"use strict";

var Controller = require('../../base/Controller');
var DomModel = require('../../base/DomModel');

module.exports = Controller.extend({

    modelConstructor: DomModel.extend({
        session: {

        }
    }),

    events: {

    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        if(this.targetModel) {
            detectVisibility(this.el, this.targetModel.view, this.onVisible.bind(this), this.onHidden.bind(this));
            this.targetModel.on('change:view', function(model, value) {
                detectVisibility(this.el, value, this.onVisible.bind(this), this.onHidden.bind(this));
            }.bind(this));

        }
    },

    onVisible: function() {
        this.el.classList.remove('hidden');
    },

    onHidden: function() {
        this.el.classList.add('hidden');
    }
});

function detectVisibility(node, view, visible, hidden) {
    if(node.id === view) {
        visible();
    } else {
        hidden();
    }
}
