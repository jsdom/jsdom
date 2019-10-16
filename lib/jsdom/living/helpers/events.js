"use strict";

const Event = require("../generated/Event");
const { tryImplForWrapper } = require("../generated/utils");

function createAnEvent(e, globalObject, eventInterface = Event, attributes = {}) {
  return eventInterface.createImpl(
    globalObject,
    [e, attributes],
    { isTrusted: attributes.isTrusted !== false }
  );
}

function fireAnEvent(e, target, eventInterface, attributes, legacyTargetOverrideFlag) {
  // TODO: clean up this code. The passed target is a huge mess, sometime the impl, sometime the
  // wrapper.
  let globalObject = tryImplForWrapper(target);
  globalObject = globalObject._globalObject || globalObject;

  const event = createAnEvent(e, globalObject, eventInterface, attributes);

  // tryImplForWrapper() is currently required due to use in Window.js and xmlhttprequest.js
  return tryImplForWrapper(target)._dispatch(event, legacyTargetOverrideFlag);
}

module.exports = {
  createAnEvent,
  fireAnEvent
};
