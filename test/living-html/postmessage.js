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

const baseOptions = {
  features: {
    FetchExternalResources: ["script","iframe"],
    ProcessExternalResources: ["script","iframe"]
  }
};

// Tests for window.postMessage(message, targetOrigin, transfer)
// Spec: https://html.spec.whatwg.org/#crossDocumentMessages

exports["throws SyntaxError on invalid targetOrigin"] = function (test) {
  var document = jsdom.jsdom(wrapScriptInHtmlDocumentString(`
    window.iframe = document.createElement("iframe");
    window.iframe.src = "${toFileUrl("files/blank.html")}";
    document.body.appendChild(window.iframe);
  `), baseOptions);
  var window = document.defaultView;

  window.iframe.onload = function () {
    test.throws(function () {
      window.iframe.postMessage("testMessage", "bogus targetOrigin");
    }, SyntaxError, "an invalid targetOrigin throws a SyntaxError");

    test.throws(function () {
      window.iframe.postMessage("testMessage");
    }, TypeError, "an missing targetOrigin throws a SyntaxError");

    test.done();
  };
};

// TODO: Test that it clones the message

exports["postMessage from iframe to parent"] = function (test) {
  var html = wrapScriptInHtmlDocumentString(`
    window.iframe = document.createElement("iframe");
    window.iframe.src = "${toFileUrl("files/iframe.html")}";
    document.body.appendChild(window.iframe);
    window.addEventListener("message", function (event) {
      window.postMessageReceived = event;
    });
  `);

  var document = jsdom.jsdom(html, baseOptions);
  var window = document.defaultView;

  window.iframe.onload = function() {
    var event = window.postMessageReceived;
    test.ok(event.data === "ack");
    test.done();
  };
};

exports["postMessage an object from iframe to parent"] = function (test) {
  var html = wrapScriptInHtmlDocumentString(`
    window.iframe = document.createElement("iframe");
    // TODO: make html file names consistent:
    // iframe-sender sends to a sibling iframe, but
    // iframe-sender-object sends to parent
    // Ideally we could specify the src here
    window.iframe.src = "${toFileUrl("files/iframe-sender-object.html")}";
    document.body.appendChild(window.iframe);
    window.addEventListener("message", function (event) {
      window.postMessageReceived = event;
    });
  `);

  var document = jsdom.jsdom(html, baseOptions);
  var window = document.defaultView;

//  window.iframe.onload = function() {
  setTimeout(function () {
    var event = window.postMessageReceived;
    test.ok(typeof event.data === "object");
    test.ok(event.data.foo === "bar");
    test.done();
  }, 1e3);
};

exports["postMessage from parent to iframe"] = function (test) {
  test.expect(1);
  var html = wrapScriptInHtmlDocumentString(`
    window.iframe = document.createElement("iframe");
    window.iframe.src = "${toFileUrl("files/iframe-receiver.html")}";
    document.body.appendChild(window.iframe);
    window.iframe.onload = function () {
      window.iframe.postMessage("ack", "*");
      window.testCallback();
    };
  `);

  var document = jsdom.jsdom(html, baseOptions);
  var window = document.defaultView;

  window.testCallback = function () {
    var event = window.postMessageEvent;
    test.ok(event.data === "ack");
    test.done();
  };
};

exports["postMessage from iframe to iframe"] = function (test) {
  // TODO: either use test.expect for all or none
  test.expect(1);
  // TODO: is jsdom.jsdom inline like this easier to read? or the other way?
  var document = jsdom.jsdom(wrapScriptInHtmlDocumentString(`
    window.iframeReceiver = document.createElement("iframe");
    window.iframeReceiver.src = "${toFileUrl("files/iframe-receiver.html")}";
    document.body.appendChild(window.iframeReceiver);

    window.iframeSender = document.createElement("iframe");
    window.iframeSender.src = "${toFileUrl("files/iframe-sender.html")}";
    document.body.appendChild(window.iframeSender);

    window.onload = function () {
      window.testCallback();
    };
  `), baseOptions);
  var window = document.defaultView;

  window.testCallback = function () {
    var event = window.postMessageEvent;
    test.ok(event.data === "ack");
    test.done();
  };
};
