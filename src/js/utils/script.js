'use strict';

var Url = require('url-parse');
var url = null;

(function() {
    var path = [];
    try {
      throw new Error();
    }
    catch(e) {

        var stackLines = e.stack.split('\n');
        var callerIndex = 0;
        for(var i in stackLines){
            if(stackLines[i].match(/http[s]?:\/\//)) {
                callerIndex = Number(i) + 2;
                break;
            }
        }

        path = stackLines[callerIndex].match(/((http[s]?:\/\/.+\/)([^\/]+\.js))/);
        url = new Url(path[1]);
    }
})();

module.exports = {
    getUrl: function() {
        return url;
    }
};
