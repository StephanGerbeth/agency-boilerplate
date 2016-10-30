"use strict";

module.exports = {
    dataTypes : {
        function : getDefinition('function', Function),
        enum: getDefinition('enum', require('enum/dist/enumItem')),
        Vector: getDefinition('Vector', require('./Vector')),
        Bounds: getDefinition('Bounds', require('./Bounds')),
        Color: getDefinition('Color', require('color')),
        HTMLElement: getDefinition('HTMLElement', HTMLElement),
        AmpersandCollection: getDefinition('AmpersandCollection', require('ampersand-collection'))
    }
};


function getDefinition(type, constructor) {

    return {
        set : function(obj){
            if(obj instanceof constructor){
                return {
                    val : obj,
                    type : type
                };
            } else if(obj instanceof Object) {
                return {
                    val: new constructor(obj),
                    type: type
                };
            } else {
                return {
                    val : obj,
                    type : typeof obj
                };
            }
        },

        compare : function(currentObj, obj){
            return currentObj === obj;
        },

        default: function() {
            return new constructor();
        }
    };
}
