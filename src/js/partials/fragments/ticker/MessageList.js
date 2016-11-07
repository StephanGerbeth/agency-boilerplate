"use strict";

var AmpersandCollection = require('ampersand-collection');
var AmpersandModel = require('ampersand-model');

module.exports = AmpersandCollection.extend({

    model: AmpersandModel.extend({
        props: {
            user: {
                type: 'object'
            },
            created: {
                type: 'number'
            },
            message: {
                type: 'string'
            }
        }
    }),

    comparator: function(objA, objB) {
        if (objA.created < objB.created) {
            return 1;
        } else if(objA.created > objB.created) {
            return -1;
        } else {
            return 0;
        }
    },

    initialize: function(limit) {
        this.limit = limit || 10;
        AmpersandCollection.prototype.initialize.apply(this, arguments);
    },

    add: function() {
        // console.log('LENGTH', this.length);
        if (this.length > this.limit-1) {
            this.at(this.length - 1).destroy();
        }
        AmpersandCollection.prototype.add.apply(this, arguments);
    },

    getMostRelevant: function(max) {
        return this.map(function(model, index) {
            if(index < max || 5) {
                var result = model.serialize();
                model.destroy();
                return result;
            }
        }.bind(this));
    }
});
