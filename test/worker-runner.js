function fire(event) {
  var data = Array.prototype.slice.call(arguments, 1);
  data = JSON.parse(JSON.stringify(data));

  postMessage({
    jsonrpc: '2.0',
    method: 'fire',
    params: {
      event: event,
      data: data
    }
  });
}

var runner = require('./browser-core');
self.onmessage = function (e) {
  var options = require('querystring').parse(e.data);
  var fileFilter, testFilter;

  var modules = {
    "level1/core": require("../test/level1/core"), // ok
    "level1/html": require("../test/level1/html"), // ok
    "level2/core": require("../test/level2/core"), // ok
    "level2/html": require("../test/level2/html"), // 6/708
    "level2/style": require("../test/level2/style"), // 0/15
    "level2/extra": require("../test/level2/extra"), // ok
    "level2/events": require("../test/level2/events"), // ok
    //"level3/core": require("../test/level3/core"),
    //"level3/ls": require("../test/level3/ls"),
    "level3/textContent.js": require("../test/level3/textContent.js"), // ok
    "level3/xpath": require("../test/level3/xpath"), // 0/93

    "living-dom/attributes.js": require("../test/living-dom/attributes.js"), // 0/10
    "living-dom/compare-document-position.js": require("../test/living-dom/compare-document-position.js"), // 0/20
    "living-dom/node-contains.js": require("../test/living-dom/node-contains.js"), // 0/20
    "living-dom/node-parent-element.js": require("../test/living-dom/node-parent-element.js"), // 0/11
    "living-html/navigator.js": require("../test/living-html/navigator.js"), // 0/2

    "window/index": require("../test/window/index"), // ok
    "window/history": require("../test/window/history"), // 0/5
    "window/script": require("../test/window/script"), // 0/10
    "window/console": require("../test/window/console"), // 0/2
    //"window/frame": require("../test/window/frame"), // fail
    //"sizzle/index": require("../test/sizzle/index"), // fail
    //"jsdom/index": require("../test/jsdom/index"), // fail
    "jsdom/parsing": require("../test/jsdom/parsing"), // 0/11
    "jsdom/env": require("../test/jsdom/env"), // 9/25
    "jsdom/utils": require("../test/jsdom/utils"), // ok
    "jsonp/jsonp": require("../test/jsonp/jsonp"), // 0/1
    "browser/css": require("../test/browser/css"), // 0/1
    "browser/index": require("../test/browser/index"), // 30/34
    "w3c/index.js": require("../test/w3c/index"), // 0/2
  };

  var modulesToRun = {};

  if (options.suites) {
    fileFilter = options.suites.replace(/\s/g, '').split(',');
  }
  // default to only those test modules that pass
  fileFilter = fileFilter || [
    "level1/core",
    "level1/html",
    "level1/svg",
    "level2/core",
    "level2/extra",
    "level2/events",
    "level3/textContent.js",
    "window/index",
    "jsdom/utils",
  ];

  if (options.tests) {
    testFilter = options.tests.replace(/\s/g, '').split(',');
  }

  Object.keys(modules).
    // process file filters
    filter(function (module) {
      if (fileFilter) {
        return fileFilter.some(function (filter) {
          return module.indexOf(filter) >= 0;
        });
      }

      return true;
    }).
    forEach(function (name) {
      var required = modules[name];
      var module = required.tests || required;

      if (testFilter) {
        // process test filters
        module = Object.keys(module).
          filter(function (test) {
            return testFilter.some(function (filter) {
              return test.indexOf(filter) >= 0;
            });
          }).
          reduce(function (filteredModule, test) {
            filteredModule[test] = module[test];

            return filteredModule;
          }, {});
      }

      if (module && Object.keys(module).length > 0) {
        modulesToRun[name] = module;
      }
    });

  var runnerEmitter = runner(modulesToRun);
  [
    'moduleStart',
    'moduleDone',
    'testStart',
    'testReady',
    'testDone',
    'log',
    'done'
  ].forEach(function (event) {
    runnerEmitter.on(event, fire.bind(null, event));
  });
  require('./browser-display')(runnerEmitter, options, function () {
    console.log('display finished...');
  });
};
