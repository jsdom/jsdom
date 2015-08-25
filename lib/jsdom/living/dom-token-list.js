"use strict";

const DOMException = require("../web-idl/DOMException");

// https://dom.spec.whatwg.org/#domtokenlist

const INTERNAL = Symbol("DOMTokenList internal");

const DOMTokenList = class DOMTokenList {
  constructor() {
    throw new TypeError("Illegal constructor");
  }

  item(index) {
    const length = this.length;
    return length <= index || index < 0 ? null : this[index];
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

  get length() {
    return this[INTERNAL].tokens.length;
  }

  set length(_val) { /* noop */ } // jshint ignore:line

  toString() {
    return join.call(this, " ");
  }
};

function validateToken(token) {
  if (token === "") {
    throw new DOMException(DOMException.SYNTAX_ERR, "The token provided must not be empty.");
  }

  if (/\s/.test(token)) {
    const whitespaceMsg = "The token provided contains HTML space characters, which are not valid in tokens.";
    throw new DOMException(DOMException.INVALID_CHARACTER_ERR, whitespaceMsg);
  }
}

function update(list) {
  const attribute = list[INTERNAL].attribute;
  if (attribute !== undefined) {
    list[INTERNAL].element.setAttribute(attribute, list.toString());
  }
}

// must provide context; i.e. indexOf.call(list, "foo")
//
// calls indexOf on internal array
function indexOf(token) {
  // jshint validthis: true

  return this[INTERNAL].tokens.indexOf(token);
}

// must provide context; i.e. push.call(list, "foo")
//
// calls push on internal array, then manually adds indexed property to this
function push(token) {
  // jshint validthis: true

  const len = this[INTERNAL].tokens.push(token);
  this[len - 1] = token;

  return len;
}

// must provide context; i.e. splice.call(list, 0, 1)
//
// calls splice on internal array then rewrites indexed properties of this
// does not allow items to be added, only removed, so splice-lite
function splice(start, deleteCount) {
  // jshint validthis: true

  const tokens = this[INTERNAL].tokens;
  const removedTokens = tokens.splice(start, deleteCount);

  // remove indexed properties from list
  const re = /^\d+$/;

  for (let prop in this) {
    if (re.test(prop)) {
      delete this[prop];
    }
  }

  // copy indexed properties from internal array
  const len = tokens.length;

  for (let i = 0; i < len; i++) {
    this[i] = tokens[i];
  }

  return removedTokens;
}

// must provide context; i.e. join.call(list, " ")
//
// calls join on internal array
function join(str) {
  // jshint validthis: true

  return this[INTERNAL].tokens.join(str);
}

exports.DOMTokenList = DOMTokenList;

// set dom token list without running update steps
exports.reset = function resetDOMTokenList(list, value) {
  const tokens = list[INTERNAL].tokens;

  splice.call(list, 0, tokens.length);
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
    attribute: attribute,
    tokens: []
  };

  exports.reset(list, element.getAttribute(attribute));

  return list;
};
