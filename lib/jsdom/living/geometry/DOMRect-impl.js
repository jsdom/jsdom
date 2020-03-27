"use strict";
const DOMRectReadOnlyImpl = require("./DOMRectReadOnly-impl").implementation;

class DOMRectImpl extends DOMRectReadOnlyImpl {
  // https://svgwg.org/svg2-draft/types.html#TermReserialize
  _reserialize({ x, y, width, height }) {
    this._reflectedElement.setAttributeNS(null, this._reflectedAttribute, `${x} ${y} ${width} ${height}`);
  }

  get x() {
    return super.x;
  }

  set x(newX) {
    if (this._reflectedElement) {
      const { y, width, height } = this;
      this._reserialize({
        x: newX,
        y,
        width,
        height
      });
      return;
    }
    this._x = newX;
  }

  get y() {
    return super.y;
  }

  set y(newY) {
    if (this._reflectedElement) {
      const { x, width, height } = this;
      this._reserialize({
        x,
        y: newY,
        width,
        height
      });
      return;
    }
    this._y = newY;
  }

  get width() {
    return super.width;
  }

  set width(newWidth) {
    if (this._reflectedElement) {
      const { x, y, height } = this;
      this._reserialize({
        x,
        y,
        width: newWidth,
        height
      });
      return;
    }
    this._width = newWidth;
  }

  get height() {
    return super.height;
  }

  set height(newHeight) {
    if (this._reflectedElement) {
      const { x, y, width } = this;
      this._reserialize({
        x,
        y,
        width,
        height: newHeight
      });
      return;
    }
    this._height = newHeight;
  }
}

exports.implementation = DOMRectImpl;
