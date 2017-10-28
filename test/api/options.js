"use strict";
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");

const jsdom = require("../..");
const { JSDOM } = require("../..");
const { version: packageVersion } = require("../../package.json");

describe("API: constructor options", () => {
  describe("referrer", () => {
    it("should allow customizing document.referrer via the referrer option", () => {
      const { document } = (new JSDOM(``, { referrer: "http://example.com/" })).window;

      assert.strictEqual(document.referrer, "http://example.com/");
    });

    it("should throw an error when passing an invalid absolute URL for referrer", () => {
      assert.throws(() => new JSDOM(``, { referrer: "asdf" }), TypeError);
    });

    it("should canonicalize referrer URLs", () => {
      const { document } = (new JSDOM(``, { referrer: "http:example.com" })).window;

      assert.strictEqual(document.referrer, "http://example.com/");
    });

    it("should have a default referrer URL of the empty string", () => {
      const { document } = (new JSDOM()).window;

      assert.strictEqual(document.referrer, "");
    });
  });

  describe("url", () => {
    it("should allow customizing document URL via the url option", () => {
      const { window } = new JSDOM(``, { url: "http://example.com/" });

      assert.strictEqual(window.location.href, "http://example.com/");
      assert.strictEqual(window.document.URL, "http://example.com/");
      assert.strictEqual(window.document.documentURI, "http://example.com/");
    });

    it("should throw an error when passing an invalid absolute URL for url", () => {
      assert.throws(() => new JSDOM(``, { url: "asdf" }), TypeError);
      assert.throws(() => new JSDOM(``, { url: "/" }), TypeError);
    });

    it("should canonicalize document URLs", () => {
      const { window } = new JSDOM(``, { url: "http:example.com" });

      assert.strictEqual(window.location.href, "http://example.com/");
      assert.strictEqual(window.document.URL, "http://example.com/");
      assert.strictEqual(window.document.documentURI, "http://example.com/");
    });

    it("should have a default document URL of about:blank", () => {
      const { window } = new JSDOM();

      assert.strictEqual(window.location.href, "about:blank");
      assert.strictEqual(window.document.URL, "about:blank");
      assert.strictEqual(window.document.documentURI, "about:blank");
    });
  });

  describe("contentType", () => {
    it("should have a default content type of text/html", () => {
      const { document } = (new JSDOM()).window;

      assert.strictEqual(document.contentType, "text/html");
    });

    it("should allow customizing document content type via the contentType option", () => {
      const { document } = (new JSDOM(``, { contentType: "application/funstuff+xml" })).window;

      assert.strictEqual(document.contentType, "application/funstuff+xml");
    });

    it("should not show content type parameters in document.contentType (HTML)", () => {
      const { document } = (new JSDOM(``, { contentType: "text/html; charset=utf8" })).window;

      assert.strictEqual(document.contentType, "text/html");
    });

    it("should not show content type parameters in document.contentType (XML)", () => {
      const { document } = (new JSDOM(``, { contentType: "application/xhtml+xml; charset=utf8" })).window;

      assert.strictEqual(document.contentType, "application/xhtml+xml");
    });

    it("should disallow content types that are unparseable", () => {
      assert.throws(() => new JSDOM(``, { contentType: "" }), TypeError);
      assert.throws(() => new JSDOM(``, { contentType: "html" }), TypeError);
      assert.throws(() => new JSDOM(``, { contentType: "text/html/xml" }), TypeError);
    });

    it("should disallow content types that are not XML or HTML", () => {
      assert.throws(() => new JSDOM(``, { contentType: "text/sgml" }), RangeError);
      assert.throws(() => new JSDOM(``, { contentType: "application/javascript" }), RangeError);
      assert.throws(() => new JSDOM(``, { contentType: "text/plain" }), RangeError);
    });
  });

  describe("userAgent", () => {
    it("should have a default user agent following the correct pattern", () => {
      const expected = `Mozilla/5.0 (${process.platform}) AppleWebKit/537.36 ` +
                       `(KHTML, like Gecko) jsdom/${packageVersion}`;

      const dom = new JSDOM();
      assert.strictEqual(dom.window.navigator.userAgent, expected);
    });

    it("should set the user agent to the given value", () => {
      const dom = new JSDOM(``, { userAgent: "test user agent" });
      assert.strictEqual(dom.window.navigator.userAgent, "test user agent");
    });
  });

  describe("includeNodeLocations", () => {
    it("should throw when set to true alongside an XML content type", () => {
      assert.throws(() => new JSDOM(``, {
        includeNodeLocations: true,
        contentType: "application/xhtml+xml"
      }));
    });

    // mostly tested by nodeLocation() tests in ./methods.js
  });

  describe("cookieJar", () => {
    it("should use the passed cookie jar", () => {
      const cookieJar = new jsdom.CookieJar();
      const dom = new JSDOM(``, { cookieJar });

      assert.strictEqual(dom.cookieJar, cookieJar);
    });

    it("should reflect changes to the cookie jar in document.cookie", () => {
      const cookieJar = new jsdom.CookieJar();
      const { document } = (new JSDOM(``, { cookieJar })).window;

      cookieJar.setCookieSync("foo=bar", document.URL);

      assert.strictEqual(document.cookie, "foo=bar");
    });

    it("should have loose behavior by default when using the CookieJar constructor", () => {
      const cookieJar = new jsdom.CookieJar();
      const { document } = (new JSDOM(``, { cookieJar })).window;

      cookieJar.setCookieSync("foo", document.URL);

      assert.strictEqual(document.cookie, "foo");
    });

    it("should have a loose-by-default cookie jar even if none is passed", () => {
      const dom = new JSDOM();
      const { document } = dom.window;

      dom.cookieJar.setCookieSync("foo", document.URL);

      assert.instanceOf(dom.cookieJar, jsdom.CookieJar);
      assert.strictEqual(document.cookie, "foo");
    });
  });

  describe("virtualConsole", () => {
    it("should use the passed virtual console", () => {
      const virtualConsole = new jsdom.VirtualConsole();
      const dom = new JSDOM(``, { virtualConsole });

      assert.strictEqual(dom.virtualConsole, virtualConsole);
    });

    it("should have a virtual console even if none is passed", () => {
      const dom = new JSDOM();
      assert.instanceOf(dom.virtualConsole, jsdom.VirtualConsole);
    });
  });

  describe("beforeParse", () => {
    it("should execute with a window and document but no nodes", () => {
      let windowPassed;

      const dom = new JSDOM(``, {
        beforeParse(window) {
          assert.instanceOf(window, window.Window);
          assert.instanceOf(window.document, window.Document);

          assert.strictEqual(window.document.doctype, null);
          assert.strictEqual(window.document.documentElement, null);
          assert.strictEqual(window.document.childNodes.length, 0);

          windowPassed = window;
        }
      });

      assert.strictEqual(windowPassed, dom.window);
    });

    it("should not have built-ins on the window by default", () => {
      let windowPassed;

      const dom = new JSDOM(``, {
        beforeParse(window) {
          assert.strictEqual(window.Array, undefined);

          windowPassed = window;
        }
      });

      assert.strictEqual(windowPassed, dom.window);
    });

    it("should have built-ins on the window when running scripts outside-only", () => {
      let windowPassed;

      const dom = new JSDOM(``, {
        runScripts: "outside-only",
        beforeParse(window) {
          assert.typeOf(window.Array, "function");

          windowPassed = window;
        }
      });

      assert.strictEqual(windowPassed, dom.window);
    });

    it("should have built-ins on the window when running scripts dangerously", () => {
      let windowPassed;

      const dom = new JSDOM(``, {
        runScripts: "dangerously",
        beforeParse(window) {
          assert.typeOf(window.Array, "function");

          windowPassed = window;
        }
      });

      assert.strictEqual(windowPassed, dom.window);
    });
  });

  describe("pretendToBeVisual", () => {
    describe("not set", () => {
      it("document should be hidden and in prerender", () => {
        const { document } = (new JSDOM(``)).window;

        assert.strictEqual(document.hidden, true);
        assert.strictEqual(document.visibilityState, "prerender");
      });

      it("document should not have rAF", () => {
        const { window } = new JSDOM(``);

        assert.isUndefined(window.requestAnimationFrame);
        assert.isUndefined(window.cancelAnimationFrame);
      });
    });

    describe("set to true", () => {
      it("document should be not be hidden and be visible", () => {
        const { document } = (new JSDOM(``, { pretendToBeVisual: true })).window;

        assert.strictEqual(document.hidden, false);
        assert.strictEqual(document.visibilityState, "visible");
      });

      it("document should call rAF", { async: true }, context => {
        const { window } = new JSDOM(``, { pretendToBeVisual: true });

        window.requestAnimationFrame(() => {
          context.done();
        });

        // Further functionality tests are in web platform tests
      });
    });
  });
});
