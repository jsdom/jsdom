"use strict";

var EventEmitter = require("events").EventEmitter;
var utils = require("./utils");

function VirtualConsole(options) {
  if (options === undefined) {
    options = {};
  }
  this.omitJsdomErrors = Boolean(options.omitJsdomErrors);

  // If "error" event has no listeners,
  // EventEmitter throws an exception
  this.on("error", function () {});
}

utils.inheritFrom(EventEmitter, VirtualConsole, {
  sendTo: function (anyConsole) {
    Object.keys(anyConsole).forEach(function (method) {
      if (typeof anyConsole[method] === "function") {
        this.on(method, function () {
          anyConsole[method].apply(anyConsole, arguments);
        });
      }
    }, this);

    this.on("jsdomError", function (e) {
      if (!this.omitJsdomErrors) {
        anyConsole.error(e.stack, e.detail);
      }
    });

    return this;
  }
});

module.exports = VirtualConsole;
