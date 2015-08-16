"use strict";
const EventEmitter = require("events").EventEmitter;

module.exports = class VirtualConsole extends EventEmitter {
  constructor(options) {
    super();

    if (options === undefined) {
      options = {};
    }
    this.omitJsdomErrors = Boolean(options.omitJsdomErrors);

    // If "error" event has no listeners,
    // EventEmitter throws an exception
    this.on("error", function () {});
  }

  sendTo(anyConsole) {
    for (const method of Object.keys(anyConsole)) {
      if (typeof anyConsole[method] === "function") {
        this.on(method, function () {
          anyConsole[method].apply(anyConsole, arguments);
        });
      }
    }

    this.on("jsdomError", function (e) {
      if (!this.omitJsdomErrors) {
        anyConsole.error(e.stack, e.detail);
      }
    });

    return this;
  }
};
