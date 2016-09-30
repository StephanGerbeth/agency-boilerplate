"use strict";

var AmpersandState = require('ampersand-state');

module.exports = AmpersandState.extend({
    props: {
        channel: {type: 'string', required: true, default: null},
        event: {type: 'string', required: true, default: null},
        msg: {type: 'object', required: true, default: null}        
    }
});
