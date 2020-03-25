"use strict";
const fs = require("fs");
const path = require("path");
const { assert } = require("chai");
const { describe, it, before, after } = require("mocha-sugar-free");
const { createServer } = require("../util.js");

const { JSDOM } = require("../..");

function fixturePath(fixture) {
  return path.resolve(__dirname, "fixtures/encoding", fixture);
}

function readFixture(fixture) {
  return fs.promises.readFile(fixturePath(fixture));
}

const factories = {
  Buffer: fixture => readFixture(fixture),
  Uint8Array: fixture => readFixture(fixture).then(buffer => Uint8Array.from(buffer)),
  ArrayBuffer: fixture => readFixture(fixture).then(buffer => Uint8Array.from(buffer).buffer),
  DataView: fixture => readFixture(fixture).then(buffer =>
    new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)),
  Int8Array: fixture => readFixture(fixture).then(buffer => {
    // Test a view that is indexing into a larger ArrayBuffer. (buffer may already be such a view, but make sure we
    // test at least one in case it's not.)
    const target = new Int8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const bigger = new Int8Array([0, 0, 0, ...target, 0, 0, 0]);
    const subView = new Int8Array(bigger.buffer, 3, buffer.byteLength);

    return subView;
  })
};

const encodingFixtures = {
  "no-bom-charset-http-equiv-no-quotes.html": {
    name: "ISO-8859-5",
    nameWhenOverridden: "ISO-8859-8",
    body: "Ђ",
    bodyWhenOverridden: "¢"
  },
  "no-bom-charset-http-equiv-tis-620.html": {
    name: "windows-874",
    nameWhenOverridden: "ISO-8859-8",
    body: "ข",
    bodyWhenOverridden: "¢"
  },
  "no-bom-charset-koi8.html": {
    name: "KOI8-R",
    nameWhenOverridden: "ISO-8859-8",
    body: "╒",
    bodyWhenOverridden: "¢"
  },
  "no-bom-charset-utf-16.html": {
    name: "UTF-8",
    nameWhenOverridden: "ISO-8859-8",
    body: "Є"
  },
  "no-bom-charset-utf-16be.html": {
    name: "UTF-8",
    nameWhenOverridden: "ISO-8859-8",
    body: "Є"
  },
  "no-bom-charset-utf-16le.html": {
    name: "UTF-8",
    nameWhenOverridden: "ISO-8859-8",
    body: "Є"
  },
  "no-bom-no-charset.html": {
    name: "windows-1252",
    nameWhenOverridden: "ISO-8859-8",
    body: "®"
  },
  "utf-8-bom.html": {
    name: "UTF-8",
    nameWhenOverridden: "UTF-8",
    body: "Є",
    bodyWhenOverridden: "Є"
  },
  "utf-16be-bom.html": {
    name: "UTF-16BE",
    nameWhenOverridden: "UTF-16BE",
    body: "Є",
    bodyWhenOverridden: "Є"
  },
  "utf-16le-bom.html": {
    name: "UTF-16LE",
    nameWhenOverridden: "UTF-16LE",
    body: "Є",
    bodyWhenOverridden: "Є"
  }
};

