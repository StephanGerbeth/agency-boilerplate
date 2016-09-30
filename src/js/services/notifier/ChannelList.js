"use strict";

var AmpersandCollection = require('ampersand-collection');
var Channel = require('./Channel');

module.exports = AmpersandCollection.extend({
    mainIndex: 'name',
    model: Channel
});
