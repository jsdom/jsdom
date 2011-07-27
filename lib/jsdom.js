
var dom      = exports.dom = require("./jsdom/level3/index").dom,
    fs       = require("fs"),
    pkg      = JSON.parse(fs.readFileSync(__dirname + "/../package.json")),
    request  = require('request'),
    URL      = require('url');

var style = require('./jsdom/level2/style');
exports.defaultLevel = dom.level3.html;
exports.browserAugmentation = require("./jsdom/browser/index").browserAugmentation;
exports.windowAugmentation = require("./jsdom/browser/index").windowAugmentation;

exports.debugMode = false;

var createWindow = exports.createWindow = require("./jsdom/browser/index").createWindow;

exports.__defineGetter__('version', function() {
  return pkg.version;
});

exports.level = function (level, feature) {
	if(!feature) feature = 'core'
	return require('./jsdom/level' + level + '/' + feature).dom['level' + level][feature]
}

exports.jsdom = function (html, level, options) {

  options = options || {};
  if(typeof level == "string") {
    level = exports.level(level, 'html')
  } else {
    level   = level || exports.defaultLevel;
  }

  if (!options.url) {
    options.url = (module.parent.id === 'jsdom') ?
                  module.parent.parent.filename  :
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
    doc.write(html + '');
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


exports.env = exports.jsdom.env = function() {
  var
  args        = Array.prototype.slice.call(arguments),
  config      = exports.env.processArguments(args),
  callback    = config.done,
  processHTML = function(err, html) {

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
      features: {
        'FetchExternalResources' : false,
        'ProcessExternalResources' : false
      },
      url: config.url
    },
    window     = exports.html(html, null, options).createWindow(),
    features   = window.document.implementation._features,
    docsLoaded = 0,
    totalDocs  = config.scripts.length,
    readyState = null,
    errors     = null;

    if (!window || !window.document) {
      return callback(new Error('JSDOM: a window object could not be created.')); 
    }

    window.document.implementation.addFeature('FetchExternalResources', ['script']);
    window.document.implementation.addFeature('ProcessExternalResources', ['script']);
    window.document.implementation.addFeature('MutationEvents', ['1.0']);

    var scriptComplete = function() {
      docsLoaded++;
      if (docsLoaded >= totalDocs) {
        window.document.implementation._features = features;
        callback(errors, window);
      }
    }

    if (config.scripts.length > 0 || config.src.length > 0) {
      config.scripts.forEach(function(src) {
        var script = window.document.createElement('script');
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
      callback(errors, window);
    }
  };

  config.html += '';

  // Handle markup
  if (config.html.indexOf("\n") > 0 || config.html.match(/^\W*</)) {
    processHTML(null, config.html);

  // Handle url/file
  } else {
    var url = URL.parse(config.html);
    config.url = config.url || url.href;
    if (url.hostname) {
      request({ uri: url,
                encoding: config.encoding || 'utf8',
                headers: config.headers || {}
              },
              function(err, request, body) {
                processHTML(err, body);
      });
    } else {
      fs.readFile(url.pathname, processHTML);
    }
  }
};

/*
  Since jsdom.env() is a helper for quickly and easily setting up a
  window with scripts and such already loaded into it, the arguments
  should be fairly flexible.  Here are the requirements

  1) collect `html` (url, string, or file on disk)  (STRING)
  2) load `code` into the window (array of scripts) (ARRAY)
  3) callback when resources are `done`             (FUNCTION)
  4) configuration                                  (OBJECT)

  Rules:
  + if there is one argument it had better be an object with atleast
    a `html` and `done` property (other properties are gravy)

  + arguments above are pulled out of the arguments and put into the
    config object that is returned
*/
exports.env.processArguments = function(args) {
  if (!args || !args.length || args.length < 1) {
    throw new Error('No arguments passed to jsdom.env().');
  }

  var
  props = {
    'html'    : true,
    'done'    : true,
    'scripts' : false,
    'config'  : false,
    'url'     : false  // the URL for location.href if different from html
  },
  propKeys = Object.keys(props),
  config = {
    code : []
  },
  l    = args.length
  ;
  if (l === 1) {
    config = args[0];
  } else {
    args.forEach(function(v) {
      var type = typeof v;
      if (!v) {
        return;
      }
      if (type === 'string' || v + '' === v) {
        config.html = v;
      } else if (type === 'object') {
        // Array
        if (v.length && v[0]) {
          config.scripts = v;
        } else {
          // apply missing required properties if appropriate
          propKeys.forEach(function(req) {

            if (typeof v[req] !== 'undefined' &&
                typeof config[req] === 'undefined') {

              config[req] = v[req];
              delete v[req];
            }
          });
          config.config = v;
        }
      } else if (type === 'function') {
        config.done = v;
      }
    });
  }

  propKeys.forEach(function(req) {
    var required = props[req];
    if (required && typeof config[req] === 'undefined') {
      throw new Error("jsdom.env requires a '" + req + "' argument");
    }
  });
  return config;
};

//TODO: move the following into level2/html once applyDocumentFeatures is moved
//into a separate module
var framePrototype = require("./jsdom/level2/index").dom.level2.html.HTMLFrameElement.prototype;
var oldSetAttribute = framePrototype.setAttribute;
framePrototype.setAttribute = function(name, value) {
  oldSetAttribute.apply(this, arguments);
  if(name === 'src') {
    exports.applyDocumentFeatures(this._contentDocument, this._ownerDocument.implementation._features);

    //if doc.__scriptContext is present, use it (this happens when a script in the browser
    //dynamically creates and appends a frame/iframe to the document): this ensures script
    //running in the frame/iframe can access window.parent properly
    var doc = this._ownerDocument, parent = doc.__scriptContext || doc.parentWindow,
      contentWindow = this._contentDocument.parentWindow;
    contentWindow.parent = parent;
    contentWindow.top = parent.top;
  }
};
