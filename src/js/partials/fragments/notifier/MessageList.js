"use strict";

var AmpersandCollection = require('ampersand-collection');
var Message = require('./Message');


module.exports = AmpersandCollection.extend({
    model: Message,

    initialize: function() {

    },

    getHashtags: function() {
        return [].concat.apply([],this.map(function(obj) {
            return obj.getHashtags();
        }));    
    }
});
