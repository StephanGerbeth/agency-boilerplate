"use strict";

var admin = null;
var users = [];

module.exports = {
    addAdmin: function(client) {
        admin = client;
        return admin;
    },

    getAdmin: function() {
        return admin;
    },

    hasAdmin: function() {
        return admin !== null;
    },

    addUser: function(client) {
        users.push(client);
    }
};
