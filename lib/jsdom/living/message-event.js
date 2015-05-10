"use strict";
const inheritFrom = require("../utils").inheritFrom;

// https://html.spec.whatwg.org/multipage/comms.html#the-messageevent-interfaces

// Currently installed via level2/events.js; that is not ideal, but necessary for now.

module.exports = function (core) {
  core.MessageEvent = function MessageEvent(eventType, eventInit) {
    core.Event.apply(this, arguments);

    // core.Event constructor takes care of type-checking so we can be loose here.
    this._data = eventInit ? eventInit.data : undefined;

    // TODO: event.source - requires reference to source window
    // TODO: event.origin - requires reference to source window
    // TODO: event.ports
  };

  inheritFrom(core.Event, core.MessageEvent, {
    get data() {
      return this._data;
    }
  });
};
