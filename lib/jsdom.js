
var dom = exports.dom = require("./jsdom/level1/core").dom;
exports.defaultLevel = dom.level1.core;
exports.browserAugmentation = require("./jsdom/browser").browserAugmentation;
exports.windowAugmentation = require("./jsdom/browser").windowAugmentation;

exports.jsdom = function(level) {
  level = level || exports.defaultLevel;
  var doc = new (level.Document)();
  doc.makeWindow =  function() {
    var window = exports.windowAugmentation(level, {document: doc});
    window.window = window;
    delete window.document.makeWindow;
    return window;
  }
  return doc;
}
