"use strict";
const traverseHistory = require("./navigation.js").traverseHistory;

// https://html.spec.whatwg.org/#session-history
class SessionHistory {
  constructor(initialEntry, window) {
    this._window = window;
    this._historyTraversalQueue = new Set();
    this.entries = [initialEntry];
    this.currentIndex = 0;
  }

  _queueHistoryTraversalTask(fn) {
    const timeoutId = this._window.setTimeout(() => {
      this._historyTraversalQueue.delete(timeoutId);
      fn();
    }, 0);

    this._historyTraversalQueue.add(timeoutId);
  }

  clearHistoryTraversalTasks() {
    for (const timeoutId of this._historyTraversalQueue) {
      this._window.clearTimeout(timeoutId);
    }
    this._historyTraversalQueue.clear();
  }

  get length() {
    return this.entries.length;
  }

  get currentEntry() {
    return this.entries[this._currentIndex];
  }

  // https://html.spec.whatwg.org/#dom-history-pushstate
  removeAllEntriesAfterCurrentEntry() {
    this.entries.splice(this._currentIndex + 1, Infinity);
  }

  // https://html.spec.whatwg.org/#traverse-the-history-by-a-delta
  traverseByDelta(delta) {
    this._queueHistoryTraversalTask(() => {
      const newIndex = this.currentIndex + delta;
      if (newIndex < 0 || newIndex >= this.length) {
        return;
      }

      const specifiedEntry = this.entries[newIndex];

      // Not implemented: unload a document guard

      // Not clear that this should be queued. html/browsers/history/the-history-interface/004.html can be fixed
      // by removing the queue, but doing so breaks some tests in history.js that also pass in browsers.
      this._queueHistoryTraversalTask(() => traverseHistory(this._window, specifiedEntry));
    });
  }
}
module.exports = SessionHistory;
