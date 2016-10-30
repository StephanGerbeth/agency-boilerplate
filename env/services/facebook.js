"use strict";

var FB = require('fb');
let instance = null;

class Facebook extends require('events'){
    constructor() {
        super();
        if(!instance){
              instance = this;
        }
        return instance;
    }

    config(appID, appSecret) {
        FB.options({
            appId: appID,
            appSecret: appSecret,
            version: 'v2.7'
        });
    }

    connect(state, longLived, resolve, reject) {
        generateUserAccessToken(state['fbsr_' + FB.options('appId')], function(res) {
            if(longLived) {
                generateLongLivedAccessToken(res.access_token, function(res) {
                    resolve(res.access_token);
                }, reject);
            } else {
                resolve(res.access_token);
            }
        }, reject);
    }

    api(token) {

        FB.setAccessToken(token);
        return FB.api.apply(FB, Array.prototype.slice.call(arguments, 1));
    }

    getPages(token, resolve, reject) {
        FB.setAccessToken(token);
        FB.api('me/accounts', {}, function(res) {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                reject();
            }
            resolve(res.data);
        });
    }

    getProfile(token, resolve, reject) {
        FB.setAccessToken(token);
        FB.api('me', {fields:'age_range,first_name,last_name,gender,middle_name,verified'}, function (res) {
            if(!res || res.error) {
                reject(!res ? 'error occurred' : res.error);

            }
            resolve({
                type: 'facebook',
                data: res
            });
        });
    }

    createPost(token, id, data, resolve, reject) {
        FB.setAccessToken(token);
        FB.api(id + '/feed', 'post', data, function (res) {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                reject();
            }
            resolve(res.id);
        });
    }

    updatePost(token, id, data, resolve, reject) {
        FB.setAccessToken(token);
        FB.api(id, 'post', data, function (res) {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                reject();
            }
            resolve(res.id);
        });
    }

    subscribePage(token, id, resolve, reject) {
        console.log('subscribe ID', id);
        this.subscribeApp(token, id, function() {
            subscribe(id, 'feed',resolve, reject);
        }, reject);
    }

    unsubscribePage(token, id, resolve, reject) {
        this.subscribeApp(token, id, function() {
            unsubscribe(id, 'feed', resolve, reject);
        }, reject);
    }

    subscribeApp(token, id, resolve, reject) {
        FB.setAccessToken(token);
        FB.api(id + '/subscribed_apps', 'get', {}, function(res) {
            if(!res || res.error) {
                reject();
            }
            resolve();
        });
    }
}

module.exports = new Facebook();

function generateUserAccessToken(signedRequestValue, resolve, reject) {
    var signedRequest  = FB.parseSignedRequest(signedRequestValue);
    if(signedRequest) {
        FB.api('oauth/access_token', {
            client_id: FB.options('appId'),
            client_secret: FB.options('appSecret'),
            redirect_uri: '',
            code: signedRequest.code
        }, function (res) {
            if(!res || res.error) {
                reject(!res ? 'error occurred' : res.error);
            }
            resolve(res);
        });
    } else {
        reject();
    }
}

function generateLongLivedAccessToken(token, resolve, reject) {
    FB.api('oauth/access_token', {
        client_id: FB.options('appId'),
        client_secret: FB.options('appSecret'),
        grant_type: 'fb_exchange_token',
        fb_exchange_token: token
    }, function (res) {
        if (!res || res.error) {
            reject(!res ? 'Unkown error' : res.error);
        }
        resolve(res);
    });
}

function generateAppAccessToken(callback) {
    FB.api('oauth/access_token', {
        client_id: FB.options('appId'),
        client_secret: FB.options('appSecret'),
        grant_type: 'client_credentials'
    }, function (res) {
        if (!res || res.error) {
            var errorMessage = !res ? 'Unkown error' : res.error;
            console.log("Failed to get fb access token " + errorMessage);
        }
        callback(res);
    });
}

function subscribe(id, fields, resolve, reject) {
    generateAppAccessToken(function(res) {
        console.log('SUBSCRIBE', res, id);
        FB.setAccessToken(res.access_token);
        FB.api(id + '/subscriptions', 'post', {
            object: 'page',
            callback_url: 'https://46dc60b0.eu.ngrok.io/facebook/feed/subscription',
            fields: fields,
            verify_token: 'PLEASE_CHANGE_ME',
        }, function() {
            if(!res || res.error) {
                reject();
            }
            resolve();
        });
    });
}

function unsubscribe(id, fields, resolve, reject) {
    generateAppAccessToken(function(res) {
        console.log('ACCESS', res, id);
        FB.setAccessToken(res.access_token);
        FB.api(FB.options('appId') + '/subscriptions', 'delete', {
            object: 'page',
            fields: fields
        }, function(res) {
            console.log('UNSUBSCRIBE',res);
            if(!res || res.error) {
                reject();
            }

            resolve();
        });
    });
}
