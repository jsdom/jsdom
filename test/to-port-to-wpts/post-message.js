"use strict";
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const { JSDOM } = require("../..");
const { injectIFrame, injectIFrameWithScript } = require("../util.js");

// Tests for window.postMessage(message, targetOrigin, transfer)
// Spec: https://html.spec.whatwg.org/#crossDocumentMessages

describe("post-message", () => {
  test("throws SyntaxError on invalid targetOrigin", (t, done) => {
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

      done();
    };
  });

  test("postMessage from iframe to parent", (t, done) => {
    const { window } = new JSDOM();
    const { document } = window;
    const iframeWindow = injectIFrame(document).contentWindow;

    window.addEventListener("message", event => {
      assert.ok(event.data === "ack");
      assert.ok(event.type === "message");
      done();
    });

    iframeWindow.parent.postMessage("ack", "*");
  });

  test("postMessage an object from iframe to parent", (t, done) => {
    const { window } = new JSDOM();
    const { document } = window;
    const iframeWindow = injectIFrame(document).contentWindow;

    window.addEventListener("message", event => {
      assert.ok(typeof event.data === "object");
      assert.ok(event.data.foo === "bar");
      assert.ok(event.type === "message");
      done();
    });

    iframeWindow.parent.postMessage({ foo: "bar" }, "*");
  });

  test("postMessage from parent to iframe", (t, done) => {
    const { document } = (new JSDOM()).window;
    const iframeWindow = injectIFrame(document).contentWindow;

    iframeWindow.addEventListener("message", event => {
      assert.ok(event.data === "ack");
      assert.ok(event.type === "message");
      done();
    });

    iframeWindow.postMessage("ack", "*");
  });

  test("postMessage from iframe to iframe", (t, done) => {
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

      done();
    }, 20);
  });

  test("postMessage silently rejects absolute URL targetOrigins", (t, done) => {
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
      done();
    }, 0);
  });
});
