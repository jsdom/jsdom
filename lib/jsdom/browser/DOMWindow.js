"use strict";

var URL = require("url");
var CSSStyleDeclaration = require("cssstyle").CSSStyleDeclaration;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var dom = require("../living/index").dom.living.html;
var NOT_IMPLEMENTED = require("./utils").NOT_IMPLEMENTED;
var createFrom = require("../utils").createFrom;
var Location = require("./location");
var History = require("./history");
var toFileUrl = require("../utils").toFileUrl;

var cssSelectorSplitRE = /((?:[^,"']|"[^"]*"|'[^']*')+)/;

function matchesDontThrow(el, selector) {
  try {
    return el.matchesSelector(selector);
  } catch (e) {
    return false;
  }
}

function startTimer(window, startFn, stopFn, callback, ms) {
  var res = startFn(callback, ms);
  window.__timers.push([res, stopFn]);
  return res;
}

function stopTimer(window, id) {
  if (typeof id === "undefined") {
    return;
  }
  for (var i in window.__timers) {
    if (window.__timers[i][0] === id) {
      window.__timers[i][1].call(window, id);
      window.__timers.splice(i, 1);
      break;
    }
  }
}

function stopAllTimers(window) {
  window.__timers.forEach(function (t) {
    t[1].call(window, t[0]);
  });
  window.__timers = [];
}

function DOMWindow(options) {
  this.__timers = [];

  var window = this;
  var url = (options || {}).url || toFileUrl(__filename);
  this.location = new Location(url, this);
  this.history = new History(this);

  if (options && options.document) {
    options.document.location = this.location;
  }

  this.addEventListener = function () {
    dom.Node.prototype.addEventListener.apply(window, arguments);
  };
  this.removeEventListener = function () {
    dom.Node.prototype.removeEventListener.apply(window, arguments);
  };
  this.dispatchEvent = function () {
    dom.Node.prototype.dispatchEvent.apply(window, arguments);
  };
  this.raise = function () {
    dom.Node.prototype.raise.apply(window.document, arguments);
  };

  this.setTimeout = function (fn, ms) { return startTimer(window, setTimeout, clearTimeout, fn, ms); };
  this.setInterval = function (fn, ms) { return startTimer(window, setInterval, clearInterval, fn, ms); };
  this.clearInterval = stopTimer.bind(this, window);
  this.clearTimeout = stopTimer.bind(this, window);
  this.__stopAllTimers = stopAllTimers.bind(this, window);

  this.console = {
    log: function (message) { window.raise("log", message); },
    info: function (message) { window.raise("info", message); },
    warn: function (message) { window.raise("warn", message); },
    error: function (message) { window.raise("error", message); }
  };

  this.XMLHttpRequest = function () {
    var xhr = new XMLHttpRequest();
    var lastUrl = "";
    xhr._open = xhr.open;
    xhr.open = function (method, url, async, user, password) {
      url = URL.resolve(options.url, url);
      lastUrl = url;
      return xhr._open(method, url, async, user, password);
    };
    xhr._send = xhr.send;
    xhr.send = function (data) {
      if (window.document.cookie) {
        var cookieDomain = window.document._cookieDomain;
        var url = URL.parse(lastUrl);
        var host = url.host.split(":")[0];
        if (host.indexOf(cookieDomain, host.length - cookieDomain.length) !== -1) {
          xhr.setDisableHeaderCheck(true);
          xhr.setRequestHeader("cookie", window.document.cookie);
          xhr.setDisableHeaderCheck(false);
        }
      }
      return xhr._send(data);
    };
    return xhr;
  };
}

DOMWindow.prototype = createFrom(dom || null, {
  constructor: DOMWindow,
  // This implements window.frames.length, since window.frames returns a
  // self reference to the window object.  This value is incremented in the
  // HTMLFrameElement init function (see: level2/html.js).
  _length: 0,
  get length() {
    return this._length;
  },
  close: function () {
    // Recursively close child frame windows, then ourselves.
    var currentWindow = this;
    (function windowCleaner(window) {
      var i;
      // We could call window.frames.length etc, but window.frames just points
      // back to window.
      if (window.length > 0) {
        for (i = 0; i < window.length; i++) {
          windowCleaner(window[i]);
        }
      }
      // We"re already in our own window.close().
      if (window !== currentWindow) {
        window.close();
      }
    })(this);

    if (this.document) {
      if (this.document.body) {
        this.document.body.innerHTML = "";
      }

      if (this.document.close) {
        // We need to empty out the event listener array because
        // document.close() causes "load" event to re-fire.
        this.document._listeners = [];
        this.document.close();
      }
      delete this.document;
    }

    stopAllTimers(currentWindow);
    // Clean up the window"s execution context.
    // dispose() is added by Contextify.
    this.dispose();
  },
  getComputedStyle: function (node) {
    var s = node.style,
        cs = new CSSStyleDeclaration(),
        forEach = Array.prototype.forEach;

    function setPropertiesFromRule(rule) {
      if (!rule.selectorText) {
        return;
      }

      var selectors = rule.selectorText.split(cssSelectorSplitRE);
      var matched = false;
      selectors.forEach(function (selectorText) {
        if (selectorText !== "" && selectorText !== "," && !matched && matchesDontThrow(node, selectorText)) {
          matched = true;
          forEach.call(rule.style, function (property) {
            cs.setProperty(property, rule.style.getPropertyValue(property), rule.style.getPropertyPriority(property));
          });
        }
      });
    }

    forEach.call(node.ownerDocument.styleSheets, function (sheet) {
      forEach.call(sheet.cssRules, function (rule) {
        if (rule.media) {
          if (Array.prototype.indexOf.call(rule.media, "screen") !== -1) {
            forEach.call(rule.cssRules, setPropertiesFromRule);
          }
        } else {
          setPropertiesFromRule(rule);
        }
      });
    });

    forEach.call(s, function (property) {
      cs.setProperty(property, s.getPropertyValue(property), s.getPropertyPriority(property));
    });

    return cs;
  },
  navigator: {
    get userAgent() { return "Node.js (" + process.platform + "; U; rv:" + process.version + ")"; },
    get appName() { return "Node.js jsDom"; },
    get platform() { return process.platform; },
    get appVersion() { return process.version; },
    noUI: true,
    get cookieEnabled() { return true; }
  },

  name: "nodejs",
  innerWidth: 1024,
  innerHeight: 768,
  outerWidth: 1024,
  outerHeight: 768,
  pageXOffset: 0,
  pageYOffset: 0,
  screenX: 0,
  screenY: 0,
  screenLeft: 0,
  screenTop: 0,
  scrollX: 0,
  scrollY: 0,
  scrollTop: 0,
  scrollLeft: 0,
  alert: NOT_IMPLEMENTED(null, "window.alert"),
  blur: NOT_IMPLEMENTED(null, "window.blur"),
  confirm: NOT_IMPLEMENTED(null, "window.confirm"),
  createPopup: NOT_IMPLEMENTED(null, "window.createPopup"),
  focus: NOT_IMPLEMENTED(null, "window.focus"),
  moveBy: NOT_IMPLEMENTED(null, "window.moveBy"),
  moveTo: NOT_IMPLEMENTED(null, "window.moveTo"),
  open: NOT_IMPLEMENTED(null, "window.open"),
  print: NOT_IMPLEMENTED(null, "window.print"),
  prompt: NOT_IMPLEMENTED(null, "window.prompt"),
  resizeBy: NOT_IMPLEMENTED(null, "window.resizeBy"),
  resizeTo: NOT_IMPLEMENTED(null, "window.resizeTo"),
  scroll: NOT_IMPLEMENTED(null, "window.scroll"),
  scrollBy: NOT_IMPLEMENTED(null, "window.scrollBy"),
  scrollTo: NOT_IMPLEMENTED(null, "window.scrollTo"),
  screen: {
    width: 0,
    height: 0
  },
  Image: NOT_IMPLEMENTED(null, "window.Image"),

  // Note: these will not be necessary for newer Node.js versions, which have
  // typed arrays in V8 and thus on every global object. (That is, in newer
  // versions we"ll get `ArrayBuffer` just as automatically as we get
  // `Array`.) But to support older versions, we explicitly set them here.
  Int8Array: global.Int8Array,
  Int16Array: global.Int16Array,
  Int32Array: global.Int32Array,
  Float32Array: global.Float32Array,
  Float64Array: global.Float64Array,
  Uint8Array: global.Uint8Array,
  Uint8ClampedArray: global.Uint8ClampedArray,
  Uint16Array: global.Uint16Array,
  Uint32Array: global.Uint32Array,
  ArrayBuffer: global.ArrayBuffer
});

module.exports = DOMWindow;
