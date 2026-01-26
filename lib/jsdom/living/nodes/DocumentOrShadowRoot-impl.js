"use strict";
const DOMException = require("../generated/DOMException");
const NODE_TYPE = require("../node-type");
const StyleSheetList = require("../generated/StyleSheetList.js");
const { nodeRoot } = require("../helpers/node");
const { retarget } = require("../helpers/shadow-dom");

class DocumentOrShadowRootImpl {
  get activeElement() {
    let candidate = this._ownerDocument._lastFocusedElement || this._ownerDocument.body;
    if (!candidate) {
      return null;
    }
    candidate = retarget(candidate, this);
    if (nodeRoot(candidate) !== this) {
      return null;
    }
    if (candidate.nodeType !== NODE_TYPE.DOCUMENT_NODE) {
      return candidate;
    }
    if (candidate.body !== null) {
      return candidate.body;
    }
    return candidate.documentElement;
  }

  get styleSheets() {
    if (!this._styleSheets) {
      this._styleSheets = StyleSheetList.createImpl(this._globalObject);
    }

    // TODO: each style and link element should register its sheet on creation
    // and remove it on removal.
    return this._styleSheets;
  }

  // Getter returns the proxy
  get adoptedStyleSheets() {
    if (!this._adoptedStyleSheetsArr) {
      this._adoptedStyleSheetsArr = [];
    }

    if (!this._adoptedStyleSheetsProxy) {
      this._adoptedStyleSheetsProxy = this._adoptedStyleSheetsProxyFactory(this._adoptedStyleSheetsArr);
    }

    return this._adoptedStyleSheetsProxy;
  }

  // Setter allows replacing the whole array (with validation)
  set adoptedStyleSheets(newArray) {
    const errorPrefix = `Failed to set 'adoptedStyleSheets' on '${this.constructor.name}':`;

    if (!Array.isArray(newArray)) {
      throw new TypeError(`${errorPrefix} The provided value cannot be converted to a sequence.`);
    }

    if (newArray.some(item => !item || item.constructor.name !== "CSSStyleSheet")) {
      throw new TypeError(`${errorPrefix} One or more items in the assigned array are invalid`);
    }

    if (newArray.some(item => item.ownerNode !== null || item.ownerRule !== null)) {
      throw DOMException.create(this._globalObject, [
        `${errorPrefix} One or more items in the assigned array are invalid`,
        "NotAllowedError"
      ]);
    }

    if (!this._adoptedStyleSheetsArr) {
      this._adoptedStyleSheetsArr = [];
    }

    // Replace internal array contents
    this._adoptedStyleSheetsArr.length = 0;
    this._adoptedStyleSheetsArr.push(...newArray);
  }

  // Creates a Proxy that enforces validation rules
  _adoptedStyleSheetsProxyFactory(arrayRef) {
    return new Proxy(arrayRef, {
      set(target, prop, value) {
        // Prevent manual length changes
        if (prop === "length") {
          return value; // Ignore silently
        }

        // Validate if setting an array index
        if (!isNaN(prop)) {
          if (!value || value.constructor.name !== "CSSStyleSheet") {
            throw new TypeError(`Failed to convert value to 'CSSStyleSheet'.`);
          }
          if (value.ownerNode !== null || value.ownerRule !== null) {
            throw DOMException.create(this._globalObject, [
              `Can't adopt non-constructed stylesheets.`,
              "NotAllowedError"
            ]);
          }
        }

        target[prop] = value;
        return true;
      },

      get(target, prop, receiver) {
        const orig = Reflect.get(target, prop, receiver);

        // Wrap mutating methods to validate inputs
        if (typeof orig === "function") {
          return function (...args) {
            // Methods that can insert/replace values
            const validateArgs = {
              push: args,
              unshift: args,
              splice: args.slice(2), // new items start at index 2
              fill: [args[0]], // fill(value, start?, end?)
              copyWithin: [] // no new values inserted
            };

            if (prop in validateArgs) {
              for (const value of validateArgs[prop]) {
                if (!value || value.constructor.name !== "CSSStyleSheet") {
                  throw new TypeError(`Failed to convert value to 'CSSStyleSheet'.`);
                }
                if (value.ownerNode !== null || value.ownerRule !== null) {
                  throw DOMException.create(this._globalObject, [
                    `Can't adopt non-constructed stylesheets.`,
                    "NotAllowedError"
                  ]);
                }
              }
            }

            return orig.apply(target, args);
          };
        }

        return orig;
      }
    });
  }
}

module.exports = {
  implementation: DocumentOrShadowRootImpl
};
