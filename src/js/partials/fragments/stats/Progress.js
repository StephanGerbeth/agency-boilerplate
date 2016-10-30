"use strict";

var Controller = require('../../../base/Controller');
var DomModel = require('../../../base/DomModel');

module.exports = Controller.extend({

    modelConstructor: DomModel.extend({
        session: {
            durationOffset: {
                type: 'number',
                required: 0,
                default: 5
            },
            duration: {
                type: 'number',
                required: true,
                default: 9
            }
        }
    }),

    bindings: {

    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        this.circle = this.el.querySelector('path');
        this.circle.length = this.circle.getTotalLength();

        if(this.targetModel) {
            this.targetModel.on('change:status', onStatusChange.bind(this));
            onStatusChange.bind(this)(this.targetModel, this.targetModel.status);
        }
    },

    play: function() {
        this.handler = global.animationFrame.addLoop(this.model.duration * 1000, onProgress.bind(this), onEnd.bind(this));
    },

    reset: function() {
        if(this.handler) {
            global.animationFrame.cancelLoop(this.handler);
        }

        updateCircle(this.circle, 0);
        this.el.classList.remove(/step\-[0-9]+/.exec(this.el.classList.value));
        this.el.classList.add('step-' + this.model.duration, 'reset');
    }
});

function onStatusChange(model, value) {
    switch(value) {
        case model.TYPES.INIT: {
            this.reset();
            break;
        }
        case model.TYPES.PROGRESS: {
            this.reset();
            this.play();
            break;
        }
        case model.TYPES.RESULT: {
            this.reset();
            setTimeout(function() {
                if(this.targetModel) {
                    this.targetModel.status = this.targetModel.TYPES.PROGRESS;
                }
            }.bind(this), this.model.durationOffset * 1000);
            break;
        }
        default: {
            break;
        }
    }
}

function onProgress(step) {
    updateCounter(this.el.classList, Math.ceil(this.model.duration - step * this.model.duration));
    updateCircle(this.circle, step);
}

function onEnd() {
    if(this.targetModel) {
        this.targetModel.status = this.targetModel.TYPES.RESULT;
    }
}

function updateCounter(classList, count) {
    if(!classList.contains('step-' + (count))) {
        classList.remove('step-' + (count+1));
        classList.add('reset', 'step-' + (count));
    } else {
        classList.remove('reset');
    }
}

function updateCircle(path, step) {
    path.style.cssText = 'stroke-dasharray: ' + path.length + '; stroke-dashoffset: ' + (path.length * step) + ';';
}
