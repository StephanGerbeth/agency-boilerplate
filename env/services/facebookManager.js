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

    addUser: function(client) {
        users.push(client);
    }
};
