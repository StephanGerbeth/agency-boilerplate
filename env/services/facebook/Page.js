"use strict";

var facebook = require('../facebook');
var LiveVideo = require('./LiveVideo');
var Post = require('./Post');

var token = Symbol();
var perms = Symbol();
var posts = Symbol();

class Page {
    constructor(config) {
        this[token] = config.access_token;
        this[perms] = config.perms;
        this[posts] = {};

        this.id = config.id;
        this.name = config.name;
        this.category = config.category;
    }

    getId() {
        return this.id;
    }

    createPost(data, resolve, reject) {
        new Post(this[token]).create(this.id, data, function(post) {
            this[posts][post.id] = post;
            resolve(post);
        }.bind(this), reject);
    }

    getPost(id) {
        return this[posts][id];
    }

    startLiveVideo(config, resolve, reject) {
        new LiveVideo(this[token]).create(this.id, config, function(video) {
            this[posts][video.id] = video;
            resolve(video);
        }.bind(this), reject);
    }

    stopLiveVideo(data, resolve, reject) {
        if(this[posts][data.stream.id]) {
            this[posts][data.stream.id].destroy();
            resolve({success: true});
        } else {
            reject({success: false});
        }
    }

    subscribe(resolve, reject) {
        facebook.subscribePage(this[token], this.id, resolve, reject);
    }

    unsubscribe(resolve, reject) {
        facebook.unsubscribePage(this[token], this.id, resolve, reject);
    }
}

module.exports = Page;
