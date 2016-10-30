"use strict";

var AmpersandView = require('ampersand-view');
var dataTypeDefinition = require('./dataTypeDefinition');

module.exports = AmpersandView.extend(dataTypeDefinition, {

    constructor: function() {
        console.log('AJA');
    },

    initialize: function(options) {
        AmpersandView.prototype.initialize.apply(this, arguments);

        $(this.el).data('controller', this);

        if(this.modelConstructor) {
            this.model = new this.modelConstructor($(this.el).data());
            this.listenTo(this.model, 'destroy', onDestroy.bind(this));
        }

        if(options.target && $(options.target).length) {

            var targetModel = $(options.target).data('controller').model;
            if(targetModel) {
                this.targetModel = targetModel;
            }
        }
//        module.hot.dispose(function(data) {
//            console.log('BOOM', arguments, this.firstName, this.toJSON());
//            data.firstName = this.firstName;
//        }.bind(this));
    },

    destroy: function() {
        this.model.destroy();
    }
});

function onDestroy() {
    this.unset('model');
    this.remove();
}
