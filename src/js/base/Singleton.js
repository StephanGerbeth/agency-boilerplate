"use strict";

module.exports = (function(constructor) {

    var instance = null;

    // handles the prevention of additional instantiations
    function getInstance() {
        if( ! instance ) {
            instance = new constructor();
        }
        return instance;
    }

    return {
        getInstance : getInstance
    };

});
