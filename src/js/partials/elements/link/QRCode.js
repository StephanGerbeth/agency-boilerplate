"use strict";

var Controller = require('../../../base/Controller');
var DomModel = require('../../../base/DomModel');

module.exports = Controller.extend({

    modelConstructor: DomModel.extend({
        session: {
            permissions: {type: 'string', required: true, default: ''},
            profile: {type: 'object', required: true, default: null}
        }
    }),

    events: {

    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
    }
});
