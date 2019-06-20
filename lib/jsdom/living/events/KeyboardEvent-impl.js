"use strict";

const { mixin } = require("../../utils");
const EventModifierMixinImpl = require("./EventModifierMixin-impl").implementation;
const UIEventImpl = require("./UIEvent-impl").implementation;

const KeyboardEventInit = require("../generated/KeyboardEventInit");

class KeyboardEventImpl extends UIEventImpl {
  initKeyboardEvent(type, bubbles, cancelable, view, keyCode, location, ctrlKey, altKey, shiftKey, metaKey) {
    if (this._dispatchFlag) {
      return;
    }

    this.initUIEvent(type, bubbles, cancelable, view, 0);
    this.keyCode = keyCode;
    this.location = location;
    this.ctrlKey = ctrlKey;
    this.altKey = altKey;
    this.shiftKey = shiftKey;
    this.metaKey = metaKey;
  }
}
mixin(KeyboardEventImpl.prototype, EventModifierMixinImpl.prototype);
KeyboardEventImpl.defaultInit = KeyboardEventInit.convert(undefined);

module.exports = {
  implementation: KeyboardEventImpl
};
