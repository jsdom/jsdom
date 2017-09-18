"use strict";

const UIEventImpl = require("./UIEvent-impl").implementation;

class CompositionEventImpl extends UIEventImpl {
  initCompositionEvent(type, bubbles, cancelable, view, data) {
    if (this._dispatchFlag) {
      return;
    }

    this.initUIEvent(type, bubbles, cancelable, view, 0);
    this.data = data;
  }
}

module.exports = {
  implementation: CompositionEventImpl
};
