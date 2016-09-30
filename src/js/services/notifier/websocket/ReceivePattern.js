"use strict";

var AmpersandState = require('ampersand-state');

module.exports = AmpersandState.extend({
    props: {
        from: {type: 'string', required: true, default: null},
        moduleId: {type: 'any', default: null},
        data: {type: 'any', required: true, default: null}
    },

    initialize: function() {
        AmpersandState.prototype.initialize.apply(this, arguments);
    },

    getData: function(callback) {
        var data = this.data;
        if(this.moduleId) {
            data = new require.cache[this.moduleId].exports(data);
        }
        callback(data, this.from);
    }
});
