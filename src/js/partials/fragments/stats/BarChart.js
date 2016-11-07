"use strict";

var Controller = require('../../../base/Controller');
var DomModel = require('../../../base/DomModel');
var Template = require('../../../base/Template');
var tmpl = new Template(require('../../../../tmpl/partials/fragments/stats/bar.hbs'));

module.exports = Controller.extend({

    modelConstructor: DomModel.extend({
        session: {
            relevantKey: {
                type: 'string',
                required: true,
                default: null
            }
        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        if(this.targetModel) {
            this.model.synonyms = this.targetModel.synonyms;
            this.targetModel.on('change:status', onStatusChange.bind(this));
        }
    }
});

function onStatusChange(model, value) {
    switch(value) {
        case model.TYPES.RESULT: {
            if(model.hashtags.length) {
                var result = prepareResult(model.hashtags.getMostRelevant());
                this.model.relevantKey = result[0].name;
                this.el.innerHTML = tmpl.render({list: result});
                global.animationFrame.add(function() {
                    this.el.querySelector('ul').classList.add('js-bar-animate');
                }.bind(this));
            } else {
                this.el.innerHTML = '';
            }
            break;
        }
        default: {
            break;
        }
    }
}

function prepareResult(list) {
    var sum = list.reduce(function(result, obj) {
        return result + obj.count;
    }, 0);

    var max = list[0].count;
    return list.map(function(obj) {
        obj.width = obj.count / max * 100;
        obj.weight = Math.round(obj.count / (sum/100));
        return obj;
    });
}
