var sys = require("sys");
process.mixin(GLOBAL, require("../src/level1/core").dom.level1.core);
process.mixin(GLOBAL, require("./mjsunit"));
process.mixin(GLOBAL, require("./DOMTestCase"));

// Compat Layer
GLOBAL.builder = { 
  contentType: ""
  
};

GLOBAL.load = function(docRef, doc, name) {

  var doc = require("./level1/_files/" + name + ".xml")[name]();
  
  // TODO: run all of the tests......
  //GLOBAL.builder.contentType = doc.contentType;
  return doc;
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


var errors = [];
var total = 0;
var tests = {
  "level1-core" : { cases: require("./level1/core").tests, errors: [], total:0},
  "level2-core" : { cases: require("./level2/core").tests, errors: [], total:0},
  "level2-html" : { cases: require("./level2/html").tests, errors: [], total:0},
  "level3-core" : { cases: require("./level3/core").tests, errors: [], total:0},
  "level3-ls"   : { cases: require("./level3/ls").tests,   errors: [], total:0}
};

var suite,suiteName;
for (suiteName in tests)
{
  if (tests.hasOwnProperty(suiteName)) {
    suite = tests[suiteName];
    
    for (test in suite.cases)
    {
	    total++;
	    if (suite.cases.hasOwnProperty(test)) {
		    suite.total++;
		    try {
			    suite.cases[test].call(GLOBAL);
		    } catch (e) {
			    suite.errors.push({ method: test, error: e});
          errors.push({ method: test, error: e});
			    //break;
		    }
	    }
	  }
  }
}


var numerator, denominator, percent;
sys.puts("");
for (var suiteName in tests)
{
  if (tests.hasOwnProperty(suiteName)) {
    numerator   = tests[suiteName].total - tests[suiteName].errors.length;
    denominator = tests[suiteName].total;
    percent     = Math.round((numerator / denominator)*100,2);
    sys.puts(suiteName + "\t" + numerator + "/" + denominator + "\t\t" + percent + "% passing");
  }
}

sys.puts("--------------------------------------------");
numerator   = total-errors.length;
denominator = total;
percent     = Math.round((numerator / denominator)*100,2);
sys.puts("TOTALS:\t\t" + numerator + "/" + denominator + "\t" + percent + "% passing\r\n");


/*
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
	    debug(e);
	    errors.push({ method: test, error: e});
    }
}

for (var i = 0; i<errors.length; i++)
{
	sys.puts('"' + errors[i].error.message + " (#" + errors[i].error.code + " " + errors[i].error.type + " in " + errors[i].method + ')');
  sys.puts(errors[i].error.stack);
}

// Summary
sys.puts(" ");
sys.puts(errors.length + " of " + total + " failed (" + Math.round(((total-errors.length)/total)*100)  + "% success)" );
sys.puts(" ");*/
