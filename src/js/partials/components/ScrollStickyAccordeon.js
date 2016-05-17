"use strict";

var Controller = require('../../base/Controller');
var DomModel = require('../../base/DomModel');
var dataTypeDefinition = require('../../base/dataTypeDefinition');
var Vector = require('../../base/Vector');
var Bounds = require('../../base/Bounds');

var element = require('../../utils/element');
var viewport = require('../../services/viewport');

var viewportDimension = new Vector();
var objectDimension = new Vector();

module.exports = Controller.extend({
    operation: 'subtractLocal',

    modelConstructor: DomModel.extend(dataTypeDefinition, {
        session: {
            extendedRange: {
                type: 'boolean',
                required: true,
                default: function() {
                    return false;
                }
            }
        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        this.header = this.el.querySelector('.top');
        this.footer = this.el.querySelector('.bottom');
        this.contentBoundsHeader = new Bounds();
        this.contentBoundsFooter = new Bounds();
        this.headerBounds = new Bounds();
        this.footerBounds = new Bounds();

        if(this.model.extendedRange) {
            this.operation = 'addLocal';
        }

        viewport.register({
            INIT: onInit.bind(this),
            RESIZE: onResize.bind(this),
            SCROLL: onScroll.bind(this)
        }, this);
    },

    onActive: function(infoFooter, infoHeader) {
        // console.log('HUI', infoHeader.y);
        if(infoFooter.y > 1) {
            this.footer.classList.remove('js-scroll-sticky-bottom');
        } else if(infoFooter.y > -1) {
            this.footer.classList.remove('out-of-screen');
            this.footer.classList.add('js-scroll-sticky-bottom');
        } else {
            this.footer.classList.remove('js-scroll-sticky-bottom');
        }

        if(infoHeader.y > 1) {
            this.header.classList.remove('js-scroll-sticky-top');
        } else if(infoHeader.y > -1) {
            this.header.classList.remove('out-of-screen');
            this.header.classList.add('js-scroll-sticky-top');

        } else {
            this.header.classList.remove('js-scroll-sticky-top');
        }
    },

    onInactive: function(infoFooter, infoHeader) {
        if(infoFooter.y < -1) {
            this.footer.classList.add('out-of-screen');
        }

        if(infoHeader.y > 1) {
            this.header.classList.add('out-of-screen');
        }

        this.footer.classList.remove('js-scroll-sticky-bottom');
        this.header.classList.remove('js-scroll-sticky-top');
    },

    destroy: function() {
        viewport.unregister(this);
        Controller.prototype.destroy.apply(this, arguments);
    }
});

function onScroll(viewportBounds, direction) {
    if(this.contentBoundsFooter.intersectsY(viewportBounds) || this.contentBoundsHeader.intersectsY(viewportBounds)) {
        this.onActive(getIntersectionInfo(this.contentBoundsFooter, objectDimension, viewportBounds, 'addLocal'), getIntersectionInfo(this.contentBoundsHeader, objectDimension, viewportBounds, 'addLocal'), direction);
    } else {
        this.onInactive(getIntersectionInfo(this.contentBoundsFooter, objectDimension, viewportBounds, 'addLocal'), getIntersectionInfo(this.contentBoundsHeader, objectDimension, viewportBounds, 'addLocal'), direction);
    }
}

function onInit(viewportBounds, direction) {
    element.updateBounds(this.el, this.contentBoundsFooter);
    element.updateBounds(this.el, this.contentBoundsHeader);
    element.updateBounds(this.header, this.headerBounds);
    element.updateBounds(this.footer, this.footerBounds);

    this.contentBoundsFooter.min.addValuesLocal(0, this.headerBounds.max.y - this.headerBounds.min.y, 0);
    this.contentBoundsFooter.min.addValuesLocal(0, this.footerBounds.max.y - this.footerBounds.min.y, 0);
    this.contentBoundsFooter.max.subtractValuesLocal(0, viewportBounds.max.y - viewportBounds.min.y, 0);

    this.contentBoundsHeader.min.addValuesLocal(0, viewportBounds.max.y - viewportBounds.min.y, 0);
    this.contentBoundsHeader.max.subtractValuesLocal(0, this.footerBounds.max.y - this.footerBounds.min.y, 0);
    this.contentBoundsHeader.max.subtractValuesLocal(0, this.headerBounds.max.y - this.headerBounds.min.y, 0);

    viewportDimension = viewportBounds.getDimension(viewportDimension);
    onScroll.bind(this)(viewportBounds, direction);
}

function onResize(viewportBounds, direction) {
    element.updateBounds(this.el, this.contentBoundsFooter);
    element.updateBounds(this.el, this.contentBoundsHeader);
    element.updateBounds(this.header, this.headerBounds);
    element.updateBounds(this.footer, this.footerBounds);

    this.contentBoundsFooter.min.addValuesLocal(0, this.headerBounds.max.y - this.headerBounds.min.y, 0);
    this.contentBoundsFooter.min.addValuesLocal(0, this.footerBounds.max.y - this.footerBounds.min.y, 0);
    this.contentBoundsFooter.max.subtractValuesLocal(0, viewportBounds.max.y - viewportBounds.min.y, 0);

    this.contentBoundsHeader.min.addValuesLocal(0, viewportBounds.max.y - viewportBounds.min.y, 0);
    this.contentBoundsHeader.max.subtractValuesLocal(0, this.footerBounds.max.y - this.footerBounds.min.y, 0);
    this.contentBoundsHeader.max.subtractValuesLocal(0, this.headerBounds.max.y - this.headerBounds.min.y, 0);

    viewportDimension = viewportBounds.getDimension(viewportDimension);
    onScroll.bind(this)(viewportBounds, direction);
}

function getIntersectionInfo(bounds, dimension, viewportBounds, operation) {
    return normalizeIntersectionInfoByRange(bounds.getIntersectionInfo(viewportBounds), getRange(bounds, dimension, operation));
}

function getRange(bounds, dimension, operation) {
    return bounds.getDimension(dimension)[operation](viewportDimension);
}

function normalizeIntersectionInfoByRange(intersectionInfo, range) {
    return intersectionInfo.divideLocal(range.absLocal());
}
