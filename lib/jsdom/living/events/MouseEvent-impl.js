"use strict";

const { mixin } = require("../../utils");
const EventModifierMixinImpl = require("./EventModifierMixin-impl").implementation;
const UIEventImpl = require("./UIEvent-impl").implementation;

const MouseEventInit = require("../generated/MouseEventInit");
const { wrapperForImpl } = require("../generated/utils");

class MouseEventImpl extends UIEventImpl {
  get x() {
    return this.clientX;
  }
  get y() {
    return this.clientY;
  }
  get pageX() {
    if (this._dispatchFlag) {
      return this._initialContainingBlockRelativeX;
    }
    const offset = wrapperForImpl(this.view)?.scrollX || 0;
    return offset + this.clientX;
  }
  get pageY() {
    if (this._dispatchFlag) {
      return this._initialContainingBlockRelativeY;
    }
    const offset = wrapperForImpl(this.view)?.scrollY || 0;
    return offset + this.clientY;
  }
  get offsetX() {
    if (this._dispatchFlag) {
      return this._paddingEdgeRelativeX;
    }
    return this.pageX;
  }
  get offsetY() {
    if (this._dispatchFlag) {
      return this._paddingEdgeRelativeY;
    }
    return this.pageY;
  }

  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    // We cache this during init so that we have a stable value during dispatch
    const { scrollX = 0, scrollY = 0 } = wrapperForImpl(this.view) ?? {};
    this._initialContainingBlockRelativeX = this.clientX + scrollX;
    this._initialContainingBlockRelativeY = this.clientY + scrollY;
    // TODO: support non-zero values somehow if/when jsdom adds layout support
    this._paddingEdgeRelativeX = 0;
    this._paddingEdgeRelativeY = 0;
  }

  initMouseEvent(
    type,
    bubbles,
    cancelable,
    view,
    detail,
    screenX,
    screenY,
    clientX,
    clientY,
    ctrlKey,
    altKey,
    shiftKey,
    metaKey,
    button,
    relatedTarget
  ) {
    if (this._dispatchFlag) {
      return;
    }

    this.initUIEvent(type, bubbles, cancelable, view, detail);
    this.screenX = screenX;
    this.screenY = screenY;
    this.clientX = clientX;
    this.clientY = clientY;
    this.ctrlKey = ctrlKey;
    this.altKey = altKey;
    this.shiftKey = shiftKey;
    this.metaKey = metaKey;
    this.button = button;
    this.relatedTarget = relatedTarget;
  }
}
mixin(MouseEventImpl.prototype, EventModifierMixinImpl.prototype);
MouseEventImpl.defaultInit = MouseEventInit.convert(undefined, undefined);

module.exports = {
  implementation: MouseEventImpl
};
