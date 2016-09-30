"use strict";

var AmpersandModel = require('ampersand-model');
var AmpersandCollection = require('ampersand-collection');
var profiles = {
    'facebook': require('../facebook/Profile')
};

module.exports = AmpersandModel.extend({
    session: {
        valid: {type: 'boolean', required: true, default: false},
        id: {type: 'string', required: true, default: null},
        auth_id: {type: 'string', required: true, default: null},
        exp: {type: 'number', required: true, default: 0},
        profile: {type: 'object', required: true, default: null},
        webRTCSupport: {type: 'any', required: true, default: function() {
            return {
                audioVideo: false,
                binary: false,
                binaryBlob: false,
                data: false,
                onnegotiationneeded: false,
                reliable: false,
                sctp: false
            };
        }},
        channelList: {type: 'any', required: true, default: function() {
            return new (AmpersandCollection.extend({mainIndex: 'name'}))();
        }},
        webRTC: {type: 'any', required: true, default: null}
    },

    initialize: function(options) {
        AmpersandModel.prototype.initialize.apply(this, arguments);

        if(options && options.profile) {
            if(options.profile.data) {
                this.profile = new profiles[options.profile.type](options.profile.data);
            }
        }
    },

    sync: function() {},
    destroy: function() {
        if(this.webRTC) {
            this.webRTC.destroy();
        }
       AmpersandModel.prototype.destroy.apply(this, arguments);
    }
});
