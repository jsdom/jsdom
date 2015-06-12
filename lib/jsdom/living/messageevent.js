"use strict";

function MessageEvent(eventType, eventInit) {
  // TODO: Find out if this could be inherited from Event
  this._type = eventType || null;

  if (eventInit === undefined || eventInit === null) {
    eventInit = {};
  }
  if (typeof eventInit !== "object") {
    throw new TypeError("cannot convert eventInit argument to a dictionary");
  }
  this._bubbles = Boolean(eventInit.bubbles);
  this._cancelable = Boolean(eventInit.cancelable);
  this._type = eventType;

  Object.defineProperty(this, "type", {
    value: eventType,
    writable: false
  });

  Object.defineProperty(this, "data", {
    value: eventInit.data,
    writable: false
  });

  // TODO: origin, source, and ports

  /*
  Object.defineProperty(this, "origin", {
    value: eventInit.data,
    writable: false
  });

  Object.defineProperty(this, "source", {
    value: eventInit.data,
    writable: false
  });
  */
}

module.exports = MessageEvent;
