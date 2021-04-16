"use strict";

function newPromiseCapability() {
  let resolve,
    reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

exports.newPromiseCapability = newPromiseCapability;
