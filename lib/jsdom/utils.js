"use strict";
const path = require("path");
const URL = require("whatwg-url").URL;
const querystring = require("querystring");
const domSymbolTree = require("./living/helpers/internal-constants").domSymbolTree;
const SYMBOL_TREE_POSITION = require("symbol-tree").TreePosition;
const iconv = require("iconv-lite");

exports.toFileUrl = function (fileName) {
  // Beyond just the `path.resolve`, this is mostly for the benefit of Windows,
  // where we need to convert "\" to "/" and add an extra "/" prefix before the
  // drive letter.
  let pathname = path.resolve(process.cwd(), fileName).replace(/\\/g, "/");
  if (pathname[0] !== "/") {
    pathname = "/" + pathname;
  }

  // path might contain spaces, so convert those to %20
  return "file://" + encodeURI(pathname);
};

/**
 * Define a setter on an object
 *
 * This method replaces any existing setter but leaves getters in place.
 *
 * - `object` {Object} the object to define the setter on
 * - `property` {String} the name of the setter
 * - `setterFn` {Function} the setter
 */
exports.defineSetter = function defineSetter(object, property, setterFn) {
  const descriptor = Object.getOwnPropertyDescriptor(object, property) || {
    configurable: true,
    enumerable: true
  };

  descriptor.set = setterFn;

  Object.defineProperty(object, property, descriptor);
};

/**
 * Define a getter on an object
 *
 * This method replaces any existing getter but leaves setters in place.
 *
 * - `object` {Object} the object to define the getter on
 * - `property` {String} the name of the getter
 * - `getterFn` {Function} the getter
 */
exports.defineGetter = function defineGetter(object, property, getterFn) {
  const descriptor = Object.getOwnPropertyDescriptor(object, property) || {
    configurable: true,
    enumerable: true
  };

  descriptor.get = getterFn;

  Object.defineProperty(object, property, descriptor);
};

/**
 * Define a set of properties on an object, by copying the property descriptors
 * from the original object.
 *
 * - `object` {Object} the target object
 * - `properties` {Object} the source from which to copy property descriptors
 */
exports.define = function define(object, properties) {
  for (const name of Object.getOwnPropertyNames(properties)) {
    const propDesc = Object.getOwnPropertyDescriptor(properties, name);
    Object.defineProperty(object, name, propDesc);
  }
};

/**
 * Define a list of constants on a constructor and its .prototype
 *
 * - `Constructor` {Function} the constructor to define the constants on
 * - `propertyMap` {Object}  key/value map of properties to define
 */
exports.addConstants = function addConstants(Constructor, propertyMap) {
  for (const property in propertyMap) {
    const value = propertyMap[property];
    addConstant(Constructor, property, value);
    addConstant(Constructor.prototype, property, value);
  }
};

function addConstant(object, property, value) {
  Object.defineProperty(object, property, {
    configurable: false,
    enumerable: true,
    writable: false,
    value
  });
}

let memoizeQueryTypeCounter = 0;

/**
 * Returns a version of a method that memoizes specific types of calls on the object
 *
 * - `fn` {Function} the method to be memozied
 */
exports.memoizeQuery = function memoizeQuery(fn) {
  // Only memoize query functions with arity <= 2
  if (fn.length > 2) {
    return fn;
  }

  const type = memoizeQueryTypeCounter++;

  return function () {
    if (!this._memoizedQueries) {
      return fn.apply(this, arguments);
    }

    if (!this._memoizedQueries[type]) {
      this._memoizedQueries[type] = Object.create(null);
    }

    let key;
    if (arguments.length === 1 && typeof arguments[0] === "string") {
      key = arguments[0];
    } else if (arguments.length === 2 && typeof arguments[0] === "string" && typeof arguments[1] === "string") {
      key = arguments[0] + "::" + arguments[1];
    } else {
      return fn.apply(this, arguments);
    }

    if (!(key in this._memoizedQueries[type])) {
      this._memoizedQueries[type][key] = fn.apply(this, arguments);
    }
    return this._memoizedQueries[type][key];
  };
};

exports.resolveHref = function resolveHref(baseUrl, href) {
  try {
    return new URL(href, baseUrl).href;
  } catch (e) {
    // can't throw since this utility is basically used everywhere
    // do what the spec says regarding anchor tags: just don't parse it
    // https://html.spec.whatwg.org/#dom-hyperlink-href
    return href;
  }
};

