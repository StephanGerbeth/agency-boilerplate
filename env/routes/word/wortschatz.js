"use strict";

var wlapi = require('wl-api');

exports.register = function (server, options, next) {

    server.route({
        method: ['GET','POST'],
        path: "/word/wortschatz",
        config: {
            auth: false
        },
        handler: function(request, reply) {
            reply(makeRequest(request).then(function(result) {
                return request
                    .generateResponse({code: '200', data: result})
                    .code(200);
            }, function() {
                return request
                    .generateResponse({code: '403', error: {message: 'no valid result from wortschatz'}})
                    .code(403);
            }));
        }
    });

    next();
};

function makeRequest(request) {
    return new global.Promise(function (resolve, reject) {
        // wlapi.baseform(request.query.word,function(err,result){
        //     if(err) {
        //         console.log('error occurred', err);
        //         reject();
        //     }
        //     resolve(result);
        // });
        wlapi.synonyms(request.query.word,5,function(err,result){
            if(err) {
                console.log('error occurred', err);
                reject();
            }
            resolve(result);
        });
    });
}

exports.register.attributes = {
    name: 'word/wortschatz',
    version: '1.0.0'
};
