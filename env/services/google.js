"use strict";

const googl = require('goo.gl');

class Google {
    constructor() {

    }

    config(apiKey) {
        googl.setKey(apiKey);
    }

    createShortUrl(url, resolve, reject) {
        googl.shorten(url)
        .then(resolve)
        .catch(reject);
    }
}

module.exports = new Google();