exports.mapper = function (parent, filter, recursive) {
  function skipRoot(node) {
    return node !== parent && (!filter || filter(node));
  }
  return () => {
    if (recursive !== false) { // default is not recursive
      return domSymbolTree.treeToArray(parent, { filter: skipRoot });
    }

    return domSymbolTree.childrenToArray(parent, { filter });
  };
};

function isValidAbsoluteURL(str) {
  try {
    /* eslint-disable no-new */
    new URL(str);
    /* eslint-enable no-new */

    // If we can parse it, it's a valid absolute URL.
    return true;
  } catch (e) {
    return false;
  }
}

exports.isValidTargetOrigin = function (str) {
  return str === "*" || str === "/" || isValidAbsoluteURL(str);
};

exports.simultaneousIterators = function* (first, second) {
  for (;;) {
    const firstResult = first.next();
    const secondResult = second.next();

    if (firstResult.done && secondResult.done) {
      return;
    }

    yield [
      firstResult.done ? null : firstResult.value,
      secondResult.done ? null : secondResult.value
    ];
  }
};

exports.treeOrderSorter = function (a, b) {
  const compare = domSymbolTree.compareTreePosition(a, b);

  if (compare & SYMBOL_TREE_POSITION.PRECEDING) { // b is preceding a
    return 1;
  }

  if (compare & SYMBOL_TREE_POSITION.FOLLOWING) {
    return -1;
  }

  // disconnected or equal:
  return 0;
};

exports.lengthFromProperties = function (arrayLike) {
  let max = -1;
  const keys = Object.keys(arrayLike);
  const highestKeyIndex = keys.length - 1;

  // Abuses a v8 implementation detail for a very fast case
  // (if this implementation detail changes, this method will still
  //  return correct results)
  /* eslint-disable eqeqeq */
  if (highestKeyIndex == keys[highestKeyIndex]) { // not ===
    /* eslint-enable eqeqeq */
    return keys.length;
  }

  for (let i = highestKeyIndex; i >= 0; --i) {
    const asNumber = Number(keys[i]);

    if (!Number.isNaN(asNumber) && asNumber > max) {
      max = asNumber;
    }
  }
  return max + 1;
};

const base64Regexp = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;

exports.parseDataUrl = function parseDataUrl(url) {
  const urlParts = url.match(/^data:(.+?)(?:;(base64))?,(.*)$/);
  let buffer;
  if (urlParts[2] === "base64") {
    if (urlParts[3] && !base64Regexp.test(urlParts[3])) {
      throw new Error("Not a base64 string");
    }
    buffer = new Buffer(urlParts[3], "base64");
  } else {
    buffer = new Buffer(querystring.unescape(urlParts[3]));
  }
  return { buffer, type: urlParts[1] };
};

const tokenRegexp = exports.tokenRegexp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
const fieldValueRegexp =
  exports.fieldValueRegexp = /^[ \t]*(?:[\x21-\x7E\x80-\xFF](?:[ \t][\x21-\x7E\x80-\xFF])?)*[ \t]*$/;
