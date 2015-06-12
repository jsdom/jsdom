"use strict";

// Tests for MessageEvent
// Spec: https://html.spec.whatwg.org/multipage/comms.html#messageevent

const MessageEvent = require("../../lib/jsdom/living/messageevent");

// TODO: Inherits from Event

exports["MessageEvent has a read-only property 'type'"] = function (t) {
  const event = new MessageEvent("fake type");

  t.equals(event.type, "fake type");
  t.throws(function () {
    event.type = "oh no";
  });

  t.done();
};

exports["MessageEvent has a read-only property 'data'"] = function (t) {
  const event = new MessageEvent("fake type", {
    data: "fake data"
  });

  t.equals(event.data, "fake data");
  t.throws(function () {
    event.data = "oh no";
  });

  t.done();
};

