"use strict";

global.addEventListener('install', function(event) {
    global.skipWaiting();
    console.log('Installed', event);
});
global.addEventListener('message', function(event) {

    console.log('Message', event);
});
global.addEventListener('activate', function(event) {
    console.log('Activated', event);
});
global.addEventListener('push', function(event) {
    var notification = event.data.json();
    event.waitUntil(
        global.registration.showNotification(notification.title, notification.content)
    );
});
global.addEventListener('notificationclick', function(event) {
    console.log('On notification click: ', event.notification.data.url);

    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
        global.clients.matchAll({
            type: "window"
        }).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (global.clients.openWindow) {
                return global.clients.openWindow(event.notification.data.url);
            }
        })
    );
});
