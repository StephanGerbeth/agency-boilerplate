"use strict";

var facebook = require('../../services/facebook');
var facebookManager = require('../../services/facebookManager');
var User = require('../../services/facebook/User');

exports.register = function (server, options, next) {
    facebook.config(options.appId, options.appSecret);

    server.route({
        method: ['GET','POST'],
        path: "/facebook/setup",
        config: {
            auth: false
        },
        handler: function(request, reply) {
            reply(makeRequest(request).then(function(pages) {
                return request
                    .generateResponse({code: '200', data: {pages: pages.map(function(page) { return page.getId();})}})
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

function makeRequest(request) {
    return new global.Promise(function (resolve, reject) {
        facebookManager.addAdmin(new User(request.state)).connect(function(user) {
            user.requestPages(resolve, reject);
        }, reject);
    });
}

exports.register.attributes = {
    name: 'facebook/setup',
    version: '1.0.0'
};
