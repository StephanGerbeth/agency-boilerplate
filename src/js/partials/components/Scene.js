"use strict";

var Controller = require('../../base/Controller');
var DomModel = require('../../base/DomModel');

module.exports = Controller.extend({

    modelConstructor: DomModel.extend({
        session: {
            view: {
                type: 'string',
                required: true,
                default: 'STARTSCREEN'
            }
        }
    }),

    events: {

    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        this.targetModel.on('change:profile', function(model, profile) {
            console.log('PROFILE');
            this.model.view = 'GAME';
        }.bind(this));

    }
});
