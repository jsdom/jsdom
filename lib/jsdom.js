
var dom = exports.dom = require("./jsdom/level3/index").dom;
exports.defaultLevel = dom.level3.html;
exports.browserAugmentation = require("./jsdom/browser/index").browserAugmentation;
exports.windowAugmentation = require("./jsdom/browser/index").windowAugmentation;

var createWindow = exports.createWindow = require("./jsdom/browser/index").createWindow;

exports.jsdom = function (html, level, options) {
  level = level || exports.defaultLevel;
  var browser  = exports.browserAugmentation(level, (options || {})),
      Document = browser.HTMLDocument || browser.Document;
      doc      = new Document();

  if (options && options.url) {
    doc.URL = options.url;
  }

  // Author: Swizec
  // remove IE's expressions and expose what applies to us
  if (html) {
      html = html.replace(/<!--\[if .*\![(]*IE[)]*\]>(.+)<\!\[endif\]-->/gi, "$1");
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

  if (path) {
    path = !path.match(/^(file|http|https):/) ? 'file://' + path : path;
  } else {
    path = 'http://code.jquery.com/jquery-latest.js';
  }

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
