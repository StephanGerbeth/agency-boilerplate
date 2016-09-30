"use strict";

var AmpersandState = require('ampersand-state');
try {
    var peerJSUtil = require('peerjs/lib/util');
    var Peer = require('peerjs');
} catch(e) {

}
var Client = require('./webRTC/Client');

module.exports = AmpersandState.extend({
    session: {
        connection: {type: 'any', required: true, default: null},
        clientID: {type: 'any', required: true, default: null}
    },

    initialize: function() {
        AmpersandState.prototype.initialize.apply(this, arguments);
    },

    getSupport: function() {
        return peerJSUtil.supports || {};
    },

    openConnection: function(auth_id, client_id, callback) {
        if(!this.connection) {
            var connection = new Peer(auth_id, {
                key: '9q6nupqs73slwhfr',
                secure: false,
                debug: 2,
                config: {
                    'iceServers': [
                        { "url": "stun:stun.l.google.com:19302" },
                        { "url": "stun:stun1.l.google.com:19302" },
                        { "url": "stun:stun2.l.google.com:19302" },
                        { "url": "stun:stun3.l.google.com:19302" },
                        { "url": "stun:stun4.l.google.com:19302" }
                    ]
                }
            });

            connection.on('open', function() {
                callback(this);
            }.bind(this));
            this.clientID = client_id;
            this.connection = connection;
        } else {
            callback(this);
        }
    },

    closeConnection: function() {
        var connection = this.connection;
        if(connection.close) {
            connection.close();
        } else {
            connection.disconnect();
        }
        this.connection = null;
    },

    createConnection: function(id) {
        if(this.connection) {
            return new Client({
                connection: this.connection.connect(id),
                clientID: this.clientID
            });
        } else {
            return null;
        }
    },

    observeConnection: function(callback) {
        this.connection.on('connection', function(connection) {
            console.log('webrtc connection initiated by', connection.peer);
            connection.on('data', callback);
        });
    }
});
