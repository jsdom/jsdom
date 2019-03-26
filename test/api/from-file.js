"use strict";
const path = require("path");
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

require("chai").use(require("../chai-helpers.js"));

function fromFixtureFile(fixture, options) {
  return JSDOM.fromFile(path.resolve(__dirname, "fixtures/from-file", fixture), options);
}

describe("API: JSDOM.fromFile()", { skipIfBrowser: true }, () => {
  it("should return a rejected promise for a nonexistant file", () => {
    return Promise.all([
      assert.isRejected(JSDOM.fromFile(undefined)),
      assert.isRejected(JSDOM.fromFile("doesntexist.html"))
    ]);
  });

  it("should use the file contents of a file that exists", () => {
    return fromFixtureFile("test.html").then(dom => {
      assert.strictEqual(dom.serialize(), `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hello</title>` +
        `</head><body><p>Hi</p>\n</body></html>`);
    });
  });

  describe("contentType option defaulting", () => {
    it("should default to text/html Content-Type even with no file extension", () => {
      return fromFixtureFile("no-extension").then(dom => {
        assert.strictEqual(dom.window.document.contentType, "text/html");
      });
    });

    it("should default to application/xhtml+xml Content-Type for .xhtml files", () => {
      return fromFixtureFile("xhtml.xhtml").then(dom => {
        assert.strictEqual(dom.window.document.contentType, "application/xhtml+xml");
      });
    });

    it("should default to application/xhtml+xml Content-Type for .xht files", () => {
      return fromFixtureFile("xhtml.xht").then(dom => {
        assert.strictEqual(dom.window.document.contentType, "application/xhtml+xml");
      });
    });

    it("should default to application/xhtml+xml Content-Type for .xml files", () => {
      return fromFixtureFile("xhtml.xml").then(dom => {
        assert.strictEqual(dom.window.document.contentType, "application/xhtml+xml");
      });
    });

    it("should allow overriding the Content-Type for .xhtml files", () => {
      return fromFixtureFile("xhtml.xhtml", { contentType: "text/html" }).then(dom => {
        assert.strictEqual(dom.window.document.contentType, "text/html");
      });
    });

    it("should allow overriding the Content-Type for .xht files", () => {
      return fromFixtureFile("xhtml.xht", { contentType: "text/html" }).then(dom => {
        assert.strictEqual(dom.window.document.contentType, "text/html");
      });
    });

    it("should allow overriding the Content-Type for .xml files", () => {
      return fromFixtureFile("xhtml.xml", { contentType: "text/html" }).then(dom => {
        assert.strictEqual(dom.window.document.contentType, "text/html");
      });
    });
  });

  describe("url option defaulting", () => {
    // Manually construct it as much as possible to avoid logic in the tests
    let pathWithLeadingSlash = path.resolve(__dirname);
    if (!pathWithLeadingSlash.startsWith("/")) {
      pathWithLeadingSlash = "/" + pathWithLeadingSlash;
    }
    const testURL = "file://" + pathWithLeadingSlash.replace(/\\/g, "/") + "/fixtures/from-file/test.html";

    it("should default to a file URL derived from the filename", () => {
      return fromFixtureFile("test.html").then(dom => {
        assert.strictEqual(dom.window.document.URL, testURL);
      });
    });

    it("should allow overriding the URL", () => {
      return fromFixtureFile("test.html", { url: "https://example.com/" }).then(dom => {
        assert.strictEqual(dom.window.document.URL, "https://example.com/");
      });
    });
  });
});
