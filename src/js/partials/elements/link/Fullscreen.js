"use strict";

var Controller = require('../../../base/Controller');

module.exports = Controller.extend({

    events: {
        'click': onClick
    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        $(this.el.parentNode).on('fullscreenchange', toggleFullscreenButton.bind(this));
    }
});

function onClick(e) {
    e.preventDefault();
    this.el.parentNode.requestFullscreen();
}

function toggleFullscreenButton() {
    if (document.fullscreenElement) {
        this.el.style.cssText = 'display: none;';
    } else {
        this.el.style.cssText = '';
    }
}
