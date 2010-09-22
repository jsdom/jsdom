
var dom = exports.dom = require("./jsdom/level1/core").dom;
exports.defaultLevel = dom.level1.core;
exports.browserAugmentation = require("./jsdom/browser").browserAugmentation;
exports.windowAugmentation = require("./jsdom/browser").windowAugmentation;

var createWindow = exports.createWindow = require("./jsdom/browser").createWindow;

exports.jsdom = function (html, level) {
  level = level || exports.defaultLevel;
  var browser = exports.browserAugmentation(level);
      doc = new (browser.Document)();

  // Author: Swizec
  // some people use IE's expression syntax, 
  //this should remove what isn't relevant to us
  if (html) {
      html = html.replace(/\<\!\-\-\[if .*\![(]*IE[)]*\]\>(.+)\<\!\[endif\]\-\-\>/gi, "$1");
  }

  doc.innerHTML = html || "<html><head></head><body></body></html>";

  doc.createWindow =  function(url) {
      var window = exports.windowAugmentation(level, { document: doc, url: url });
    if (window &&
        window.document &&
        window.document.createWindow)
    {
      delete window.document.createWindow;
    }
    return window;
  }
  return doc;
}

exports.jQueryify = function (window /* path [optional], callback */) {

  if (!window || !window.document) { return; }

  var args = Array.prototype.slice.call(arguments),
      callback = (typeof(args[args.length - 1]) === 'function') && args.pop(),
      path = undefined,
      jQueryTag = window.document.createElement("script");

  if (args.length > 1 && typeof(args[1] === 'string')) {
    path = args[1];
  }

  path = path ? "file://" + path : 'http://code.jquery.com/jquery-1.4.2.js';
  
  jQueryTag.src = path;

  jQueryTag.onload = function() {
    if (this.readyState === 'complete') {
      if (callback) {
        callback(window, window.jQuery);
      }
    }
  };

  return window;
};
