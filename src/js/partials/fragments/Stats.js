"use strict";

var Controller = require('../../base/Controller');
var DomModel = require('../../base/DomModel');
var HashtagList = require('./stats/HashtagList');
var countBy = require('lodash/countBy');
var transform = require('lodash/transform');
var TYPES = new (require('enum'))(['INIT', 'PROGRESS', 'RESULT'], { ignoreCase: true });

module.exports = Controller.extend({

    modelConstructor: DomModel.extend(require('../../base/dataTypeDefinition'), {
        TYPES: TYPES,
        session: {
            synonyms: {
                type: 'object',
                required: true,
                default: function() {
                    return {};
                }
            },
            hashtags: {
                type: 'AmpersandCollection',
                required: true,
                default: function() {
                    return new HashtagList();
                }
            },
            state: {
                type: 'string',
                required: true,
                default: function() {
                    return TYPES.PROGRESS.toString();
                }
            },
            status: {
                type: 'enum',
                required: true,
                default: function() {
                    return TYPES.PROGRESS;
                }
            }
        }
    }),

    bindings: {
        'model.status': {
            type: function(node, value) {
                if(value) {
                    this.model.state = value.toString();
                }
            }
        },
        'model.state': {
            type: 'switchClass',
            name: 'js-binding-visible',
            cases: {
                'PROGRESS': '.partial[data-partial="fragments/stats/progress"]',
                'RESULT': '.partial[data-partial="fragments/stats/bar-chart"]'
            }
        }
    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        if(this.targetModel) {
            this.model.on('change:status', onStatusChange.bind(this));
        }
        this.model.status = this.model.TYPES.PROGRESS;
    }
});

function onStatusChange(model, value) {
    if(value === TYPES.RESULT) {
        var hashtags = this.targetModel.messageList.getHashtags();
        model.hashtags.add(group(hashtags, this.model.synonyms));
        this.targetModel.messageList.reset();
    }
}

function group(list, synonyms) {
    return transform(countBy(list.map(function(value) {
        return synonyms[value] || value;
    }.bind(this))), function(result, count, name) {
        result.push({
            name: name,
            count: count
        });
    }, []);
}
