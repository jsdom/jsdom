// custom proxy class (invisible proxy)
// to make proxy look like CSSStyleDeclaration object

"use strict";
const DOMException = require("domexception/webidl2js-wrapper");
const odp = Object.defineProperty;

class CSSStyleDeclaration {
  constructor(globalObject, inlineStyle, sheetStyle, defaultStyle) {
    // hidden props
    odp(this, "_globalObject", { value: globalObject });
    odp(this, "_inlineStyle", { value: inlineStyle, writable: true });
    odp(this, "_sheetStyle", { value: sheetStyle, writable: true });
    odp(this, "_defaultStyle", { value: defaultStyle });
    odp(this, "_length", { value: 0, writable: true });
  }
}

const proto = CSSStyleDeclaration.prototype;

proto._get = function (key) {
  if (key === "constructor") {
    // (only) constructor is not accessible with obj['constructor']
    return this.constructor;
  }
  /* debug
  console.dir({
    this: this[key],
    inline: this._inlineStyle[key],
    custom: this._sheetStyle[key],
    default: this._defaultStyle[key]
  });
  */
  return (
    this[key] || // get prop-name by index or _hiddenProp
    this._inlineStyle[key] ||
    this._sheetStyle[key] ||
    this._defaultStyle[key]
  );
};

proto._set = function (key, val) {
  // secret write interface
  // in user-space computedStyle is read-only
  if (key === "_write") {
    const [mode, _key, _val] = val;
    if (mode === "set") {
      this[_key] = _val;
      return true;
    }
    if (mode === "delete") {
      delete this[_key];
      return true;
    }
    return false;
  }

  throw DOMException.create(this._globalObject, [
    "Computed style is read-only.",
    "NoModificationAllowedError"
  ]);
};

// TODO why is update called so often?
proto._update = function () {
  // rebuild property list
  // get unique list of keys
  // Object.values gives prop names in kebab-case
  // TODO optimize.
  // custom and inline style
  // should always be a subset of default style
  // so computed style is of constant length
  // and we can avoid calling _update()
  /*
  const propNames = Array.from(new Set(
    Object.values(this._defaultStyle),
    Object.values(this._sheetStyle),
    Object.values(this._inlineStyle),
  ));
  */

  // TODO fix interface of cssstyle.CSSStyleDeclaration
  // Object.values(decl) should return a list of propNames
  // here we workaround with decl._length

  const propNames = Array.from(new Set(Array.from(Array(this._defaultStyle._length))
    .map((_, idx) => this._defaultStyle[idx])
    .concat(Array.from(Array(this._sheetStyle._length))
      .map((_, idx) => this._sheetStyle[idx]))
    .concat(Array.from(Array(this._inlineStyle._length))
      .map((_, idx) => this._inlineStyle[idx]))));

  // use secret write interface
  propNames.forEach((key, idx) => {
    this._write = ["set", idx, key];
  });
  for (let idx = propNames.length; idx < this._length; idx++) {
    this._write = ["delete", idx];
  }
  // set this._length
  this._write = ["set", "_length", propNames.length || 0];
};

proto.getPropertyValue = function (name) {
  return this._sheetStyle.getPropertyValue(name) ||
    this._defaultStyle.getPropertyValue(name);
};

// computed prio is always empty
proto.getPropertyPriority = () => "";

// http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-item
proto.item = function (index) {
  index = parseInt(index);
  if (index < 0 || this._length <= index) {
    return "";
  }
  return this[index];
};

proto.setProperty =
proto.removeProperty =
function () {
  throw DOMException.create(this._globalObject, [
    "Computed style is read-only.",
    "NoModificationAllowedError"
  ]);
};

proto.getPropertyCSSValue =
proto.getPropertyShorthand =
proto.isPropertyImplicit =
() => {
  throw new Error("not implemented");
};

module.exports = CSSStyleDeclaration;
