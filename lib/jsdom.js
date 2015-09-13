"use strict";
/*jshint -W030 */
`jsdom 4.x onward only works on io.js or Node.js 4 or newer: https://github.com/tmpvar/jsdom#install`;
/*jshint +W030 */

var fs = require("fs");
var path = require("path");
var xtend = require("xtend/mutable"); // TODO replace with Object.assign when io.js support is dropped.
var URL = require("url");
var CookieJar = require("tough-cookie").CookieJar;

var toFileUrl = require("./jsdom/utils").toFileUrl;
var defineGetter = require("./jsdom/utils").defineGetter;
var defineSetter = require("./jsdom/utils").defineSetter;
var features = require("./jsdom/browser/documentfeatures");
var domToHtml = require("./jsdom/browser/domtohtml").domToHtml;
var Window = require("./jsdom/browser/Window");
var resourceLoader = require("./jsdom/browser/resource-loader");
var VirtualConsole = require("./jsdom/virtual-console");
const locationInfo = require("./jsdom/living/helpers/internal-constants").locationInfo;

require("./jsdom/living"); //Enable living standard features

var canReadFilesFromFS = !!fs.readFile; // in a browserify environment, this isn't present

exports.createVirtualConsole = function (options) {
  return new VirtualConsole(options);
};

exports.getVirtualConsole = function (window) {
  return window._virtualConsole;
};

exports.createCookieJar = function () {
  return new CookieJar();
};

exports.nodeLocation = function (node) {
  return node[locationInfo];
};

exports.reconfigureWindow = function (window, newProps) {
  if ("top" in newProps) {
    window._top = newProps.top;
  }
};

exports.debugMode = false;

// Proxy feature functions to features module.
["availableDocumentFeatures",
 "defaultDocumentFeatures",
 "applyDocumentFeatures"].forEach(function (propName) {
  defineGetter(exports, propName, function () {
    return features[propName];
  });
  defineSetter(exports, propName, function (val) {
    return (features[propName] = val);
  });
});

exports.jsdom = function (html, options) {
  if (options === undefined) {
    options = {};
  }
  if (options.parsingMode === undefined || options.parsingMode === "auto") {
    options.parsingMode = "html";
  }

  if (options.parsingMode !== "html" && options.parsingMode !== "xml") {
    throw new RangeError(`Invalid parsingMode option ${JSON.stringify(options.parsingMode)}; must be either "html", ` +
      `"xml", "auto", or undefined`);
  }

  // List options explicitly to be clear which are passed through
  var window = new Window({
    parsingMode: options.parsingMode,
    contentType: options.contentType,
    parser: options.parser,
    url: options.url,
    referrer: options.referrer,
    cookieJar: options.cookieJar,
    cookie: options.cookie,
    resourceLoader: options.resourceLoader,
    deferClose: options.deferClose,
    concurrentNodeIterators: options.concurrentNodeIterators,
    virtualConsole: options.virtualConsole
  });

  if (options.created) {
    options.created(null, window);
  }

  features.applyDocumentFeatures(window.document, options.features);

  if (options.parsingMode === "html") {
    if (html === undefined || html === "") {
      html = "<html><head></head><body></body></html>";
    }

    window.document.write(html);
  }
  if (options.parsingMode === "xml") {
    if (html !== undefined) {
      window.document._htmlToDom.appendHtmlToDocument(html, window.document);
    }
  }

  if (window.document.close && !options.deferClose) {
    window.document.close();
  }

  return window.document;
};

exports.jQueryify = exports.jsdom.jQueryify = function (window, jqueryUrl, callback) {
  if (!window || !window.document) {
    return;
  }

  var features = window.document.implementation._features;
  window.document.implementation._addFeature("FetchExternalResources", ["script"]);
  window.document.implementation._addFeature("ProcessExternalResources", ["script"]);
  window.document.implementation._addFeature("MutationEvents", ["2.0"]);

  var scriptEl = window.document.createElement("script");
  scriptEl.className = "jsdom";
  scriptEl.src = jqueryUrl;
  scriptEl.onload = scriptEl.onerror = function () {
    window.document.implementation._features = features;

    if (callback) {
      callback(window, window.jQuery);
    }
  };

  window.document.body.appendChild(scriptEl);
};

exports.env = exports.jsdom.env = function () {
  var config = getConfigFromArguments(arguments);

  if (config.file && canReadFilesFromFS) {
    fs.readFile(config.file, "utf-8", function (err, text) {
      if (err) {
        reportInitError(err, config);
        return;
      }

      setParsingModeFromExtension(config, config.file);

      config.html = text;
      processHTML(config);
    });
  } else if (config.html !== undefined) {
    processHTML(config);
  } else if (config.url) {
    handleUrl(config);
  } else if (config.somethingToAutodetect !== undefined) {
    var url = URL.parse(config.somethingToAutodetect);
    if (url.protocol && url.hostname) {
      config.url = config.somethingToAutodetect;
      handleUrl(config.somethingToAutodetect);
    } else if (canReadFilesFromFS) {
      fs.readFile(config.somethingToAutodetect, "utf-8", function (err, text) {
        if (err) {
          if (err.code === "ENOENT" || err.code === "ENAMETOOLONG") {
            config.html = config.somethingToAutodetect;
            processHTML(config);
          } else {
            reportInitError(err, config);
          }
        } else {
          setParsingModeFromExtension(config, config.somethingToAutodetect);

          config.html = text;
          config.url = toFileUrl(config.somethingToAutodetect);
          processHTML(config);
        }
      });
    } else {
      config.html = config.somethingToAutodetect;
      processHTML(config);
    }
  }

  function handleUrl() {
    var options = {
      encoding: config.encoding || "utf8",
      headers: config.headers || {},
      proxy: config.proxy || null
    };

    config.cookieJar = config.cookieJar || new CookieJar();

    resourceLoader.download(config.url, options, config.cookieJar, null, function (err, responseText, res) {
      if (err) {
        reportInitError(err, config);
        return;
      }

      // The use of `res.request.uri.href` ensures that `window.location.href`
      // is updated when `request` follows redirects.
      config.html = responseText;
      config.url = res.request.uri.href;

      var contentType = res.headers["content-type"];

      if (config.parsingMode === "auto" && (
        contentType === "application/xml" ||
        contentType === "text/xml" ||
        contentType === "application/xhtml+xml")) {
        config.parsingMode = "xml";
      }

      processHTML(config);
    });
  }
};

