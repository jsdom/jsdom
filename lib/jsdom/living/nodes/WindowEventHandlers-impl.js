"use strict";

const { createEventAccessor } = require("../helpers/create-event-accessor");

const events = new Set([
  // WindowEventHandlers
  "afterprint",
  "beforeprint",
  "beforeunload",
  "hashchange",
  "languagechange",
  "message",
  "offline",
  "online",
  "pagehide",
  "pageshow",
  "popstate",
  "rejectionhandled",
  "storage",
  "unhandledrejection",
  "unload",

  // inherited and overridden
  "blur",
  "error",
  "focus",
  "load",
  "resize",
  "scroll"
]);

// This class builds on GlobalEventHandlers, which must be mixed in first.
class WindowEventHandlersImpl {
  _initWindowEvents() {
    // Overriding this on all body/frameset instances; this is simpler than trying to make this mixin override
    // GlobalEventHandlers while declaring a _getEventHandlerTarget method on the prototype.
    if (this.constructor.name !== "Window") {
      this._getEventHandlerTarget = event => {
        if (!events.has(event)) {
          return this;
        }

        // We're a body or frameset, so we need to proxy to the window, if it exists
        return this.ownerDocument.defaultView || null;
      };
    }
  }

  // TODO: dedupe with GlobalEventHandlers?
  _windowEventChanged(event) {
    const propName = "on" + event;
    if (!events.has(event)) {
      return;
    }

    const val = this.getAttribute(propName);
    const handler = val === null ? null : { body: val };
    this._setEventHandlerFor(event, handler);
  }
}

for (const event of events) {
  createEventAccessor(WindowEventHandlersImpl.prototype, event);
}

module.exports = {
  implementation: WindowEventHandlersImpl
};
