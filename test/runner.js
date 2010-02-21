var sys = require("sys");
process.mixin(GLOBAL, require("../lib/level1/core").dom.level1.core);
process.mixin(GLOBAL, require("./mjsunit"));
process.mixin(GLOBAL, require("./DOMTestCase"));

// Compat Layer
GLOBAL.builder = { 
  contentType: "",
  type: "",
  testDirectory: ""
};

GLOBAL.load = function(docRef, doc, name) {
  return require("./" + GLOBAL.builder.testDirectory + "/files/" + name + "." + GLOBAL.builder.type)[name]();
};

GLOBAL.checkInitialization = function() {
  return null;
};


GLOBAL.debug = function(val) {
  var str;
  try {
    str = JSON.stringify(val, null, "  ");
  } catch (e) {
    str = sys.inspect(val);
  }
  sys.puts(str);
  process.exit();

}
// End Compat Layer

var suites = {
  "level1/core" : { cases: require("./level1/core").tests, setUp : function() {
      GLOBAL.builder.contentType   = "text/xml";
      GLOBAL.builder.type          = "xml";
      GLOBAL.builder.testDirectory = "level1/core";  
    }
  },
  "level1/html" : { cases: require("./level1/html").tests, setUp : function() {
      GLOBAL.builder.contentType   = "text/html";
      GLOBAL.builder.type          = "html";
      GLOBAL.builder.testDirectory = "level1/html";  
    }
  },
  "level1/svg"  : { cases: require("./level1/svg").tests, setUp : function() {
      GLOBAL.builder.contentType   = "image/svg+xml";
      GLOBAL.builder.type          = "svg";
      GLOBAL.builder.testDirectory = "level1/svg";  
    }
  },
  "browser"     : { cases: require("./browser").tests, setUp : function() {
      GLOBAL.builder.contentType   = "text/html";
      GLOBAL.builder.type          = "html";
      GLOBAL.builder.testDirectory = "browser";  
    }
  },
  "level2/core" : { cases: require("./level2/core").tests, setUp : function() {
      GLOBAL.builder.contentType   = "text/xml";
      GLOBAL.builder.type          = "xml";
      GLOBAL.builder.testDirectory = "level2/core"; 
    }
  },
  "level2/html" : { cases: require("./level2/html").tests, setUp : function() {
      GLOBAL.builder.contentType   = "text/html";
      GLOBAL.builder.type          = "html";
      GLOBAL.builder.testDirectory = "level2/html";  
    }
  },
 "level3/core" : { cases: require("./level3/core").tests, setUp : function() {
     GLOBAL.builder.contentType   = "text/xml";
     GLOBAL.builder.type          = "xml";
     GLOBAL.builder.testDirectory = "level3/core";  
   }
 },
 "level3/ls"   : { cases: require("./level3/ls").tests, setUp : function() {
      GLOBAL.builder.contentType   = "text/html";
      GLOBAL.builder.type          = "html";
      GLOBAL.builder.testDirectory = "level3/ls";  
    }
  }
};

require("mjsunit.runner/lib/runner").run(suites);

