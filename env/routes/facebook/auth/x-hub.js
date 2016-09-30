"use strict";

const Boom = require('boom');
const Signature = require('./X-Hub-Signature');

const internals = {};

exports.register = function (plugin, options, next) {
    plugin.auth.scheme('x-hub-signature', internals.xHubSignature);
    plugin.auth.scheme('x-hub-verify', internals.xHubVerify);
    next();
};

exports.register.attributes = {
    name: 'auth/x-hub',
    version: '1.0.0'
};

internals.xHubSignature = function (server, options) {
    const scheme = {
        authenticate: function (request, reply) {
            if(!request.raw.req.headers['x-hub-signature']) {
                return reply(Boom.unauthorized(null, 'x-hub'));
            }
            return reply.continue({ credentials: {} });
        },
        payload: function(request, reply) {
            var xHubSignature = request.raw.req.headers['x-hub-signature'];
            var signature = new Signature(xHubSignature, {
                algorithm: 'sha1',
                secret: options.key
            });

            if(signature.isValid(request.payload)) {
                request.payload = JSON.parse(request.payload.toString());
                return reply.continue();
            } else {
                return reply(Boom.unauthorized(null, 'x-hub'));
            }
        }
    };
    return scheme;
};

internals.xHubVerify = function (server, options) {
    const scheme = {
        authenticate: function (request, reply) {
            if(request.query['hub.mode'] === 'subscribe' && request.query['hub.verify_token'] === options.verify_token) {
                return reply.continue({
                    credentials: {
                        challenge: request.query['hub.challenge']
                    }
                });
            } else {
                return reply(Boom.unauthorized(null, 'x-hub'));
            }
        }
    };
    return scheme;
};
