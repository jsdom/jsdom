"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { appendHandler } = require("../helpers/create-event-accessor");

const idlUtils = require("../generated/utils");
const GlobalEventHandlersImpl = require("./GlobalEventHandlers-impl").implementation;
const WindowEventHandlersImpl = require("./WindowEventHandlers-impl").implementation;

const inheritedEvents = new Set(["blur", "error", "focus", "load", "resize", "scroll"]);

class HTMLBodyElementImpl extends HTMLElementImpl {
  _attrModified(name) {
    super._attrModified.apply(this, arguments);

    if (name.startsWith("on")) {
      this._windowEventChanged(name.substring(2));
    }
  }

  _globalEventChanged(event) {
    const propName = "on" + event;
    if (!inheritedEvents.has(event)) {
      GlobalEventHandlersImpl.prototype._globalEventChanged.call(this, event);
      return;
    }

    const val = this.getAttribute(propName);

    if (!this.ownerDocument.defaultView._eventHandlers[event]) {
      appendHandler(this.ownerDocument.defaultView, event);
    }

    this.ownerDocument.defaultView._eventHandlers[event] = {
      body: val
    };
  }
}

idlUtils.mixin(HTMLBodyElementImpl.prototype, WindowEventHandlersImpl.prototype);

for (const event of inheritedEvents) {
  Object.defineProperty(HTMLBodyElementImpl.prototype, "on" + event, {
    get() {
      return this.ownerDocument.defaultView._eventHandlers[event];
    },
    set(value) {
      if (!this.ownerDocument.defaultView._eventHandlers[event]) {
        appendHandler(this.ownerDocument.defaultView, event);
      }
      this.ownerDocument.defaultView._eventHandlers[event] = value;
    }
  });
}

module.exports = {
  implementation: HTMLBodyElementImpl
};
