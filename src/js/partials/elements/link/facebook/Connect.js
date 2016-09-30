"use strict";

var Controller = require('../../../../base/Controller');
var DomModel = require('../../../../base/DomModel');
var facebook = require('../../../../services/facebook');

module.exports = Controller.extend({

    modelConstructor: DomModel.extend({
        session: {
            permissions: {type: 'string', required: true, default: ''},
            profile: {type: 'object', required: true, default: null}
        }
    }),

    events: {
        'click': onConnect
    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        facebook.getInstance().getStatus().on('change:type', function(model, value) {
            $('.js-active', this.el).removeClass('js-active');
            $('.' + value.toString().toLowerCase(), this.el).addClass('js-active');
            if(model.isConnected()) {
                facebook.getInstance().getProfile(function(profile) {
                    this.model.profile = profile;
                }.bind(this));
            }
        }.bind(this));
    }
});

function onConnect(e) {
    e.preventDefault();
    var notVerifiedPermissions = facebook.getInstance().getStatus().verifyPermissions(this.model.permissions);    
    if(notVerifiedPermissions.length || !facebook.getInstance().getStatus().isConnected()) {
        facebook.getInstance().login(notVerifiedPermissions);
    }
}
