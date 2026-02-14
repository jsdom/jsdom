"use strict";

const { createEventAccessor } = require("../helpers/create-event-accessor");
const { windowEventHandlersEvents } = require("../../../generated/event-sets");

// These events are specified on WindowEventHandlers but, per the HTML spec, are reflected on the Window from the body
// element. They are not derivable from the IDL alone.
const windowReflectingBodyElementEvents = new Set([
  "blur",
  "error",
  "focus",
  "load",
  "resize",
  "scroll"
]);

const events = new Set([...windowEventHandlersEvents, ...windowReflectingBodyElementEvents]);

// This class builds on GlobalEventHandlers, which must be mixed in first.
class WindowEventHandlersImpl {
  _proxyWindowEventsToWindow() {
    // We're a <body> or <frameset>, so we need to proxy these specific events to the Window (if it exists)
    this._getEventHandlerTarget = event => {
      if (events.has(event)) {
        return this.ownerDocument.defaultView || null;
      }
      return this;
    };
  }
}

for (const event of events) {
  createEventAccessor(WindowEventHandlersImpl.prototype, event);
}

module.exports = {
  implementation: WindowEventHandlersImpl
};
