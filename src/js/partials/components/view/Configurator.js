"use strict";

var dataTypeDefinition = require('../../../base/dataTypeDefinition');
var AmpersandCollection = require('ampersand-collection');
var View = require('../View');
var Template = require('../../../base/Template');
var tmpl = new Template(require('../../../../tmpl/partials/fragments/form/configurator.hbs'));
require('imports?jQuery=jquery!parsleyjs/dist/parsley');
require('imports?jQuery=jquery!jquery-serializejson');

module.exports = View.extend({

    modelConstructor: View.prototype.modelConstructor.extend(dataTypeDefinition, {
        session: {
            comments: {
                type: 'AmpersandCollection',
                required: true,
                default: function() {
                    return new AmpersandCollection();
                }
            },
            video: {
                type: 'object',
                default: null
            },
            sessionUrl: {
                type: 'string',
                default: null
            }
        }
    }),

    events: {
        'submit form': onSubmit,
        'click button[type="reset"]': onReset,
        'click button.fullscreen': onFullscreen
    },

    bindings: {

    },

    initialize: function() {
        View.prototype.initialize.apply(this, arguments);

        console.log('CONFIGURATOR');
    },

    onVisible: function() {
        View.prototype.onVisible.apply(this, arguments);

        $.ajax('/facebook/setup', {
            method: 'POST',
            success: function(result) {
                this.el.querySelector('.content-container').innerHTML = tmpl.render(result.data);
                $(this.el.querySelector('form')).parsley().on('field:validated', function() {
                    console.log('ERRORs');
                });
            }.bind(this)
        });

        this.model.on('change:video', function(model, value) {
            if(value > 0) {
                model.sessionUrl = '/index.html?session=' + value;
            } else {
                model.sessionUrl = null;
            }
        });
    }
});

function onSubmit(e) {
    e.preventDefault();
    var form = $(this.el.querySelector('form'));
    form.parsley().validate();
    if (form.parsley().isValid()) {
        sendRequest({
            type: 'start',
            data: JSON.stringify(form.serializeJSON())
        }, function(result) {
            console.log('https://www.facebook.com/', result.data.url);
            this.model.video = result.data;
            this.targetModel.url = result.shortUrl;

        }.bind(this));
    }
}

function onReset(e) {
    console.log('RESET');
    e.preventDefault();
    var form = $(this.el.querySelector('form'));
    sendRequest({
        type: 'stop',
        data: JSON.stringify({
            pageId: form.serializeJSON().pageId,
            stream: {
                id: this.model.video.id
            }
        })
    }, function() {
        this.model.video = null;
    }.bind(this));
}

function onFullscreen(e) {
    e.preventDefault();
    this.el.parentNode.requestFullscreen();
}

function sendRequest(data, callback) {
    $.ajax('/facebook/feed/video', {
        method: 'POST',
        data: data,
        success: function(result) {
            callback(result);
        }
    });
}
