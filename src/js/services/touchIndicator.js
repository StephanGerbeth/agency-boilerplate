"use strict";

import parse from 'url-parse';

(function() {
    $('a.partial[data-partial*="elements/link"]').on('click', function(e) {
        var target = e.currentTarget;
        var node = target.querySelector('.partial[data-partial="touch-indicator"]');
        if (!node) {
            return;
        }
        if (!target.classList.contains('js-touch-indicator--animate')) {
            e.preventDefault();
            if(isNewPageUrl(target)) {
                e.stopPropagation();
            }

            var eventName = 'animationend.' + e.timeStamp;
            node.style.cssText = 'transform: translate3d(' + e.offsetX + 'px, ' + e.offsetY + 'px, 0);';
            target.classList.add('js-touch-indicator--animate');

            $(e.currentTarget).on(eventName, function(e) {
                $(e.currentTarget).off(eventName);
                if(isNewPageUrl(target)) {
                    target.click();
                } else {
                    target.classList.remove('js-touch-indicator--animate');
                }
            });
        } else {
            target.classList.remove('js-touch-indicator--animate');
        }

    });
})();

function isNewPageUrl(node) {
    var linkUrl = parse(node.href);
    var winUrl = parse(global.location.href);
    if (linkUrl.toString().replace(linkUrl.hash, '') !== winUrl.toString().replace(winUrl.hash, '') && node.href) {
        return true;
    }
    return false;
}
