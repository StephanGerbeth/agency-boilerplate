"use strict";

var Singleton = require('../base/Singleton');
var AmpersandState = require('ampersand-state');
var Status = require('./facebook/Status');
var profile = new (require('./facebook/Profile'))();

module.exports = Singleton(AmpersandState.extend({

    session: {
        appId: {type: 'number', required: true, default: 653149338194538}
    },

    initialize: function() {
        AmpersandState.prototype.initialize.apply(this, arguments);

        $.ajaxSetup({ cache: true });
        $.getScript('//connect.facebook.net/en_US/sdk.js')
            .done(onInitSuccess.bind(this))
            .fail(onInitFail.bind(this));
    },

    login: function(permissions) {
        if(FB) {
            profile.status.update();
            FB.login(profile.status.update.bind(profile.status), getLoginOptions(permissions, profile.status.isConnected()));
        }
    },

    getStatus: function() {
        return profile.status;
    },

    getProfile: function(callback) {
        FB.api('/me', {fields:'age_range,first_name,last_name,gender,middle_name,verified'}, function(data) {
            callback(profile.set(data));

        });
    }
}));

function onInitSuccess() {
    FB.init({
        appId: this.appId,
        cookie: true,
        version: 'v2.5'
    });
    // console.log(FB.Event.subscribe);
    // FB.Event.subscribe('auth.statusChange', profile.status.update.bind(profile.status));
    FB.getLoginStatus(profile.status.update.bind(profile.status));
}

function onInitFail(jqxhr, settings, exception) {
    console.error('facebook script will be blocked by browser:', exception);
    profile.status.type = profile.status.TYPES.FAIL;
}

function getLoginOptions(permissions, connected) {
    var options = {
        scope: permissions
    };
    if(connected) {
        options.auth_type = 'rerequest';
    }
    return options;
}
