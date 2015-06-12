"use strict";
//const utils = require("../utils");
//const inheritFrom = utils.inheritFrom;

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

  this._target = null;
  this._currentTarget = null;
  this._eventPhase = 0;
  this._timeStamp = null;
  this._stopPropagation = false;
  this._canceled = false;

  Object.defineProperty(this, "data", {
    value: eventInit.data,
    writable: false
  });
}

module.exports = MessageEvent;
