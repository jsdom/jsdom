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
      return this._pageX;
    }
    const offset = wrapperForImpl(this.view)?.scrollX || 0;
    return offset + this.clientX;
  }
  get pageY() {
    if (this._dispatchFlag) {
      return this._pageY;
    }
    const offset = wrapperForImpl(this.view)?.scrollY || 0;
    return offset + this.clientY;
  }
  get offsetX() {
    if (this._dispatchFlag) {
      return this._offsetX;
    }
    return this.pageX;
  }
  get offsetY() {
    if (this._dispatchFlag) {
      return this._offsetY;
    }
    return this.pageY;
  }

  get target() {
    return super.target;
  }

  set target(target) {
    super.target = target;
    // calculate the event position when the target is set so that it's stable during dispatch
    if (target) {
      const { scrollX = 0, scrollY = 0 } = wrapperForImpl(this.view) ?? {};
      this._pageX = this.clientX + scrollX;
      this._pageY = this.clientY + scrollY;
      const domRect = target.getBoundingClientRect?.() ?? { x: 0, y: 0 };
      this._offsetX = this.clientX - domRect.x;
      this._offsetY = this.clientY - domRect.y;
    }
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
