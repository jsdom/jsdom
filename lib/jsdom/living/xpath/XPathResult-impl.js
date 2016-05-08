"use strict";

class XPathResultImpl {
  constructor(args) {
    this._result = args[0];
  }

  interateNext() {
    return this._result.iterateNext();
  }

  snapshotItem(idx) {
    return this._result.snapshotItem(idx);
  }
}

module.exports = {
  implementation: XPathResultImpl
};
