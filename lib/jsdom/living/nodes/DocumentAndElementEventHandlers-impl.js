"use strict";

const { appendHandler, createEventAccessor, isInheritedAttribute } = require("../helpers/create-event-accessor");

const events = new Set(["cut", "copy", "paste"]);

class DocumentAndElementEventHandlersImpl {
  _initDocumentAndElementEvents() {
    this._eventHandlers = Object.create(null);
  }

  _documentAndElementEventChanged(event) {
    const propName = "on" + event;
    if (!events.has(event)) {
      return;
    }

    const val = this.getAttribute(propName);

    if (isInheritedAttribute(event, this)) {
      if (!this.ownerDocument.defaultView._eventHandlers[event]) {
        appendHandler(this.ownerDocument.defaultView, event);
      }

      this.ownerDocument.defaultView._eventHandlers[event] = {
        body: val
      };
    } else {
      if (!this._eventHandlers[event]) {
        appendHandler(this, event);
      }

      this._eventHandlers[event] = {
        body: val
      };
    }
  }
}

for (const event of events) {
  createEventAccessor(DocumentAndElementEventHandlersImpl.prototype, event);
}

module.exports = {
  implementation: DocumentAndElementEventHandlersImpl
};
