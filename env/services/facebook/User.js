"use strict";

var facebook = require('../facebook');
var Page = require('./Page');
var state = Symbol();
var accessToken = Symbol();

class User {
    constructor(config) {
        this.pages = [];
        this[state] = config;
        this[accessToken] = '';
    }

    connect(resolve, reject) {
        facebook.connect(this[state], true, function(access_token) {
            this[accessToken] = access_token;
            resolve(this);
        }.bind(this), reject);
    }

    getProfile(resolve, reject) {
        return facebook.getProfile(this[accessToken], resolve, reject);
    }

    getPage(id) {
        return this.pages.find(function(page) {            
            return page.getId() === id.toString();
        });
    }

    requestPages(resolve, reject) {
        facebook.getPages(this[accessToken], function(pages) {
            this.pages = pages.map(function(page) {
                return new Page(page);
            });
            resolve(this.pages);
        }.bind(this), function() {
            reject();
        });
    }
}

module.exports = User;
