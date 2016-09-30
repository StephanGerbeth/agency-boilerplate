"use strict";

var facebookManager = require('../../services/facebookManager');

exports.register = function (server, options, next) {

    server.route({
        method: ['GET','POST'],
        path: "/facebook/doPost",
        config: {
            auth: false
        },
        handler: function(request, reply) {
            reply(makeRequest(request).then(function(result) {
                return request
                    .generateResponse({code: '200', data: {post_id: result}})
                    .code(200);
            }, function() {
                return request
                    .generateResponse({code: '403', error: {message: 'can\'t post to timeline'}})
                    .code(403);
            }));
        }
    });

    next();
};

function makeRequest(request) {
    return new global.Promise(function (resolve, reject) {
        facebookManager.getAdmin().getPage(request.payload.pageId).doPost({ message: request.payload.message }, function(result) {
            console.log('WHAR');
            facebookManager.getAdmin().getPage(request.payload.pageId).subscribe(function() {
                resolve(result);
            }, reject);

        }, reject);
    });
}

exports.register.attributes = {
    name: 'facebook/doPost',
    version: '1.0.0'
};
