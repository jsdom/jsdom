"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

// Tests for MessageEvent
// Spec: https://html.spec.whatwg.org/multipage/comms.html#messageevent

describe("location", () => {
  specify("MessageEvent has a read-only property 'type'", () => {
    const { window } = new JSDOM();
    const event = new window.MessageEvent("fake type");

    assert.equal(event.type, "fake type");
    assert.throws(() => {
      event.type = "oh no";
    });
  });

  specify("MessageEvent has a read-only property 'data'", () => {
    const { window } = new JSDOM();
    const event = new window.MessageEvent("fake type", {
      data: "fake data"
    });

    assert.equal(event.data, "fake data");
    assert.throws(() => {
      event.data = "oh no";
    });
  });
});
