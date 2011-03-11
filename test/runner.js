var sys = require("sys"),
  fs = require("fs");

var mixin = function(target) {
  var i = 1, length = arguments.length, source;
  for ( ; i < length; i++ ) {
    // Only deal with defined values
    if ( (source = arguments[i]) !== undefined ) {
      Object.getOwnPropertyNames(source).forEach(function(k){
        var d = Object.getOwnPropertyDescriptor(source, k) || {value:source[k]};
        if (d.get) {
          target.__defineGetter__(k, d.get);
          if (d.set) target.__defineSetter__(k, d.set);
        }
        else if (target !== d.value) {
          target[k] = d.value;
        }
      });
    }
  }
  return target;
};

mixin(global, require("./mjsunit"));
mixin(global, require("./DOMTestCase"));

// Compat Layer
global.builder = {
  contentType: "",
  type: "",
  testDirectory: ""
};

var fileCache = {};
global.load = global.originalLoad = function(docRef, doc, name) {
  var file = "./" + global.builder.testDirectory +
             "/files/" + name + "." + global.builder.type,
      fn = fileCache[file] || require(file);

  fileCache[file] = fn;
  if (!fn[name]) {
    throw new Error("Test method " + name + " not found..");
  }

  try {
    return fn[name].call(global);
  } catch (e) {
    debug(e.stack);
  }
};

global.checkInitialization = function() {
  return null;
};


global.debug = function(val) {
  var str;
  try {
    str = JSON.stringify(val, null, "  ");
  } catch (e) {
    str = sys.inspect(val, null, true);
  }
  sys.debug(str);
  process.exit();

}
// End Compat Layer

var suites = {
  "level1/core" : { cases: require("./level1/core").tests, setUp : function() {
      mixin(global, require("../lib/jsdom/level1/core").dom.level1.core);
      global.builder.contentType   = "text/xml";
      global.builder.type          = "xml";
      global.builder.testDirectory = "level1/core";
    }
  },
  "level1/html" : { cases: require("./level1/html").tests, setUp : function() {
      mixin(global, require("../lib/jsdom/level1/core").dom.level1.core);
      global.builder.contentType   = "text/html";
      global.builder.type          = "html";
      global.builder.testDirectory = "level1/html";
    }
  },
  "level1/svg"  : { cases: require("./level1/svg").tests, setUp : function() {
      mixin(global, require("../lib/jsdom/level1/core").dom.level1.core);
      global.builder.contentType   = "image/svg+xml";
      global.builder.type          = "svg";
      global.builder.testDirectory = "level1/svg";
    }
  },
  "level2/core" : { cases: require("./level2/core").tests, setUp : function() {
      global.builder.contentType   = "text/xml";
      global.builder.type          = "xml";
      global.builder.testDirectory = "level2/core";
    }
  },
  "level2/extra" : { cases: require("./level2/extra").tests, setUp : function () {
      mixin(global, require("../lib/jsdom/level2/core").dom.level2.core);
      global.builder.contentType   = "text/xml";
      global.builder.type          = "xml";
      global.builder.testDirectory = "level2/extra";
    }
  },
  "level2/events" : { cases: require("./level2/events").tests, setUp : function() {
      mixin(global, require("../lib/jsdom/level2/events").dom.level2.events);
      global.events = require("../lib/jsdom/level2/events").dom.level2.events;
      global.builder.contentType   = "text/xml";
      global.builder.type          = "xml";
      global.builder.testDirectory = "level2/events";
    }, tearDown : function() {
      delete global.events;
    }
  },
  "level2/html" : { cases: require("./level2/html").tests, setUp : function() {
      global.builder.contentType   = "text/html";
      global.builder.type          = "html";
      global.builder.testDirectory = "level2/html";
      global.load = function(docRef, doc, name) {
        var file     = __dirname + "/" + global.builder.testDirectory +
                       "/files/" + name + "." + global.builder.type,
            contents = fileCache[file] || fs.readFileSync(file, 'utf8'),

            doc      = require("../lib/jsdom").jsdom(contents, null, {
              url : "file://" + file // fake out the tests
            });
        fileCache[file] = contents;
        return doc;
      };

      global.level2 = require("../lib/jsdom/level2/html").dom.level2.html;
      global.getImplementation = function() {
        var doc = new (global.level2.HTMLDocument)();
        return doc.implementation;
      };
    }
  },
 "level3/core" : { cases: require("./level3/core").tests, setUp : function() {
      global.builder.contentType   = "text/xml";
      global.builder.type          = "xml";
      global.builder.testDirectory = "level3/core";
      global.load                  = global.originalLoad;
      global.DOMErrorMonitor = function() {
        this.allErrors = new Array();
      }

      global.DOMErrorMonitor.prototype.handleError = function(err) {
          errorMonitor.allErrors[errorMonitor.allErrors.length] = new DOMErrorImpl(err);
      }

      global.DOMErrorMonitor.prototype.assertLowerSeverity = function(id, severity) {
          var i;
          for (i = 0; i < errorMonitor.allErrors.length; i++) {
              if (errorMonitor.allErrors[i].severity >= severity) {
                 assertEquals(id, severity - 1, errorMonitor.allErrors[i].severity);
              }
          }
      }
      var level3core = require("../lib/jsdom/level3/core").dom.level3.core;
      global.getImplementation = function() {
        return {
          createDocument : function() {
            return new (level3core.Document)();
          }
        };
      }
    }
  },/*
 "level3/ls"   : { cases: require("./level3/ls").tests, setUp : function() {
      global.builder.contentType   = "text/html";
      global.builder.type          = "html";
      global.builder.testDirectory = "level3/ls";
    }
  }
*/
  "browser"     : { cases: require("./browser/index").tests, setUp : function() {
      global.dom = require("../lib/jsdom/level2/core").dom.level2.core;
      global.html = require("../lib/jsdom/level2/html").dom.level2.html;
      global.browser = require("../lib/jsdom/browser/index").browserAugmentation(dom);
      global.builder.contentType   = "text/html";
      global.builder.type          = "html";
      global.builder.testDirectory = "browser";
    }
  },
  "window"     : { cases: require("./window/index").tests, setUp : function() {
      global.dom = require("../lib/jsdom/level1/core").dom.level1.core;
      global.window = require("../lib/jsdom/browser/index").windowAugmentation(dom);

      global.builder.contentType   = "text/html";
      global.builder.type          = "html";
      global.builder.testDirectory = "browser";
    }
  },
  "jsdom"     : { cases: require("./jsdom/index").tests, setUp : function() {
      global.jsdom = require("../lib/jsdom");
      global.builder.contentType   = "text/html";
      global.builder.type          = "html";
      global.builder.testDirectory = "browser";
    }
  }
};

require("mjsunit.runner/runner").run(suites);
