"use strict";

var AmpersandModel = require('ampersand-model');
var Status = require('./Status');

module.exports = AmpersandModel.extend({
    session: {
        status: {type: 'any', required: true, default: function() {
            return new Status();
        }}
    },
    props: {
        id: {
            type: 'string',
            required: true,
            default: null
        },
        first_name: {
            type: 'string',
            required: true,
            default: null
        },
        last_name: {
            type: 'string',
            required: true,
            default: null
        },
        gender: {
            type: 'string',
            required: true,
            default: null
        },
        age_range: {
            type: 'object',
            required: true,
            default: null
        }
    },

    derived: {
        name: function() {
            return this.first_name + ' ' + this.last_name;
        },
        picture: function() {
            return 'http://graph.facebook.com/' + this.id + '/picture?type=square';
        }
    }
});
