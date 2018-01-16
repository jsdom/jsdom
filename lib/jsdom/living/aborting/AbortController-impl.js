"use strict";

class AbortControllerImpl {
  constructor(args, privateData) {
    this.signal = privateData.window._core.AbortSignal.createImpl([]);
  }

  abort() {
    this.signal._signalAbort();
  }
}

module.exports = {
  implementation: AbortControllerImpl
};
