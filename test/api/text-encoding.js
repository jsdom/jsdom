"use strict";
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");
const { JSDOM } = require("../..");

const testString = "Hello, World";
const testBuffer = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100]);

function equalBuffer(buf1, buf2) {
  if (buf1.byteLength !== buf2.byteLength) {
    return false;
  }
  for (let i = 0; i !== buf1.byteLength; i++) {
    if (buf1[i] !== buf2[i]) {
      return false;
    }
  }
  return true;
}

describe("API: encoding", { skipIfBrowser: true }, () => {
  it("should have encoding set to 'utf-8'", () => {
    const dom = new JSDOM();

    const { TextEncoder } = dom.window;
    const textEncoder = new TextEncoder();
    assert.strictEqual(textEncoder.encoding, "utf-8");
  });
  it("should encode correctly to Uint8Array", () => {
    const dom = new JSDOM();

    const { TextEncoder } = dom.window;
    const textEncoder = new TextEncoder();
    const buffer = textEncoder.encode(testString);
    assert.strictEqual(equalBuffer(buffer, testBuffer), true);
    assert.strictEqual(equalBuffer(buffer, new Uint8Array()), false);
  });
  it("should decode correctly from Uint8Array", () => {
    const dom = new JSDOM();

    const { TextDecoder } = dom.window;
    const textDecoder = new TextDecoder("utf-8");
    const str = textDecoder.decode(testBuffer);
    assert.strictEqual(str, testString);
    assert.notEqual(str, "testString");
  });
});
