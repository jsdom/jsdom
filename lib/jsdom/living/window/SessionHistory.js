"use strict";
// https://html.spec.whatwg.org/#session-history
class SessionHistory {
  constructor(initialEntry) {
    this.entries = [initialEntry];
    this.currentIndex = 0;
  }
  get length() {
    return this.entries.length;
  }

  get currentEntry() {
    return this.entries[this._currentIndex];
  }

  removeAllEntriesAfterCurrentEntry() {
    this.entries.splice(this._currentIndex + 1, Infinity);
  }
}
module.exports = SessionHistory;
