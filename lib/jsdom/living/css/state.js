"use strict";

const windowStates = new WeakMap();

// Registrations and random bases survive style invalidation and belong to one document.
exports.getCSSState = (globalObject) => {
  let state = windowStates.get(globalObject);
  if (!state) {
    state = {
      customProperties: new Map(),
      randomValues: new Map(),
      elementRandomValues: new WeakMap(),
    };
    windowStates.set(globalObject, state);
  }
  return state;
};

exports.getRandomBaseValue = (globalObject, { element, identifier, scope }) => {
  const state = exports.getCSSState(globalObject);
  let cache = state.randomValues;
  if (element) {
    cache = state.elementRandomValues.get(element);
    if (!cache) {
      cache = new Map();
      state.elementRandomValues.set(element, cache);
    }
  }
  const key = JSON.stringify([identifier, scope]);
  if (!cache.has(key)) {
    cache.set(key, Math.random());
  }
  return cache.get(key);
};