describe("API: encoding detection", () => {
  describe("constructor, given a string", () => {
    it("should default to UTF-8 when passing a string", () => {
      const dom = new JSDOM("©");

      assert.strictEqual(dom.window.document.characterSet, "UTF-8");
      assert.strictEqual(dom.window.document.body.textContent, "©");
    });

    it("should default to UTF-8 when passing nothing", () => {
      const dom = new JSDOM();

      assert.strictEqual(dom.window.document.characterSet, "UTF-8");
      assert.strictEqual(dom.window.document.body.textContent, "");
    });

    it("should default to UTF-8 when passing null", () => {
      const dom = new JSDOM(null);

      assert.strictEqual(dom.window.document.characterSet, "UTF-8");
      assert.strictEqual(dom.window.document.body.textContent, "null");
    });
  });

  describe("constructor, given binary data", { skipIfBrowser: true }, () => {
    describe("with no contentType option given", () => {
      for (const binaryDataType of Object.keys(factories)) {
        const factory = factories[binaryDataType];

        describe(binaryDataType, () => {
          for (const encodingFixture of Object.keys(encodingFixtures)) {
            const { name, body } = encodingFixtures[encodingFixture];

            it(`should sniff ${encodingFixture} as ${name}`, () => {
              return factory(encodingFixture).then(binaryData => {
                assert.strictEqual(
                  binaryData.constructor.name, binaryDataType,
                  "Sanity check: input binary data must be of the right type"
                );

                const dom = new JSDOM(binaryData);

                assert.strictEqual(dom.window.document.characterSet, name);
                assert.strictEqual(dom.window.document.body.textContent, body);
              });
            });
          }
        });
      }
    });

    describe("with a contentType option specifying csiso88598e", () => {
      for (const binaryDataType of Object.keys(factories)) {
        const factory = factories[binaryDataType];

        describe(binaryDataType, () => {
          for (const encodingFixture of Object.keys(encodingFixtures)) {
            const { nameWhenOverridden, bodyWhenOverridden } = encodingFixtures[encodingFixture];

            it(`should sniff ${encodingFixture} as ${nameWhenOverridden}`, () => {
              return factory(encodingFixture).then(binaryData => {
                assert.strictEqual(
                  binaryData.constructor.name, binaryDataType,
                  "Sanity check: input binary data must be of the right type"
                );

                const dom = new JSDOM(binaryData, { contentType: "text/html;charset=csiso88598e" });

                assert.strictEqual(dom.window.document.characterSet, nameWhenOverridden);
                assert.strictEqual(dom.window.document.contentType, "text/html"); // encoding should be stripped

                if (bodyWhenOverridden) {
                  assert.strictEqual(dom.window.document.body.textContent, bodyWhenOverridden);
                }
              });
            });
          }
        });
      }
    });
  });

  describe("fromFile", { skipIfBrowser: true }, () => {
    for (const encodingFixture of Object.keys(encodingFixtures)) {
      const { name, body } = encodingFixtures[encodingFixture];

      it(`should sniff ${encodingFixture} as ${name}`, () => {
        return JSDOM.fromFile(fixturePath(encodingFixture)).then(dom => {
          assert.strictEqual(dom.window.document.characterSet, name);
          assert.strictEqual(dom.window.document.body.textContent, body);
        });
      });
    }
  });

  describe("fromURL", { skipIfBrowser: true }, () => {
    let server;
    let host;
    before(() => {
      return createServer((req, res) => {
        const [, fixture, query] = /^\/([^?]+)(\?.*)?$/.exec(req.url);

        const headers = { "Content-Type": "text/html" };
        if (query === "?charset=csiso88598e") {
          headers["Content-Type"] = "text/html;charset=csiso88598e";
        }

        res.writeHead(200, headers);
        fs.createReadStream(fixturePath(fixture)).pipe(res);
      }).then(s => {
        server = s;
        host = `http://127.0.0.1:${s.address().port}`;
      });
    });

    after(() => server.destroy());

    describe("with no Content-Type header given", () => {
      for (const encodingFixture of Object.keys(encodingFixtures)) {
        const { name, body } = encodingFixtures[encodingFixture];

        it(`should sniff ${encodingFixture} as ${name}`, () => {
          return JSDOM.fromURL(`${host}/${encodingFixture}`).then(dom => {
            assert.strictEqual(dom.window.document.characterSet, name);
            assert.strictEqual(dom.window.document.body.textContent, body);
          });
        });
      }
    });

    describe("with a Content-Type header specifying csiso88598e", () => {
      for (const encodingFixture of Object.keys(encodingFixtures)) {
        const { nameWhenOverridden, bodyWhenOverridden } = encodingFixtures[encodingFixture];

        it(`should sniff ${encodingFixture} as ${nameWhenOverridden}`, () => {
          return JSDOM.fromURL(`${host}/${encodingFixture}?charset=csiso88598e`).then(dom => {
            assert.strictEqual(dom.window.document.characterSet, nameWhenOverridden);
            assert.strictEqual(dom.window.document.contentType, "text/html"); // encoding should be stripped

            if (bodyWhenOverridden) {
              assert.strictEqual(dom.window.document.body.textContent, bodyWhenOverridden);
            }
          });
        });
      }
    });
  });
});
