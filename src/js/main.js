"use strict";

var js = require('./services/parser/js');
var Client = require('./services/notifier/Client');
var url = require('url');
var Vector = require('./base/Vector');

require('./services/touchIndicator');

var notifier = null;

module.exports = global.gp = {
    connect: function(callback) {
        if(!notifier) {

            notifier = new Client({});
            notifier.auth().then(function(client) {
                // console.log('HUI',url.parse(global.location.href, true).query.session||client.id );
                client.registerChannels([{
                    name: url.parse(global.location.href, true).query.session || client.id,
                    onConnect: function(channel) {
                        console.log('connected', channel.name);
                        client.getQRCode(function(qrCode) {
                            callback(channel, qrCode);
                        });
                    },
                    onDisconnect: function(channel) {
                        console.log('DISCONNECTED CHANNEL', channel.get('name'));
                    }
                }]);
            });
        } else {
            callback(notifier);
        }
    }
};

(function(){
    $(function() {
        // if(!url.parse(global.location.href, true).query.session) {
            js.parse();
            // global.gp.connect(function(channel, qrCode) {
            //     console.log('voila', channel, qrCode);
            //     channel.userList.on('add', function() {
            //         setTimeout(function() {
            //             channel.send('channel-1', new Vector(0.5, 0.5));
            //         }, 1000);
            //     });
            //
            // });
        // } else {
        //     js.parse();
        // }

    });
})();
