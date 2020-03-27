"use strict";

const DOMRectReadOnly = require("../generated/DOMRectReadOnly");
const DOMRect = require("../generated/DOMRect");

// https://drafts.csswg.org/css-syntax/#number-token-diagram
const numberRe = /^[+-]?(?:\d*\.)?\d+(?:[eE][+-]?\d+)?/;

// https://svgwg.org/svg2-draft/coords.html#ViewBoxAttribute
function parseViewBox(str) {
  // Use a do-while "loop" as JavaScript `goto end`.
  do {
    // When the attribute does not exist.
    if (typeof str !== "string") {
      break;
    }

    let i = 0;
    skipSpace();
    const xStr = matchNumber();
    if (!xStr) {
      break;
    }
    if (!skipDelimiter()) {
      break;
    }
    const yStr = matchNumber();
    if (!yStr) {
      break;
    }
    if (!skipDelimiter()) {
      break;
    }
    const widthStr = matchNumber();
    if (!widthStr) {
      break;
    }
    if (!skipDelimiter()) {
      break;
    }
    const heightStr = matchNumber();
    if (!heightStr) {
      break;
    }
    // Test for trailing junk.
    skipSpace();
    if (i < str.length) {
      break;
    }

    // A negative value for <width> or <height> is an error and invalidates the 'viewBox' attribute.
    const width = Number(widthStr);
    if (width < 0) {
      break;
    }
    const height = Number(heightStr);
    if (height < 0) {
      break;
    }

    return {
      x: Number(xStr),
      y: Number(yStr),
      width,
      height
    };

    function skipSpace() {
      while (i < str.length && str[i] === " ") {
        i += 1;
      }
    }

    function matchNumber() {
      const numMatch = numberRe.exec(str.slice(i));
      if (!numMatch) {
        return undefined;
      }
      i += numMatch[0].length;
      return numMatch[0];
    }

    function skipDelimiter() {
      const start = i;
      skipSpace();
      if (i < str.length && str[i] === ",") {
        i += 1;
      }
      skipSpace();
      return i > start;
    }
  } while (false);

  return { x: 0, y: 0, width: 0, height: 0 };
}

class SVGAnimatedRectImpl {
  constructor(globalObject, args, privateData) {
    this._globalObject = globalObject;
    this._element = privateData.element;
    this._attribute = privateData.attribute;
  }

  get baseVal() {
    return DOMRect.createImpl(this._globalObject, [], {
      reflectedElement: this._element,
      reflectedAttribute: this._attribute,
      parser: parseViewBox
    });
  }

  get animVal() {
    return DOMRectReadOnly.createImpl(this._globalObject, [], {
      reflectedElement: this._element,
      reflectedAttribute: this._attribute,
      parser: parseViewBox
    });
  }
}

exports.implementation = SVGAnimatedRectImpl;
