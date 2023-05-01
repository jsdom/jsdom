"use strict";

const { implementation: MessagePortImpl } = require("../message-port/MessagePort-impl");

class MessageChannelImpl {
  constructor(globalObject) {
    this._ports = [
      new MessagePortImpl(globalObject),
      new MessagePortImpl(globalObject)
    ];

    MessagePortImpl.entangle(...this._ports);
  }

  get port1() {
    return this._ports[0];
  }

  get port2() {
    return this._ports[1];
  }
}

module.exports = {
  implementation: MessageChannelImpl
};
