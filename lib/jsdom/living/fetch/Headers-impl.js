"use strict";

const {
  isForbidden,
  isForbiddenResponse,
  isPrivilegedNoCORSRequest,
  isNoCORSSafelistedRequest,
  isCORSWhitelisted
} = require("./header-types");
const HeaderList = require("./header-list");

function assertName(name) {
  if (!isHeaderName(name)) {
    throw new TypeError("name is invalid");
  }
}

function assertValue(value) {
  if (!isHeaderValue(value)) {
    throw new TypeError("value is invalid");
  }
}

// https://fetch.spec.whatwg.org/#header-name
function isHeaderName(name) {
  return /^[!#$%&'*+\-.^`|~\w]+$/.test(name);
}

// https://fetch.spec.whatwg.org/#header-value
function isHeaderValue(value) {
  return value[0] !== "\t" &&
    value[0] !== " " &&
    value[value.length - 1] !== "\t" &&
    value[value.length - 1] !== " " &&
    !/[\0\r\n]/.test(value);
}

// https://fetch.spec.whatwg.org/#concept-header-value-normalize
function normalizeHeaderValue(potentialValue) {
  return potentialValue.replace(/^[\n\r\t ]+|[\n\r\t ]+$/g, "");
}

class HeadersImpl {
  constructor(globalObject, args) {
    this.guard = "none";
    this.headersList = new HeaderList();

    if (args[0]) {
      this._fill(args[0]);
    }
  }

  _fill(init) {
    if (Array.isArray(init)) {
      for (const header of init) {
        if (header.length !== 2) {
          throw new TypeError("init is invalid");
        }
        this.append(header[0], header[1]);
      }
    } else {
      for (const key of Object.keys(init)) {
        this.append(key, init[key]);
      }
    }
  }

  has(name) {
    assertName(name);
    return this.headersList.contains(name);
  }

  getSetCookie() {
    return this.headersList.getAll("Set-Cookie") || [];
  }

  get(name) {
    assertName(name);
    return this.headersList.get(name);
  }

  _removePrivilegedNoCORSHeaders() {
    this.headersList.delete("range");
  }

  append(name, value) {
    value = normalizeHeaderValue(value);
    assertName(name);
    assertValue(value);

    switch (this.guard) {
      case "immutable":
        throw new TypeError("Headers is immutable");
      case "request":
        if (isForbidden(name)) {
          return;
        }
        break;
      case "request-no-cors": {
        if (!isCORSWhitelisted(name, value)) {
          return;
        }
        break;
      }
      case "response":
        if (isForbiddenResponse(name)) {
          return;
        }
        break;
    }

    this.headersList.append(name, value);
    this._removePrivilegedNoCORSHeaders();
  }

  set(name, value) {
    value = normalizeHeaderValue(value);
    assertName(name);
    assertValue(value);

    switch (this.guard) {
      case "immutable":
        throw new TypeError("Headers is immutable");
      case "request":
        if (isForbidden(name)) {
          return;
        }
        break;
      case "request-no-cors": {
        if (!isCORSWhitelisted(name, value)) {
          return;
        }
        break;
      }
      case "response":
        if (isForbiddenResponse(name)) {
          return;
        }
        break;
    }
    this.headersList.set(name, value);
    this._removePrivilegedNoCORSHeaders();
  }

  delete(name) {
    assertName(name);

    switch (this.guard) {
      case "immutable":
        throw new TypeError("Headers is immutable");
      case "request":
        if (isForbidden(name)) {
          return;
        }
        break;
      case "request-no-cors": {
        if (
          !isNoCORSSafelistedRequest(name) &&
          !isPrivilegedNoCORSRequest(name)
        ) {
          return;
        }
        break;
      }
      case "response":
        if (isForbiddenResponse(name)) {
          return;
        }
        break;
    }
    this.headersList.delete(name);
    this._removePrivilegedNoCORSHeaders();
  }

  * [Symbol.iterator]() {
    for (const header of this.headersList.sortAndCombine()) {
      yield header;
    }
  }
}

exports.implementation = HeadersImpl;
exports.normalizeHeaderValue = normalizeHeaderValue;
exports.isHeaderName = isHeaderName;
exports.isHeaderValue = isHeaderValue;
