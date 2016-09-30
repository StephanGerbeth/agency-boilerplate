"use strict";

var AmpersandState = require('ampersand-state');

module.exports = AmpersandState.extend({
    props: {
        type: {type: 'any', required: true, default: null},
        moduleId: {type: 'any', required: true, default: null},
        data: {type: 'object', required: true, default: null},
        volatile: {type: 'boolean', required: true, default: false}
    }
});
