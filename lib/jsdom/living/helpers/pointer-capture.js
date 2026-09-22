"use strict";
const NODE_TYPE = require("../node-type");
const DOMException = require("../../../generated/idl/DOMException");
const PointerEvent = require("../../../generated/idl/PointerEvent");
const { fireAnEvent } = require("./events");

// https://w3c.github.io/pointerevents/#pointer-capture
//
// jsdom has no hit-testing and no real input devices, so "active pointers" here are populated purely from
// pointerdown/pointerup/pointercancel events that scripts dispatch themselves (e.g. via testing-library's
// fireEvent, or a raw el.dispatchEvent(new PointerEvent(...))), rather than from real hardware input. Given that,
// the pointer lock interaction and the "pointer's active document" check from the spec are not modeled, since
// jsdom does not implement the Pointer Lock API and has only one meaningful document per pointer.

// Event types for which pointer capture retargeting and "process pending pointer capture" apply.
const RETARGETABLE_TYPES = new Set([
  "pointerover", "pointerenter", "pointerdown", "pointermove", "pointerrawupdate",
  "pointerup", "pointercancel", "pointerout", "pointerleave"
]);

// https://w3c.github.io/pointerevents/#dfn-implicit-release-of-the-pointer-capture
const IMPLICIT_RELEASE_TYPES = new Set(["pointerup", "pointercancel"]);

function getOwnerDocument(nodeImpl) {
  return nodeImpl.nodeType === NODE_TYPE.DOCUMENT_NODE ? nodeImpl : nodeImpl._ownerDocument;
}

function getOrCreateState(documentImpl) {
  let state = documentImpl._pointerCaptureState;
  if (!state) {
    state = {
      activePointerIds: new Set(),
      // pointerId -> ElementImpl; see https://w3c.github.io/pointerevents/#pending-pointer-capture-target-override
      pendingOverrides: new Map(),
      // pointerId -> ElementImpl; see https://w3c.github.io/pointerevents/#pointer-capture-target-override
      overrides: new Map()
    };
    documentImpl._pointerCaptureState = state;
  }
  return state;
}

// https://w3c.github.io/pointerevents/#dom-element-setpointercapture
exports.setPointerCapture = (elementImpl, pointerId) => {
  const state = getOrCreateState(elementImpl._ownerDocument);

  if (!state.activePointerIds.has(pointerId)) {
    throw DOMException.create(elementImpl._globalObject, [
      "The pointerId provided does not match any of the active pointers.",
      "NotFoundError"
    ]);
  }

  if (!elementImpl.isConnected) {
    throw DOMException.create(elementImpl._globalObject, [
      "Cannot set pointer capture on an element that is not connected.",
      "InvalidStateError"
    ]);
  }

  state.pendingOverrides.set(pointerId, elementImpl);
};

// https://w3c.github.io/pointerevents/#dom-element-releasepointercapture
exports.releasePointerCapture = (elementImpl, pointerId) => {
  const state = getOrCreateState(elementImpl._ownerDocument);

  if (!state.activePointerIds.has(pointerId)) {
    throw DOMException.create(elementImpl._globalObject, [
      "The pointerId provided does not match any of the active pointers.",
      "NotFoundError"
    ]);
  }

  if (state.pendingOverrides.get(pointerId) !== elementImpl) {
    return;
  }

  state.pendingOverrides.delete(pointerId);
};

// https://w3c.github.io/pointerevents/#dom-element-haspointercapture
exports.hasPointerCapture = (elementImpl, pointerId) => {
  const state = elementImpl._ownerDocument._pointerCaptureState;
  return state !== undefined && state.pendingOverrides.get(pointerId) === elementImpl;
};

function fireCaptureEvent(elementImpl, type, pointerId, pointerType) {
  fireAnEvent(type, elementImpl, PointerEvent, {
    bubbles: true,
    cancelable: false,
    composed: true,
    pointerId,
    pointerType
  });
}