exports.serializeDocument = function (doc) {
  return domToHtml([doc]);
};

function processHTML(config) {
  var options = {
    cookieJar: config.cookieJar,
    features: config.features,
    url: config.url,
    parser: config.parser,
    parsingMode: config.parsingMode,
    created: config.created,
    resourceLoader: config.resourceLoader,
    concurrentNodeIterators: config.concurrentNodeIterators,
    virtualConsole: config.virtualConsole
  };

  if (config.document) {
    options.referrer = config.document.referrer;
    options.cookie = config.document.cookie;
  }

  var window = exports.jsdom(config.html, options).defaultView;
  var features = JSON.parse(JSON.stringify(window.document.implementation._features));

  var docsLoaded = 0;
  var totalDocs = config.scripts.length + config.src.length;

  if (!window || !window.document) {
    reportInitError(new Error("JSDOM: a window object could not be created."), config);
    return;
  }

  function scriptComplete() {
    docsLoaded++;

    if (docsLoaded >= totalDocs) {
      window.document.implementation._features = features;

      process.nextTick(function () {
        if (config.onload) {
          config.onload(window);
        }
        if (config.done) {
          config.done(null, window);
        }
      });
    }
  }

  function handleScriptError() {
    // nextTick so that an exception within scriptComplete won't cause
    // another script onerror (which would be an infinite loop)
    process.nextTick(scriptComplete);
  }

  if (config.scripts.length > 0 || config.src.length > 0) {
    window.document.implementation._addFeature("FetchExternalResources", ["script"]);
    window.document.implementation._addFeature("ProcessExternalResources", ["script"]);
    window.document.implementation._addFeature("MutationEvents", ["2.0"]);

    config.scripts.forEach(function (scriptSrc) {
      var script = window.document.createElement("script");
      script.className = "jsdom";
      script.onload = scriptComplete;
      script.onerror = handleScriptError;
      script.src = scriptSrc;

      window.document.body.appendChild(script);
    });

    config.src.forEach(function (scriptText) {
      var script = window.document.createElement("script");
      script.onload = scriptComplete;
      script.onerror = handleScriptError;
      script.text = scriptText;

      window.document.documentElement.appendChild(script);
      window.document.documentElement.removeChild(script);
    });
  } else {
    if (window.document.readyState === "complete") {
      scriptComplete();
    } else {
      window.addEventListener("load", function () {
        scriptComplete();
      });
    }
  }
}

function getConfigFromArguments(args) {
  var config = {};
  if (typeof args[0] === "object") {
    var configToClone = args[0];
    Object.keys(configToClone).forEach(function (key) {
      config[key] = configToClone[key];
    });
  } else {
    Array.prototype.forEach.call(args, function (arg) {
      switch (typeof arg) {
        case "string":
          config.somethingToAutodetect = arg;
          break;
        case "function":
          config.done = arg;
          break;
        case "object":
          if (Array.isArray(arg)) {
            config.scripts = arg;
          } else {
            xtend(config, arg);
          }
          break;
      }
    });
  }

  if (!config.done && !config.created && !config.onload) {
    throw new Error("Must pass a \"created\", \"onload\", or \"done\" option, or a callback, to jsdom.env");
  }

  if (config.somethingToAutodetect === undefined &&
      config.html === undefined && !config.file && !config.url) {
    throw new Error("Must pass a \"html\", \"file\", or \"url\" option, or a string, to jsdom.env");
  }

  config.scripts = ensureArray(config.scripts);
  config.src = ensureArray(config.src);
  config.parsingMode = config.parsingMode || "auto";

  config.features = config.features || {
    FetchExternalResources: false,
    ProcessExternalResources: false,
    SkipExternalResources: false
  };

  if (!config.url && config.file) {
    config.url = toFileUrl(config.file);
  }

  return config;
}

function reportInitError(err, config) {
  if (config.created) {
    config.created(err);
  }
  if (config.done) {
    config.done(err);
  }
}

function ensureArray(value) {
  var array = value || [];
  if (typeof array === "string") {
    array = [array];
  }
  return array;
}

function setParsingModeFromExtension(config, filename) {
  if (config.parsingMode === "auto") {
    var ext = path.extname(filename);
    if (ext === ".xhtml" || ext === ".xml") {
      config.parsingMode = "xml";
    }
  }
}
