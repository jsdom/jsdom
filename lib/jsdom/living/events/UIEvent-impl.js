"use strict";

const UIEventInit = require("../generated/UIEventInit");
const EventImpl = require("./Event-impl").implementation;

class UIEventImpl extends EventImpl {
  initUIEvent(type, bubbles, cancelable, view, detail) {
    if (this._dispatchFlag) {
      return;
    }

    this.initEvent(type, bubbles, cancelable);
    this.view = view;
    this.detail = detail;
  }
}
UIEventImpl.defaultInit = UIEventInit.convert(undefined);

module.exports = {
  implementation: UIEventImpl
};
