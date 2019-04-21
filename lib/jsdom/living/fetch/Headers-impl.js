"use strict";

const MIMEType = require("whatwg-mimetype");

const {
  FORBIDDEN,
  FORBIDDEN_RESPONSE,
  NO_CORS_SAFELISTED_REQUEST,
  PRIVILEGED_NO_CORS_REQUEST
} = require("./reservedHeaders");
const HeaderList = require("./header-list");

const CORS_UNSAFE_BYTE = /[\x00-\x08\x0A-\x1F"():<>?@[\\\]{}\x7F]/;

function assertName(name) {
  if (!name.match(/^[!#$%&'*+\-.^`|~\w]+$/)) {
    throw new TypeError("name is invalid");
  }
}

function assertValue(value) {
  if (value.match(/[\0\r\n]/)) {
    throw new TypeError("value is invalid");
  }
}

function isForbiddenHeader(name) {
  name = name.toLowerCase();
  return (
    FORBIDDEN.has(name) || name.startsWith("proxy-") || name.startsWith("sec-")
  );
}

function isCORSWhitelisted(name, value) {
  name = name.toLowerCase();
  switch (name) {
    case "accept":
      if (value.match(CORS_UNSAFE_BYTE)) {
        return false;
      }
      break;
    case "accept-language":
    case "content-language":
      if (value.match(/[^\x30-\x39\x41-\x5A\x61-\x7A *,\-.;=]/)) {
        return false;
      }
      break;
    case "content-type": {
      if (value.match(CORS_UNSAFE_BYTE)) {
        return false;
      }
      const mimeType = MIMEType.parse(value);
      if (mimeType === null) {
        return false;
      }
      if (
        ![
          "application/x-www-form-urlencoded",
          "multipart/form-data",
          "text/plain"
        ].includes(mimeType.essence)
      ) {
        return false;
      }
      break;
    }
    default:
      return false;
  }
  if (Buffer.from(value).length > 128) {
    return false;
  }
  return true;
}

class HeadersImpl {
  constructor(args) {
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

  get(name) {
    assertName(name);
    return this.headersList.get(name);
  }

  _removePrivilegedNoCORSHeaders() {
    this.headersList.delete("range");
  }

  append(name, value) {
    value = value.trim();
    assertName(name);
    assertValue(value);

    switch (this.guard) {
      case "immutable":
        throw new TypeError("Headers is immutable");
      case "request":
        if (isForbiddenHeader(name)) {
          return;
        }
        break;
      case "request-no-cors": {
        let temporaryValue = this.get(name);
        if (temporaryValue === null) {
          temporaryValue = value;
        } else {
          temporaryValue += `, ${value}`;
        }
        if (!isCORSWhitelisted(name, value)) {
          return;
        }
        break;
      }
      case "response":
        if (FORBIDDEN_RESPONSE.has(name.toLowerCase())) {
          return;
        }
        break;
    }

    this.headersList.append(name, value);
    this._removePrivilegedNoCORSHeaders();
  }

  set(name, value) {
    value = value.trim();
    assertName(name);
    assertValue(value);

    switch (this.guard) {
      case "immutable":
        throw new TypeError("Headers is immutable");
      case "request":
        if (isForbiddenHeader(name)) {
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
        if (FORBIDDEN_RESPONSE.has(name.toLowerCase())) {
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
        if (isForbiddenHeader(name)) {
          return;
        }
        break;
      case "request-no-cors": {
        if (
          !NO_CORS_SAFELISTED_REQUEST.has(name.toLowerCase()) &&
          !PRIVILEGED_NO_CORS_REQUEST.has(name.toLowerCase())
        ) {
          return;
        }
        break;
      }
      case "response":
        if (FORBIDDEN_RESPONSE.has(name.toLowerCase())) {
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
