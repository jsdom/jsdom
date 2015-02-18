"use strict";

// TODO: This error should be removed, it doesn't exist in specs

var inheritFrom = require("../utils").inheritFrom;

module.exports = EventException;

function EventException() {
  if (arguments.length > 0) {
    this._code = arguments[0];
  } else {
    this._code = 0;
  }
  if (arguments.length > 1) {
    this._message = arguments[1];
  } else {
    this._message = "Unspecified event type";
  }
  Error.call(this, this._message);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, EventException);
  }
}

inheritFrom(Error, EventException, {
  UNSPECIFIED_EVENT_TYPE_ERR: 0,
  get code() { return this._code; }
});
