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
    // Note: this rejects Float32Array, Float64Array and DataView.
    //
    // We perform "instance tests" by comparing `array.constructor.name` so
    // that the tests will be successful across realms.
    const typeName = array.constructor.name;
    if (!(typeName === "Int8Array" ||
        typeName === "Uint8Array" ||
        typeName === "Uint8ClampedArray" ||
        typeName === "Int16Array" ||
        typeName === "Uint16Array" ||
        typeName === "Int32Array" ||
        typeName === "Uint32Array" ||
        typeName === "BigInt64Array" ||
        typeName === "BigUint64Array")) {
      throw DOMException.create(this._globalObject, [
        `getRandomValues() only accepts integer typed arrays`,
        "TypeMismatchError"
      ]);
    }

    if (array.byteLength > 65536) {
      throw DOMException.create(this._globalObject, [
        `getRandomValues() cannot generate more than 65536 bytes of random values; ` +
        `${array.byteLength} bytes were requested`,
        "QuotaExceededError"
      ]);
    }

    nodeCrypto.randomFillSync(array);
    return array;
  }
}

exports.implementation = CryptoImpl;
