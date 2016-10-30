"use strict";

var Controller = require('../../../base/Controller');
var DomModel = require('../../../base/DomModel');
var Collection = require('ampersand-collection');
var Template = require('../../../base/Template');
var tmpl = new Template(require('../../../../tmpl/partials/fragments/stats/bar.hbs'));

module.exports = Controller.extend({

    modelConstructor: DomModel.extend({
        session: {
            values: {
                type: 'AmpersandCollection',
                required: true,
                default: function() {
                    return new Collection([{
                        weight: 20,
                        title: 'ZWANZIG'
                    }, {
                        weight: 5,
                        title: 'FÜNF'
                    }, {
                        weight: 10,
                        title: 'ZEHN'
                    }, {
                        weight: 40,
                        title: 'VIERZIG'
                    }, {
                        weight: 30,
                        title: 'DREISSIG'
                    }], {
                        comparator: function(objA, objB) {
                            return objA.weight < objB.weight;
                        }
                    });
                }
            }
        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        if(this.targetModel) {
            this.targetModel.on('change:status', onStatusChange.bind(this));
        }
    }
});

function onStatusChange(model, value) {
    switch(value) {
        case model.TYPES.RESULT: {
            var result = prepareResult(model.hashtags.getMostRelevant());
            console.log(result);
            this.el.innerHTML = tmpl.render({list: result});
            global.animationFrame.add(function() {
                this.el.querySelector('ul').classList.add('js-bar-animate');
            }.bind(this));
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
