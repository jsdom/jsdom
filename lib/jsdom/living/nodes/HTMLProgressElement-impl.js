"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { getLabelsForLabelable } = require("../helpers/form-controls");
const { parseFloatingPointNumber } = require("../helpers/strings");

class HTMLProgressElementImpl extends HTMLElementImpl {
  constructor(args, privateData) {
    super(args, privateData);
    this._labels = null;
  }

  get value() {
    const parsedValue = parseFloatingPointNumber(this.getAttribute("value"));

    if (!isNaN(parsedValue) && parsedValue > 0) {
      return parsedValue > this.max ? this.max : parsedValue;
    }

    return 0;
  }
  set value(value) {
    this.setAttribute("value", value);
  }

  get max() {
    const parsedMax = parseFloatingPointNumber(this.getAttribute("max"));

    if (!isNaN(parsedMax) && parsedMax > 0) {
      return parsedMax;
    }

    return 1.0;
  }
  set max(value) {
    this.setAttribute("max", value);
  }

  get position() {
    if (!this.hasAttribute("value")) {
      return -1;
    }

    return this.value / this.max;
  }

  get labels() {
    return getLabelsForLabelable(this);
  }
}

module.exports = {
  implementation: HTMLProgressElementImpl
};
