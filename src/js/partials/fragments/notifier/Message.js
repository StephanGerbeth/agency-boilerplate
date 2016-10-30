'use strict';

var AmpersandModel = require('ampersand-model');

module.exports = AmpersandModel.extend({
    session: {
        "parent_id": {
            type: 'string',
            default: null
        },
        "sender_name": {
            type: 'string',
            default: null
        },
        "comment_id": {
            type: 'string',
            default: null
        },
        "sender_id": {
            type: 'number',
            default: -1
        },
        "item": {
            type: 'string',
            default: null
        },
        "verb": {
            type: 'string',
            default: null
        },
        "created_time": {
            type: 'number',
            default: -1
        },
        "post_id": {
            type: 'string',
            default: null
        },
        "message": {
            type: 'string',
            default: null
        }
    },

    initialize: function() {
        AmpersandModel.prototype.initialize.apply(this, arguments);
    },

    getHashtags: function() {
        return this.message.toLowerCase().match(/\#[^\s\.\,\-]+/gi);
    },

    getSummary: function() {
        return {
            user: {
                id: this.sender_id,
                name: this.sender_name
            },
            created: this.created_time,
            message: this.message.replace(/(\#[^\s\.\,\-]+)/gi, "<span class='highlight'>$1</span>")
        };
    }
});
