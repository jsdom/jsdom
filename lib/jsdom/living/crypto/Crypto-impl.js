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
    // See #3395. Subclasses of TypedArrays should properly work, but we can't
    // rely on instanceof because Uint8Array may be different across different
    // windows. As a solution we rely on `nodeCrytpo.randomFillSync` to throw
    // when not possible and then rethrow. Note that this code is not 100% spec
    // compliant because even if the array is too big, the values will be
    // filled anyway.
    try {
      nodeCrypto.randomFillSync(array);
    } catch (e) {
      if (e.code === "ERR_INVALID_ARG_TYPE") {
        throw DOMException.create(this._globalObject, [
          `getRandomValues() only accepts integer typed arrays`,
          "TypeMismatchError"
        ]);
      } else {
        throw e;
      }
    }

    if (array.byteLength > 65536) {
      throw DOMException.create(this._globalObject, [
        `getRandomValues() cannot generate more than 65536 bytes of random values; ` +
        `${array.byteLength} bytes were requested`,
        "QuotaExceededError"
      ]);
    }
    return array;
  }
}

exports.implementation = CryptoImpl;
