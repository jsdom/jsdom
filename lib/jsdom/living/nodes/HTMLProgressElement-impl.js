"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { getLabelsForLabelable } = require("../helpers/form-controls");

class HTMLProgressElementImpl extends HTMLElementImpl {
  get labels() {
    return getLabelsForLabelable(this);
  }
}

module.exports = {
  implementation: HTMLProgressElementImpl
};
