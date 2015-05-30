"use strict";

// Tests for window.postMessage(message, targetOrigin, transfer)
// Spec: https://html.spec.whatwg.org/#crossDocumentMessages

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
    FetchExternalResources: ["script", "iframe"],
    ProcessExternalResources: ["script", "iframe"]
  }
};

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
    }, TypeError, "an missing targetOrigin throws a TypeError");

    test.done();
  };
};

// TODO: Test that it clones the message

exports["postMessage from iframe to parent"] = function (test) {
  var window = jsdom.jsdomwrapScriptInHtmlDocumentString(`
    window.iframe = document.createElement("iframe");
    window.iframe.src = "${toFileUrl("files/iframe.html")}";
    document.body.appendChild(window.iframe);
    window.addEventListener("message", function (event) {
      window.postMessageReceived = event;
    });
  `).defaultView;

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
  var window = jsdom.jsdom(wrapScriptInHtmlDocumentString(`
    window.iframe = document.createElement("iframe");
    window.iframe.src = "${toFileUrl("files/iframe-receiver.html")}";
    document.body.appendChild(window.iframe);
    window.iframe.onload = function () {
      window.iframe.postMessage("ack", "*");
      window.testCallback();
    };
  `).defaultView;

  window.testCallback = function () {
    var event = window.postMessageEvent;
    test.ok(event.data === "ack");
    test.done();
  };
};

exports["postMessage from iframe to iframe ficus"] = function (test) {
  var window = jsdom.jsdom(wrapScriptInHtmlDocumentString(`
    window.iframeReceiver = document.createElement("iframe");
    window.iframeReceiver.src = "${toFileUrl("files/iframe-receiver.html")}";
    document.body.appendChild(window.iframeReceiver);

    window.iframeSender = document.createElement("iframe");
    window.iframeSender.src = "${toFileUrl("files/iframe-sender.html")}";
    document.body.appendChild(window.iframeSender);

    window.onload = function () {
      window.testCallback();
    };
  `), baseOptions).defaultView;

  window.testCallback = function () {
    var event = window.postMessageEvent;
    test.ok(event.data === "ack");
    test.done();
  };
};

exports["postMessage only distributes to specified targetOrigin  dingus"] = function (test) {

jsdom.env({
  file: __dirname+"/files/test-root.html",
  features: {
    FetchExternalResources: ["script", "iframe"],
    ProcessExternalResources: ["script", "iframe"]
  },
  done: function (errors, window) {
    if (errors) {
      return console.error(errors);
    }
    var document = window.document;

    window.iframeReceiver = document.createElement("iframe");
    window.iframeReceiver.src = toFileUrl("files/iframe-receiver.html");
    document.body.appendChild(window.iframeReceiver);

    window.iframeSender = document.createElement("iframe");
    window.iframeSender.src = toFileUrl("files/iframe-sender-root-origin.html");
    document.body.appendChild(window.iframeSender);

    setTimeout(function () {
      var frameEvent = console.log(window.postMessageEvent);
      var rootEvent = console.log(window.rootEvent);
//      test.ok(rootEvent.data === "ack");
//      test.ok(frameEvent === null);
      test.done();
    }, 1e3);
  }
});
/*

  var document = jsdom.jsdom(wrapScriptInHtmlDocumentString(`
    window.iframeReceiver = document.createElement("iframe");
    window.iframeReceiver.src = "${toFileUrl("files/iframe-receiver.html")}";
    document.body.appendChild(window.iframeReceiver);

    window.iframeSender = document.createElement("iframe");
    window.iframeSender.src = "${toFileUrl("files/iframe-sender-root-origin.html")}";
    document.body.appendChild(window.iframeSender);

    window.addEventListener("message", function (event) {
      window.rootPostMessageEvent = event;
    });

    window.onload = function () {
      window.testCallback();
    };
  `), baseOptions);
  var window = document.defaultView;

  window.testCallback = function () {
    var rootEvent = window.rootPostMessageEvent;
    var frameEvent = window.postMessageEvent;
    test.ok(rootEvent.data === "ack");
    test.ok(frameEvent === null);
    test.done();
  };
*/
};
