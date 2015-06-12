"use strict";

const inheritFrom = require("../utils").inheritFrom;

module.exports = function (core) {

  function MessageEvent(eventType, eventInit) {
    eventInit = eventInit || {};
    core.Event.apply(this, arguments);
    this._data = eventInit.data;

    // TODO: event.source - requires reference to source window
    // TODO: event.origin - requires reference to source window
    // TODO: event.ports
  }

  inheritFrom(core.Event, MessageEvent, {
    get data() { return this._data; }
  });

  return MessageEvent;
};
