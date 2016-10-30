"use strict";

var View = require('../View');

module.exports = View.extend({

    events: {

    },

    initialize: function() {
        View.prototype.initialize.apply(this, arguments);

        if(this.targetModel) {
            // console.log(this.targetModel);
        }
    }
});
