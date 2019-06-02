"use strict";

class DOMPoint extends DOMPointReadOnly {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    super(x, y, z, w);
  }

  static fromPoint({ x, y, z, w }) {
    return new DOMPoint(x, y, z, w);
  }
}
