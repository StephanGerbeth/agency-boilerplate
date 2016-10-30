"use strict";

var facebookManager = require('../../../services/facebookManager');
var google = require('../../../services/google');


exports.register = function (server, options, next) {
    google.config(options.google.apiKey);

    server.route({
        method: ['GET','POST'],
        path: "/facebook/feed/video",
        config: {
            auth: false
        },
        handler: function(request, reply) {
            reply(makeRequest(request).then(function(result) {
                return request
                    .generateResponse({code: '200', data: result})
                    .code(200);
            }, function(message) {
                console.log('ERROR', message);
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
        var data = JSON.parse(request.payload.data);
        switch(request.payload.type) {
            case 'start': {
                let page = facebookManager.getAdmin().getPage(extractPageIdFromPostId(data.pageId));
                page.startLiveVideo(data, function(data) {
                    console.log('DATA', data);
                    page.subscribe(function() {
                        resolve(data);
                    }, reject);
                }, reject);
                break;
            }
            case 'stop': {
                let page = facebookManager.getAdmin().getPage(extractPageIdFromPostId(data.pageId));
                page.stopLiveVideo(data, function(data) {
                    page.unsubscribe(function() {
                        resolve(data);
                    }, reject);
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
    name: 'facebook/feed/video',
    version: '1.0.0'
};
