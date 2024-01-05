"use strict";

class ElementInternalsImpl {
  constructor(globalObject, args, { targetElement }) {
    this._targetElement = targetElement;
  }

  get shadowRoot() {
    const shadow = this._targetElement._shadowRoot;

    if (!shadow || !shadow._availableToElementInternals) {
      return null;
    }

    return shadow;
  }
}

module.exports = {
  implementation: ElementInternalsImpl
};
