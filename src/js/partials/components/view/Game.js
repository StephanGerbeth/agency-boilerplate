"use strict";

var View = require('../View');

module.exports = View.extend({

    session: {
        hashtagOrder: {
            type: 'array',
            required: true,
            default: function() {
                return ['red', 'green', 'blue'];
            }
        }
    },

    events: {

    },

    initialize: function() {
        View.prototype.initialize.apply(this, arguments);

        console.log('GAME');
    }
});
