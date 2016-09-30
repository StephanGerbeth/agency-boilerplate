"use strict";

var AmpersandState = require('ampersand-state');
var Channel = require('./Channel');

module.exports = AmpersandState.extend({
    session: {
        notifications: {type: 'any', required: true, default: function() {
            return new Channel({name: ''});
        }},
        messageTypes: {type: 'any', required: true, default: function() {
            return {};
        }}
    },

    initialize: function() {
        AmpersandState.prototype.initialize.apply(this, arguments);
    },

    auth: function(client, callback) {
        this.notifications.connect(client.token);
        this.notifications.subscribe('config', function(msg/*, from*/) {
            this.messageTypes = msg.types;
            client.set(msg.client);
            client.set('accessUrl', msg.accessUrl);

            client.openWebRTCConnection(function() {
                this.createChannels(client.channelList, client);
                callback(this);
            }.bind(this));
        }.bind(this));
        this.notifications.on('change:connected', function(model, value) {
            if(!value) {
                client.closeWebRTCConnection();
            }
        });
    },

    createChannels: function(channelList, client) {
        channelList.forEach(function(channel) {
            channel.connect(client.get('token'), this.messageTypes);
            channel.subscribe('user:init', onUsers.bind({socket: this, channel: channel, client: client}));
            channel.subscribe('user:add', onUserAdded.bind({socket: this, channel: channel, client: client}));
            channel.subscribe('user:remove', onUserRemoved.bind({socket: this, channel: channel, client: client}));
        }.bind(this));
    }
});

function onUsers(users/*, from*/) {
    var newUsers = this.socket.notifications.userList.add(users);
    tryToConnectByWebRTC(newUsers, this.channel, this.client);
    this.channel.userList.add(newUsers);
}

function onUserAdded(user/*, from*/) {
    var newUser = this.socket.notifications.userList.add(user);
    tryToConnectByWebRTC([newUser], this.channel, this.client);
    this.channel.userList.add(newUser);
}

function onUserRemoved(data/*, from*/) {
    var user = this.channel.userList.get(data.id);
    if(user) {
        user.channelList.remove(this.channel.name);
        if(user.channelList.length === 0) {
            user.destroy();
        }
    }
}

function tryToConnectByWebRTC(users, channel, client) {
    users.forEach(function(user) {
        if(!user.webRTC && user.webRTCSupport.data && client.webRTCSupport.data) {
            user.webRTC = client.webRTC.createConnection(user.auth_id);
        }
        user.channelList.add(channel);
    });
}
