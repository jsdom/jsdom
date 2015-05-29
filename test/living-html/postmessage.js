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

// Tests for window.postMessage
// Spec: https://html.spec.whatwg.org/#crossDocumentMessages

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
      window.iframe.postMessage("ack");
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
    test.ok(event.data === "ack");
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
    test.ok(event.data === "ack");
    test.done();
  };
};
