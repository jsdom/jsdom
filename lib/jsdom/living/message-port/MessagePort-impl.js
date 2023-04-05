"use strict";

const DOMException = require("domexception/webidl2js-wrapper");
const MessageEvent = require("../generated/MessageEvent");
const { fireAnEvent } = require("../helpers/events");
const EventTargetImpl = require("../events/EventTarget-impl");
const { structuredSerializeWithTransfer } = require("../structured-clone/structuredSerializeWithTransfer");
const { structuredDeserializeWithTransfer } = require("../structured-clone/structuredDeserializeWithTransfer");

class PortMessageQueue {
  constructor() {
    this._enabled = false;

    /**
     * @type {[*, object]} queue
     */

    this.queue = [];
  }

  get enabled() {
    return this._enabled;
  }

  enable() {
    if (this._enabled) {
      return;
    }

    this._enabled = true;
  }

  enqueue(message, options) {
    this.queue.push([message, options]);
  }
}


class MessagePortImpl extends EventTargetImpl {
  constructor(globalObject) {
    super(globalObject);

    this._globalObject = globalObject;
    this._onmessage = undefined;
    this._onmessageerror = undefined;
    this._dataHolder = {
      _remotePort: null,
      _portMessageQueue: new PortMessageQueue()
    };
  }

  /**
   * @param {MessagePortImpl} port1
   * @param {MessagePortImpl} port2
   */

  static entangle(port1, port2) {
    port1._dataHolder._remotePort = port2;
    port2._dataHolder._remotePort = port1;
  }

  /**
   * @param {MessagePortImpl} port1
   * @param {MessagePortImpl} port2
   */

  static disentangle(port1, port2) {
    port2._dataHolder._remotePort = null;
    port1._dataHolder._remotePort = null;
  }

  get onmessage() {
    return this._onmessage;
  }

  set onmessage(value) {
    this._onmessage = value;
    this.start();
  }

  postMessage(message, optionsOrTransfer) {
    const options = {};

    if (Array.isArray(optionsOrTransfer)) {
      options.transfer = optionsOrTransfer;
    } else if (typeof optionsOrTransfer === "object") {
      Object.assign(options, optionsOrTransfer);
    }

    const { transfer } = options;

    if (transfer.some(t => t === this)) {
      throw DOMException.create(this._globalObject, [
        "The object can not be cloned.",
        "DataCloneError"
      ]);
    }

    let doomed = false;
    const targetPort = this._dataHolder._remotePort;

    if (targetPort !== null && transfer.includes(targetPort)) {
      doomed = true;
    }

    const serializeWithTransferResult = structuredSerializeWithTransfer(message, transfer);

    if (!targetPort || doomed) {
      // eslint-disable-next-line no-console
      console.warn("Target port was posted to itself, causing the communication channel to be lost.");
      return;
    }

    /**
     * Out of standard, but we don't have the event loop
     */

    if (!this._dataHolder._portMessageQueue.enabled) {
      this._dataHolder._portMessageQueue.enqueue(message, options);
      return;
    }

    queueMicrotask(() => {
      const finalTargetPort = targetPort;
      /**
       * Let deserializeRecord be StructuredDeserializeWithTransfer(serializeWithTransferResult, targetRealm).
       * If this throws an exception, catch it, fire an event named messageerror at finalTargetPort, using
       *        MessageEvent, and then return.
       */

      let deserializeRecord;

      try {
        deserializeRecord = structuredDeserializeWithTransfer(serializeWithTransferResult, this._globalObject);
      } catch (err) {
        fireAnEvent("messageerror", finalTargetPort, MessageEvent, { data: err });
      }

      /**
       * Let messageClone be deserializeRecord.[[Deserialized]].
       */

      const messageClone = deserializeRecord.Deserialized;

      /**
       * Let newPorts be a new frozen array consisting of all MessagePort objects in
       * deserializeRecord.[[TransferredValues]], if any, maintaining their relative order.
       */

      const newPorts = Object.freeze(
        deserializeRecord.TransferredValues.filter(value => value instanceof MessagePortImpl)
      );

      fireAnEvent("message", finalTargetPort, MessageEvent, { data: messageClone, ports: newPorts });
    });
  }

  start() {
    this._dataHolder._portMessageQueue.enable();

    let event;

    while ((event = this._dataHolder._portMessageQueue.queue.shift())) {
      const [message, options] = event;
      this.postMessage(message, options);
    }
  }

  close() {
    MessagePortImpl.disentangle(this, this._dataHolder._remotePort);
  }
}

module.exports = {
  implementation: MessagePortImpl
};
