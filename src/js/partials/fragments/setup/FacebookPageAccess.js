"use strict";

var Controller = require('../../../base/Controller');
var DomModel = require('../../../base/DomModel');

module.exports = Controller.extend({

    modelConstructor: DomModel.extend({
        session: {
            profile: {
                type: 'object'
            }
        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        console.log('WHAT', this.model);
        this.targetModel.on('change:profile', function(model, profile) {
            $.ajax('/facebook/setup', {
                method: 'POST',
                success: function() {
                    $.ajax('/facebook/doPost', {
                        method: 'POST',
                        data: {
                            pageId: '211777805515561',
                            message: 'Let\'s get ready to rumble! ' + Date.now()
                        },
                        success: function(result) {                            
                            console.log('https://www.facebook.com/' + result.data.post_id);
                        }
                    });
                }
            });
        });
    }
});
