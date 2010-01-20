var sys = require("sys");
process.mixin(GLOBAL, require("./mjsunit"));


var errors = [];

var level1_core = require("./level1/core").tests;

var test = null;
var total = 0;
for (test in level1_core)
{
	total++;
	if (level1_core.hasOwnProperty(test)) {
		try {
			level1_core[test].call(GLOBAL);
		} catch (e) {
			errors.push({ method: test, error: e});
		}
	}
}

for (var i = 0; i<errors.length; i++)
{
	sys.puts('FAIL: failed with message "' + errors[i].error.message + " (" + errors[i].error.type + " in " + errors[i].method + ')');
}

// Summary
sys.puts(" ");
sys.puts(errors.length + " of " + total + " failed (" + Math.round(((total-errors.length)/total)*100)  + "% success)" );
sys.puts(" ");