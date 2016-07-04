"use strict";

module.exports = {
    registerDevice: function(id, auth, callback) {
        loadScript(function() {
            global.DB.ready().then(function() {
                if (!global.DB.Device.isRegistered) {
                    console.log('NOT REGISTERED');
                    var device = new global.DB.Device(auth);
                    global.DB.Device.register('Android', id, device);
                }
                callback();
            });
        });
    }
};

function loadScript(callback) {
    $.getScript('//baqend.global.ssl.fastly.net/js-sdk/latest/baqend.min.js', function() {
        global.DB.connect('image-cache', function() {

        });
        callback();
    });
}
