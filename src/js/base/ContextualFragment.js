"use strict";

var Template = require('./Template');

var ContextualFragment = function(template) {
    this.template = new Template(template);
};

ContextualFragment.prototype.generate = function(data) {
    return document.createRange().createContextualFragment(this.template.render(data));
};

module.exports = ContextualFragment;
