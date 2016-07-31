"use strict";

var apn = require('apn');
var fs = require('fs');

var o = {
    cert: fs.readFileSync(__dirname + '/cert/push-cert.pem'),
    key: fs.readFileSync(__dirname + '/cert/push-key.pem'),
    production: true,
    "batchFeedback": true,
    "interval": 300
};

var feedback = new apn.Feedback(o);
feedback.on("feedback", function(devices) {
    devices.forEach(function(item) {
        console.log('HUHU', item);
        // Do something with item.device and item.time;
    });
});

exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/notifierApple',
        config: {
            auth: false,
            handler: function (request, reply) {
                console.log('AJA');
                reply(doNotify(request.payload).then(function() {
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

function doNotify(payload) {
    return new global.Promise(function (resolve, reject) {
        var options = {
            cert: fs.readFileSync(__dirname + '/cert/push-cert.pem'),
            key: fs.readFileSync(__dirname + '/cert/push-key.pem'),
            production: true,
            fastMode: false,
        };
        var apnConnection = new apn.Connection(options);
        apnConnection.on("connected", function() {
            console.log("Connected");
        });

        apnConnection.on("transmitted", function(notification, device) {
            console.log("Notification transmitted to:" + device.token.toString("hex"));
        });

        apnConnection.on("transmissionError", function(errCode, notification, device) {
            console.error("Notification caused error: " + errCode + " for device ", device, notification);
            if (errCode === 8) {
                console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
            }
        });

        apnConnection.on("timeout", function () {
            console.log("Connection Timeout");
        });

        apnConnection.on("disconnected", function() {
            console.log("Disconnected from APNS");
        });

        var myDevice = new apn.Device('8C2452DE79323D9A081DD855B88BA850E081CBF6DE4AE4F416D8D5947F29979C');
        var note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 3;
        note.sound = "ping.aiff";
        note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
        note.payload = {'messageFrom': 'Caroline'};

        apnConnection.pushNotification(note, myDevice);


        resolve();
    });
}

exports.register.attributes = {
    name: 'notifierApple',
    version: '1.0.0'
};
