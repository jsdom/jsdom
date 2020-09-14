// custom proxy class (invisible proxy)
// to make proxy look like CSSStyleDeclaration object

const DOMException = require("domexception/webidl2js-wrapper");
const D = Object.defineProperty;

class CSSStyleDeclaration {
  constructor(globalObject, inlineStyle, customStyle, defaultStyle) {
    // hidden props
    D(this, '_globalObject', {value: globalObject});
    D(this, '_inlineStyle', {value: inlineStyle});
    D(this, '_customStyle', {value: customStyle});
    D(this, '_defaultStyle', {value: defaultStyle});
    D(this, '_length', {value: 0, writable: true});
  }
}

const P = CSSStyleDeclaration.prototype;

P._get = function(key) {
  if (key == 'constructor') {
    // (only) constructor is not accessible with obj['constructor']
    return this.constructor;
  }
  /* debug
  console.dir({
    this: this[key],
    inline: this._inlineStyle[key],
    custom: this._customStyle[key],
    default: this._defaultStyle[key]
  });
  */
  return (
    this[key] || // get prop-name by index or _hiddenProp
    this._inlineStyle[key] ||
    this._customStyle[key] ||
    this._defaultStyle[key]
  );
};

P._set = function(key, val) {
  // secret write interface
  if (key == '_write') {
    if (val[1]) {
      this[val[0]] = val[1];
      return true;
    }
    if (val[0]) {
      delete this[val[0]];
      return true;
    }
    return false;
  }

  //throw new Error('read only');

  // TODO fix window
  throw DOMException.create(this._globalObject, [
    "Computed style is read-only.",
    "NoModificationAllowedError"
  ]);
};

// TODO why is update called so often?
P._update = function() {
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
    Object.values(this._customStyle),
    Object.values(this._inlineStyle),
  ));
  */

  // TODO fix interface of cssstyle.CSSStyleDeclaration
  // Object.values(decl) should return a list of propNames
  // here we workaround with decl._length

  const propNames = Array.from(new Set(
  Array.from(Array(this._defaultStyle._length))
  .map((_, idx) => this._defaultStyle[idx])
  .concat(
    Array.from(Array(this._customStyle._length))
    .map((_, idx) => this._customStyle[idx])
  )
  .concat(
    Array.from(Array(this._inlineStyle._length))
    .map((_, idx) => this._inlineStyle[idx])
  )));

  // use secret write interface
  propNames.forEach((key, idx) => {
    this['_write'] = [idx, key];
  });
  for (let idx = propNames.length; idx < this._length; idx++) {
    this['_write'] = [idx]; // delete
  }
  // set this._length
  this['_write'] = ['_length', propNames.length];
};

P.getPropertyValue = function(name) {
  return this._customStyle.getPropertyValue(name) ||
    this._defaultStyle.getPropertyValue(name);
};

// computed prio is always empty
P.getPropertyPriority = () => '';

// http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-item
P.item = function(index) {
  index = parseInt(index, 10);
  if (index < 0 || this._length <= index) {
    return '';
  }
  return this[index];
};

P.setProperty =
P.removeProperty =
() => {
  //throw new Error('read only');

  // TODO fix window
  throw DOMException.create(this._globalObject, [
    "Computed style is read-only.",
    "NoModificationAllowedError"
  ]);
};

P.getPropertyCSSValue =
P.getPropertyShorthand =
P.isPropertyImplicit =
() => {throw new Error('not implemented')};

module.exports = CSSStyleDeclaration;
