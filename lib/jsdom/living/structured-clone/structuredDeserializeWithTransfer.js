"use strict";

const DOMException = require("domexception/webidl2js-wrapper");

function structuredDeserializeWithTransfer(serializeWithTransferResult, targetRealm) {
  /**
   * Let memory be an empty map.
   * Let transferredValues be a new empty List.
   */

  const memory = {};
  const transferredValues = [];

  /** For each transferDataHolder of serializeWithTransferResult.[[TransferDataHolders]]: */
  for (const transferDataHolder of serializeWithTransferResult.TransferDataHolders) {
    // Let value be an uninitialized value.
    let value;

    /**
     * If transferDataHolder.[[Type]] is "ArrayBuffer", then set value to a new ArrayBuffer object
     * in targetRealm whose [[ArrayBufferData]] internal slot value is transferDataHolder.[[ArrayBufferData]],
     * and whose [[ArrayBufferByteLength]] internal slot value is transferDataHolder.[[ArrayBufferByteLength]].
     *
     * In cases where the original memory occupied by [[ArrayBufferData]] is accessible during the deserialization,
     * this step is unlikely to throw an exception, as no new memory needs to be allocated: the memory occupied by
     * [[ArrayBufferData]] is instead just getting transferred into the new ArrayBuffer. This could be true,
     * for example, when both the source and target realms are in the same process.
     */

    if (transferDataHolder.Type === "ArrayBuffer") {
      value = new ArrayBuffer(transferDataHolder.ArrayBufferByteLength);

      const view = new Uint8Array(value);
      view.set(transferDataHolder.ArrayBufferData, 0);
    } else if (transferDataHolder.Type === "ResizableArrayBuffer") {
    /**
     * Otherwise, if transferDataHolder.[[Type]] is "ResizableArrayBuffer", then set value to a new ArrayBuffer
     * object in targetRealm whose [[ArrayBufferData]] internal slot value is transferDataHolder.[[ArrayBufferData]],
     * whose [[ArrayBufferByteLength]] internal slot value is transferDataHolder.[[ArrayBufferByteLength]],
     * and whose [[ArrayBufferMaxByteLength]] internal slot value is transferDataHolder.[[ArrayBufferMaxByteLength]].
     *
     * For the same reason as the previous step, this step is also unlikely to throw an exception.
     */

      value = new ArrayBuffer(transferDataHolder.ArrayBufferByteLength, {
        maxByteLength: transferDataHolder.ArrayBufferMaxByteLength
      });

      const view = new Uint8Array(value);
      view.set(transferDataHolder.ArrayBufferData, 0);
    } else {
      /**
       * Otherwise:
       * Let interfaceName be transferDataHolder.[[Type]].
       * If the interface identified by interfaceName is not exposed in targetRealm, then throw
       * a "DataCloneError" DOMException.
       * Set value to a new instance of the interface identified by interfaceName, created in targetRealm.
       * Perform the appropriate transfer-receiving steps for the interface identified by interfaceName given
       * transferDataHolder and value.
       */

      const interfaceName = transferDataHolder.Type;

      /**
       * @TODO If the interface identified by interfaceName is not exposed in targetRealm, then throw
       * a "DataCloneError" DOMException.
       *
       * Comment: how do we check this?
       */

      /**
       * Set value to a new instance of the interface identified by interfaceName, created in targetRealm.
       */

      // eslint-disable-next-line no-undef
      value = Reflect.construct(targetRealm[interfaceName], []);
    }

    /**
     * Set memory[transferDataHolder] to value.
     * Append value to transferredValues.
     */

    memory[transferDataHolder] = value;
    transferredValues.push(value);
  }

  /**
   * Let deserialized be ? StructuredDeserialize(serializeWithTransferResult.[[Serialized]], targetRealm, memory).
   * Return { [[Deserialized]]: deserialized, [[TransferredValues]]: transferredValues }.
   */

  const deserialized = structuredDeserialize(serializeWithTransferResult.Serialized, targetRealm, memory);

  return {
    Deserialized: deserialized,
    TransferredValues: transferredValues
  };
}

