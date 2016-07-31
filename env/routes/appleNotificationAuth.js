"use strict";

var pushLib = require('safari-push-notifications');
var fs = require('fs');

exports.register = function (server, options, next) {
    server.route({
        method: 'POST',
        path: '/v1/pushPackages/web.com.baqend.stephan',
        config: {
            auth: false,
            handler: function (request, reply) {
                console.log(request.payload);
                reply(generatePushPackage());
            }
        }
    });
    next();
};

function generatePushPackage() {
    return pushLib.generatePackage(
        pushLib.websiteJSON(
            'My Site', // websiteName
            'web.com.baqend.stephan', // websitePushID
            ['https://local.baqend.com:8050'], // allowedDomains
            'https://local.baqend.com:8050', // urlFormatString
            '8C2452DE79323D9A081DD855B88BA850E081CBF6DE4AE4F416D8D5947F29979C', // authenticationToken (zeroFilled to fit 16 chars)
            'https://local.baqend.com:8050' // webServiceURL (Must be https!)
        ),
        __dirname + '/pushPackage.raw/icon.iconset', // Folder containing the iconset
        fs.readFileSync(__dirname + '/cert/push-cert.pem'),
        fs.readFileSync(__dirname + '/cert/push-key.pem'),
        fs.readFileSync(__dirname + '/cert/apple-cert.pem')
    );
}

exports.register.attributes = {
    name: 'appleNotificationAuth',
    version: '1.0.0'
};
