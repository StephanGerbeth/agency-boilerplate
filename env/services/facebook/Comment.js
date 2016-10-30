"use strict";

class Comment {
    constructor(data) {
        this.id = data.comment_id;
        this.postId = data.post_id; 
        this.createdBy = data.sender_id;
        this.createdOn = data.created_time;
        this.message = data.message;
    }
}

module.exports = Comment;
