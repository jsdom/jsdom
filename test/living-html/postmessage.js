"use strict";

var jsdom = require("../..");
var toFileUrl = require("../util").toFileUrl(__dirname);

function wrapScriptInHtmlDocumentString(js) {
  return `
    <html>
      <head>
        <script>
          ${js}
        </script>
      </head>
      <body>
      </body>
    </html>
  `;
}

// Idea: run framebus tests on jsdom to get a reasonable idea that most features are working

// Tests for window.postMessage
// TODO: Spec: https://html.spec.whatwg.org/(?)

// TODO: Change data from event.data to whatever spec dictates
exports["postMessage from iframe to parent"] = function (test) {

  var html = wrapScriptInHtmlDocumentString(`
    window.iframe = document.createElement("iframe");
    window.iframe.src = "${toFileUrl("files/iframe.html")}";
    document.body.appendChild(window.iframe);
    window.addEventListener("message", function (event) {
      window.postMessageReceived = event;
    });
  `);

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

  // TODO: We can modify the old frame tests to use template strings now
  var html = wrapScriptInHtmlDocumentString(`
    window.iframe = document.createElement("iframe");
    window.iframe.src = "${toFileUrl("files/iframe-receiver.html")}";
    document.body.appendChild(window.iframe);
    window.iframe.onload = function () {
      window.iframe.postMessage("yeah");
      window.testCallback();
    };
  `);

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
    // TODO: Make test strings consistent
    test.ok(event.data === "yeah");
    test.done();
  };
};

exports["postMessage from iframe to iframe"] = function (test) {

  var html = wrapScriptInHtmlDocumentString(`
    window.iframeReceiver = document.createElement("iframe");
    window.iframeReceiver.src = "${toFileUrl("files/iframe-receiver.html")}";
    document.body.appendChild(window.iframeReceiver);

    window.iframeSender = document.createElement("iframe");
    window.iframeSender.src = "${toFileUrl("files/iframe-sender.html")}";
    document.body.appendChild(window.iframeSender);

    window.onload = function () {
      window.testCallback();
    };
  `);

  // TODO: Make an option for virtualConsole to proxy every frame's console?
    // Right now it just proxies the root frame's console
  // TODO: should sendTo() return the instance?
  var virtualConsole = jsdom.createVirtualConsole();
  virtualConsole.sendTo(console);
  var options = {
    virtualConsole: virtualConsole,
    features: {
      FetchExternalResources: ["script","iframe"],
      ProcessExternalResources: ["script","iframe"]
    }
  }

  var document = jsdom.jsdom(html, options);
  var window = document.defaultView;

  window.testCallback = function () {
    var event = window.postMessageEvent;
    // TODO: Test origin
    test.ok(event.data === "yeah");
    test.done();
  };
};

// x: Test parent to iframe
// x: Test iframe to iframe
// TODO: Test origin preference
