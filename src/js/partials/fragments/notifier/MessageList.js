"use strict";

var AmpersandCollection = require('ampersand-collection');
var Message = require('./Message');
var countBy = require('lodash/countBy');
var transform = require('lodash/transform');

module.exports = AmpersandCollection.extend({
    model: Message,

    initialize: function() {

    },

    getHashtags: function() {
        return transform(countBy([].concat.apply([],this.map(function(obj) {
            return obj.getHashtags();
        }))), function(result, count, name) {
            result.push({
                name: name,
                count: count
            });
        }, []);
    }
});
