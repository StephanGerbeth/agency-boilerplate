"use strict";

var facebookManager = require('../../../services/facebookManager');

exports.register = function (server, options, next) {

    server.route({
        method: ['GET','POST'],
        path: "/facebook/feed/post",
        config: {
            auth: false
        },
        handler: function(request, reply) {
            reply(makeRequest(request).then(function(result) {
                return request
                    .generateResponse({code: '200', data: result})
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

        switch(request.payload.type) {
            case 'create': {
                let page = facebookManager.getAdmin().getPage(request.payload.id);
                page.createPost(request.payload.data, function(post) {
                    page.subscribe(function() {
                        resolve(post.getId());
                    }, reject);
                }, reject);
                break;
            }
            case 'update': {
                let page = facebookManager.getAdmin().getPage(extractPageIdFromPostId(request.payload.id));
                console.log('UPDATE POST', page);
                page.getPost(request.payload.id).update(request.payload.data, function() {
                    console.log('UPDATED POST');
                    resolve();
                }, reject);
                break;
            }
            default: {
                reject();
                break;
            }
        }

    });
}

function extractPageIdFromPostId(postId) {
    return postId.split('_')[0];
}

exports.register.attributes = {
    name: 'facebook/feed/post',
    version: '1.0.0'
};
