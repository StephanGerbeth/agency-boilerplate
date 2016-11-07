'use strict';

var Controller = require('../../base/Controller');
var Swiper = require('swiper');
require('style!swiper/dist/css/swiper.min.css');

module.exports = Controller.extend({

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);


        this.slider = new Swiper(this.el, {
            autoHeight: false,
            effect: 'fade',
            fade: {
              crossFade: false
            }
        });

        if(this.targetModel) {
            collectSynonyms(this.el.querySelectorAll('.swiper-slide[data-key]'), this.targetModel.synonyms);
            this.targetModel.on('change:relevantKey', onRelevantKeyChange.bind(this));
        }
    }
});

function onRelevantKeyChange(model, value) {
    if(this.el.querySelector('.swiper-slide-next[data-key="' + value + '"]')) {
        console.log('VALUE', value);
        this.slider.slideNext();
    }
}

function collectSynonyms(nodes, synonyms) {
    [].forEach.call(nodes, function(node) {
        var key = $(node).data('key');
        synonyms[key] = key;
        $(node).data('synonyms').split(',').forEach(function(value) {
            synonyms[value] = key;
        });
    });
}
