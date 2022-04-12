"use strict";

const nodeCrypto = require("crypto");
const DOMException = require("domexception/webidl2js-wrapper");

// https://w3c.github.io/webcrypto/#crypto-interface
class CryptoImpl {
  constructor(globalObject) {
    this._globalObject = globalObject;
  }

  // https://w3c.github.io/webcrypto/#Crypto-method-getRandomValues
  getRandomValues(array) {
    // Note: this rejects Float32Array and Float64Array.
    if (!(array instanceof this._globalObject.Int8Array ||
        array instanceof this._globalObject.Uint8Array ||
        array instanceof this._globalObject.Uint8ClampedArray ||
        array instanceof this._globalObject.Int16Array ||
        array instanceof this._globalObject.Uint16Array ||
        array instanceof this._globalObject.Int32Array ||
        array instanceof this._globalObject.Uint32Array ||
        array instanceof this._globalObject.BigInt64Array ||
        array instanceof this._globalObject.BigUint64Array)) {
      throw DOMException.create(this._globalObject, [
        `The type of an object is incompatible with the expected type of the parameter associated to the object`,
        "TypeMismatchError"
      ]);
    }

    if (array.byteLength > 65536) {
      throw DOMException.create(this._globalObject, [
        `The quota has been exceeded.`,
        "QuotaExceededError"
      ]);
    }

    nodeCrypto.randomFillSync(array);
    return array;
  }
}

exports.implementation = CryptoImpl;
