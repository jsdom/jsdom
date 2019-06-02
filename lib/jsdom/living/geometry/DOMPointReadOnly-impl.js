"use strict";

class DOMPointReadOnly {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get z() {
    return this._z;
  }

  get w() {
    return this._w;
  }

  static fromPoint({ x, y, z, w }) {
    return new DOMPointReadOnly(x, y, z, w);
  }

  matrixTransform(matrix) {
    return matrix;
  }
}
