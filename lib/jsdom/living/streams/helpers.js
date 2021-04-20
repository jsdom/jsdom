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

class QueueWithSize {
  constructor() {
    this.totalSize = 0;
    this.items = [];
  }

  enqueue(value, size) {
    this.items.push({ value, size });
    this.totalSize += size;
  }

  dequeue() {
    const { value, size } = this.items.shift();
    this.totalSize = Math.max(0, this.totalSize - size);
    return value;
  }

  get length() {
    return this.items.length;
  }

  get size() {
    return this.totalSize;
  }
}

exports.QueueWithSize = QueueWithSize;
