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
    // windows.
    const [, typeName] = getChain(array);
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

exports.implementation = useWebcrypto(CryptoImpl);

// Wraps the crypto implementation to use webcrypto if available (Node >15).
function useWebcrypto(Constructor) {
  const { webcrypto } = nodeCrypto;
  if (!webcrypto) {
    return Constructor;
  }
  const props = Object.getOwnPropertyNames(Constructor.prototype);
  for (const key of props) {
    if (key !== "constructor" && webcrypto[key]) {
      Constructor.prototype[key] = function (...args) {
        // See #3395. In order to pass the web-platform-tests, we have to
        // rethrow errors. It defeats.
        let output;
        try {
          output = webcrypto[key](...args);
        } catch (e) {
          if (!e.code) {
            throw e;
          }
          if (e.code === e.constructor.TYPE_MISMATCH_ERR) {
            throw DOMException.create(this._globalObject, [
              `getRandomValues() only accepts integer typed arrays`,
              "TypeMismatchError"
            ]);
          } else if (e.code === e.constructor.QUOTA_EXCEEDED_ERR) {
            throw DOMException.create(this._globalObject, [
              `getRandomValues() cannot generate more than 65536 bytes of random values; ` +
              `${args[0].byteLength} bytes were requested`,
              "QuotaExceededError"
            ]);
          }
        }
        return output;
      };
    }
  }
  return Constructor;
}

// See #3395. Subclasses of TypedArrays should properly work, but we can't rely
// on instanceof because Uint8Array may be different across different windows -
// which can happen in JSDOM when running { runScripts: "dangerously" }. As a
// solution, we imitate the behavior of instanceof by walking the proottype
// chain.
function getChain(array) {
  const target = array.constructor;
  const chain = [target.name];
  let proto = Object.getPrototypeOf(target);
  while (proto) {
    chain.push(proto.name);
    proto = Object.getPrototypeOf(proto);
  }

  while (chain.length > 0 && chain[chain.length - 1] !== "TypedArray") {
    chain.pop();
  }
  chain.reverse();
  return chain;
}
