"use strict";
const DOMException = require("domexception/webidl2js-wrapper");

class SVGRectImpl {
  constructor(globalObject, args, privateData) {
    this._globalObject = globalObject;

    this._reflectedElement = privateData.reflectedElement;
    this._reflectedAttribute = privateData.reflectedAttribute;
    this._parser = privateData.parser;
    this._readOnly = privateData.readOnly;
  }

  // https://svgwg.org/svg2-draft/types.html#TermReserialize
  _reserialize({ x, y, width, height }) {
    this._reflectedElement.setAttributeNS(null, this._reflectedAttribute, `${x} ${y} ${width} ${height}`);
  }

  get x() {
    const attr = this._reflectedElement.getAttributeNS(null, this._reflectedAttribute);
    return this._parser(attr).x;
  }

  set x(newX) {
    if (this._readOnly) {
      throw DOMException.create(this._globalObject, ["This SVGRect is read-only", "NO_MODIFICATION_ALLOWED_ERR"]);
    }
    const { y, width, height } = this;
    this._reserialize({
      x: newX,
      y,
      width,
      height
    });
  }

  get y() {
    const attr = this._reflectedElement.getAttributeNS(null, this._reflectedAttribute);
    return this._parser(attr).y;
  }

  set y(newY) {
    if (this._readOnly) {
      throw DOMException.create(this._globalObject, ["This SVGRect is read-only", "NO_MODIFICATION_ALLOWED_ERR"]);
    }
    const { x, width, height } = this;
    this._reserialize({
      x,
      y: newY,
      width,
      height
    });
  }

  get width() {
    const attr = this._reflectedElement.getAttributeNS(null, this._reflectedAttribute);
    return this._parser(attr).width;
  }

  set width(newWidth) {
    if (this._readOnly) {
      throw DOMException.create(this._globalObject, ["This SVGRect is read-only", "NO_MODIFICATION_ALLOWED_ERR"]);
    }
    const { x, y, height } = this;
    this._reserialize({
      x,
      y,
      width: newWidth,
      height
    });
  }

  get height() {
    const attr = this._reflectedElement.getAttributeNS(null, this._reflectedAttribute);
    return this._parser(attr).height;
  }

  set height(newHeight) {
    if (this._readOnly) {
      throw DOMException.create(this._globalObject, ["This SVGRect is read-only", "NO_MODIFICATION_ALLOWED_ERR"]);
    }
    const { x, y, width } = this;
    this._reserialize({
      x,
      y,
      width,
      height: newHeight
    });
  }
}

exports.implementation = SVGRectImpl;
