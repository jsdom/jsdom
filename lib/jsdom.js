
var dom      = exports.dom = require("./jsdom/level3/index").dom,
    request  = require('request'),
    fs       = require("fs"),
    pkg      = JSON.parse(fs.readFileSync(__dirname + "/../package.json"));
    URL      = require('url');
    
exports.defaultLevel = dom.level3.html;
exports.browserAugmentation = require("./jsdom/browser/index").browserAugmentation;
exports.windowAugmentation = require("./jsdom/browser/index").windowAugmentation;

exports.debugMode = false;

var createWindow = exports.createWindow = require("./jsdom/browser/index").createWindow;

exports.__defineGetter__('version', function() {
  return pkg.version;
});

exports.jsdom = function (html, level, options) {

  options = options || {};
  level   = level || exports.defaultLevel;

  if (!options.url) {
    options.url = module.parent.id == 'jsdom'   ?
                  module.parent.parent.filename :
                  module.parent.filename;
  }

  if (options.features && options.features.QuerySelector) {
    require("./jsdom/selectors/index").applyQuerySelectorPrototype(level);
  }

  var browser = exports.browserAugmentation(level, options),
      doc     = (browser.HTMLDocument)             ?
                 new browser.HTMLDocument(options) :
                 new browser.Document(options);

  exports.applyDocumentFeatures(doc, options.features);
  
  if (!!html) {
    doc.write(html + '')
  } else {
    doc.write('<html><head></head><body></body></html>');
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
  // body
  if (!~html.indexOf('<body')) {
    html = '<body>' + html + '</body>';
  }

  // html
  if (!~html.indexOf('<html')) {
    html = '<html>' + html + '</html>';
  }
  return exports.jsdom(html, level, options);
};

exports.availableDocumentFeatures = [
  'FetchExternalResources',
  'ProcessExternalResources',
  'MutationEvents',
  'QuerySelector'
];

exports.defaultDocumentFeatures = {
  "FetchExternalResources"   : ['script'/*, 'img', 'css', 'frame', 'link'*/],
  "ProcessExternalResources" : ['script'/*, 'frame', 'iframe'*/],
  "MutationEvents"           : '2.0',
  "QuerySelector"            : false
};

exports.applyDocumentFeatures = function(doc, features) {
  var i, maxFeatures = exports.availableDocumentFeatures.length,
      defaultFeatures = exports.defaultDocumentFeatures,
      j,
      k,
      featureName,
      featureSource;

  features = features || {};

  for (i=0; i<maxFeatures; i++) {
    featureName = exports.availableDocumentFeatures[i];
    if (typeof features[featureName] !== 'undefined') {
      featureSource = features[featureName];
    } else if (defaultFeatures[featureName]) {
      featureSource = defaultFeatures[featureName];
    } else {
      continue;
    }

    doc.implementation.removeFeature(featureName);

    if (typeof featureSource !== 'undefined') {
      if (featureSource instanceof Array) {
        k = featureSource.length;
        for (j=0; j<k; j++) {
          doc.implementation.addFeature(featureName, featureSource[j]);
        }
      } else {
        doc.implementation.addFeature(featureName, featureSource);
      }
    }
  }
};

exports.jQueryify = exports.jsdom.jQueryify = function (window /* path [optional], callback */) {

  if (!window || !window.document) { return; }

  var args = Array.prototype.slice.call(arguments),
      callback = (typeof(args[args.length - 1]) === 'function') && args.pop(),
      path,
      jQueryTag = window.document.createElement("script");

  if (args.length > 1 && typeof(args[1] === 'string')) {
    path = args[1];
  }

  var features = window.document.implementation._features;

  window.document.implementation.addFeature('FetchExternalResources', ['script']);
  window.document.implementation.addFeature('ProcessExternalResources', ['script']);
  window.document.implementation.addFeature('MutationEvents', ["1.0"]);
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


exports.env = exports.jsdom.env = function(config) {

  if(!config || !config.done) {
    throw new Error('JSDOM: a config and config.done callback must be supplied.');
  }

  var
  callback    = config.done,
  processHTML = function(err, html) {
    html += '';

    if(err) {
      return callback(err);
    }

    config.code = config.code || [];

    if (typeof config.code === 'string') {
      config.code = [config.code];
    }

    var window     = exports.html(html).createWindow(),
        features   = window.document.implementation._features,
        docsLoaded = 0,
        totalDocs  = config.code.length;
        readyState = null,
        errors     = null;

    if (!window || !window.document) {
      return callback(new Error('JSDOM: a window object could not be created.')); 
    }

    window.document.implementation.addFeature('FetchExternalResources', ['script']);
    window.document.implementation.addFeature('ProcessExternalResources', ['script']);
    window.document.implementation.addFeature('MutationEvents', ['1.0']);

    config.code.forEach(function(src) {
      var
      script = window.document.createElement('script'),
      scriptComplete = function() {
        docsLoaded++;
        if (docsLoaded >= totalDocs) {
          window.document.implementation._features = features;
          callback(errors, window);
        }
      }

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
      window.document.documentElement.appendChild(script);
    });
  };

  config.html += '';

  // Handle markup
  if (config.html.indexOf("\n") > 0 || config.html.match(/^\W*</)) {
    processHTML(null, config.html);
    
  // Handle url/file
  } else {
    var url = URL.parse(config.html);
    if (url.hostname) {
      request({uri: url}, function(err, request, body) {
        processHTML(err, body);
      });
    } else {
      fs.readFile(url.pathname, processHTML);
    }
  }
};
