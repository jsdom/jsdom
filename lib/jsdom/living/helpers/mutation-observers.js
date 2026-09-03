"use strict";

const { domSymbolTree } = require("./internal-constants");
const reportException = require("./runtime-script-errors");

const Event = require("../../../generated/idl/Event");
const idlUtils = require("../../../generated/idl/utils");
const MutationRecord = require("../../../generated/idl/MutationRecord");

const MUTATION_TYPE = {
  ATTRIBUTES: "attributes",
  CHARACTER_DATA: "characterData",
  CHILD_LIST: "childList"
};

// Note:
// Since jsdom doesn't currently implement the concept of "unit of related similar-origin browsing contexts"
// (https://html.spec.whatwg.org/multipage/browsers.html#unit-of-related-similar-origin-browsing-contexts)
// we will approximate that the following properties are global for now.

// https://dom.spec.whatwg.org/#mutation-observer-compound-microtask-queued-flag
let mutationObserverMicrotaskQueueFlag = false;

// Non-spec compliant: List of all the mutation observers with mutation records enqueued. It's a replacement for
// mutation observer list (https://dom.spec.whatwg.org/#mutation-observer-list) but without leaking since it's empty
// before notifying the mutation observers.
const activeMutationObservers = new Set();

// https://dom.spec.whatwg.org/#signal-slot-list
const signalSlotList = [];

function appendMutationRecord(observer, recordData) {
  const record = MutationRecord.createImpl(recordData.target._globalObject, [], recordData);
  observer._recordQueue.push(record);
  activeMutationObservers.add(observer);
}

// https://dom.spec.whatwg.org/#queue-a-mutation-record
function queueMutationRecord(
  type,
  target,
  name,
  namespace,
  oldValue,
  addedNodes,
  removedNodes,
  previousSibling,
  nextSibling
) {
  // This is a hot path, and measurements show that avoiding the spec's interested-observers map for zero or one
  // matching observer is worthwhile:
  // https://github.com/jsdom/jsdom/pull/4269
  let firstInterestedObserver = null;
  let firstMappedOldValue = null;
  let interestedObservers = null;

  for (let node = target; node !== null; node = domSymbolTree.parent(node)) {
    const registeredObserverList = node._registeredObserverList;
    if (registeredObserverList === null) {
      continue;
    }

    for (const registered of registeredObserverList) {
      const { options, observer: mo } = registered;

      if (
        !(node !== target && options.subtree === false) &&
        !(type === MUTATION_TYPE.ATTRIBUTES && options.attributes !== true) &&
        !(type === MUTATION_TYPE.ATTRIBUTES && options.attributeFilter &&
          !options.attributeFilter.some(value => value === name || value === namespace)) &&
        !(type === MUTATION_TYPE.CHARACTER_DATA && options.characterData !== true) &&
        !(type === MUTATION_TYPE.CHILD_LIST && options.childList === false)
      ) {
        const requestsOldValue =
          (type === MUTATION_TYPE.ATTRIBUTES && options.attributeOldValue === true) ||
          (type === MUTATION_TYPE.CHARACTER_DATA && options.characterDataOldValue === true);

        if (interestedObservers !== null) {
          if (!interestedObservers.has(mo)) {
            interestedObservers.set(mo, null);
          }
          if (requestsOldValue) {
            interestedObservers.set(mo, oldValue);
          }
        } else if (firstInterestedObserver === null) {
          firstInterestedObserver = mo;
          firstMappedOldValue = requestsOldValue ? oldValue : null;
        } else if (firstInterestedObserver === mo) {
          if (requestsOldValue) {
            firstMappedOldValue = oldValue;
          }
        } else {
          interestedObservers = new Map();
          interestedObservers.set(firstInterestedObserver, firstMappedOldValue);
          interestedObservers.set(mo, requestsOldValue ? oldValue : null);
        }
      }
    }
  }

  if (firstInterestedObserver !== null) {
    const recordData = {
      type,
      target,
      attributeName: name,
      attributeNamespace: namespace,
      oldValue: firstMappedOldValue,
      addedNodes,
      removedNodes,
      previousSibling,
      nextSibling
    };

    if (interestedObservers === null) {
      appendMutationRecord(firstInterestedObserver, recordData);
    } else {
      for (const [observer, mappedOldValue] of interestedObservers) {
        recordData.oldValue = mappedOldValue;
        appendMutationRecord(observer, recordData);
      }
    }
  }

  queueMutationObserverMicrotask();
}

// https://dom.spec.whatwg.org/#queue-a-tree-mutation-record
function queueTreeMutationRecord(target, addedNodes, removedNodes, previousSibling, nextSibling) {
  queueMutationRecord(
    MUTATION_TYPE.CHILD_LIST,
    target,
    null,
    null,
    null,
    addedNodes,
    removedNodes,
    previousSibling,
    nextSibling
  );
}

// https://dom.spec.whatwg.org/#queue-an-attribute-mutation-record
function queueAttributeMutationRecord(target, name, namespace, oldValue) {
  queueMutationRecord(
    MUTATION_TYPE.ATTRIBUTES,
    target,
    name,
    namespace,
    oldValue,
    [],
    [],
    null,
    null
  );
}

// https://dom.spec.whatwg.org/#queue-a-mutation-observer-compound-microtask
function queueMutationObserverMicrotask() {
  if (mutationObserverMicrotaskQueueFlag) {
    return;
  }

  mutationObserverMicrotaskQueueFlag = true;

  Promise.resolve().then(() => {
    notifyMutationObservers();
  });
}

// https://dom.spec.whatwg.org/#notify-mutation-observers
function notifyMutationObservers() {
  mutationObserverMicrotaskQueueFlag = false;

  const notifyList = [...activeMutationObservers].sort((a, b) => a._id - b._id);
  activeMutationObservers.clear();

  const signalList = [...signalSlotList];
  signalSlotList.splice(0, signalSlotList.length);

  for (const mo of notifyList) {
    // This is a hot path, and replacing the record queue before invoking the callback makes it safe to avoid cloning:
    // https://github.com/jsdom/jsdom/pull/4269
    const records = mo._recordQueue;
    mo._recordQueue = [];

    for (const node of mo._nodeList) {
      node._registeredObserverList = node._registeredObserverList.filter(registeredObserver => {
        return registeredObserver.source !== mo;
      });
    }

    if (records.length > 0) {
      try {
        const moWrapper = idlUtils.wrapperForImpl(mo);
        mo._callback.call(
          moWrapper,
          records.map(idlUtils.wrapperForImpl),
          moWrapper
        );
      } catch (e) {
        const { target } = records[0];
        const window = target._ownerDocument._defaultView;

        reportException(window, e);
      }
    }
  }

  for (const slot of signalList) {
    const slotChangeEvent = Event.createImpl(
      slot._globalObject,
      [
        "slotchange",
        { bubbles: true }
      ],
      { isTrusted: true }
    );

    slot._dispatch(slotChangeEvent);
  }
}

module.exports = {
  MUTATION_TYPE,

  queueMutationRecord,
  queueTreeMutationRecord,
  queueAttributeMutationRecord,

  queueMutationObserverMicrotask,

  signalSlotList
};
