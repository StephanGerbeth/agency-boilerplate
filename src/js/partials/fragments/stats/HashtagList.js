'use strict';

var AmpersandCollection = require('ampersand-collection');
var Hashtag = require('./Hashtag');
var Faltu = require('faltu');

module.exports = AmpersandCollection.extend({
    model: Hashtag,

    comparator: function(objA, objB) {
        if (objA.count < objB.count) {
            return 1;
        } else if(objA.count > objB.count) {
            return -1;
        } else {
            return 0;
        }
    },

    initialize: function() {
        AmpersandCollection.prototype.initialize.apply(this, arguments);
    },

    getMostRelevant: function(max) {
        var result = new Faltu(this.serialize()).find().limit(max || 3).get();
        this.reset([]);
        return result;
    }
});
