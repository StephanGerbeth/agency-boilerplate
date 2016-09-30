"use strict";

var AmpersandState = require('ampersand-state');
var AmpersandCollection = require('ampersand-collection');
var dataTypeDefinition = require('../../base/dataTypeDefinition');
var UserList = require('./UserList');
var Websocket = require('./Websocket');
var messageModel = new (require('./message/Model'))();

module.exports = AmpersandState.extend(dataTypeDefinition, {
    idAttribute: "name",

    session: {
        postfix: {type: 'string', required: true, default: '.custom'},
        name: {type: 'string', required: true, default: null},
        connected: {type: 'boolean', required: true, default: false},
        userList: {type: 'any', required: true, default: function() {
            return new UserList();
        }},
        websocket: {type: 'any', required: true, default: function() {
            return new Websocket();
        }},
        subscribers: {type: 'any', required: true, default: function() {
            return new AmpersandCollection();
        }},
        onConnect: {type: 'function', required: true, default: function() {
            return function() {};
        }},
        onDisconnect: {type: 'function', required: true, default: function() {
            return function() {};
        }}
    },

    initialize: function() {
        AmpersandState.prototype.initialize.apply(this, arguments);

        this.on('change:connected', function(model, value) {
            if(value === true) {
                this.onConnect(this);
            } else {
                this.onDisconnect(this);
            }
        });
        this.websocket.on('change:connection', onConnection.bind(this));
        console.log('NAME',this.name);
    },

    connect: function(token, messageTypes) {
        console.log('do registration of channel:', !!!this.name ? '*' : this.name);
        this.websocket.connect(this.name, token, messageTypes);


        this.userList.on('add', function(user) {
            console.log('added user', user, 'to channel', !!!this.name ? '*' : this.name);
        }.bind(this));
        this.userList.on('remove', function(user) {
            console.log('removed user', user, 'in channel', !!!this.name ? '*' : this.name);
        }.bind(this));
    },

    send: function(eventName, msg) {
        this.sendbyWebRTC(eventName, msg, this.userList);
        if(messageModel.to.length > 0) {
            if(messageModel.to.length < this.userList.length) {
                this.websocket.sendTo(eventName + this.postfix, messageModel);
            } else {
                this.websocket.send(eventName + this.postfix, messageModel);
            }
        }
    },

    sendTo: function(eventName, msg, to) {
        this.sendByWebRTC(eventName, msg, to);
        if(messageModel.to.length > 0) {
            this.websocket.sendTo(eventName + this.postfix, messageModel);
        }
    },

    sendByWebsocket: function(eventName, msg, to) {
        // messageModel.clear();
        messageModel.set({
            to: (to||[]),
            data: msg
        });
        this.websocket.sendTo(eventName + this.postfix, messageModel);
    },

    sendbyWebRTC: function(eventName, msg, userList) {
        // messageModel.clear();
        messageModel.set('data', msg);
        console.log(messageModel);

        eventName += this.postfix;
        var channelName = this.name;
        userList.forEach(function(user) {
            if(user.webRTC) {
                user.webRTC.send(channelName, eventName, messageModel);
            } else {
                messageModel.to.push(user);
            }
        });
    },

    sendToAll: function(eventName, msg) {
        // messageModel.clear();
        messageModel.set('data', msg);
        this.websocket.sendToAll(eventName + this.postfix, messageModel);
    },

    subscribe: function(eventName, callback) {
        if(this.connected) {
            this.websocket.subscribe(eventName + this.postfix, function(msg, from) {
                console.log('resolved message', msg, 'on channel', !!!this.name ? '*' : this.name, 'by event', eventName + this.postfix,'from', from);
                callback(msg, this.userList.get(from));
            }.bind(this));
        } else {
            this.subscribers.add({eventName: eventName, callback: callback});
        }
    },

    unsubscribe: function(eventName) {
        this.websocket.unsubscribe(eventName + this.postfix);
    },

    destroy: function() {
        this.set(this.idAttribute, '');
        this.websocket.destroy();
    }
});

function onConnection(model, connection) {
    connection.on('connect', function() {
        console.log('registration successful on channel:', !!!this.name ? '*' : this.name);
        this.connected = true;
        initWaitingSubscribers.bind(this)(this.subscribers);
        connection.on('disconnect', function() {
            console.log('USERLIST after DISCONNECT', this.userList);
//            while(this.userList.length > 0) {
//                this.userList.at(0).remove();
//            }
            this.connected = false;
        }.bind(this));
    }.bind(this));
}

function initWaitingSubscribers(subscribers) {
    while(subscribers.length > 0) {
        var subscriber = subscribers.models.shift();
        this.subscribe(subscriber.eventName, subscriber.callback);
    }
}
