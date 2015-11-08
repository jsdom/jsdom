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
    "level2/style": require("../test/level2/style"), // 13/15
    "level2/events": require("../test/level2/events"), // ok
    //"level3/core": require("../test/level3/core"),
    //"level3/ls": require("../test/level3/ls"),
    "level3/textContent.js": require("../test/level3/textContent.js"), // ok
    "level3/xpath": require("../test/level3/xpath"), // 0/93

    "living-dom/attributes.js": require("../test/living-dom/attributes.js"), // 1/11
    "living-dom/class-list.js": require("../test/living-dom/class-list.js"), // ok
    "living-dom/compare-document-position.js": require("../test/living-dom/compare-document-position.js"), // 0/20
    "living-dom/dom-implementation.js": require("../test/living-dom/dom-implementation.js"), // ok
    "living-dom/event-target.js": require("../test/living-dom/event-target.js"), // ok
    "living-dom/node-clone-node.js": require("../test/living-dom/node-clone-node.js"), // ok
    "living-dom/node-contains.js": require("../test/living-dom/node-contains.js"), // 0/20
    "living-dom/node-list.js": require("../test/living-dom/node-list.js"), // ok
    "living-dom/node-parent-element.js": require("../test/living-dom/node-parent-element.js"), // 0/11
    "living-dom/non-document-type-child-node.js": require("../test/living-dom/non-document-type-child-node.js"),

    "living-html/htmlanchorelement.js": require("../test/living-html/htmlanchorelement.js"), // ok
    "living-html/htmlbuttonelement.js": require("../test/living-html/htmlbuttonelement.js"), // ok
    "living-html/htmlcanvaselement.js": require("../test/living-html/htmlcanvaselement.js"), // ok
    "living-html/htmlelement.js": require("../test/living-html/htmlelement.js"), // ok
    "living-html/location.js": require("../test/living-html/location.js"), // ok
    "living-html/inline-event-handlers.js": require("../test/living-html/inline-event-handlers.js"), // ok
    "living-html/message-event.js": require("../test/living-html/message-event.js"), // ok
    "living-html/post-message.js": require("../test/living-html/post-message.js"), // ok
    "living-html/on-error.js": require("../test/living-html/on-error.js"), // ok
    "living-html/navigator.js": require("../test/living-html/navigator.js"), // ok
    "misc/url.js": require("../test/misc/url.js"), // ok
    "misc/xhr-file-urls.js": require("../test/misc/xhr-file-urls.js"), // 0; file I/O does not work in browsers
    "misc/xhr-requires-server.js": require("../test/misc/xhr-requires-server.js"), // 0; could work if we figured
      // out a way to say that the server parts happen in Node.js, and the browser parts happen in the browser.

    "window/base64": require("../test/window/base64"), // ok
    "window/history": require("../test/window/history"), // ok
    "window/script": require("../test/window/script"), // 0/10
    "window/console": require("../test/window/console"), // ok
    //"window/frame": require("../test/window/frame"), // fail
    //"sizzle/index": require("../test/sizzle/index"), // fail
    //"jsdom/index": require("../test/jsdom/index"), // fail
    "jsdom/parsing": require("../test/jsdom/parsing"), // 0/11
    "jsdom/serialization": require("../test/jsdom/serialization"),
    "jsdom/env": require("../test/jsdom/env"), // 9/25
    "jsdom/env-browser": require("../test/jsdom/env-browser"),
    "jsdom/utils": require("../test/jsdom/utils"), // ok
    "jsdom/inside-worker-smoke-tests": require("../test/jsdom/inside-worker-smoke-tests"),
    "jsdom/named-properties-tracker.js": require("../test/jsdom/named-properties-tracker"),
    "jsdom/node-location.js": require("../test/jsdom/node-location"),
    "jsdom/resource-loading.js": require("../test/jsdom/resource-loading"), // 0/4
    "jsdom/reconfigure-window.js": require("../test/jsdom/reconfigure-window"),
    "jsonp/jsonp": require("../test/jsonp/jsonp"), // 0/1
    "browser/css": require("../test/browser/css"), // ok
    "browser/index": require("../test/browser/index"), // ok
    //"web-platform-tests/index.js": require("../test/web-platform-tests/index"), // cannot browserify
    "misc/domparsing.js": require("../test/misc/domparsing")
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

    "living-dom/class-list.js",
    "living-dom/event-target.js",
    "living-dom/node-clone-node.js",
    "living-dom/node-list.js",
    "living-dom/non-document-type-child-node.js",
    "living-html/htmlanchorelement.js",
    "living-html/htmlbuttonelement.js",
    "living-html/htmlcanvaselement.js",
    "living-html/location.js",
    "living-html/inline-event-handlers.js",
    "living-html/message-event.js",
    "living-html/navigator.js",
    "living-html/on-error.js",
    "living-html/post-message.js",

    "misc/url.js",

    "window/base64",
    "window/history",
    "window/console",
    "jsdom/env-browser",
    "jsdom/utils",
    "jsdom/inside-worker-smoke-tests",
    "jsdom/serialization",
    "jsdom/named-properties-tracker",
    "jsdom/node-location",
    "jsdom/reconfigure-window",
    "browser/css",
    "browser/index",

    "misc/domparsing.js"
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
