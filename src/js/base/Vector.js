"use strict";

function Vector(x, y, z) {
    if (!(this instanceof Vector)) {
        return new Vector(x, y, z);
    }

    if(x === Object(x)) {        
        this.reset(x);
    } else {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
}

Vector.prototype.x = 0;
Vector.prototype.y = 0;
Vector.prototype.z = 0;

Vector.prototype.setX = function(value) {
    this.x = value;
    return this;
};

Vector.prototype.setY = function(value) {
    this.y = value;
    return this;
};

Vector.prototype.setZ = function(value) {
    this.z = value;
    return this;
};

Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

Vector.prototype.reset = function(vector) {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
    return this;
};

Vector.prototype.resetValues = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
};

Vector.prototype.resetByRad = function(rad) {
    this.x = Math.cos(rad);
    this.y = Math.sin(rad);
    this.z = Math.tan(rad);
    return this;
};

Vector.prototype.toJSON = function() {
    return {x: this.x, y: this.y, z: this.z};
};

Vector.prototype.toString = function() {
    return JSON.stringify(this.toJSON());
};

Vector.prototype.add = function(vector){
    return add(this, vector.x, vector.y, vector.z, new Vector());
};

Vector.prototype.addValue = function(v){
    return add(this, v, v, v, new Vector());
};

Vector.prototype.addValues = function(x, y, z){
    return add(this, x, y, z, new Vector());
};

Vector.prototype.addLocal = function(vector){
    return add(this, vector.x, vector.y, vector.z, this);
};

Vector.prototype.addValueLocal = function(v){
    return add(this, v, v, v, this);
};

Vector.prototype.addValuesLocal = function(x, y, z){
    return add(this, x, y, z, this);
};

function add(left, x, y, z, result) {
    return result.resetValues(left.x + x, left.y + y, left.z + z);
}

Vector.prototype.subtract = function(vector){
    return subtract(this, vector.x, vector.y, vector.z, new Vector());
};

Vector.prototype.subtractValue = function(v){
    return subtract(this, v, v, v, new Vector());
};

Vector.prototype.subtractValues = function(x, y, z){
    return subtract(this, x, y, z, new Vector());
};

Vector.prototype.subtractLocal = function(vector){
    return subtract(this, vector.x, vector.y, vector.z, this);
};

Vector.prototype.subtractValueLocal = function(v){
    return subtract(this, v, v, v, this);
};

Vector.prototype.subtractValuesLocal = function(x, y, z){
    return subtract(this, x, y, z, this);
};

function subtract(left, x, y, z, result) {
    return result.resetValues(left.x - x, left.y - y, left.z - z);
}

Vector.prototype.multiply = function(vector){
    return multiply(this, vector.x, vector.y, vector.z, new Vector());
};

Vector.prototype.multiplyValue = function(v){
    return multiply(this, v, v, v, new Vector());
};

Vector.prototype.multiplyValues = function(x, y, z){
    return multiply(this, x, y, z, new Vector());
};

Vector.prototype.multiplyLocal = function(vector){
    return multiply(this, vector.x, vector.y, vector.z , this);
};

Vector.prototype.multiplyValueLocal = function(v){
    return multiply(this, v, v, v, this);
};

Vector.prototype.multiplyValuesLocal = function(x, y, z){
    return multiply(this, x, y, z, this);
};

function multiply(left, x, y, z, result){
    return result.resetValues(left.x * x, left.y * y, left.z * z);
}

Vector.prototype.divide = function(vector){
    return divide(this, vector.x, vector.y, vector.z, new Vector());
};

Vector.prototype.divideValue = function(v){
    return divide(this, v, v, v, new Vector());
};

Vector.prototype.divideValues = function(x, y, z){
    return divide(this, x, y, z, new Vector());
};

Vector.prototype.divideLocal = function(vector){
    return divide(this, vector.x, vector.y, vector.z, this);
};

Vector.prototype.divideValueLocal = function(v){
    return divide(this, v, v, v, this);
};

Vector.prototype.divideValuesLocal = function(x, y, z){
    return divide(this, x, y, z, this);
};

function divide(left, x, y, z, result){
    return result.resetValues((left.x / x || 0), (left.y / y || 0), (left.z / z || 0));
}

Vector.prototype.normalize = function() {
    return normalize(this, new Vector());
};

Vector.prototype.normalizeLocal = function() {
    return normalize(this, this);
};

function normalize(scope, result) {
    var l = scope.length();
    if(l > 1) {
        result.setX(scope.x/l).setY(scope.y/l).setZ(scope.z/l);
    }
    return result;
}

Vector.prototype.clamp = function(min, max) {
    return clamp(this, min, max, new Vector());
};

Vector.prototype.clampLocal = function(min, max) {
    return clamp(this, min, max, this);
};

function clamp(scope, min, max, result) {
    return result
        .setX(Math.min(Math.max(scope.x, min), max))
        .setY(Math.min(Math.max(scope.y, min), max))
        .setZ(Math.min(Math.max(scope.z, min), max));
}

Vector.prototype.sign = function() {
    return sign(this, new Vector());
};

Vector.prototype.signLocal = function() {
    return sign(this, this);
};

function sign(scope, result) {
    return result
        .setX(scope.x >> 31 | -scope.x >>> 31)
        .setY(scope.y >> 31 | -scope.y >>> 31)
        .setZ(scope.z >> 31 | -scope.z >>> 31);
}

Vector.prototype.abs = function() {
    return abs(this, new Vector());
};

Vector.prototype.absLocal = function() {
    return abs(this, this);
};

function abs(scope, result) {
    return result
        .setX((scope.x + (scope.x >> 31)) ^ (scope.x >> 31))
        .setY((scope.y + (scope.y >> 31)) ^ (scope.y >> 31))
        .setZ((scope.z + (scope.z >> 31)) ^ (scope.z >> 31));
}

Vector.prototype.angle = function() {
    return Math.atan2(this.y, this.x);
};

Vector.prototype.radBetween = function(vector) {
    return Math.atan2(vector.y,vector.x) - Math.atan2(this.y,this.x);
    // return Math.atan2(this.y - vector.y, this.x - vector.x);
};

module.exports = Vector;
