"use strict";

const DOMException = require("../web-idl/DOMException");

// https://dom.spec.whatwg.org/#domtokenlist

const INTERNAL = Symbol("DOMTokenList internal");

const indexOf = Array.prototype.indexOf;
const push = Array.prototype.push;
const splice = Array.prototype.splice;
const join = Array.prototype.join;

const DOMTokenList = class {
  constructor() {
    throw new TypeError("Illegal constructor");
  }

  item(index) {
    return this.length <= index ? null : this[index];
  }

  contains(token) {
    validateToken(token);
    return indexOf.call(this, token) !== -1;
  }

  add(/* tokens... */) {
    const tokens = arguments;
    const len = tokens.length;

    for (let i = 0; i < len; i++) {
      const token = tokens[i];
      validateToken(token);

      if (indexOf.call(this, token) === -1) {
        push.call(this, token);
      }
    }
    update(this);
  }

  add(/* tokens... */) {
    const tokens = arguments;
    const len = tokens.length;

    for (let i = 0; i < len; i++) {
      const token = tokens[i];
      validateToken(token);

      if (indexOf.call(this, token) === -1) {
        push.call(this, token);
      }
    }
    update(this);
  }

  remove(/* tokens... */) {
    const tokens = arguments;
    const len = tokens.length;

    for (let i = 0; i < len; i++) {
      const token = tokens[i];
      validateToken(token);

      const index = indexOf.call(this, token);
      if (index !== -1) {
        splice.call(this, index, 1);
      }
    }
    update(this);
  }

  // if force is true, this behaves like add
  // if force is false, this behaves like remove
  // if force is undefined, this behaves as one would expect toggle to
  // always returns whether classList contains token after toggling
  toggle(token, force) {
    validateToken(token);

    const index = indexOf.call(this, token);

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
  }

  toString() {
    return join.call(this, " ");
  }
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
  const attribute = list[INTERNAL].attribute;
  if (attribute !== undefined) {
    list[INTERNAL].element.setAttribute(attribute, list.toString());
  }
}

exports.DOMTokenList = DOMTokenList;

// set dom token list without running update steps
exports.reset = function resetDOMTokenList(list, value) {
  splice.call(list, 0, list.length);
  value = (value || "").trim();
  if (value !== "") {
    const tokens = value.split(/\s+/);
    const len = tokens.length;
    for (let i = 0; i < len; i++) {
      const token = tokens[i];
      if (indexOf.call(list, token) === -1) {
        push.call(list, token);
      }
    }
  }
};

exports.create = function createDOMTokenList(element, attribute) {
  const list = Object.create(DOMTokenList.prototype);

  list[INTERNAL] = {
    element: element,
    attribute: attribute
  };

  exports.reset(list, element.getAttribute(attribute));

  return list;
};
