"use strict";

var id = Symbol();

class Post {
    constructor(postId) {
        this[id] = postId;
    }

    getId() {
        return this[id];
    }
}

module.exports = Post;
