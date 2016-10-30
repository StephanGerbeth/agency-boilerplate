"use strict";

var Controller = require('../../base/Controller');
var Viewport = require('../../base/Viewport');
var Vector = require('../../base/Vector');
var TweenMax = require('gsap');
require('pepjs');

module.exports = Controller.extend({

    events: {
        'pointerdown .masked-content': onPointerDown
    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        debugger;
        this.movePoint = new Vector();
        this.viewport = new Viewport(this.el.querySelector('.masked-content'), this.el.querySelector('.masked-content'));
        this.mask = this.el.querySelector('.mask');

        this.viewport
            .on(this.viewport.EVENT_TYPES.INIT, onResize.bind(this))
            .on(this.viewport.EVENT_TYPES.RESIZE, onResize.bind(this));
    }
});

function onResize() {
    this.viewport.dimension.divideValueLocal(2);
}

function onPointerDown(e) {
    onMeasure.bind(this)(e);
    global.animationFrame.throttle('pointerdown', onPaint.bind(this))();

    $(document).on('pointermove.' + this.cid, global.animationFrame.throttle('pointermove', onPaint.bind(this), onMeasure.bind(this)));
    $(document).on('pointerup.' + this.cid, onPointerUp.bind(this));
}

function onPointerUp() {
    $(document).off('pointermove.' + this.cid + ' pointerup.' + this.cid);
}

function onMeasure(e) {
    e.preventDefault();
    this.movePoint.setX(e.pageX).setY(e.pageY)
        .subtractLocal(this.viewport.offset)
        .subtractLocal(this.viewport.dimension)
        .divideLocal(this.viewport.dimension)
        .divideValueLocal(2)
        .multiplyValueLocal(100);
}

function onPaint() {
    TweenMax.set(this.mask, {
        css: {
            x: this.movePoint.x + '%',
            y: this.movePoint.y + '%'
        }
    });
}
