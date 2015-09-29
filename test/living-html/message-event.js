"use strict";
const jsdom = require("../..");

// Tests for MessageEvent
// Spec: https://html.spec.whatwg.org/multipage/comms.html#messageevent

exports["MessageEvent has a read-only property 'type'"] = t => {
  const window = jsdom.jsdom().defaultView;
  const event = new window.MessageEvent("fake type");

  t.equals(event.type, "fake type");
  t.throws(() => {
    event.type = "oh no";
  });

  t.done();
};

exports["MessageEvent has a read-only property 'data'"] = t => {
  const window = jsdom.jsdom().defaultView;
  const event = new window.MessageEvent("fake type", {
    data: "fake data"
  });

  t.equals(event.data, "fake data");
  t.throws(() => {
    event.data = "oh no";
  });

  t.done();
};
