"use strict";

var jsdom = require("../..");
var toFileUrl = require("../util").toFileUrl(__dirname);

// Tests for window.postMessage
// TODO: Spec: https://html.spec.whatwg.org/(?)

// TODO: Change data from event.data to whatever spec dictates
exports["postMessage from iframe to parent"] = function (test) {

  var html = '<html><head>\
    <script>\
      window.iframe = document.createElement("iframe");\
      window.iframe.src = "' + toFileUrl("files/iframe.html") + '";\
      document.body.appendChild(window.iframe);\
      window.addEventListener("message", function (event) {\
        window.postMessageReceived = event;\
      });\
    </script>\
    </head><body></body></html>';

  var options = {
    features: {
      FetchExternalResources: ["script","iframe"],
      ProcessExternalResources: ["script","iframe"]
    }
  }

  var document = jsdom.jsdom(html, options);
  var window = document.defaultView;

  window.iframe.onload = function() {
    var event = window.postMessageReceived;
    test.ok(event.data === "yep");

    test.done();
  };
};

exports["postMessage from parent to iframe"] = function (test) {

  var html = '<html><head>\
    <script>\
      window.iframe = document.createElement("iframe");\
      window.iframe.src = "' + toFileUrl("files/iframe-receiver.html") + '";\
      document.body.appendChild(window.iframe);\
      window.iframe.onload = function () {\
        window.iframe.postMessage("yeah");\
        window.testCallback();\
      };\
    </script>\
    </head><body></body></html>';

  var options = {
    features: {
      FetchExternalResources: ["script","iframe"],
      ProcessExternalResources: ["script","iframe"]
    }
  }

  var document = jsdom.jsdom(html, options);
  var window = document.defaultView;

  window.testCallback = function () {
    var event = window.postMessageEvent;
    test.ok(event.data === "yeah");
    test.done();
  };
};

// Check: Test parent to iframe
// TODO: Test iframe to iframe
// TODO: Test origin preference
