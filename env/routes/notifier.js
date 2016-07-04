"use strict";

var webPush = require('web-push');
webPush.setGCMAPIKey('AIzaSyBvRBxSjMjZyExzrUd66nhogBuqvqTyTMQ');

var DB = require('baqend');
DB.connect('image-cache');

exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/notifier',
        config: {
            auth: false,
            handler: function (request, reply) {
                reply(doNotify().then(function() {
                    return request
                        .generateResponse('')
                        .header('Content-Type', 'text/plain')
                        // .header('Content-Length', img.length)
                        .code(200);
                }).catch(function(e) {
                    console.log(e);
                }));
            }
        }
    });
    next();
};

function doNotify() {
    return new global.Promise(function (resolve, reject) {
        getNotifierIDs(function(devices) {
            if(devices.length) {
                devices.forEach(function(device) {
                    webPush.sendNotification(device.endpoint, {
                        TTL: 1000,
                        userPublicKey: device.key,
                        userAuth: device.secret,
                        payload: JSON.stringify({
                            title: 'Ich bin ein Status Title',
                            content: {
                                body: 'Ich bin eine Status Description',
                                icon: 'assets/img/wave.8bit.png',
                                tag: '',
                                data: {
                                    url: '/#sample'
                                }
                            }
                        })
                    });
                });
                resolve();
            } else {
                reject();
            }
        });
    });
}

function getNotifierIDs(callback) {
    DB.ready(function() {
        DB.Device.find().resultList(function(result) {
            callback(result);
        });

    });
}

exports.register.attributes = {
    name: 'notifier',
    version: '1.0.0'
};
