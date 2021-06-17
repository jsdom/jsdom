"use strict";
const assert = require("assert");
const { rethrowAssertionErrorRejection } = require("./miscellaneous.js");

const OriginalPromise = Promise;
const originalPromiseThen = Promise.prototype.then;
const originalPromiseReject = Promise.reject;

const promiseSideTable = new WeakMap();

// https://heycam.github.io/webidl/#a-new-promise
function newPromise() {
  // The stateIsPending tracking only works if we never resolve the promises with other promises.
  // In this spec, that happens to be true for the promises in question; they are always resolved with undefined.
  const sideData = { stateIsPending: true };
  const promise = new OriginalPromise((resolve, reject) => {
    sideData.resolve = resolve;
    sideData.reject = reject;
  });

  promiseSideTable.set(promise, sideData);
  return promise;
}

// https://heycam.github.io/webidl/#resolve
function resolvePromise(p, value) {
  // We intend to only resolve or reject promises that are still pending.
  // When this is not the case, it usually means there's a bug in the specification that we want to fix.
  // This assertion is NOT a normative requirement. It is part of the reference implementation only
  // to help detect bugs in the specification. Other implementors MUST NOT replicate this assertion.
  assert(stateIsPending(p) === true);
  promiseSideTable.get(p).resolve(value);
  promiseSideTable.get(p).stateIsPending = false;
}

// https://heycam.github.io/webidl/#reject
function rejectPromise(p, reason) {
  assert(stateIsPending(p) === true);
  promiseSideTable.get(p).reject(reason);
  promiseSideTable.get(p).stateIsPending = false;
}

// https://heycam.github.io/webidl/#a-promise-resolved-with
function promiseResolvedWith(value) {
  // Cannot use original Promise.resolve since that will return value itself sometimes, unlike Web IDL.
  const promise = new OriginalPromise(resolve => resolve(value));
  promiseSideTable.set(promise, { stateIsPending: false });
  return promise;
}

// https://heycam.github.io/webidl/#a-promise-rejected-with
function promiseRejectedWith(reason) {
  const promise = originalPromiseReject.call(OriginalPromise, reason);
  promiseSideTable.set(promise, { stateIsPending: false });
  return promise;
}

function performPromiseThen(promise, onFulfilled, onRejected) {
  // There doesn't appear to be any way to correctly emulate the behaviour from JavaScript, so this is just an
  // approximation.
  return originalPromiseThen.call(promise, onFulfilled, onRejected);
}

// https://heycam.github.io/webidl/#dfn-perform-steps-once-promise-is-settled
function uponPromise(promise, onFulfilled, onRejected) {
  performPromiseThen(
    performPromiseThen(promise, onFulfilled, onRejected),
    undefined,
    rethrowAssertionErrorRejection
  );
}

function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
  return performPromiseThen(promise, fulfillmentHandler, rejectionHandler);
}

function setPromiseIsHandledToTrue(promise) {
  performPromiseThen(promise, undefined, rethrowAssertionErrorRejection);
}

function stateIsPending(promise) {
  return promiseSideTable.get(promise).stateIsPending;
}

Object.assign(exports, {
  newPromise,
  resolvePromise,
  rejectPromise,
  promiseResolvedWith,
  promiseRejectedWith,
  uponPromise,
  transformPromiseWith,
  setPromiseIsHandledToTrue,
  stateIsPending
});

// https://heycam.github.io/webidl/#wait-for-all
function waitForAll(promises, successSteps, failureSteps) {
  let rejected = false;
  function rejectionHandler(arg) {
    if (rejected === false) {
      rejected = true;
      failureSteps(arg);
    }
  }
  let index = 0;
  let fulfilledCount = 0;
  const total = promises.length;
  const result = new Array(total);
  if (total === 0) {
    queueMicrotask(() => successSteps(result));
    return;
  }
  for (const promise of promises) {
    const promiseIndex = index;
    // eslint-disable-next-line no-loop-func
    function fulfillmentHandler(arg) {
      result[promiseIndex] = arg;
      ++fulfilledCount;
      if (fulfilledCount === total) {
        successSteps(result);
      }
    }
    performPromiseThen(promise, fulfillmentHandler, rejectionHandler);
    ++index;
  }
}

// https://heycam.github.io/webidl/#waiting-for-all-promise
exports.waitForAllPromise = (promises, successSteps, failureSteps = undefined) => {
  let resolveP,
    rejectP;
  const promise = new Promise((resolve, reject) => {
    resolveP = resolve;
    rejectP = reject;
  });
  if (failureSteps === undefined) {
    failureSteps = arg => {
      throw arg;
    };
  }
  function successStepsWrapper(results) {
    try {
      const stepsResult = successSteps(results);
      resolveP(stepsResult);
    } catch (e) {
      rejectP(e);
    }
  }
  function failureStepsWrapper(reason) {
    try {
      const stepsResult = failureSteps(reason);
      resolveP(stepsResult);
    } catch (e) {
      rejectP(e);
    }
  }
  waitForAll(promises, successStepsWrapper, failureStepsWrapper);
  return promise;
};
