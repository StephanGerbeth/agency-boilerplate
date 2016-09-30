"use strict";

var Controller = require('../../base/Controller');
var DomModel = require('../../base/DomModel');
var Client = require('../../services/notifier/Client');
var parse = require('url-parse');

module.exports = Controller.extend({

    modelConstructor: DomModel.extend({
        session: {
            profile: {
                type: 'object'
            },

            channel: {
                type: 'object'
            }
        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        this.targetModel.on('change:profile', function(model, profile) {
            new Client({profile: profile}).auth().then(function(client) {
                if(client.sessionId) {
                    client.registerChannels([{
                        name: client.sessionId,
                        onConnect: onConnect.bind(this),
                        onDisconnect: onDisconnect
                    }]);
                    this.channel = client.channelList.get(client.sessionId);
                    console.log(client.channelList.get(client.sessionId).name);
                    client.channelList.get(client.sessionId).subscribe('channel-1', function(data, from) {
                        console.log('GEILOMEILO', data, from);
                    });

                    client.channelList.get(client.sessionId).userList.on('add', function(user, collection) {
                        // console.log('ADDED USER:', user, 'COUNT:', collection.length);
                    });

                    client.channelList.get(client.sessionId).userList.on('remove', function(user, collection) {
                        // console.log('REMOVED USER:', user, 'COUNT:', collection.length);
                    });
                }
            }.bind(this), function(err) {
                console.error(err);
            });
        });
    }
});

function onConnect(channel) {
    $(document.documentElement).removeClass('loading');
}

function onDisconnect(channel) {
    // console.log('DISCONNECTED CHANNEL', channel.get('name'));
}
