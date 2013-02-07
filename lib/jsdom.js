var dom      = exports.dom = require("./jsdom/level3/index").dom,
    features = require('./jsdom/browser/documentfeatures'),
    fs       = require("fs"),
    pkg      = JSON.parse(fs.readFileSync(__dirname + "/../package.json")),
    request  = require('request'),
    URL      = require('url'),
    assert   = require('assert');

var style = require('./jsdom/level2/style');
exports.defaultLevel = dom.level3.html;
exports.browserAugmentation = require("./jsdom/browser/index").browserAugmentation;
exports.windowAugmentation = require("./jsdom/browser/index").windowAugmentation;

// Proxy feature functions to features module.
['availableDocumentFeatures',
 'defaultDocumentFeatures',
 'applyDocumentFeatures'].forEach(function (propName) {
  exports.__defineGetter__(propName, function () {
    return features[propName];
  });
  exports.__defineSetter__(propName, function (val) {
    return features[propName] = val;
  });
});

exports.debugMode = false;

var createWindow = exports.createWindow = require("./jsdom/browser/index").createWindow;

exports.__defineGetter__('version', function() {
  return pkg.version;
});

exports.level = function (level, feature) {
	if(!feature) {
    feature = 'core';
  }

	return require('./jsdom/level' + level + '/' + feature).dom['level' + level][feature];
};

exports.jsdom = function (html, level, options) {

  options = options || {};
  if(typeof level === "string") {
    level = exports.level(level, 'html');
  } else {
    level   = level || exports.defaultLevel;
  }

  if (!options.url) {
    options.url = (module.parent.id === 'jsdom') ?
                  module.parent.parent.filename  :
                  module.parent.filename;
    options.url = options.url.replace(/\\/g, '/');
    if (options.url[0] !== '/') {
      options.url = '/' + options.url;
    }
    options.url = 'file://' + options.url;
  }

  var browser = exports.browserAugmentation(level, options),
      doc     = (browser.HTMLDocument)             ?
                 new browser.HTMLDocument(options) :
                 new browser.Document(options);

  require("./jsdom/selectors/index").applyQuerySelector(doc, level);

  features.applyDocumentFeatures(doc, options.features);

  if (typeof html === 'undefined' || html === null) {
    doc.write('<html><head></head><body></body></html>');
  } else {
    doc.write(html + '');
  }

  if (doc.close && !options.deferClose) {
    doc.close();
  }

  // Kept for backwards-compatibility. The window is lazily created when
  // document.parentWindow or document.defaultView is accessed.
  doc.createWindow = function() {
    // Remove ourself
    if (doc.createWindow) {
      delete doc.createWindow;
    }
    return doc.parentWindow;
  };

  return doc;
};

exports.html = function(html, level, options) {
  html += '';

  // TODO: cache a regex and use it here instead
  //       or make the parser handle it
  var htmlLowered = html.toLowerCase();

  // body
  if (!~htmlLowered.indexOf('<body')) {
    html = '<body>' + html + '</body>';
  }

  // html
  if (!~htmlLowered.indexOf('<html')) {
    html = '<html>' + html + '</html>';
  }
  return exports.jsdom(html, level, options);
};

exports.jQueryify = exports.jsdom.jQueryify = function (window /* path [optional], callback */) {

  if (!window || !window.document) { return; }

  var args = Array.prototype.slice.call(arguments),
      callback = (typeof(args[args.length - 1]) === 'function') && args.pop(),
      path,
      jQueryTag = window.document.createElement("script");
      jQueryTag.className = "jsdom";

  if (args.length > 1 && typeof(args[1] === 'string')) {
    path = args[1];
  }

  var features = window.document.implementation._features;

  window.document.implementation.addFeature('FetchExternalResources', ['script']);
  window.document.implementation.addFeature('ProcessExternalResources', ['script']);
  window.document.implementation.addFeature('MutationEvents', ["2.0"]);
  jQueryTag.src = path || 'http://code.jquery.com/jquery-latest.js';
  window.document.body.appendChild(jQueryTag);

  jQueryTag.onload = function() {
    if (callback) {
      callback(window, window.jQuery);
    }

    window.document.implementation._features = features;
  };

  return window;
};


exports.env = exports.jsdom.env = function(config, callback) {
  // figure out whether we're dealing with a local file, a URL, or html
  if (config.html) {
    processHTML(null, config.html);
  } else if (config.file) {
    fs.readFile(config.file, processHTML);
  } else {
    assert.ok(config.url, "URL required");
    var url = URL.parse(config.url);
    request({
      uri      : url,
      encoding : config.encoding || 'utf8',
      headers  : config.headers || {},
      proxy    : config.proxy || null
    },
    function(err, request, body) {
      processHTML(err, body);
    });
  }

  function processHTML(err, html) {
    html += '';
    if(err) {
      return callback(err);
    }

    config.scripts = config.scripts || [];
    if (typeof config.scripts === 'string') {
      config.scripts = [config.scripts];
    }

    config.src = config.src || [];
    if (typeof config.src === 'string') {
      config.src = [config.src];
    }

    var
    options    = {
      features: config.features || {
        'FetchExternalResources' : false,
        'ProcessExternalResources' : false,
        'SkipExternalResources' : false
      },
      url: config.url
    },
    window     = exports.html(html, null, options).createWindow(),
    features   = JSON.parse(JSON.stringify(window.document.implementation._features)),
    docsLoaded = 0,
    totalDocs  = config.scripts.length + config.src.length,
    readyState = null,
    errors     = null;

    if (!window || !window.document) {
      return callback(new Error('JSDOM: a window object could not be created.'));
    }

    if( config.document ) {
      window.document._referrer = config.document.referrer;
      window.document._cookie = config.document.cookie;
    }

    window.document.implementation.addFeature('FetchExternalResources', ['script']);
    window.document.implementation.addFeature('ProcessExternalResources', ['script']);
    window.document.implementation.addFeature('MutationEvents', ['2.0']);

    var scriptComplete = function() {
      docsLoaded++;
      if (docsLoaded >= totalDocs) {
        window.document.implementation._features = features;

        if (errors) {
          errors = errors.concat(window.document.errors || []);
        }

        process.nextTick(function() { callback(errors, window); });
      }
    }

    if (config.scripts.length > 0 || config.src.length > 0) {
      config.scripts.forEach(function(src) {
        var script = window.document.createElement('script');
        script.className = "jsdom";
        script.onload = function() {
          scriptComplete()
        };

        script.onerror = function(e) {
          if (!errors) {
            errors = [];
          }
          errors.push(e.error);
          scriptComplete();
        };

        script.src = src;
        try {
          // project against invalid dom
          // ex: http://www.google.com/foo#bar
          window.document.documentElement.appendChild(script);
        } catch(e) {
          if(!errors) {
            errors=[];
          }
          errors.push(e.error || e.message);
          scriptComplete();
        }
      });

      config.src.forEach(function(src) {
        var script = window.document.createElement('script');
        script.onload = function() {
          process.nextTick(scriptComplete);
        };

        script.onerror = function(e) {
          if (!errors) {
            errors = [];
          }
          errors.push(e.error || e.message);
          // nextTick so that an exception within scriptComplete won't cause
          // another script onerror (which would be an infinite loop)
          process.nextTick(scriptComplete);
        };

        script.text = src;
        window.document.documentElement.appendChild(script);
        window.document.documentElement.removeChild(script);
      });
    } else {
      scriptComplete();
    }
  }
};

