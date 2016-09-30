"use strict";

var facebook = require('../facebook');
var Post = require('./Post');
var properties = Symbol();

class Page {
    constructor(config) {
        this[properties] = config;
        this.posts = {};
    }

    getId() {
        return this[properties].id;
    }

    doPost(data, resolve, reject) {
        facebook.doPost(this[properties].access_token, this[properties].id, data, function(id) {
            this.posts[id] = new Post(id);
            resolve(id);
        }.bind(this), reject);
    }

    subscribe(resolve, reject) {
        facebook.subscribePage(this[properties].access_token, this[properties].id, resolve, reject);
    }
}

module.exports = Page;
