"use strict";

var DOMException = require("../web-idl/DOMException");

// https://dom.spec.whatwg.org/#domtokenlist

var INTERNAL = Symbol("DOMTokenList internal");

var indexOf = Array.prototype.indexOf;
var push = Array.prototype.push;
var splice = Array.prototype.splice;
var join = Array.prototype.join;

function DOMTokenList() {
  throw new TypeError("Illegal constructor");
}

DOMTokenList.prototype.item = function item(index) {
  return this.length <= index ? null : this[index];
};

DOMTokenList.prototype.contains = function contains(token) {
  validateToken(token);
  return indexOf.call(this, token) !== -1;
};

DOMTokenList.prototype.add = function add(/* tokens... */) {
  var tokens = arguments;
  var len = tokens.length;

  for (var i = 0; i < len; i++) {
    var token = tokens[i];
    validateToken(token);

    if (indexOf.call(this, token) === -1) {
      push.call(this, token);
    }
  }
  update(this);
};

DOMTokenList.prototype.remove = function remove(/* tokens... */) {
  var tokens = arguments;
  var len = tokens.length;

  for (var i = 0; i < len; i++) {
    var token = tokens[i];
    validateToken(token);

    var index = indexOf.call(this, token);
    if (index !== -1) {
      splice.call(this, index, 1);
    }
  }
  update(this);
};

// if force is true, this behaves like add
// if force is false, this behaves like remove
// if force is undefined, this behaves as one would expect toggle to
// always returns whether classList contains token after toggling
DOMTokenList.prototype.toggle = function toggle(token, force) {
  validateToken(token);

  var index = indexOf.call(this, token);
  if (index !== -1) {
    if (force === false || force === undefined) {
      splice.call(this, index, 1);
      update(this);
      return false;
    }

    return true;
  }

  if (force === false) {
    return false;
  }

  push.call(this, token);
  update(this);
  return true;
};

DOMTokenList.prototype.toString = function toString() {
  return join.call(this, " ");
};

function validateToken(token) {
  if (token === "") {
    throw new DOMException(DOMException.SYNTAX_ERR);
  }

  if (/\s/.test(token)) {
    throw new DOMException(DOMException.INVALID_CHARACTER_ERR);
  }
}

function update(list) {
  var attribute = list[INTERNAL].attribute;
  if (attribute !== undefined) {
    list[INTERNAL].element.setAttribute(attribute, list.toString());
  }
}

exports.DOMTokenList = DOMTokenList;

// set dom token list without running update steps
exports.resetDOMTokenList = function resetDOMTokenList(list, value) {
  splice.call(list, 0, list.length);
  value = (value || "").trim();
  if (value !== "") {
    var tokens = value.split(/\s+/);
    var len = tokens.length;
    for (var i = 0; i < len; i++) {
      var token = tokens[i];
      if (indexOf.call(list, token) === -1) {
        push.call(list, token);
      }
    }
  }
};

exports.createDOMTokenList = function createDOMTokenList(element, attribute) {
  var list = Object.create(DOMTokenList.prototype);
  list.constructor = DOMTokenList;

  list[INTERNAL] = {
    element: element,
    attribute: attribute
  };

  exports.resetDOMTokenList(list, element.getAttribute(attribute));

  return list;
};
