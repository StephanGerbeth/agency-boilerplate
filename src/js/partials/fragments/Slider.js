'use strict';

var Controller = require('../../base/Controller');
var Swiper = require('swiper');
require('style!swiper/dist/css/swiper.min.css');

module.exports = Controller.extend({

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);


        new Swiper(this.el, {
            autoHeight: true,
            effect: 'fade',
            fade: {
              crossFade: false
            }
        });


    }
});
