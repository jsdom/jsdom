// For: nodeunit
var AssertionError = require('assert').AssertionError;
var nodeunit = require('nodeunit');

var totalTests = 0;
var failedTests = 0;
var passedTests = 0;
var modules = {};
var currentModule = "";
var moduleIndex = 0;
var start;
var argv;

var runnerHandlers = {
  moduleStart: function (name) {
    currentModule = name.replace('.js', '');
    console.log("running", name, currentModule);
    modules[currentModule] = {
      total : 0,
      fail  : 0,
      pass  : 0
    };
    moduleIndex++;
  },
  moduleDone: function (name, assertions) {
    if (argv['verbose']) {
      console.log(' ');
    }
  },
  testStart: function (test) {
    modules[currentModule].total++;
    if (argv['verbose']) {
      process.stdout.write('  ' + test[0] + ' ...');
    }
  },
  testDone: function (test, assertions) {
    if (argv['verbose']) {
      console.log(' done');
    }
    totalTests++;
    if (!assertions.failures()) {
      passedTests++;
      modules[currentModule].pass++;
    }
    else {
      failedTests++;
      modules[currentModule].fail++;

      console.log('✖ ' + currentModule + '/' + test);
      assertions.forEach(function (a) {
        if (a.failed()) {
          if (a.error) {
            if (!a.error.stack) {
              a.error.stack = ''; // if no stack is available nodeunit crashes
            }
            a = nodeunit.utils.betterErrors(a);

            if (a.error.stack) {
              console.log(a.error.stack);
            } else if (a.error.name === 'AssertionError') {
              console.log(a.method + ': ' +
                JSON.stringify(a.error.actual) + ' ' + a.error.operator + ' ' + JSON.stringify(a.error.expected));
            } else { // last resort, just dump it
              console.log(a);
            }
          } else {
            if (a.method) {
              console.log(a.method + ': ' + a.message);
            } else {
              console.log(a.message);
            }
          }
        } else {
          console.log(a.message);
        }
      });

      if (argv['fail-fast']) {
        process.exit();
      }
    }
  },
  done: function (assertions) {
    var end = new Date().getTime();
    var duration = end - start;
    var maxWidths = {
      name   : 0,
      ratio   : 0,
      percent : 4
    };
    var width = 0;
    var keys = Object.keys(modules);

    var calculateMax = function(name, value) {
      if (!maxWidths[name] || value.length > maxWidths[name]) {
          maxWidths[name] = value.length;
      }

      width = 2;
      Object.keys(maxWidths).forEach(function(v) {
        width += maxWidths[v] + 2;
      });
    }

    var pad = function(name, value, rightJustified) {
      var ret = '';
      var padding = '';

      var amount = maxWidths[name] - value.length;
      while(amount--) {
          padding += " ";
      }

      if (rightJustified) {
        return ' ' + padding + value + '     ';
      } else {
        return ' ' + value + padding + '     ';
      }
    }

    // First pass, calculate the max widths
    keys.forEach(function(v) {
       var module = modules[v];
       var ratio  = module.pass + '/' + module.total;
       var percentage = Math.floor((module.pass/module.total)*100) + '%';
       modules[v].ratio = ratio;
       modules[v].percentage = percentage;
       calculateMax('name', v);
       calculateMax('ratio', ratio);
       calculateMax('percentage', percentage);
    });

    var caps = '';
    var gen = width;

    while(gen--) {
      caps += '-';
    }

    console.log('');
    Object.keys(modules).forEach(function(v) {
       var module = modules[v];
       process.stdout.write(pad('name', v, false));
       process.stdout.write(pad('ratio', module.ratio, true));
       process.stdout.write(pad('percentage', module.percentage, true));
       process.stdout.write('\n');
    });
    console.log(caps);
    var ratio = failedTests + '/' + totalTests;
    var percent = 0;
    if (totalTests === 0) {
      percent = '100%';
    } else {
      percent = Math.floor((passedTests/totalTests)*100) + '%';
    }
    console.log('TOTALS: %s failed; %s success', ratio, percent);
    console.log('TIME: %dms', duration);
  }
};

module.exports = function (runner, args, callback) {
  argv = args;
  start = new Date().getTime();

  Object.keys(runnerHandlers).forEach(function (event) {
    runner.on(event, runnerHandlers[event]);
  });

  runner.on('done', function () {
    if (passedTests !== totalTests) {
      callback(new Error(failedTests + ' failures'));
    } else {
      callback();
    }
  });
};
