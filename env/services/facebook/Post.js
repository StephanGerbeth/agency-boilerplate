"use strict";

var id = Symbol();
var token = Symbol();
var validate = Symbol();
var fb = require('../facebook');

class Post {
    constructor(accessToken) {
        this[id] = null;
        this[token] = accessToken;
        this[validate] = false;
    }

    getId() {
        return this[id];
    }

    create(pageId, data, resolve, reject) {
        fb.api(this[token], pageId + '/feed', 'post', data, function (res) {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                reject();
            }
            this[id] = res.id;
            fb.api(this[token], res.id, 'get', function (res) {
                resolve(this);
            }.bind(this));

        }.bind(this));
    }

    update(data, resolve, reject) {
        fb.api(this[token], this[id], 'post', data, function (res) {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                reject();
            }
            resolve(res.id);
        });
    }

    validate() {
        this[validate] = true;
    }

    isValid() {
        return this[validate];
    }
}

module.exports = Post;
