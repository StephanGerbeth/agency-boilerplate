"use strict";

var aguid = require('aguid');
var jwt = require('jsonwebtoken');
var extend = require('lodash/extend');
var User = require('../../services/facebook/User');

exports.register = function (server, options, next) {

    server.route({
        method: ['GET','POST'], 
        path: "/auth/session",
        config: {
            auth: false,
            cors: {
                credentials: true,
                exposedHeaders: ['Authorization']
            }
        },
        handler: function(request, reply) {
            reply(makeRequest(request, options.secret).then(function(auth) {
                return request
                    .generateResponse({code: '200', data: {message: 'valid athorization'}})
                    .header("Authorization", auth)
                    .code(200);
            }, function() {
                return request
                    .generateResponse({code: '403', error: {message: 'no valid facebook account'}})
                    .code(403);
            }));
        }
    });

    next();
};

function makeRequest(request, secret) {
    return new global.Promise(function (resolve, reject) {
        var session = createSessionObject(request.payload.data, request.info.host);
        var user = new User(request.state).connect(function(user) {
            user.getProfile(function(profile) {
                session.profile = profile;
                resolve(jwt.sign(session, secret));
            }, reject);
        }, function() {
            console.log(user);
            resolve(jwt.sign(session, secret));
        });
    });
}

function createSessionObject(data, host) {
    return extend(JSON.parse(data || '{}'), {
        host: host,
        valid: true, // this will be set to false when the person logs out
        auth_id: aguid(), // a random session id
        exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
    });
}

exports.register.attributes = {
    name: 'auth/session',
    version: '1.0.0'
};
