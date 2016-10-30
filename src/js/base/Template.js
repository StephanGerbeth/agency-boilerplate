"use strict";

function Template(hbs) {
    this.hbs = hbs;
}

Template.prototype.render = function(data) {    
    return this.hbs(data).replace(/(---[^><]+---)/gi, '');
};

module.exports = Template;
