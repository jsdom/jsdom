"use strict";

const Event = require("../generated/Event");

function createAnEvent(e, globalObject, eventInterface = Event, attributes = {}) {
  return eventInterface.createImpl(
    globalObject,
    [e, attributes],
    { isTrusted: attributes.isTrusted !== false }
  );
}

function fireAnEvent(e, target, eventInterface, attributes, legacyTargetOverrideFlag) {
  const event = createAnEvent(e, target._globalObject, eventInterface, attributes);
  return target._dispatch(event, legacyTargetOverrideFlag);
}

module.exports = {
  createAnEvent,
  fireAnEvent
};
