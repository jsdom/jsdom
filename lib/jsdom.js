
var dom = exports.dom = require("./jsdom/level1/core").dom;
exports.defaultLevel = dom.level1.core;
exports.browserAugmentation = require("./jsdom/browser").browserAugmentation;
exports.windowAugmentation = require("./jsdom/browser").windowAugmentation;

exports.jsdom = function (level) {
  level = level || exports.defaultLevel;
  var doc = new (level.Document)();
  doc.createWindow =  function() {
    var window = exports.windowAugmentation(level, { document: doc });
    delete window.document.createWindow;
    return window;
  }
  return doc;
}

exports.createWindow = function (html, level) {
  var window = exports.jsdom(level).createWindow();
  window.document.innerHTML = html;
  return window;
};

exports.jQueryify = function (window /* path [optional], callback */) {
  var args = Array.prototype.slice.call(arguments),
      callback = (typeof(args[args.length - 1]) === 'function') && args.pop(),
      path = undefined,
      head   = window.document.getElementsByTagName('head')[0],
      jQueryTag = window.document.createElement("script");
      
  if (args.length > 1 && typeof(args[1] === 'string')) {
    path = args[1];
  }
  
  path = path ? "file://" + path : 'http://code.jquery.com/jquery-1.4.2.js';
  
  jQueryTag.src = path;
  
  jQueryTag.onload = function() {
    if (this.readyState === 'complete') {
      if (callback) {
        callback();
      }
    }
  };
  
  return window;
};
