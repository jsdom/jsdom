"use strict";

// Tests for window.postMessage(message, targetOrigin, transfer)
// Spec: https://html.spec.whatwg.org/#crossDocumentMessages

const jsdom = require("../..");
const injectIFrame = require("../util").injectIFrame;
const injectIFrameWithScript = require("../util").injectIFrameWithScript;
const todo = require("../util").todo;

exports["throws SyntaxError on invalid targetOrigin"] = t => {
  const document = jsdom.jsdom();
  const window = document.defaultView;
  const iframe = injectIFrame(document);

  window.onload = () => {
    t.throws(() => {
      iframe.contentWindow.postMessage("testMessage", "bogus targetOrigin");
    }, window.DOMException, "an invalid targetOrigin throws a DOMException");

    t.throws(() => {
      iframe.contentWindow.postMessage("testMessage");
    }, TypeError, "a missing targetOrigin throws a TypeError");

    t.done();
  };
};

exports["postMessage from iframe to parent"] = t => {
  const document = jsdom.jsdom();
  const window = document.defaultView;
  const iframeWindow = injectIFrame(document).contentWindow;

  window.addEventListener("message", event => {
    t.ok(event.data === "ack");
    t.ok(event.type === "message");
    t.done();
  });

  iframeWindow.parent.postMessage("ack", "*");
};

exports["postMessage an object from iframe to parent"] = t => {
  const document = jsdom.jsdom();
  const window = document.defaultView;
  const iframeWindow = injectIFrame(document).contentWindow;

  window.addEventListener("message", event => {
    t.ok(typeof event.data === "object");
    t.ok(event.data.foo === "bar");
    t.ok(event.type === "message");
    t.done();
  });

  iframeWindow.parent.postMessage({ foo: "bar" }, "*");
};

exports["postMessage from parent to iframe"] = t => {
  const document = jsdom.jsdom();
  const iframeWindow = injectIFrame(document).contentWindow;

  iframeWindow.addEventListener("message", event => {
    t.ok(event.data === "ack");
    t.ok(event.type === "message");
    t.done();
  });

  iframeWindow.postMessage("ack", "*");
};

exports["postMessage from iframe to iframe"] = t => {
  const document = jsdom.jsdom();
  const window = document.defaultView;

  window.iframeReceiver = injectIFrameWithScript(document, `
    window.addEventListener("message", event => {
      window.parent.postMessageEvent = event;
    });
  `);

  injectIFrameWithScript(document, `
    window.parent.iframeReceiver.contentWindow.postMessage("ack", "*");
  `);

  setTimeout(() => {
    t.ok(window.postMessageEvent.type === "message");
    t.ok(window.postMessageEvent.data === "ack");
    t.done();
  }, 0);
};

exports["postMessage silently rejects absolute URL targetOrigins"] = t => {
  const document = jsdom.jsdom();
  const window = document.defaultView;
  window.iframeReceiver = injectIFrame(document).contentWindow;
  window.iframeSender = injectIFrame(document).contentWindow;

  window.iframeReceiver.addEventListener("message", event => {
    window.iframeReceiver.parent.postMessageEvent = event;
  });

  window.iframeSender.parent.iframeReceiver.postMessage("ack", "https://github.com");

  setTimeout(() => {
    t.ok(window.postMessageEvent === undefined);
    t.done();
  }, 0);
};

exports["postMessage respects '/' targetOrigin option"] = t => {
  todo(t, tt => {
    // This would require knowledge of the source window
    // See: https://github.com/tmpvar/jsdom/pull/1140#issuecomment-111587499

    const document = jsdom.jsdom();
    const window = document.defaultView;
    window.iframeReceiver = injectIFrame(document);

    window.iframeReceiver.addEventListener("message", event => {
      tt.ok(event.type === "message");
      tt.ok(event.data === "ack");
      tt.done();
    });

    injectIFrameWithScript(document, `
      window.parent.iframeReceiver.contentWindow.postMessage("ack", "/");
    `);
  });
  t.done();
};