function structuredDeserialize(serialized, targetRealm, memory = {}) {
  if (memory[serialized]) {
    return memory[serialized];
  }

  // Let deep be false.
  // Let value be an uninitialized value.
  let deep = false;
  let value;

  // If serialized.[[Type]] is "primitive", then set value to serialized.[[Value]].

  if (serialized.Type === "primitive") {
    value = serialized.Value;
  } else if (serialized.Type === "Boolean") {
    /**
     * Otherwise, if serialized.[[Type]] is "Boolean", then set value to a new Boolean object in targetRealm
     * whose [[BooleanData]] internal slot value is serialized.[[BooleanData]].
     */
    value = Boolean(serialized.BooleanData);
  } else if (serialized.Type === "Number") {
    /**
     * Otherwise, if serialized.[[Type]] is "Number", then set value to a new Number object in targetRealm whose
     * [[NumberData]] internal slot value is serialized.[[NumberData]].
     */

    value = Number(serialized.NumberData);
  } else if (serialized.Type === "BigInt") {
    // Otherwise, if serialized.[[Type]] is "BigInt", then set value to a new BigInt object in targetRealm whose
    // [[BigIntData]] internal slot value is serialized.[[BigIntData]].

    value = BigInt(serialized.BigIntData);
  } else if (serialized.Type === "String") {
    // Otherwise, if serialized.[[Type]] is "String", then set value to a new String object in targetRealm whose
    // [[StringData]] internal slot value is serialized.[[StringData]].

    value = String(serialized.StringData);
  } else if (serialized.Type === "Date") {
    // Otherwise, if serialized.[[Type]] is "Date", then set value to a new Date object in targetRealm whose
    // [[DateValue]] internal slot value is serialized.[[DateValue]].

    value = new Date(serialized.DateValue);
  } else if (serialized.Type === "RegExp") {
    /**
     * Otherwise, if serialized.[[Type]] is "RegExp", then set value to a new RegExp object in targetRealm whose
     * [[RegExpMatcher]] internal slot value is serialized.[[RegExpMatcher]],
     * whose [[OriginalSource]] internal slot value is serialized.[[OriginalSource]], and whose [[OriginalFlags]]
     * internal slot value is serialized.[[OriginalFlags]].
     */

    value = new RegExp(serialized.OriginalSource, serialized.OriginalFlags);
  } else if (serialized.Type === "SharedArrayBuffer") {
    // Otherwise, if serialized.[[Type]] is "SharedArrayBuffer", then:

    /**
     * @TODO If targetRealm's corresponding agent cluster is not serialized.[[AgentCluster]], then then
     * throw a "DataCloneError" DOMException
     */

    // Otherwise, set value to a new SharedArrayBuffer object in targetRealm whose [[ArrayBufferData]]
    // internal slot value is serialized.[[ArrayBufferData]] and whose [[ArrayBufferByteLength]] internal slot value is
    // serialized.[[ArrayBufferByteLength]].

    value = new SharedArrayBuffer(serialized.ArrayBufferByteLength);

    const dv = new Uint8Array(value);
    dv.set(serialized.ArrayBufferData, 0);
  } else if (serialized.Type === "GrowableSharedArrayBuffer") {
    // Otherwise, if serialized.[[Type]] is "GrowableSharedArrayBuffer", then:

    /**
     * @TODO If targetRealm's corresponding agent cluster is not serialized.[[AgentCluster]], then then throw a
     * "DataCloneError" DOMException.
     */

    /**
     * Otherwise, set value to a new SharedArrayBuffer object in targetRealm whose [[ArrayBufferData]]
     * internal slot value is serialized.[[ArrayBufferData]], whose [[ArrayBufferByteLengthData]] internal
     * slot value is serialized.[[ArrayBufferByteLengthData]], and whose [[ArrayBufferMaxByteLength]]
     * internal slot value is serialized.[[ArrayBufferMaxByteLength]].
     */

    value = new SharedArrayBuffer(serialized.ArrayBufferByteLength, {
      maxByteLength: serialized.ArrayBufferMaxByteLength
    });

    const dv = new Uint8Array(value);
    dv.set(serialized.ArrayBufferData, 0);
  } else if (serialized.Type === "ArrayBuffer") {
    /**
     * Otherwise, if serialized.[[Type]] is "ArrayBuffer", then set value to a new ArrayBuffer
     * object in targetRealm whose [[ArrayBufferData]] internal slot value is serialized.[[ArrayBufferData]], and whose
     * [[ArrayBufferByteLength]] internal slot value is serialized.[[ArrayBufferByteLength]].
     *
     * If this throws an exception, catch it, and then throw a "DataCloneError" DOMException.
     * This step might throw an exception if there is not enough memory available to create such an ArrayBuffer object.
     */

    try {
      value = new ArrayBuffer(serialized.ArrayBufferByteLength);
      value.set(serialized.ArrayBufferData, 0);
    } catch (err) {
      // eslint-disable-next-line no-undef
      throw DOMException.create(targetRealm, [
        "The object can not be cloned.",
        "DataCloneError"
      ]);
    }
  } else if (serialized.Type === "ResizableArrayBuffer") {
    /**
     * Otherwise, if serialized.[[Type]] is "ResizableArrayBuffer", then set value to a new ArrayBuffer object in
     * targetRealm whose [[ArrayBufferData]] internal slot value is serialized.[[ArrayBufferData]], whose
     * [[ArrayBufferByteLength]] internal slot value is serialized.[[ArrayBufferByteLength]], and whose
     * [[ArrayBufferMaxByteLength]] internal slot value is a serialized.[[ArrayBufferMaxByteLength]].
     *
     * If this throws an exception, catch it, and then throw a "DataCloneError" DOMException.
     * This step might throw an exception if there is not enough memory available to create such an ArrayBuffer object.
     */

    try {
      value = new ArrayBuffer(serialized.ArrayBufferByteLength, { maxByteLength: serialized.ArrayBufferMaxByteLength });
      value.set(serialized.ArrayBufferData, 0);
    } catch (err) {
    // eslint-disable-next-line no-undef
      throw DOMException.create(targetRealm, [
        "The object can not be cloned.",
        "DataCloneError"
      ]);
    }
  } else if (serialized.Type === "ArrayBufferView") {
    // Otherwise, if serialized.[[Type]] is "ArrayBufferView", then:
    // Let deserializedArrayBuffer be
    // ? StructuredDeserialize(serialized.[[ArrayBufferSerialized]], targetRealm, memory).

    const deserializedArrayBuffer = structuredDeserialize(serialized.ArrayBufferSerialized, targetRealm, memory);

    if (serialized.Constructor === "DataView") {
      // If serialized.[[Constructor]] is "DataView", then set value to a new DataView object in targetRealm whose
      // [[ViewedArrayBuffer]] internal slot value is deserializedArrayBuffer, whose [[ByteLength]] internal slot
      // value is serialized.[[ByteLength]], and whose [[ByteOffset]] internal slot value is serialized.[[ByteOffset]].

      value = new DataView(deserializedArrayBuffer, serialized.ByteOffset, serialized.ByteLength);
    } else {
      // Otherwise, set value to a new typed array object in targetRealm, using the constructor given by
      // serialized.[[Constructor]], whose [[ViewedArrayBuffer]] internal slot value is deserializedArrayBuffer,
      // whose [[TypedArrayName]] internal slot value is serialized.[[Constructor]], whose [[ByteLength]] internal
      // slot value is serialized.[[ByteLength]], whose [[ByteOffset]] internal slot value is serialized.[[ByteOffset]],
      // and whose [[ArrayLength]] internal slot value is serialized.[[ArrayLength]].

      // eslint-disable-next-line no-undef
      value = Reflect.construct(targetRealm[serialized.Constructor], [
        deserializedArrayBuffer,
        serialized.ByteOffset,
        serialized.ByteLength
      ]);
    }
  } else if (serialized.Type === "Map") {
    /**
     * Otherwise, if serialized.[[Type]] is "Map", then:
     *
     * Set value to a new Map object in targetRealm whose [[MapData]] internal slot value is a new empty List.
     * Set deep to true.
     */
    value = new Map();
    deep = true;
  } else if (serialized.Type === "Set") {
    /**
     * Otherwise, if serialized.[[Type]] is "Set", then:
     * Set value to a new Set object in targetRealm whose [[SetData]] internal slot value is a new empty List.
     * Set deep to true.
     */

    value = new Set();
    deep = true;
  } else if (serialized.Type === "Array") {
    /**
     * Otherwise, if serialized.[[Type]] is "Array", then:
     * Let outputProto be targetRealm.[[Intrinsics]].[[%Array.prototype%]].
     * Set value to ! ArrayCreate(serialized.[[Length]], outputProto).
     * Set deep to true.
     */

    value = new Array(serialized.Length);
    deep = true;
  } else if (serialized.Type === "Object") {
    // Otherwise, if serialized.[[Type]] is "Object", then:
    // Set value to a new Object in targetRealm.
    // Set deep to true.

    value = {};
    deep = true;
  } else if (serialized.Type === "Error") {
    // Otherwise, if serialized.[[Type]] is "Error", then:

    let prototype;

    // Let prototype be %Error.prototype%.
    // If serialized.[[Name]] is "EvalError", then set prototype to %EvalError.prototype%.
    // If serialized.[[Name]] is "RangeError", then set prototype to %RangeError.prototype%.
    // If serialized.[[Name]] is "ReferenceError", then set prototype to %ReferenceError.prototype%.
    // If serialized.[[Name]] is "SyntaxError", then set prototype to %SyntaxError.prototype%.
    // If serialized.[[Name]] is "TypeError", then set prototype to %TypeError.prototype%.
    // If serialized.[[Name]] is "URIError", then set prototype to %URIError.prototype%.

    switch (serialized.Name) {
      case "EvalError": {
        prototype = EvalError.prototype;
        break;
      }

      case "RangeError": {
        prototype = RangeError.prototype;
        break;
      }

      case "ReferenceError": {
        prototype = ReferenceError.prototype;
        break;
      }

      case "SyntaxError": {
        prototype = SyntaxError.prototype;
        break;
      }

      case "TypeError": {
        prototype = TypeError.prototype;
        break;
      }

      case "URIError": {
        prototype = URIError.prototype;
        break;
      }

      default: {
        prototype = Error.prototype;
      }
    }

    // Let message be serialized.[[Message]].
    const message = serialized.Message;

    // Set value to OrdinaryObjectCreate(prototype, « [[ErrorData]] »).
    value = Object.create(prototype);

    // If message is not undefined, then perform ! OrdinaryDefineOwnProperty(value, "message", messageDesc).
    if (message) {
    // Let messageDesc be
    // PropertyDescriptor{ [[Value]]: message, [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: true }.

      const messageDesc = {
        value: message,
        writable: true,
        enumerable: true,
        configurable: true
      };

      Object.defineProperty(value, "message", messageDesc);
    }

    // Any interesting accompanying data attached to serialized should be deserialized and attached to value.
  } else {
    // Otherwise:

    // Let interfaceName be serialized.[[Type]].
    const interfaceName = serialized.Type;

    /**
     * @TODO If the interface identified by interfaceName is not exposed in targetRealm,
     * then throw a "DataCloneError" DOMException.
     */

    // Set value to a new instance of the interface identified by interfaceName, created in targetRealm.
    // eslint-disable-next-line no-undef
    value = Reflect.construct(targetRealm[interfaceName], []);

    // Set deep to true.
    deep = true;
  }

  // Set memory[serialized] to value.
  memory[serialized] = value;

  if (deep) {
    // If deep is true, then:

    if (serialized.Type === "Map") {
    // If serialized.[[Type]] is "Map", then:

      // For each Record { [[Key]], [[Value]] } entry of serialized.[[MapData]]:
      for (const { Key, Value } of serialized.MapData) {
        // Let deserializedKey be ? StructuredDeserialize(entry.[[Key]], targetRealm, memory).
        const deserializedKey = structuredDeserialize(Key, targetRealm, memory);
        // Let deserializedValue be ? StructuredDeserialize(entry.[[Value]], targetRealm, memory).
        const deserializedValue = structuredDeserialize(Value, targetRealm, memory);

        // Append { [[Key]]: deserializedKey, [[Value]]: deserializedValue } to value.[[MapData]].
        value.set(deserializedKey, deserializedValue);
      }
    } else if (serialized.Type === "Set") {
    // Otherwise, if serialized.[[Type]] is "Set", then:

      // For each entry of serialized.[[SetData]]:
      for (const entry of serialized.SetData) {
        // Let deserializedEntry be ? StructuredDeserialize(entry, targetRealm, memory).
        const deserializedEntry = structuredDeserialize(entry, targetRealm, memory);
        // Append deserializedEntry to value.[[SetData]].
        value.add(deserializedEntry);
      }
    } else if (serialized.Type === "Array" || serialized.Type === "Object") {
    // Otherwise, if serialized.[[Type]] is "Array" or "Object", then:

      // For each Record { [[Key]], [[Value]] } entry of serialized.[[Properties]]:
      for (const { Key, Value } of serialized.Properties) {
        // Let deserializedValue be ? StructuredDeserialize(entry.[[Value]], targetRealm, memory).
        const deserializedValue = structuredDeserialize(Value, targetRealm, memory);
        // Let result be ! CreateDataProperty(value, entry.[[Key]], deserializedValue).
        value[Key] = deserializedValue;

        /**
         * @TODO Assert: result is true.
         */
      }
    } else {
    /**
     * @TODO Otherwise:
     * Perform the appropriate deserialization steps for the interface identified by serialized.[[Type]], given
     * serialized, value, and targetRealm.
     * The deserialization steps may need to perform a sub-deserialization. This is an operation which takes
     * as input a previously-serialized Record subSerialized, and returns
     * StructuredDeserialize(subSerialized, targetRealm, memory).
     * (In other words, a sub-deserialization is a specialization of StructuredDeserialize to be consistent
     * within this invocation.)
     */
    }
  }

  return value;
}

module.exports = {
  structuredDeserializeWithTransfer
};
