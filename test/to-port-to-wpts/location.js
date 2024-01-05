"use strict";
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const { JSDOM } = require("../..");

describe("location", () => {
  test("window.location and document.location should be equal", () => {
    const { window } = new JSDOM();

    assert.equal(window.document.location, window.location);
  });

  test("window.location.href for a default window is about:blank", () => {
    const { window } = new JSDOM();

    assert.equal(window.location.href, "about:blank");
  });

  test("window.location.port for an about:blank window", () => {
    const { window } = new JSDOM();

    assert.equal(window.location.port, "");
  });

  test("window.location.hash is manipulable", () => {
    const { window } = new JSDOM(``, { url: "http://www.example.com/" });
    const defaultHref = window.location.href;

    assert.equal(window.location.hash, "");

    window.location.href += "#foobar";
    assert.equal(window.location.hash, "#foobar");

    window.location.hash = "#baz";
    assert.equal(window.location.hash, "#baz");
    assert.equal(window.location.href, defaultHref + "#baz");
  });

  test(
    "window.location.hash is manipulable even for about:blank (GH-1289)",
    () => {
      const { window } = new JSDOM(``, { url: "about:blank" });

      assert.equal(window.location.hash, "");

      window.location.hash = "#baz";
      assert.equal(window.location.hash, "#baz");
      assert.equal(window.location.href, "about:blank#baz");
    }
  );

  test(
    "when changing window.location.href by adding a hash, should fire a hashchange event",
    (t, done) => {
      const { window } = new JSDOM(``, { url: "http://www.example.com/" });
      window.addEventListener("hashchange", event => {
        assert.equal(event.bubbles, false);
        assert.equal(event.cancelable, false);
        assert.equal(event.oldURL, "http://www.example.com/");
        assert.equal(event.newURL, "http://www.example.com/#foo");

        assert.ok(true, "hashchange event was fired");
        done();
      });

      window.location.href += "#foo";
    }
  );

  test(
    "when changing window.location.hash directly, should fire a hashchange event",
    (t, done) => {
      const { window } = new JSDOM(``, { url: "http://www.example.com/" });
      window.addEventListener("hashchange", event => {
        assert.equal(event.bubbles, false);
        assert.equal(event.cancelable, false);
        assert.equal(event.oldURL, "http://www.example.com/");
        assert.equal(event.newURL, "http://www.example.com/#foo");

        assert.ok(true, "hashchange event was fired");
        done();
      });

      window.location.hash = "#foo";
    }
  );

  test("window.location components are correct", () => {
    const { window } = new JSDOM(``, { url: "http://www.example.com:1234/path/to/foo.txt?blahblah#hash" });

    assert.equal(window.location.href, "http://www.example.com:1234/path/to/foo.txt?blahblah#hash");
    assert.equal(window.location.origin, "http://www.example.com:1234");
    assert.equal(window.location.protocol, "http:");
    assert.equal(window.location.host, "www.example.com:1234");
    assert.equal(window.location.hostname, "www.example.com");
    assert.equal(window.location.port, "1234");
    assert.equal(window.location.pathname, "/path/to/foo.txt");
    assert.equal(window.location.search, "?blahblah");
    assert.equal(window.location.hash, "#hash");
  });
});
