'use strict';

var AmpersandModel = require('ampersand-model');

module.exports = AmpersandModel.extend({
    props: {
        name: {
            type: 'string',
            default: null
        },
        count: {
            type: 'number',
            default: 0
        }
    }
});
