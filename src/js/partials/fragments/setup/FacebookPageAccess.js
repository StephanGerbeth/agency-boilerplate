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
                    $.ajax('/facebook/feed/post', {
                        method: 'POST',
                        data: {
                            type: 'create',
                            id: '211777805515561',
                            data: {
                                link: 'https://4c991553.eu.ngrok.io/dev/',
                                message: 'Let\'s get ready to rumble! ' + Date.now()
                            }
                        },
                        success: function(result) {
                            console.log('https://www.facebook.com/', result.data.id);

                            $.ajax('/facebook/feed/video', {
                                method: 'POST',
                                data: {
                                    type: 'create',
                                    id: '211777805515561',
                                    status: 'LIVE_NOW',
                                    data: {
                                        title: 'sample title',
                                        description: 'sample description',
                                        save_vod: false
                                    }
                                },
                                success: function(result) {
                                    console.log('https://www.facebook.com/', result);
                                }
                            });
                        }
                    });
                }
            });
        });
    }
});
