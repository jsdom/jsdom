"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
const { injectIFrame, injectIFrameWithScript, todo } = require("../util.js");

// Tests for window.postMessage(message, targetOrigin, transfer)
// Spec: https://html.spec.whatwg.org/#crossDocumentMessages

describe("post-message", () => {
  specify("throws SyntaxError on invalid targetOrigin", t => {
    const { window } = new JSDOM();
    const { document } = window;
    const iframe = injectIFrame(document);

    window.onload = () => {
      try {
        iframe.contentWindow.postMessage("testMessage", "bogus targetOrigin");
      } catch (err) {
        assert.ok(err.name === "SyntaxError");
      }

      assert.throws(() => {
        iframe.contentWindow.postMessage("testMessage");
      }, TypeError);

      t.done();
    };
  }, {
    async: true
  });

  specify("postMessage from iframe to parent", t => {
    const { window } = new JSDOM();
    const { document } = window;
    const iframeWindow = injectIFrame(document).contentWindow;

    window.addEventListener("message", event => {
      assert.ok(event.data === "ack");
      assert.ok(event.type === "message");
      t.done();
    });

    iframeWindow.parent.postMessage("ack", "*");
  }, {
    async: true
  });

  specify("postMessage an object from iframe to parent", t => {
    const { window } = new JSDOM();
    const { document } = window;
    const iframeWindow = injectIFrame(document).contentWindow;

    window.addEventListener("message", event => {
      assert.ok(typeof event.data === "object");
      assert.ok(event.data.foo === "bar");
      assert.ok(event.type === "message");
      t.done();
    });

    iframeWindow.parent.postMessage({ foo: "bar" }, "*");
  }, {
    async: true
  });

  specify("postMessage from parent to iframe", t => {
    const { document } = (new JSDOM()).window;
    const iframeWindow = injectIFrame(document).contentWindow;

    iframeWindow.addEventListener("message", event => {
      assert.ok(event.data === "ack");
      assert.ok(event.type === "message");
      t.done();
    });

    iframeWindow.postMessage("ack", "*");
  }, {
    async: true
  });

  specify("postMessage from iframe to iframe", t => {
    const { window } = new JSDOM(``, { runScripts: "dangerously" });
    const { document } = window;

    window.iframeReceiver = injectIFrameWithScript(document, `
      window.addEventListener("message", event => {
        window.parent.postMessageEvent = event;
      });
    `);

    injectIFrameWithScript(document, `
      window.parent.iframeReceiver.contentWindow.postMessage("ack", "*");
    `);

    setTimeout(() => {
      assert.ok(window.postMessageEvent.type === "message");
      assert.ok(window.postMessageEvent.data === "ack");

      t.done();
    }, 20);
  }, {
    async: true
  });

  specify("postMessage silently rejects absolute URL targetOrigins", t => {
    const { window } = new JSDOM();
    const { document } = window;
    window.iframeReceiver = injectIFrame(document).contentWindow;
    window.iframeSender = injectIFrame(document).contentWindow;

    window.iframeReceiver.addEventListener("message", event => {
      window.iframeReceiver.parent.postMessageEvent = event;
    });

    window.iframeSender.parent.iframeReceiver.postMessage("ack", "https://github.com");

    setTimeout(() => {
      assert.ok(window.postMessageEvent === undefined);
      t.done();
    }, 0);
  }, {
    async: true
  });

  specify("postMessage respects '/' targetOrigin option", () => {
    todo(assert, tt => {
      // This would require knowledge of the source window
      // See: https://github.com/jsdom/jsdom/pull/1140#issuecomment-111587499

      const { window } = new JSDOM();
      const { document } = window;
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
  });
});
