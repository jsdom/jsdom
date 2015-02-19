"use strict";

exports.NOT_IMPLEMENTED = function (target, nameForErrorMessage) {
  return function () {
    var raise;

    var message = "Called NOT_IMPLEMENTED without an element to raise on" +
      (nameForErrorMessage ? ": " + nameForErrorMessage : "");

    target = target || this;
    if (target) {
      raise = target.raise;
    } else {
      if (typeof console !== "undefined" && console.log) {
        console.log(new Error(message));
      }

      return;
    }

    raise.call(target, "error", message);
  };
};
