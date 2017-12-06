"use strict";
const { setupForSimpleEventAccessors } = require("../helpers/create-event-accessor");

const READY_STATES = Object.freeze({
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
});

const events = ["open", "error", "close"];

class WebSocketImpl {
  constructor() {
    this.readyState = READY_STATES.EMPTY;
  }
}
setupForSimpleEventAccessors(WebSocketImpl.prototype, events);

exports.implementation = WebSocketImpl;
