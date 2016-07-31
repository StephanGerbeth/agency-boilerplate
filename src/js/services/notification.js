"use strict";

var AmpersandState = require('ampersand-state');
var dataTypeDefinition = require('../base/dataTypeDefinition');
var serviceWorker = require("serviceworker!./worker/notification.js");
var startsWith = require('lodash/startsWith');
var baqend = require('./baqend');
var Enum = require('enum');

module.exports = new (AmpersandState.extend(dataTypeDefinition, {
    session: {
        id: {
            type: 'string',
            default: null
        }
    },

    initialize: function() {
        AmpersandState.prototype.initialize.apply(this, arguments);

        $('body').on('click', function() {
            console.log('WHAT');

        });
    },

    create: function() {

        if ('serviceWorker' in navigator) {

            // navigator.serviceWorker.ready.then(function() {
            //     console.log('WHAT');
                serviceWorker().then(function(registration) {
                    subscribe(registration, function(id, auth) {
                        console.log('Bücklers Output:', id, auth);
                        baqend.registerDevice(id, auth, function() {
                            console.log('BOING');
                        });
                    }.bind(this));
                }.bind(this)).catch(function(err) {
                    console.log('registration failed', err);
                });
            // });
        } else {
            var permissionData = window.safari.pushNotification.permission('web.com.baqend.stephan');

            checkRemotePermission(permissionData);
        }
    }
}))();

function checkRemotePermission(permissionData) {

    if (permissionData.permission === 'default') {

        // This is a new web service URL and its validity is unknown.

        window.safari.pushNotification.requestPermission(

            'https://local.baqend.com:8050', // The web service URL.

            'web.com.baqend.stephan',     // The Website Push ID.

            {}, // Data that you choose to send to your server to help you identify the user.

            checkRemotePermission         // The callback function.

        );

    }

    else if (permissionData.permission === 'denied') {

        // The user said no.
        console.log('NO');
    }

    else if (permissionData.permission === 'granted') {

        // The web service URL is a valid push provider, and the user said yes.

        // permissionData.deviceToken is now available to use.
        console.log('YES', permissionData);
    }

}

function subscribe(registration, callback) {
    registration.pushManager.subscribe({userVisibleOnly:true}).then(function(subscription) {
        console.log(subscription);
        callback(getGCMRegistrationID(subscription.endpoint), getAuthData(subscription));
    }).catch(function(e) {
        if (Notification.permission === 'denied') {
            // The user denied the notification permission which
            // means we failed to subscribe and the user will need
            // to manually change the notification permission to
            // subscribe to push messages
            console.warn('Permission for Notifications was denied');
        } else {
            // A problem occurred with the subscription; common reasons
            // include network errors, and lacking gcm_sender_id and/or
            // gcm_user_visible_only in the manifest.
            console.error('Unable to subscribe to push.', e);
        }
    });
}

function getAuthData(subscription) {
    var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
    var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
    return {
        endpoint: subscription.endpoint,
        key: rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '',
        secret: rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : ''
    };
}

function getGCMRegistrationID(endpoint) {
    // if(startsWith(endpoint, 'https://android.googleapis.com/gcm/send')) {
        var endpointParts = endpoint.split('/');
        return endpointParts[endpointParts.length - 1];
    // }
    // return null;
}
