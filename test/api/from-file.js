"use strict";
const path = require("path");
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const { pathToFileURL } = require("url");

const { JSDOM } = require("../..");

function fixturePath(fixture) {
  return path.resolve(__dirname, "fixtures/from-file", fixture);
}

function fromFixtureFile(fixture, options) {
  return JSDOM.fromFile(fixturePath(fixture), options);
}

describe("API: JSDOM.fromFile()", () => {
  it("should return a rejected promise for a nonexistant file", () => {
    return Promise.all([
      assert.rejects(JSDOM.fromFile(undefined)),
      assert.rejects(JSDOM.fromFile("doesntexist.html"))
    ]);
  });

  it("should use the file contents of a file that exists", () => {
    return fromFixtureFile("test.html").then(dom => {
      assert.equal(dom.serialize(), `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hello</title>` +
        `</head><body><p>Hi</p>\n</body></html>`);
    });
  });

  it("should work even for Unicode main resource and subresource filenames (GH-3016)", async () => {
    const fixture = fixturePath("unicode-진 シーン-i 🥰 you.html");
    const dom = await JSDOM.fromFile(fixture, { resources: "usable" });

    await new Promise(resolve => {
      dom.window.onload = resolve;
    });

    assert.equal(dom.window.getComputedStyle(dom.window.document.querySelector("p")).color, "rgb(255, 0, 0)");
    assert.equal(dom.window.document.URL, pathToFileURL(fixture).href);
  });

  it("should properly encode # in filenames", async () => {
    const fixture = fixturePath("file#with#hash.html");
    const dom = await JSDOM.fromFile(fixture);

    assert.equal(dom.window.document.URL, pathToFileURL(fixture).href);
  });

  describe("contentType option defaulting", () => {
    it("should default to text/html Content-Type even with no file extension", () => {
      return fromFixtureFile("no-extension").then(dom => {
        assert.equal(dom.window.document.contentType, "text/html");
      });
    });

    it("should default to application/xhtml+xml Content-Type for .xhtml files", () => {
      return fromFixtureFile("xhtml.xhtml").then(dom => {
        assert.equal(dom.window.document.contentType, "application/xhtml+xml");
      });
    });

    it("should default to application/xhtml+xml Content-Type for .xht files", () => {
      return fromFixtureFile("xhtml.xht").then(dom => {
        assert.equal(dom.window.document.contentType, "application/xhtml+xml");
      });
    });

    it("should default to application/xhtml+xml Content-Type for .xml files", () => {
      return fromFixtureFile("xhtml.xml").then(dom => {
        assert.equal(dom.window.document.contentType, "application/xhtml+xml");
      });
    });

    it("should allow overriding the Content-Type for .xhtml files", () => {
      return fromFixtureFile("xhtml.xhtml", { contentType: "text/html" }).then(dom => {
        assert.equal(dom.window.document.contentType, "text/html");
      });
    });

    it("should allow overriding the Content-Type for .xht files", () => {
      return fromFixtureFile("xhtml.xht", { contentType: "text/html" }).then(dom => {
        assert.equal(dom.window.document.contentType, "text/html");
      });
    });

    it("should allow overriding the Content-Type for .xml files", () => {
      return fromFixtureFile("xhtml.xml", { contentType: "text/html" }).then(dom => {
        assert.equal(dom.window.document.contentType, "text/html");
      });
    });
  });

  describe("url option defaulting", () => {
    const testURL = pathToFileURL(path.resolve(__dirname, "fixtures/from-file/test.html")).href;

    it("should default to a file URL derived from the filename", () => {
      return fromFixtureFile("test.html").then(dom => {
        assert.equal(dom.window.document.URL, testURL);
      });
    });

    it("should allow overriding the URL", () => {
      return fromFixtureFile("test.html", { url: "https://example.com/" }).then(dom => {
        assert.equal(dom.window.document.URL, "https://example.com/");
      });
    });
  });
});
