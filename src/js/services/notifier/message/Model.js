'use strict';

var AmpersandModel = require('ampersand-model');

module.exports = AmpersandModel.extend({
    props: {
        moduleId: {type: 'number', required: true, default: -1},
        from: {type: 'string', default: null},
        to: {type: 'array', default: function() {return [];}},
        type: {type: 'number', default: 0},
        data: {type: 'object', required: true, default: function() {return {};}}
    },

    initialize: function() {
        AmpersandModel.prototype.initialize.apply(this, arguments);

        this.on('change:data', function(model, data) {
            if(!data.moduleId) {
                for(var i in require.cache) {
                    if(require.cache[i].exports === data.constructor) {
                        Object.defineProperty(data.constructor.prototype, 'moduleId', {
                            enumerable: false,
                            configurable: false,
                            writable: false,
                            value: require.cache[i].id
                        });                        
                        break;
                    }
                }
            }
            model.set('data', data.toJSON(), {silent: true});
            model.moduleId = data.moduleId;
        });
    }
});
