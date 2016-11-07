"use strict";

var AmpersandState = require('ampersand-state');
var transferPattern = new (require('./TransferPattern'))();

module.exports = AmpersandState.extend({
    session: {
        connection: {type: 'any', required: true, default: null},
        clientID: {type: 'any', required: true, default: null}
    },

    initialize: function() {
        AmpersandState.prototype.initialize.apply(this, arguments);
    },

    send: function(channelName, eventName, msg) {
        msg.from = this.clientID;
        this.connection.send(messageToJSON(channelName, eventName, msg));
    },

    destroy: function() {
        this.id = null;
        if(this.connection.close) {
            this.connection.close();
        } else {
            this.connection.disconnect();
        }
    }
});

function messageToJSON(channelName, eventName, msg) {
    // console.log(msg);
    return transferPattern.set({
        'channel': channelName,
        'event': eventName,
        'msg': msg
    }).toJSON();
}
