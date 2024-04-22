"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const BlobImpl =
  require("../lib/jsdom/living/file-api/Blob-impl.js").implementation;
const { TextDecoder } = require("util");
global.TextDecoder = TextDecoder;

describe("File-API: Blob-impl.js", () => {
  it("should return correct test from the blob", done => {
    const globalObject = {};
    const blobData = "Hello World";
    const blobPros = { type: "text/plain" };
    const blob = new BlobImpl(globalObject, [[blobData], blobPros], {});

    blob
      .text()
      .then(text => {
        assert.strictEqual(text, blobData, 'Blob text should be "Hello World"');
        done();
      })
      .catch(done);
  });
});
