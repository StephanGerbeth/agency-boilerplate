"use strict";

var AmpersandCollection = require('ampersand-collection');
var User = require('./User');

module.exports = AmpersandCollection.extend({    
    model: User
});
