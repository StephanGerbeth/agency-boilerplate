"use strict";

var js = require('./services/parser/js');
var notification = require('./services/notification');
require('./services/touchIndicator');

// var serviceWorker = require("serviceworker!./services/worker/notification.js");
// console.log(serviceWorker());

(function(){
    $(function() {
        js.parse();
        notification.create();

        // var isPushEnabled = false;
        // serviceWorker().then(function(serviceWorkerRegistration) {
        //     console.log('registration successful', serviceWorkerRegistration);
        //     serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly:true})
        //       .then(function(subscription) {
        //         // The subscription was successful
        //         isPushEnabled = true;
        //         var endpoint = subscription.endpoint;
        //         // if(endpoint.startswith('https://android.googleapis.com/gcm/send')) {
        //             var endpointParts = endpoint.split('/');
        //             var registrationId = endpointParts[endpointParts.length - 1];
        //
        //             endpoint = 'https://android.googleapis.com/gcm/send';
        //             console.log(registrationId);
        //         // }
        //
        //         // return sendSubscriptionToServer(subscription);
        //       })
        //       .catch(function(e) {
        //         if (Notification.permission === 'denied') {
        //           // The user denied the notification permission which
        //           // means we failed to subscribe and the user will need
        //           // to manually change the notification permission to
        //           // subscribe to push messages
        //           console.warn('Permission for Notifications was denied');
        //         } else {
        //           // A problem occurred with the subscription; common reasons
        //           // include network errors, and lacking gcm_sender_id and/or
        //           // gcm_user_visible_only in the manifest.
        //           console.error('Unable to subscribe to push.', e);
        //         }
        //       });
        //       console.log(serviceWorkerRegistration.active.postMessage('hello'));
        //
        //     // serviceWorkerRegistration.pushManager.getSubscription().then(function(pushSubscription) {
        //     //     pushSubscription.unsubscribe().then(function(successful) {
        //     //         console.log('unsubscribed');
        //     //     }).catch(function(e) {
        //     //         console.log('Unsubscription error: ', e);
        //     //     });
        //     // });
        //
        // }).catch(function(err) {
        //     console.log('registration failed', err);
        // });
    });
})();
