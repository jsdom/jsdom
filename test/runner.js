var sys = require("sys");
process.mixin(GLOBAL, require("../src/level1/core").dom.level1.core);
process.mixin(GLOBAL, require("./mjsunit"));
process.mixin(GLOBAL, require("./DOMTestCase"));

// Compat Layer
GLOBAL.load = function(docRef, doc, name) {
  var doc = require("./level1/_files/" + name + ".xml")[name]();
  return doc;
};

GLOBAL.checkInitialization = function() {
	return null;
};

GLOBAL.builder = function() {
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


var errors = [];

var level1_core = require("./level1/core").tests;
var total = 0;


if (process.ARGV[2] != "-t") {
    var test = null;
    for (test in level1_core)
    {
	    total++;
	    if (level1_core.hasOwnProperty(test)) {
		    try {
			    level1_core[test].call(GLOBAL);
		    } catch (e) {
			    errors.push({ method: test, error: e});
			    //break;
		    }
	    }
    }
} else {
    total = 1;
    try {
        level1_core[process.ARGV[3]].call(GLOBAL);
    } catch (e) {
	    errors.push({ method: test, error: e});
    }
}

for (var i = 0; i<errors.length; i++)
{
	sys.puts('FAIL: failed with message "' + errors[i].error.message + " (#" + errors[i].error.code + " " + errors[i].error.type + " in " + errors[i].method + ')');
  sys.puts(errors[i].error.stack);
}

// Summary
sys.puts(" ");
sys.puts(errors.length + " of " + total + " failed (" + Math.round(((total-errors.length)/total)*100)  + "% success)" );
sys.puts(" ");
