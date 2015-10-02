"use strict";

const detailSymbol = Symbol("detail");

module.exports = function (core) {
  class CustomEvent extends core.Event {
    constructor(eventType, eventInit) {
      super(eventType, eventInit);
      if (eventInit && eventInit.detail) {
        this[detailSymbol] = eventInit.detail;
      }
    }
    initProgressEvent(type, bubbles, cancelable, detail) {
      this.initEvent(type, bubbles, cancelable);
      this[detailSymbol] = detail;
    }
    get detail() {
      return this[detailSymbol];
    }
  }

  core.CustomEvent = CustomEvent;
};
