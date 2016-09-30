"use strict";

var AmpersandState = require('ampersand-state');
var map = require('lodash/map');
var load = require('load-script');
var script = require('../../utils/script');
var receivePattern = new (require('./websocket/ReceivePattern'))();

module.exports = AmpersandState.extend({
    session: {
        name: {type: 'string', required: true, default: null},
        connection: {type: 'any', required: true, default: null},
        messageTypes: {type: 'any', required: true, default: function() {
            return {};
        }}
    },

    initialize: function() {
        AmpersandState.prototype.initialize.apply(this, arguments);
    },

    connect: function(name, token, messageTypes) {
        this.name = name;
        if(messageTypes) {
            this.messageTypes = messageTypes;
        }

        getSocketIO(function() {
            this.connection = global.io.connect('//' + getSocketIOHost() + '/' + this.name, {
                query: {token: token}
            });

            // this.peer = new P2P(this.connection);
            this.connection.on('error', function() {
                console.log('ERROR', arguments);
            });
        }.bind(this));
    },

    send: function(eventName, msg) {
        this.connection.emit(eventName, messageToJSON(this.messageTypes, 'SEND', msg));
    },

    sendTo: function(eventName, msg) {
        this.connection.emit(eventName, messageToJSON(this.messageTypes, 'SENDTO', msg));
    },

    sendToAll: function(eventName, msg) {
        this.connection.emit(eventName, messageToJSON(this.messageTypes, 'SENDTOALL', msg));
    },

    subscribe: function(eventName, callback) {
        this.connection.on(eventName, function(data) {
            messageToObject(data, callback);
        });
    },

    unsubscribe: function(eventName) {
        this.connection.off(eventName);
    },

    destroy: function() {
        this.set(this.idAttribute, '');
        this.connection.disconnect('/' + this.name);
    }
});

function getSocketIO(callback) {
    if(!global.io) {

        load(getSocketIOScriptUrl().toString(), function(err, script) {
            if(err) {
                console.error(err);
            } else {
                console.log(script.src + 'was successfully loaded');
                callback(global.io);
            }
        }.bind(this));
    } else {
        callback(global.io);
    }
}

function messageToJSON(messageTypes, messageType, obj) {
    obj.to = map(obj.to, 'id');
    obj.type = getMessageType(messageType, messageTypes);
    return obj.toJSON();
}

function messageToObject(data, callback) {    
    if(data.msg) {
        console.log('WEBSOCKET MESSAGETOOBJECT', new (require.cache[data.msg.moduleId].exports)());
        callback(new (require.cache[data.msg.moduleId].exports)(data.msg.data), data.msg.from);
    } else {
        receivePattern.set(data).getData(callback);
    }
}

function getMessageType(key, messageTypes) {
    if(messageTypes) {
        var messageType = messageTypes[key];
        if(messageType !== undefined) {
            return messageType;
        }
    }
    return null;
}

function getSocketIOScriptUrl() {
    var url = script.getUrl();
    url.pathname = '/socket.io/socket.io.js';
    if(!!url.port) {
        url.port = global.location.port;
    }
    return url;
}

function getSocketIOHost() {
    var url = script.getUrl();
    if(!!!url.port) {
        return url.hostname + ':80';
    }
    return url.hostname;
}
