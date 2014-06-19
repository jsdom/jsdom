"use strict";

var jsdom = require("../..");

exports["cookieEnabled should be true on the navigator object"] = function (t) {
  var window = jsdom.jsdom().parentWindow;
  t.strictEqual(window.navigator.cookieEnabled, true, "cookie enabled");
  t.done();
};

exports["navigator properties should be read-only from the site"] = function (t) {
  t.expect(5);

  jsdom.env({
    html: "<!doctype html><html><head><script>navigator.userAgent = 'test'; navigator.platform = 'test';" +
          "navigator.appName = 'test';navigator.appVersion = 'test';</script></head><body></body></html>",
    done: function (errors, window) {
      t.ifError(errors);

      t.notEqual(window.navigator.userAgent, "test", "navigator.userAgent shouldn't be modifiable");
      t.notEqual(window.navigator.platform, "test", "navigator.platform shouldn't be modifiable");
      t.notEqual(window.navigator.appName, "test", "navigator.appName shouldn't be modifiable");
      t.notEqual(window.navigator.appVersion, "test", "navigator.appVersion shouldn't be modifiable");
      t.done();
    },
    features: {
      FetchExternalResources: ["script"],
      ProcessExternalResources:["script"]
    }
  });
};
