"use strict";

var View = require('../View');

module.exports = View.extend({

    session: {
        
    },

    events: {

    },

    initialize: function() {
        View.prototype.initialize.apply(this, arguments);

        console.log('GAME');
    },

    onVisible: function() {
        View.prototype.onVisible.apply(this, arguments);


    }
});