// https://w3c.github.io/pointerevents/#process-pending-pointer-capture
function processPendingPointerCapture(documentImpl, pointerId, pointerType) {
  const state = documentImpl._pointerCaptureState;
  if (!state) {
    return;
  }

  const previousOverride = state.overrides.get(pointerId) || null;
  const pendingOverride = state.pendingOverrides.get(pointerId) || null;

  if (previousOverride !== null && previousOverride !== pendingOverride) {
    fireCaptureEvent(previousOverride, "lostpointercapture", pointerId, pointerType);
  }
  if (pendingOverride !== null && pendingOverride !== previousOverride) {
    fireCaptureEvent(pendingOverride, "gotpointercapture", pointerId, pointerType);
  }

  if (pendingOverride !== null) {
    state.overrides.set(pointerId, pendingOverride);
  } else {
    state.overrides.delete(pointerId);
  }
}

// Called from EventTarget-impl's dispatchEvent() for every event dispatch, so the common (non-pointer-event) case
// must stay cheap: PointerEvent.isImpl() is a brand check, just like the existing MouseEvent.isImpl() check that
// dispatchEvent() already performs for click activation behavior.
exports.retargetForPointerCapture = (originalTargetImpl, eventImpl) => {
  if (!PointerEvent.isImpl(eventImpl) || !RETARGETABLE_TYPES.has(eventImpl.type)) {
    return originalTargetImpl;
  }

  if (
    originalTargetImpl.nodeType !== NODE_TYPE.ELEMENT_NODE &&
    originalTargetImpl.nodeType !== NODE_TYPE.DOCUMENT_NODE
  ) {
    return originalTargetImpl;
  }

  const documentImpl = getOwnerDocument(originalTargetImpl);
  const { pointerId, pointerType } = eventImpl;

  if (eventImpl.type === "pointerdown") {
    getOrCreateState(documentImpl).activePointerIds.add(pointerId);
  }

  processPendingPointerCapture(documentImpl, pointerId, pointerType);

  const state = documentImpl._pointerCaptureState;
  const overrideImpl = state && state.overrides.get(pointerId);

  return overrideImpl || originalTargetImpl;
};

// https://w3c.github.io/pointerevents/#dfn-implicit-release-of-the-pointer-capture
exports.implicitlyReleaseAfterDispatch = (originalTargetImpl, eventImpl) => {
  if (!PointerEvent.isImpl(eventImpl) || !IMPLICIT_RELEASE_TYPES.has(eventImpl.type)) {
    return;
  }

  if (
    originalTargetImpl.nodeType !== NODE_TYPE.ELEMENT_NODE &&
    originalTargetImpl.nodeType !== NODE_TYPE.DOCUMENT_NODE
  ) {
    return;
  }

  const documentImpl = getOwnerDocument(originalTargetImpl);
  const state = documentImpl._pointerCaptureState;
  if (!state) {
    return;
  }

  const { pointerId, pointerType } = eventImpl;

  state.pendingOverrides.delete(pointerId);
  processPendingPointerCapture(documentImpl, pointerId, pointerType);
  state.activePointerIds.delete(pointerId);
};

// https://w3c.github.io/pointerevents/#dom-element-releasepointercapture
//
// "When the pointer capture target override is no longer connected, the pointer capture target override SHOULD be
// set to the document. When the pending pointer capture target override is no longer connected, the pending pointer
// capture target override node SHOULD be cleared. The previous two paragraphs result in a lostpointercapture event
// corresponding to the captured pointer being fired at the document during the next Process pending pointer capture
// after the capture node is removed."
//
// So this only retargets state; it does not fire lostpointercapture itself. That happens later, at document, the
// next time processPendingPointerCapture() runs for this pointerId (i.e. the next retargetable pointer event
// dispatch) -- it may never fire at all if no such event follows.
exports.releaseCaptureForDisconnectedElement = elementImpl => {
  const documentImpl = elementImpl._ownerDocument;
  const state = documentImpl && documentImpl._pointerCaptureState;
  if (!state) {
    return;
  }

  const pointerIds = new Set([...state.pendingOverrides.keys(), ...state.overrides.keys()]);

  for (const pointerId of pointerIds) {
    if (state.pendingOverrides.get(pointerId) === elementImpl) {
      state.pendingOverrides.delete(pointerId);
    }

    if (state.overrides.get(pointerId) === elementImpl) {
      state.overrides.set(pointerId, documentImpl);
    }
  }
};
