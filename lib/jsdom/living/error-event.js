"use strict";
const inheritFrom = require("../utils").inheritFrom;

// https://html.spec.whatwg.org/multipage/webappapis.html#errorevent

// Currently installed via level2/events.js; that is not ideal, but necessary for now.

const message = Symbol("ErrorEvent message");
const filename = Symbol("ErrorEvent filename");
const lineno = Symbol("ErrorEvent lineno");
const colno = Symbol("ErrorEvent colno");
const error = Symbol("ErrorEvent error");

module.exports = function (core) {
  core.ErrorEvent = function ErrorEvent(type, eventInitDict) {
    core.Event.apply(this, arguments);

    this[message] = eventInitDict && "message" in eventInitDict ? String(eventInitDict.message) : "";
    this[filename] = eventInitDict && "filename" in eventInitDict ? String(eventInitDict.filename) : "";
    this[lineno] = eventInitDict && "lineno" in eventInitDict ? Number(eventInitDict.lineno) : 0;
    this[colno] = eventInitDict && "colno" in eventInitDict ? Number(eventInitDict.colno) : 0;
    this[error] = eventInitDict && "error" in eventInitDict ? eventInitDict.error : null;
  };

  inheritFrom(core.Event, core.ErrorEvent, {
    get message() {
      return this[message];
    },
    get filename() {
      return this[filename];
    },
    get lineno() {
      return this[lineno];
    },
    get colno() {
      return this[colno];
    },
    get error() {
      return this[error];
    }
  });
};

module.exports.setErrorEventValues = function (e, values) {
  e[message] = values.message;
  e[filename] = values.filename;
  e[lineno] = values.lineno;
  e[colno] = values.colno;
  e[error] = values.error;
};
