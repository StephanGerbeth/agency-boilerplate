"use strict";

var nativeSupport = true;
var taskNames = {};
var mutateTasks = [];
var timer = null;

module.exports = (function (window) {
    var lastTime = 0;
    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
    var cancelAnimationFrame = window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame;


    // polyfill with setTimeout fallback
    // heavily inspired from @darius gist mod: https://gist.github.com/paulirish/1579671#comment-837945
    if (!requestAnimationFrame || !cancelAnimationFrame) {
        nativeSupport = false;
        requestAnimationFrame = function (callback) {
            var now = 0;
            if (Date.now) {
                now = +Date.now();
            } else {
                now = (new Date()).getTime();
            }

            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function () {
                callback(lastTime = nextTime);
            }, nextTime - now);
        };

        cancelAnimationFrame = clearTimeout;
    }

    // export to window
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelRequestAnimationFrame = cancelAnimationFrame;
    loop();

    return {
        add: function (callback) {
            window.requestAnimationFrame(callback);
        },

        addLoop: function (duration, onTick, onEnd) {
            var handler = {
                id: null,
                begin: 0,
                current: 0,
                duration: duration || -1,
                onTick: onTick,
                onEnd: onEnd
            };
            (function animloop(time) {
                handler.id = window.requestAnimationFrame(animloop);
                handler.begin = handler.begin || time;
                if(time) {
                    handler.current = (time - handler.begin) / duration;
                    if(handler.current >= 1) {
                        window.cancelRequestAnimationFrame(handler.id);
                        (handler.onEnd || handler.onTick)(1);
                    } else {
                        handler.onTick(handler.current);
                    }
                }
            })();
            return handler;
        },

        cancelLoop: function (handler) {
            window.cancelRequestAnimationFrame(handler.id);
        },

        throttle: function(taskName, mutate, measure) {
            taskNames[taskName] = false;
            measure = measure || function() {};
            var mutateTask = {
                name: taskName,
                mutate: mutate
            };

            // var body = document.body;
            return function(e) {
                measure(e);
                if (taskNames[taskName]) {
                    return;
                }

                mutateTasks.push(mutateTask);
                taskNames[taskName] = true;

                // clearTimeout(timer);
                // if(!body.classList.contains('disable-hover')) {
                //     body.classList.add('disable-hover');
                // }
                //
                // timer = setTimeout(function(){
                //     body.classList.remove('disable-hover');
                // },500);
            };
        }
    };
})(global);

function loop() {
    var task;
    while(mutateTasks.length) {
        task = mutateTasks.pop();
        task.mutate();
        taskNames[task.name] = false;
    }

    global.requestAnimationFrame(loop);
}
