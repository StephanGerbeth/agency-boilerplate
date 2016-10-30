"use strict";

var facebookManager = require('../../../services/facebookManager');
var Socket = require('agency-server/lib/websocket/Socket');

exports.register = function (server, options, next) {
    server.register([require('../auth/x-hub')], function (err) {
        if(err){
            console.log(err);
        }

        server.auth.strategy('x-hub-signature', 'x-hub-signature', {
            key: '01ea97f939594e0c4dd162a409fe1ba8'
        });

        server.auth.strategy('x-hub-verify', 'x-hub-verify', {
            verify_token: 'PLEASE_CHANGE_ME'
        });

        server.route({
            method: ['GET'],
            path: "/facebook/feed/subscription",
            config: {
                auth: 'x-hub-verify'
            },
            handler: function(request, reply) {
                console.log('REGISTER FOR SUBCRIPTIONS');
                reply(request.auth.credentials.challenge);
            }
        });

        server.route({
            method: ['POST'],
            path: "/facebook/feed/subscription",
            config: {
                auth: {
                    strategies: ['x-hub-signature'],
                    payload: true
                },
                payload: {
                    output: 'data',
                    parse: false
                }
            },
            handler: function(request, reply) {
                reply(verifyRequest(request).then(function() {
                    console.log('POST');
                    return request
                        .code(200);
                }, function(message) {
                    console.log(message);
                    return request
                        .code(200);
                }));
            }
        });
    });

    next();
};
 
function verifyRequest(request) {
    return new global.Promise(function (resolve, reject) {
        console.log('TADA', JSON.stringify(request.payload));
        if(request.payload) {
            switch(request.payload.object) {
                case "page": {
                    request.payload.entry.forEach(function(entry) {
                        entry.changes.forEach(function(e) {
                            verifyPageFeedEvent(e);
                        });
                    });
                    break;
                }
                default: {
                    break;
                }
            }
            resolve();
        } else {
            reject('no valid event');
        }
    });
}

function verifyPageFeedEvent(e) {
    // console.log('SOCKET', Socket);
    console.log('Verification Page Event', e);
    if(facebookManager.hasAdmin()) {
        switch(e.value.item) {
            case 'video': {

                break;
            }
            case 'comment': {
                // console.log('POST', facebookManager.getAdmin().getPage(e.value.sender_id).getPost(e.value.post_id));
                Socket.getChannel('/' + e.value.post_id).sockets[0].emit('comment:add.custom', {data: e.value});
                break;
            }
            default: {
                console.log(facebookManager.getAdmin().getPage(e.value.sender_id));
                break;
            }
        }

    }
}

exports.register.attributes = {
    name: 'facebook/feed/subscription',
    version: '1.0.0'
};
