"use strict";

const { appendHandler, createEventAccessor } = require("../helpers/create-event-accessor");

const events = new Set([
  "abort", "autocomplete",
  "autocompleteerror", "blur",
  "cancel", "canplay", "canplaythrough",
  "change", "click",
  "close", "contextmenu",
  "cuechange", "dblclick",
  "drag", "dragend",
  "dragenter", "dragexit",
  "dragleave", "dragover",
  "dragstart", "drop",
  "durationchange", "emptied",
  "ended", "error", "focus",
  "input", "invalid",
  "keydown", "keypress",
  "keyup", "load", "loadeddata",
  "loadedmetadata", "loadstart",
  "mousedown", "mouseenter",
  "mouseleave", "mousemove",
  "mouseout", "mouseover",
  "mouseup", "wheel",
  "pause", "play",
  "playing", "progress",
  "ratechange", "reset",
  "resize", "scroll",
  "seeked", "seeking",
  "select", "show",
  "sort", "stalled",
  "submit", "suspend",
  "timeupdate", "toggle",
  "volumechange", "waiting"
]);

class GlobalEventHandlersImpl {
  _initGlobalEvents() {
    this._eventHandlers = Object.create(null);
  }

  _globalEventChanged(event) {
    const propName = "on" + event;
    if (!events.has(event)) {
      return;
    }

    const val = this.getAttribute(propName);

    if (!this._eventHandlers[event]) {
      appendHandler(this, event);
    }

    this._eventHandlers[event] = {
      body: val
    };
  }
}

for (const event of events) {
  createEventAccessor(GlobalEventHandlersImpl.prototype, event);
}

module.exports = {
  implementation: GlobalEventHandlersImpl
};
