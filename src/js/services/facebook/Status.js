"use strict";

var AmpersandModel = require('ampersand-model');
var difference = require('lodash/difference');
var TYPES = new (require('enum'))(['FAIL', 'IDLE', 'CONNECTED', 'NOT_AUTHORIZED', 'UNKNOWN'], { ignoreCase: true });

module.exports = AmpersandModel.extend(require('../../base/dataTypeDefinition'), {
    TYPES: TYPES,
    session: {
        type: {
            type: 'enum',
            required: true,
            default: function() {
                return TYPES.IDLE;
            }
        },
        permissions: {
            type: 'array',
            required: true,
            default: function() {
                return [];
            }
        }
    },

    initialize: function() {
        AmpersandModel.prototype.initialize.apply(this, arguments);
    },

    update: function(data) {
        if(data && TYPES.get(data.status) === TYPES.CONNECTED) {
            getPermissions(function(permissions) {
                this.permissions = permissions;
                this.type = TYPES.CONNECTED;
            }.bind(this));
        } else if(data){
            this.type = TYPES.NOT_AUTHORIZED;
        } else {
            this.type = TYPES.IDLE;
        }
    },

    isConnected: function() {
        return this.type === TYPES.CONNECTED;
    },

    verifyPermissions: function(permissions) {        
        var grantedPermissions = this.permissions.map(function(obj) {
            return obj.permission;
        });
        return difference(permissions.split(','), grantedPermissions);
    },

    hasPermission: function(permission) {
        return this.permissions.some(function(obj) {
            return obj.permission === permission;
        });
    }
});

function getPermissions(callback) {
    FB.api('/me/permissions', {}, function(permissions) {
        callback(permissions.data.filter(function(permission) {
            return permission.status === 'granted';
        }));
    });

    return [];
}
