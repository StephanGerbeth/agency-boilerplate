"use strict";

var script = require('../../utils/script');
var User = require('./User');
var ChannelList = require('./ChannelList');
var WebRTC = require('./WebRTC');
var Socket = require('./Socket');
var mixin = require('lodash/mixin');
var request = require('superagent');
var parse = require('url-parse');

module.exports = User.extend({
    session: {
        socket: {type: 'any', required: true, default: function() {
            return new Socket();
        }},
        channelList: {type: 'any', required: true, default: function() {
            return new ChannelList();
        }},
        webRTC: {type: 'any', required: true, default: function() {
            return new WebRTC();
        }},
        token: {type: 'string', required: true, default: null},
        accessUrl: {type: 'string', default: null},
        sessionId: {type: 'string', required: true, default: function() {
            return parse(global.location.href, true).query.session;
        }}
    },

    initialize: function() {
        User.prototype.initialize.apply(this, arguments);
        this.webRTCSupport = mixin(this.webRTC.getSupport(), this.webRTCSupport);
    },

    auth: function() {
        return new global.Promise(function (resolve, reject) {

            if(!this.token) {
                request.post(getAuthUrl())
                    .set('Content-Type','application/x-www-form-urlencoded; charset=UTF-8')
                    .send({data: JSON.stringify({webRTCSupport: this.webRTCSupport})})
                    .end(function(err, resp) {
                        if(!err) {
                            this.token = resp.xhr.getResponseHeader('Authorization');
                            this.socket.auth(this, function() {
                                resolve(this);
                            }.bind(this));
                        } else {
                            reject('no valid facebook auth');
                        }
                    }.bind(this));
            } else {
                resolve(this);
            }
        }.bind(this));
    },

    registerChannels: function(config) {
        var channelList = this.channelList.add(config);
        if(this.token) {
            this.socket.createChannels(channelList, this);
        }
    },

    unregisterChannels: function(names) {
        names.forEach(function(name) {
            var channel = this.channelList.remove(this.channelList.get(name));
            channel.destroy();
        }.bind(this));
    },

    openWebRTCConnection: function(callback) {
        if(this.webRTCSupport.data) {
            this.webRTC.openConnection(this.auth_id, this.id, function(webrtc) {
                webrtc.observeConnection(onIncomingMessage.bind(this));
                callback();
            }.bind(this));
        } else {
            callback();
        }
    },

    closeWebRTCConnection: function() {
        if(this.webRTCSupport.data) {
            this.webRTC.closeConnection();
        }
    },

    getQRCode: function(callback) {
        var img = new Image();
        img.onload = function() {
            var link = document.createElement('a');
            link.href = this.accessUrl;
            link.target = '_blank';
            link.appendChild(img);
            callback(link);
        }.bind(this);
        img.src = 'http://chart.googleapis.com/chart?cht=qr&chs=500x500&choe=UTF-8&chld=H|0&chl=' + this.accessUrl;
    }
});

function onIncomingMessage(data) {
    console.log('DATA RECEIVED BY WEBRTC', data);
    if(this.channelList.get(data.channel)) {
        var websocketCallbacks = this.channelList.get(data.channel).websocket.connection._callbacks;
        if(websocketCallbacks[data.event]) {
            websocketCallbacks[data.event].forEach(function(callback) {
                callback(data);
            });
        }
    } else {
        console.warn('Channel', data.channel, 'not available');
    }
}

function getAuthUrl() {
    var url = script.getUrl();
    url.pathname = '/auth/session';
    if(!!url.port) {
        url.set('port', global.location.port);
    }

    return url.toString();
}
