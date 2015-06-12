"use strict";

// Tests for window.postMessage(message, targetOrigin, transfer)
// Spec: https://html.spec.whatwg.org/#crossDocumentMessages

const jsdom = require("../..");
const injectIFrame = require("../util").injectIFrame;
const injectIFrameWithScript = require("../util").injectIFrameWithScript;
const DOMException = require("../../lib/jsdom/web-idl/DOMException");

exports["throws SyntaxError on invalid targetOrigin"] = function (t) {
  const document = jsdom.jsdom();
  const window = document.defaultView;
  const iframe = injectIFrameWithScript(document);

  window.onload = function () {
    t.throws(function () {
      iframe.contentWindow.postMessage("testMessage", "bogus targetOrigin");
    }, DOMException, "an invalid targetOrigin throws a DOMException");

    t.throws(function () {
      iframe.contentWindow.postMessage("testMessage");
    }, TypeError, "an missing targetOrigin throws a TypeError");

    t.done();
  };
};

exports["postMessage from iframe to parent"] = function (t) {
  const document = jsdom.jsdom();
  const window = document.defaultView;
  const iframeWindow = injectIFrame(document).contentWindow;

  window.addEventListener("message", function (event) {
    t.ok(event.data === "ack");
    t.done();
  });

  iframeWindow.parent.postMessage("ack", "*");
};

exports["postMessage an object from iframe to parent"] = function (t) {
  const document = jsdom.jsdom();
  const window = document.defaultView;
  const iframeWindow = injectIFrame(document).contentWindow;

  window.addEventListener("message", function (event) {
    t.ok(typeof event.data === "object");
    t.ok(event.data.foo === "bar");
    t.done();
  });

  iframeWindow.parent.postMessage({foo: "bar"}, "*");
};

exports["postMessage from parent to iframe"] = function (t) {
  const document = jsdom.jsdom();
  const window = document.defaultView;
  const iframeWindow = injectIFrame(document).contentWindow;

  iframeWindow.addEventListener("message", function (event) {
    t.ok(event.data === "ack");
    t.done();
  });

  iframeWindow.postMessage("ack", "*");
};

exports["postMessage from iframe to iframe"] = function (t) {
  const document = jsdom.jsdom();
  const window = document.defaultView;

  window.iframeReceiver = injectIFrameWithScript(document, `
    window.addEventListener("message", function (event) {
      window.parent.postMessageEvent = event;
    });
  `);

  injectIFrameWithScript(document, `
    window.parent.iframeReceiver.contentWindow.postMessage("ack", "*");
  `);

  setImmediate(function () {
    t.ok(window.postMessageEvent.data === "ack");
    t.done();
  });
};

exports["postMessage silently rejects absolute URL targetOrigins"] = function (t) {
  const document = jsdom.jsdom();
  const window = document.defaultView;
  window.iframeReceiver = injectIFrame(document).contentWindow;
  window.iframeSender = injectIFrame(document).contentWindow;

  window.iframeReceiver.addEventListener("message", function (event) {
    window.iframeReceiver.parent.postMessageEvent = event;
  });

  window.iframeSender.parent.iframeReceiver.postMessage("ack", "https://github.com");

  setImmediate(function () {
    t.ok(window.postMessageEvent === undefined);
    t.done();
  });
};

/*
// TODO: Figure out how to get origin to enable '/'
exports["postMessage respects '/' targetOrigin option"] = function (t) {
  const document = jsdom.jsdom();
  const window = document.defaultView;

  window.iframeReceiver = injectIFrameWithScript(document, `
    window.addEventListener("message", function (event) {
      window.parent.postMessageEvent = event;
    });
  `);

  injectIFrameWithScript(document, `
    window.parent.iframeReceiver.contentWindow.postMessage("ack", "/");
  `);

  window.onload = function () {
    t.ok(window.postMessageEvent.data === "ack");
    t.done();
  };
};
*/
