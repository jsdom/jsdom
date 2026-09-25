"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const { JSDOM } = require("../..");

function read(window, url) {
  const xhr = new window.XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send();
  return xhr.responseText;
}

describe("blob URLs", () => {
  for (const localName of ["a", "area"]) {
    it(`preserves ${localName}.origin for an FTP blob URL after revocation`, () => {
      const { window } = new JSDOM("", { url: "ftp://example.org/" });
      try {
        const url = window.URL.createObjectURL(new window.Blob(["contents"]));
        const element = window.document.createElement(localName);
        element.href = url;
        assert.equal(element.origin, "ftp://example.org");

        window.URL.revokeObjectURL(url);
        assert.equal(element.origin, "ftp://example.org");
      } finally {
        window.close();
      }
    });
  }

  it("preserves location.origin for an FTP blob URL after revocation", async () => {
    const creator = new JSDOM("", { url: "ftp://example.org/" });
    let loaded;
    try {
      const url = creator.window.URL.createObjectURL(new creator.window.Blob(["<p>contents</p>"], {
        type: "text/html"
      }));
      loaded = await JSDOM.fromURL(url);
      assert.equal(loaded.window.location.origin, "ftp://example.org");

      creator.window.URL.revokeObjectURL(url);
      assert.equal(loaded.window.location.origin, "ftp://example.org");
    } finally {
      creator.window.close();
      if (loaded) {
        loaded.window.close();
      }
    }
  });

  it("shares URLs between same-origin JSDOM instances and cleans up the creating window", () => {
    const first = new JSDOM("", { url: "https://example.org/" });
    const second = new JSDOM("", { url: "https://example.org/" });
    try {
      const url = first.window.URL.createObjectURL(new first.window.Blob(["contents"]));
      assert.equal(read(second.window, url), "contents");
      first.window.close();
      assert.throws(() => read(second.window, url), { name: "NetworkError" });
    } finally {
      first.window.close();
      second.window.close();
    }
  });

  it("isolates opaque origins while sharing an about:blank iframe's inherited origin", () => {
    const first = new JSDOM("<iframe></iframe>");
    const second = new JSDOM();
    try {
      const url = first.window.URL.createObjectURL(new first.window.Blob(["contents"]));
      assert.equal(read(first.window.frames[0], url), "contents");
      assert.throws(() => read(second.window, url), { name: "NetworkError" });
      second.window.URL.revokeObjectURL(url);
      assert.equal(read(first.window, url), "contents");
    } finally {
      first.window.close();
      second.window.close();
    }
  });

  it("loads a blob document through JSDOM.fromURL", async () => {
    const creator = new JSDOM("", { url: "https://example.org/" });
    let loaded;
    try {
      const url = creator.window.URL.createObjectURL(new creator.window.Blob(["<p>contents</p>"], {
        type: "text/html"
      }));
      loaded = await JSDOM.fromURL(url);
      assert.equal(loaded.window.document.querySelector("p").textContent, "contents");
      assert.equal(loaded.window.origin, creator.window.origin);
    } finally {
      creator.window.close();
      if (loaded) {
        loaded.window.close();
      }
    }
  });

  it("retains the opaque origin when a fromURL request's blob URL is revoked", async () => {
    const creator = new JSDOM();
    let loaded;
    try {
      const contentsURL = creator.window.URL.createObjectURL(new creator.window.Blob(["contents"]));
      const documentURL = creator.window.URL.createObjectURL(new creator.window.Blob(["<p>document</p>"], {
        type: "text/html"
      }));
      const loading = JSDOM.fromURL(documentURL, {
        beforeParse(window) {
          assert.equal(read(window, contentsURL), "contents");
        }
      });
      creator.window.URL.revokeObjectURL(documentURL);
      loaded = await loading;
      assert.equal(loaded.window.document.querySelector("p").textContent, "document");
      assert.equal(read(loaded.window, contentsURL), "contents");
    } finally {
      creator.window.close();
      if (loaded) {
        loaded.window.close();
      }
    }
  });
});
