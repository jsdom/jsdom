
var dom = exports.dom = require("./jsdom/level3/index").dom;
exports.defaultLevel = dom.level3.html;
exports.browserAugmentation = require("./jsdom/browser/index").browserAugmentation;
exports.windowAugmentation = require("./jsdom/browser/index").windowAugmentation;

var createWindow = exports.createWindow = require("./jsdom/browser/index").createWindow;

exports.jsdom = function (html, level, options) {
  options = options || {};
  level = level || exports.defaultLevel;
  var browser = exports.browserAugmentation(level, options),
      Document = browser.HTMLDocument || browser.Document;
      doc = new Document();

  doc.URL = options.url || module.parent.filename;
  
  if (level.resourceLoader) {
    level.resourceLoader.documentRoot = options.documentRoot || require('path').dirname(doc.URL);
  }

  if (options.onload) {
    doc.addEventListener('load', function(ev) {
      options.onload(ev);
    });
  }
  
  doc.innerHTML = html || "<html><head></head><body></body></html>";

  var ev = doc.createEvent('HTMLEvents');
  ev.initEvent('DOMContentLoaded', false, false);
  doc.dispatchEvent(ev);
  
  var loadEvent;
  level.resourceLoader.enqueue(doc, function() {
    loadEvent = doc.createEvent('HTMLEvents');
    loadEvent.initEvent('load', false, false);
    doc.dispatchEvent(loadEvent);
  })(null, true);
  
  doc.createWindow = function(url) {
    var window = exports.windowAugmentation(level, { document: doc, url: url });
    if (window &&
        window.document &&
        window.document.createWindow)
    {
      delete window.document.createWindow;
    }
    
    if (loadEvent) {
      window.dispatchEvent(loadEvent);
    }
    doc.addEventListener('load', function(ev) {
      window.dispatchEvent(ev);
    });
    
    return window;
  };
  return doc;
};

exports.jQueryify = function (window /* path [optional], callback */) {

  if (!window || !window.document) { return; }

  var args = Array.prototype.slice.call(arguments),
      callback = (typeof(args[args.length - 1]) === 'function') && args.pop(),
      path,
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
