"use strict";

// Manage pending requests, each exposing an `abort()` method and its `signal`.
module.exports = class RequestManager {
  constructor() {
    this.openedRequests = [];
  }

  add(req) {
    this.openedRequests.push(req);
  }

  remove(req) {
    const idx = this.openedRequests.indexOf(req);
    if (idx !== -1) {
      this.openedRequests.splice(idx, 1);
    }
  }

  close() {
    for (const openedRequest of this.openedRequests) {
      openedRequest.abort();

      // Node's default abort reason can retain a window through its unformatted stack.
      // Work around https://github.com/nodejs/node/issues/66192 while preserving the original reason.
      try {
        openedRequest.signal.reason.stack; // eslint-disable-line no-unused-expressions
      } catch {
        // A custom stack formatter must not interfere with cancellation of the remaining requests.
      }
    }
    this.openedRequests = [];
  }

  size() {
    return this.openedRequests.length;
  }
};
