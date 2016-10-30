"use strict";

var Controller = require('../../base/Controller');
var DomModel = require('../../base/DomModel');
var Client = require('../../services/notifier/Client');
var countBy = require('lodash/countBy');
var identity = require('lodash/identity');
var MessageList = require('./notifier/MessageList');

var test = [{
    "parent_id":"211777805515561_1458553370837992",
    "sender_name":"TestTest",
    "comment_id":"1458553370837992_1458553834171279",
    "sender_id":211777805515561,
    "item":"comment",
    "verb":"add",
    "created_time":1477381408,
    "post_id":"211777805515561_1458553370837992",
    "message":"#Jemand #musste #Josef K. #verleumdet #haben, #denn #ohne #dass #er #etwas #Böses #getan #hätte, #wurde #er #eines #Morgens #verhaftet."
}, {
    "parent_id":"211777805515561_1458553370837992",
    "sender_name":"TestTest",
    "comment_id":"1458553370837992_1458553834171279",
    "sender_id":211777805515561,
    "item":"comment",
    "verb":"add",
    "created_time":1477381408,
    "post_id":"211777805515561_1458553370837992",
    "message":"#Er #hörte #leise #Schritte #hinter #sich. #Das #bedeutete #nichts #Gutes. #Wer #würde #ihm #schon #folgen, #spät #in #der #Nacht #und #dazu #noch #in #dieser #engen #Gasse #mitten #im #übel #beleumundeten #Hafenviertel?"
}, {
    "parent_id":"211777805515561_1458553370837992",
    "sender_name":"TestTest",
    "comment_id":"1458553370837992_1458553834171279",
    "sender_id":211777805515561,
    "item":"comment",
    "verb":"add",
    "created_time":1477381408,
    "post_id":"211777805515561_1458553370837992",
    "message":"#Überall #dieselbe #alte #Leier. #Das #Layout #ist #fertig, #der #Text #lässt #auf #sich #warten."
}];

module.exports = Controller.extend({

    modelConstructor: DomModel.extend({
        session: {
            messageList: {
                type: 'AmpersandCollection',
                required: true,
                default: function() {
                    return new MessageList();
                }
            },
            hashtags: {
                type: 'array',
                required: true,
                default: function() {
                    return [];
                }
            },
            users: {
                type: 'array',
                required: true,
                default: function() {
                    return [];
                }
            }
        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        if(this.targetModel) {
            this.targetModel.on('change:video', function(model, video) {
                this.client = new Client({});
                this.client.auth().then(function(client) {
                    client.registerChannels([{
                        name: video.id,
                        onConnect: onConnect.bind(this),
                        onDisconnect: function(channel) {
                            console.log('DISCONNECTED CHANNEL', channel.get('name'));
                        }
                    }]);
                }.bind(this));
            }.bind(this));

            addTestData.bind(this)(0);
        }
    }
});

function addTestData(count) {
    setTimeout(function() {
        this.model.messageList.add(test[count%3]);    
        addTestData.bind(this)(++count);
    }.bind(this), 3000);
}

function onConnect(channel) {
    // client.getQRCode(function(qrCode) {
    //     console.log(qrCode);
    //     // callback(channel, qrCode);
    // });
    channel.subscribe('comment:add', function(data) {
        console.log(this.model);
        console.log(JSON.stringify(data));
        this.model.messageList.add(data);
        // (data.message.match(/\S*#(?:\[[^\]]+\]|\S+)/g) || []).forEach(function(value) {
        //     this.model.hashtags.push(value.replace('#', ''));
        // }.bind(this));

        // 'https://graph.facebook.com/' + data.sender_id + '/picture?type=large'
        this.users.push(data.sender_id);

        console.log(countBy(this.model.hashtags, identity));
    }.bind(this));
}
