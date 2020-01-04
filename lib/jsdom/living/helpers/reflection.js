"use strict";
const DOMException = require("domexception/webidl2js-wrapper");
const conversions = require("webidl-conversions");
const { parseNonNegativeInteger } = require("./strings");
const { mixin } = require("../../utils");

// https://html.spec.whatwg.org/#limited-to-only-non-negative-numbers
function reflectLimitedToNonNegative(prototype, idlAttr, contentAttr, defaultValue = -1) {
  mixin(prototype, {
    get [idlAttr]() {
      const attr = this.getAttributeNS(null, contentAttr);
      if (attr !== null) {
        const parsed = parseNonNegativeInteger(this.getAttributeNS(null, contentAttr));
        if (parsed !== null && conversions.long(parsed) === parsed) {
          return parsed;
        }
      }
      return defaultValue;
    },
    set [idlAttr](value) {
      if (value < 0) {
        throw DOMException.create(this._globalObject, ["The value is not in the allowed range.", "IndexSizeError"]);
      }
      this.setAttributeNS(null, contentAttr, String(value));
    }
  });
}
exports.reflectLimitedToNonNegative = reflectLimitedToNonNegative;
