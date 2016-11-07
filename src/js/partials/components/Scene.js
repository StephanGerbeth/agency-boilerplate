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
            },
            url: {
                type: 'string',
                default: null
            }
        }
    }),

    events: {

    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        this.targetModel.on('change:profile', function() {
            console.log('PROFILE');
            this.model.view = 'CONFIGURATOR';
        }.bind(this));

        this.model.on('change:url', function() {            
            this.model.view = 'GAME';
        }.bind(this));

    }
});