const contentTypeRegexp = /^(.*?)\/(.*?)([\t ]*;.*)?$/;
const parameterValueRegexp = /^(.*?)=(.*)$/;
const quotedStringRegexp = /"(?:[\t \x21\x23-\x5B\x5D-\x7E\x80-\xFF]|(?:\\[\t \x21-\x7E\x80-\xFF]))*"/;
const qescRegExp = /\\([\t \x21-\x7E\x80-\xFF])/g;
const quoteRegExp = /([\\"])/g;
const headerListSeparatorRegexp = exports.headerListSeparatorRegexp = /,[ \t]*/;

function qstring(val) {
  if (tokenRegexp.test(val)) {
    return val;
  }
  return "\"" + val.replace(quoteRegExp, "\\$1") + "\"";
}

class ContentType {
  constructor(type, subtype, parameterList) {
    this.type = type;
    this.subtype = subtype;
    this.parameterList = parameterList;
  }
  get(key) {
    const param = this.parameterList.reverse().find(v => v.key === key);
    return param ? param.value : null;
  }
  set(key, value) {
    this.parameterList = this.parameterList.filter(v => v.key !== key);
    this.parameterList.push({
      separator: ";",
      key,
      value
    });
  }
  isXML() {
    return (this.subtype === "xml" && (this.type === "text" || this.type === "application"))
      || this.subtype.endsWith("+xml");
  }
  isHTML() {
    return this.subtype === "html" && this.type === "text";
  }
  isText() {
    return this.type === "text";
  }
  toString() {
    return this.type + "/" + this.subtype +
      this.parameterList.map(v => v.separator + (v.key ? v.key + "=" + qstring(v.value) : v.value))
      .join("");
  }
}

exports.parseContentType = function parseContentType(contentType) {
  if (!contentType) {
    return null;
  }
  const contentTypeMatch = contentTypeRegexp.exec(contentType);
  if (contentTypeMatch) {
    const type = contentTypeMatch[1];
    const subtype = contentTypeMatch[2];
    const parameters = contentTypeMatch[3];
    if (tokenRegexp.test(type) && tokenRegexp.test(subtype)) {
      const parameterPattern = /([\t ]*;[\t ]*)([^\t ;]*)/g;
      const parameterList = [];
      let match;
      while (match = parameterPattern.exec(parameters)) {
        const separator = match[1];
        const keyValue = parameterValueRegexp.exec(match[2]);
        let key;
        let value;
        if (keyValue && tokenRegexp.test(keyValue[1])) {
          key = keyValue[1];
          if(quotedStringRegexp.test(keyValue[2])) {
            value = keyValue[2]
              .substr(1, keyValue[2].length - 2)
              .replace(qescRegExp, "$1");
          } else {
            value = keyValue[2];
          }
        }
        if (key) {
          parameterList.push({
            separator,
            key,
            value
          });
        } else {
          parameterList.push({
            separator,
            value: match[2]
          });
        }
      }
      return new ContentType(type, subtype, parameterList);
    }
    return null;
  }
  return null;
};

exports.decodeString = function decodeString(buffer, contentType, defaultEncoding, detectMetaCharset) {
  if (!iconv.encodingExists(defaultEncoding)) {
    defaultEncoding = "UTF-8";
  }
  let charset = contentType ? contentType.get("charset") : null;
  if (!iconv.encodingExists(charset)) {
    charset = null;
  }
  if(buffer.length >= 2) {
    if(buffer[0] === 0xFE && buffer[1] === 0xFF) {
      charset = "UTF-16BE";
    } else if(buffer[0] === 0xFF && buffer[1] === 0xFE) {
      charset = "UTF-16LE";
    } else if(buffer.length >= 3 &&
        buffer[0] === 0xEF &&
        buffer[1] === 0xBB &&
        buffer[2] === 0xBF) {
      charset = "UTF-8";
    }
  }
  if (!charset && detectMetaCharset) {
    charset = prescanMetaCharset(buffer);
  }
  charset = charset || defaultEncoding;
  return { data: iconv.decode(buffer, charset), charset };
};

// https://html.spec.whatwg.org/multipage/syntax.html#prescan-a-byte-stream-to-determine-its-encoding
function prescanMetaCharset(buffer) {
  const l = Math.min(buffer.length, 1024);
  for (let i = 0; i < l; i++) {
    let c = buffer[i];
    // "<"
    if(c === 0x3C) {
      let c1 = buffer[i + 1];
      let c2 = buffer[i + 2];
      let c3 = buffer[i + 3];
      let c4 = buffer[i + 4];
      let c5 = buffer[i + 5];
      // !-- (comment start)
      if(c1 === 0x21 && c2 === 0x2D && c3 === 0x2D) {
        i += 4;
        for (; i < l; i++) {
          c = buffer[i];
          c1 = buffer[i + 1];
          c2 = buffer[i + 2];
          // --> (comment end)
          if(c === 0x2D && c1 === 0x2D && c2 === 0x3E) {
            i += 2;
            break;
          }
        }
      }
      // "meta" + space or /
      else if((c1 === 0x4D || c1 === 0x6D) &&
         (c2 === 0x45 || c2 === 0x65) &&
         (c3 === 0x54 || c3 === 0x74) &&
         (c4 === 0x41 || c4 === 0x61) &&
         (c5 === 0x09 || c5 === 0x0A || c5 === 0x0C || c5 === 0x0D || c5 === 0x20 || c5 === 0x2F)) {
        i += 6;
        let gotPragma = false;
        let needPragma = null;
        let charset = null;

        let attrRes;
        do {
          attrRes = getAttribute(buffer, i, l);
          if(attrRes.attr) {
            if (attrRes.attr.name === "http-equiv") {
              gotPragma = attrRes.attr.value === "content-type";
            } else if (attrRes.attr.name === "content" && !charset) {
              const contentType = exports.parseContentType(attrRes.attr.value);
              if(contentType && contentType.get("charset")) {
                charset = contentType.get("charset");
                needPragma = true;
              }
            } else if (attrRes.attr.name === "charset") {
              charset = attrRes.attr.value;
              needPragma = false;
            }
          }
          i = attrRes.i;
        } while(attrRes.attr);
        if(needPragma === null) {
          continue;
        }
        if(needPragma === true && gotPragma === false) {
          continue;
        }
        if (!iconv.encodingExists(charset)) {
          continue;
        }
        if(charset === "x-user-defined") {
          charset = "windows-1252";
        }
        return charset;
      // a-z or A-Z
      } else if((c1 >= 0x41 && c1 <= 0x5A) || (c1 >= 0x61 && c1 <= 0x7A)) {
        for (i += 2; i < l; i++) {
          c = buffer[i];
          // space or >
          if(c === 0x09 || c === 0x0A || c === 0x0C || c === 0x0D || c === 0x20 || c === 0x3E) {
            break;
          }
        }
        let attrRes;
        do {
          attrRes = getAttribute(buffer, i, l);
          i = attrRes.i;
        } while(attrRes.attr);
      // ! or / or ?
      } else if(c1 === 0x21 || c1 === 0x2F || c1 === 0x3F) {
        for (i += 2; i < l; i++) {
          c = buffer[i];
          // >
          if(c === 0x3E) {
            break;
          }
        }
      }
    }
  }
  return null;
}

// https://html.spec.whatwg.org/multipage/syntax.html#concept-get-attributes-when-sniffing
function getAttribute(buffer, i, l) {
  for(; i < l; i++) {
    let c = buffer[i];
    // space or /
    if(c === 0x09 || c === 0x0A || c === 0x0C || c === 0x0D || c === 0x20 || c === 0x2F) {
      continue;
    }
    // ">"
    if(c === 0x3E) {
      i++;
      break;
    }
    let name = "";
    let value = "";
    nameLoop:for(; i < l; i++) {
      c = buffer[i];
      // "="
      if(c === 0x3D && name !== "") {
        i++;
        break;
      }
      // space
      if(c === 0x09 || c === 0x0A || c === 0x0C || c === 0x0D || c === 0x20) {
        for(i++; i < l; i++) {
          c = buffer[i];
          // space
          if(c === 0x09 || c === 0x0A || c === 0x0C || c === 0x0D || c === 0x20) {
            continue;
          }
          // not "="
          if(c !== 0x3D) {
            return { attr: {name, value}, i};
          } else {
            i++;
            break nameLoop;
          }
        }
        break;
      }
      // / or >
      if(c === 0x2F || c === 0x3E) {
        return { attr: {name, value}, i};
      }
      // A-Z
      if(c >= 0x41 && c <= 0x5A) {
        name += String.fromCharCode(c + 0x20); // lowercase
      } else {
        name += String.fromCharCode(c);
      }
    }
    c = buffer[i];
    // space
    if(c === 0x09 || c === 0x0A || c === 0x0C || c === 0x0D || c === 0x20) {
      for(i++; i < l; i++) {
        c = buffer[i];
        // space
        if(c === 0x09 || c === 0x0A || c === 0x0C || c === 0x0D || c === 0x20) {
          continue;
        } else {
          break;
        }
      }
    }
    // " or '
    if(c === 0x22 || c === 0x27) {
      const quote = c;
      for(i++; i < l; i++) {
        c = buffer[i];

        if(c === quote) {
          i++;
          return { attr: {name, value}, i};
        }

        // A-Z
        if(c >= 0x41 && c <= 0x5A) {
          value += String.fromCharCode(c + 0x20); // lowercase
        } else {
          value += String.fromCharCode(c);
        }
      }
    }

    // >
    if(c === 0x3E) {
      return { attr: {name, value}, i};
    }

    // A-Z
    if(c >= 0x41 && c <= 0x5A) {
      value += String.fromCharCode(c + 0x20); // lowercase
    } else {
      value += String.fromCharCode(c);
    }

    for(i++; i < l; i++) {
      c = buffer[i];

      // space or >
      if(c === 0x09 || c === 0x0A || c === 0x0C || c === 0x0D || c === 0x20 || c === 0x3E) {
        return { attr: {name, value}, i};
      }

      // A-Z
      if(c >= 0x41 && c <= 0x5A) {
        value += String.fromCharCode(c + 0x20); // lowercase
      } else {
        value += String.fromCharCode(c);
      }
    }
  }
  return {i};
}

/* eslint-disable global-require */

exports.Canvas = null;
try {
  exports.Canvas = require("canvas");
  if (typeof exports.Canvas !== "function") {
    // In browserify, the require will succeed but return an empty object
    exports.Canvas = null;
  }
} catch (e) {
  exports.Canvas = null;
}
