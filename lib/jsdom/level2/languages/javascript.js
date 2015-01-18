"use strict";
var vm = require("vm");

exports.javascript = function (element, code, filename) {
  var document = element.ownerDocument;
  var window = document && document.parentWindow;

  if (window) {
    try {
      vm.runInContext(code, window, { filename: filename });
    } catch (e) {
      element.raise(
        "error", "Running " + filename + " failed.",
        {error: e, filename: filename}
      );
    }
  }
};
