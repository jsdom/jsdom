"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const jsdom = require("../..");
const { JSDOM } = require("../..");

function withResolvers() {
  if (Promise.withResolvers) {
    return Promise.withResolvers();
  }
  const r = {};
  // eslint-disable-next-line no-promise-executor-return
  r.promise = new Promise((resolve, reject) => Object.assign(r, { resolve, reject }));
  return r;
}

describe("API: constructor options", () => {
  describe("(general tests)", () => {
    it("should not mutate the passed-in options object", () => {
      const options = {};

      // eslint-disable-next-line no-new
      new JSDOM(``, options);

      assert.equal(Object.getOwnPropertyNames(options).length, 0);
    });
  });

  describe("referrer", () => {
    it("should allow customizing document.referrer via the referrer option", () => {
      const { document } = (new JSDOM(``, { referrer: "http://example.com/" })).window;

      assert.equal(document.referrer, "http://example.com/");
    });

    it("should throw an error when passing an invalid absolute URL for referrer", () => {
      assert.throws(() => new JSDOM(``, { referrer: "asdf" }), TypeError);
    });

    it("should canonicalize referrer URLs", () => {
      const { document } = (new JSDOM(``, { referrer: "http:example.com" })).window;

      assert.equal(document.referrer, "http://example.com/");
    });

    it("should have a default referrer URL of the empty string", () => {
      const { document } = (new JSDOM()).window;

      assert.equal(document.referrer, "");
    });
  });

  describe("url", () => {
    it("should allow customizing document URL via the url option", () => {
      const { window } = new JSDOM(``, { url: "http://example.com/" });

      assert.equal(window.location.href, "http://example.com/");
      assert.equal(window.document.URL, "http://example.com/");
      assert.equal(window.document.documentURI, "http://example.com/");
    });

    it("should throw an error when passing an invalid absolute URL for url", () => {
      assert.throws(() => new JSDOM(``, { url: "asdf" }), TypeError);
      assert.throws(() => new JSDOM(``, { url: "/" }), TypeError);
    });

    it("should canonicalize document URLs", () => {
      const { window } = new JSDOM(``, { url: "http:example.com" });

      assert.equal(window.location.href, "http://example.com/");
      assert.equal(window.document.URL, "http://example.com/");
      assert.equal(window.document.documentURI, "http://example.com/");
    });

    it("should have a default document URL of about:blank", () => {
      const { window } = new JSDOM();

      assert.equal(window.location.href, "about:blank");
      assert.equal(window.document.URL, "about:blank");
      assert.equal(window.document.documentURI, "about:blank");
    });
  });

  describe("contentType", () => {
    it("should have a default content type of text/html", () => {
      const { document } = (new JSDOM()).window;

      assert.equal(document.contentType, "text/html");
    });

    it("should allow customizing document content type via the contentType option", () => {
      const { document } = (new JSDOM(`<doc/>`, { contentType: "application/funstuff+xml" })).window;

      assert.equal(document.contentType, "application/funstuff+xml");
    });

    it("should not show content type parameters in document.contentType (HTML)", () => {
      const { document } = (new JSDOM(``, { contentType: "text/html; charset=utf8" })).window;

      assert.equal(document.contentType, "text/html");
    });

    it("should not show content type parameters in document.contentType (XML)", () => {
      const { document } = (new JSDOM(`<doc/>`, { contentType: "application/xhtml+xml; charset=utf8" })).window;

      assert.equal(document.contentType, "application/xhtml+xml");
    });

    it("should disallow content types that are unparseable", () => {
      assert.throws(() => new JSDOM(``, { contentType: "" }), Error);
      assert.throws(() => new JSDOM(``, { contentType: "html" }), Error);
      assert.throws(() => new JSDOM(``, { contentType: "text/html/xml" }), Error);
    });

    it("should disallow content types that are not XML or HTML", () => {
      assert.throws(() => new JSDOM(``, { contentType: "text/sgml" }), RangeError);
      assert.throws(() => new JSDOM(``, { contentType: "application/javascript" }), RangeError);
      assert.throws(() => new JSDOM(``, { contentType: "text/plain" }), RangeError);
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

      assert.equal(dom.cookieJar, cookieJar);
    });

    it("should reflect changes to the cookie jar in document.cookie", () => {
      const cookieJar = new jsdom.CookieJar();
      const { document } = (new JSDOM(``, { url: "https://example.com/", cookieJar })).window;

      cookieJar.setCookieSync("foo=bar", document.URL);

      assert.equal(document.cookie, "foo=bar");
    });

    it("should have loose behavior by default when using the CookieJar constructor", () => {
      const cookieJar = new jsdom.CookieJar();
      const { document } = (new JSDOM(``, { url: "https://example.com/", cookieJar })).window;

      cookieJar.setCookieSync("foo", document.URL);

      assert.equal(document.cookie, "foo");
    });

    it("should have a loose-by-default cookie jar even if none is passed", () => {
      const dom = new JSDOM(``, { url: "https://example.com/" });
      const { document } = dom.window;

      dom.cookieJar.setCookieSync("foo", document.URL);

      assert(dom.cookieJar instanceof jsdom.CookieJar);
      assert.equal(document.cookie, "foo");
    });

    // More tests in cookies.js
  });

  describe("virtualConsole", () => {
    it("should use the passed virtual console", () => {
      const virtualConsole = new jsdom.VirtualConsole();
      const dom = new JSDOM(``, { virtualConsole });

      assert.equal(dom.virtualConsole, virtualConsole);
    });

    it("should have a virtual console even if none is passed", () => {
      const dom = new JSDOM();
      assert(dom.virtualConsole instanceof jsdom.VirtualConsole);
    });
  });

  describe("beforeParse", () => {
    it("should execute with a window and document but no nodes", () => {
      let windowPassed;

      const dom = new JSDOM(``, {
        beforeParse(window) {
          assert(window instanceof window.Window);
          assert(window.document instanceof window.Document);

          assert.equal(window.document.doctype, null);
          assert.equal(window.document.documentElement, null);
          assert.equal(window.document.childNodes.length, 0);

          windowPassed = window;
        }
      });

      assert.equal(windowPassed, dom.window);
    });
  });

  describe("pretendToBeVisual", () => {
    describe("not set", () => {
      it("document should be hidden and in prerender", () => {
        const { document } = (new JSDOM(``)).window;

        assert.equal(document.hidden, true);
        assert.equal(document.visibilityState, "prerender");
      });

      it("document should not have rAF", () => {
        const { window } = new JSDOM(``);

        assert.equal(window.requestAnimationFrame, undefined);
        assert.equal(window.cancelAnimationFrame, undefined);
      });

      it("child frame document should not have rAF", () => {
        const { window } = new JSDOM(`<body></body>`);
        const frame = window.document.createElement("iframe");
        window.document.body.appendChild(frame);

        assert.equal(window.requestAnimationFrame, undefined);
        assert.equal(window.cancelAnimationFrame, undefined);
        assert.equal(frame.contentWindow.requestAnimationFrame, undefined);
        assert.equal(frame.contentWindow.cancelAnimationFrame, undefined);
      });
    });

    describe("set to true", () => {
      it("document should be not be hidden and be visible", () => {
        const { document } = (new JSDOM(``, { pretendToBeVisual: true })).window;

        assert.equal(document.hidden, false);
        assert.equal(document.visibilityState, "visible");
      });

      it("document should call rAF", () => {
        const { promise, resolve } = withResolvers();
        const { window } = new JSDOM(``, { pretendToBeVisual: true });

        window.requestAnimationFrame(() => {
          resolve();
        });
        // Further functionality tests are in web platform tests
        return promise;
      });

      it("child frame document should have rAF", () => {
        const { promise, resolve } = withResolvers();
        const { window } = new JSDOM(`<body></body>`, { pretendToBeVisual: true });
        const frame = window.document.createElement("iframe");
        window.document.body.appendChild(frame);

        frame.contentWindow.requestAnimationFrame(() => {
          resolve();
        });
        return promise;
      });
    });
  });

  describe("storageQuota", () => {
    describe("not set", () => {
      it("should be 5000000 code units by default", () => {
        const { localStorage, sessionStorage } = (new JSDOM(``, { url: "https://example.com" })).window;
        const dataWithinQuota = "0".repeat(4000000);

        localStorage.setItem("foo", dataWithinQuota);
        sessionStorage.setItem("bar", dataWithinQuota);

        assert.equal(localStorage.foo, dataWithinQuota);
        assert.equal(sessionStorage.bar, dataWithinQuota);

        const dataExceedingQuota = "0".repeat(6000000);

        assert.throws(() => localStorage.setItem("foo", dataExceedingQuota));
        assert.throws(() => sessionStorage.setItem("bar", dataExceedingQuota));
      });
    });

    describe("set to 10000 code units", () => {
      it("should only allow setting data within the custom quota", () => {
        const { localStorage, sessionStorage } = (new JSDOM(``, {
          url: "https://example.com",
          storageQuota: 10000
        })).window;
        const dataWithinQuota = "0".repeat(5);

        localStorage.setItem("foo", dataWithinQuota);
        sessionStorage.setItem("bar", dataWithinQuota);

        assert.equal(localStorage.foo, dataWithinQuota);
        assert.equal(sessionStorage.bar, dataWithinQuota);

        const dataJustWithinQuota = "0".repeat(9995);

        localStorage.foo = dataJustWithinQuota;
        sessionStorage.bar = dataJustWithinQuota;

        assert.equal(localStorage.foo, dataJustWithinQuota);
        assert.equal(sessionStorage.bar, dataJustWithinQuota);

        const dataExceedingQuota = "0".repeat(15000);

        assert.throws(() => localStorage.setItem("foo", dataExceedingQuota));
        assert.throws(() => sessionStorage.setItem("bar", dataExceedingQuota));
      });
    });

    describe("set to 10000000 code units", () => {
      it("should only allow setting data within the custom quota", () => {
        const { localStorage, sessionStorage } = (new JSDOM(``, {
          url: "https://example.com",
          storageQuota: 10000000
        })).window;
        const dataWithinQuota = "0000000000".repeat(800000);

        localStorage.someKey = dataWithinQuota;
        sessionStorage.someKey = dataWithinQuota;

        assert.equal(localStorage.someKey, dataWithinQuota);
        assert.equal(sessionStorage.someKey, dataWithinQuota);

        const dataExceedingQuota = "0000000000".repeat(1100000);

        assert.throws(() => localStorage.setItem("foo", dataExceedingQuota));
        assert.throws(() => sessionStorage.setItem("bar", dataExceedingQuota));
      });
    });
  });
});
