"use strict";

var Controller = require('../../base/Controller');
var DomModel = require('../../base/DomModel');
var MessageList = require('./ticker/MessageList');
var ContextualFragment = require('../../base/ContextualFragment');
var sublistTmpl = new ContextualFragment(require('../../../tmpl/partials/fragments/ticker/sublist.hbs'));
var bumperTmpl = new ContextualFragment(require('../../../tmpl/partials/fragments/ticker/bumper.hbs'));

module.exports = Controller.extend({

    modelConstructor: DomModel.extend({
        session: {
            delay: {
                type: 'number',
                required: true,
                default: 5
            },
            messages: {
                type: 'array',
                required: true,
                default: function() {
                    return new MessageList();
                }
            }
        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        var list = '.partial[data-partial="fragments/ticker/list"]';
        var nextList = list + ' + ' + list;
        defineDurationAndDelay(this.el.querySelector(list), this.el.querySelector(nextList), this.model.delay);

        if(this.targetModel) {
            $(document).on('animationend', '.partial[data-partial="fragments/ticker"] ' + nextList, appendEntryList.bind(this));

            this.targetModel.messageList.on('add', function(entry) {
                this.model.messages.add(entry.getSummary());
            }.bind(this));
            // console.log(this.targetModel);
            this.targetModel.on('change:url', function(model, value) {
                [].forEach.call(this.el.querySelectorAll('.partial[data-partial="fragments/ticker/bumper"]'), function(node) {
                  node.parentNode.replaceChild(bumperTmpl.generate({
                      imgUrl: value + '.qr',
                      url: value
                  }), node);
                });
            }.bind(this));
        } else {
            $(document).on('animationend', '.partial[data-partial="fragments/ticker"] ' + nextList, moveEntryList.bind(this));
        }
    }
});

function defineDurationAndDelay(presentNode, nextNode, delay) {
    var refWidth = $(presentNode.parentNode).width();
    var duration = refWidth / 100;

    var factorA = $(presentNode).outerWidth() / refWidth;
    var factorB = $(nextNode).outerWidth() / refWidth;

    presentNode.style.cssText = 'animation-delay: ' + delay + 's; animation-duration: ' + duration * factorA + 's;';
    nextNode.style.cssText = 'animation-delay: ' + ((duration * factorA) - (duration * factorB) + delay) + 's; animation-duration: ' + duration * factorB + 's;';
}

function appendEntryList() {
    var list = '.partial[data-partial="fragments/ticker/list"]';
    var sublist = list + ' .partial[data-partial="fragments/ticker/sublist"]';
    var nextList = list + ' + ' + list;
    var nextSublist = list + ' + ' + sublist;
    global.animationFrame.add(function() {
        this.el.querySelector(nextSublist).parentNode.replaceChild(sublistTmpl.generate({list:this.model.messages.getMostRelevant(4)}), this.el.querySelector(nextSublist));
        this.el.appendChild(this.el.querySelector(list));
        defineDurationAndDelay(this.el.querySelector(list), this.el.querySelector(nextList), this.model.delay);
    }.bind(this));
}

function moveEntryList() {
    var list = '.partial[data-partial="fragments/ticker/list"]';
    var nextList = list + ' + ' + list;
    global.animationFrame.add(function() {
        this.el.appendChild(this.el.querySelector(list));
        defineDurationAndDelay(this.el.querySelector(list), this.el.querySelector(nextList), this.model.delay);
    }.bind(this));
}
