"use strict";

var Controller = require('../../base/Controller');
var Parsley = require('parsleyjs');

module.exports = Controller.extend({

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        $(this.el).parsley().on('field:validated', function() {

        }).on('form:submit', function() {
            $.ajax({
                method: 'POST',
                url: '/notifier',
                data: $(this).serialize()
            });
            // console.log($(this).serialize());
            return false; // Don't submit form for this demo
        }.bind(this.el));
    }
});
