var sys = require("sys");

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

mixin(global, require(__dirname + "/../lib/jsdom/level1/core").dom.level1.core);
mixin(global, require(__dirname + "/mjsunit"));
mixin(global, require("./DOMTestCase"));

// Compat Layer
global.builder = { 
  contentType: "",
  type: "",
  testDirectory: ""
};

global.load = function(docRef, doc, name) {
  var file = __dirname + "/" + global.builder.testDirectory +
             "/files/" + name + "." + global.builder.type,
      fn = require(file);
  

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
  sys.puts(str);
  process.exit();

}
// End Compat Layer

var suites = {
  "level1/core" : { cases: require("./level1/core").tests, setUp : function() {
      global.builder.contentType   = "text/xml";
      global.builder.type          = "xml";
      global.builder.testDirectory = "level1/core";  
    }
  },
  "level1/html" : { cases: require("./level1/html").tests, setUp : function() {
      global.builder.contentType   = "text/html";
      global.builder.type          = "html";
      global.builder.testDirectory = "level1/html";  
    }
  },
  "level1/svg"  : { cases: require("./level1/svg").tests, setUp : function() {
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
  "browser"     : { cases: require("./browser").tests, setUp : function() {
      global.dom = require(__dirname + "/../lib/jsdom/level1/core").dom.level1.core;
      global.browser = require(__dirname + "/../lib/jsdom/browser").browserAugmentation(dom);
      
      global.builder.contentType   = "text/html";
      global.builder.type          = "html";
      global.builder.testDirectory = "browser";  
    }
  },
  "window"     : { cases: require("./window").tests, setUp : function() {
      global.dom = require(__dirname + "/../lib/jsdom/level1/core").dom.level1.core;
      global.window = require(__dirname + "/../lib/jsdom/browser").windowAugmentation(dom);
      
      global.builder.contentType   = "text/html";
      global.builder.type          = "html";
      global.builder.testDirectory = "browser";  
    }
  }

  /*
    Ignoring for now..
  "level2/html" : { cases: require("./level2/html").tests, setUp : function() {
      global.builder.contentType   = "text/html";
      global.builder.type          = "html";
      global.builder.testDirectory = "level2/html";  
    }
  },
 "level3/core" : { cases: require("./level3/core").tests, setUp : function() {
     global.builder.contentType   = "text/xml";
     global.builder.type          = "xml";
     global.builder.testDirectory = "level3/core";  
   }
 },
 "level3/ls"   : { cases: require("./level3/ls").tests, setUp : function() {
      global.builder.contentType   = "text/html";
      global.builder.type          = "html";
      global.builder.testDirectory = "level3/ls";  
    }
  }
*/
};

require("mjsunit.runner/lib/runner").run(suites);
