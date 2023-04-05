"use strict";

const DOMException = require("domexception/webidl2js-wrapper");
const { isArrayBuffer } = require("../generated/utils");
const { isDetachedBuffer, isArrayBufferResizable } = require("../../utils");

function structuredSerializeWithTransfer(globalObject) {
  return function (value, transferList = []) {
    if (!Array.isArray(transferList)) {
      transferList = [transferList];
    }

    const memory = {};

    for (const transferable of transferList) {
      /**
       * @TODO If transferable has neither an [[ArrayBufferData]] internal slot nor a [[Detached]] internal slot,
       *    then throw a "DataCloneError" DOMException.
       *
       * Missing check on [[ArrayBufferData]]
       */

      if (isDetachedBuffer(transferable)) {
        throw DOMException.create(globalObject, [
          "The object can not be cloned.",
          "DataCloneError"
        ]);
      }

      /**
       * @TODO If transferable has an [[ArrayBufferData]] internal slot and IsSharedArrayBuffer(transferable) is true,
       *    then throw a "DataCloneError" DOMException.
       *
       * Missing check on [[ArrayBufferData]]
       */

      if (transferable instanceof SharedArrayBuffer) {
        throw DOMException.create(globalObject, [
          "The object can not be cloned.",
          "DataCloneError"
        ]);
      }

      if (memory[transferable]) {
        throw DOMException.create(globalObject, [
          "The object can not be cloned.",
          "DataCloneError"
        ]);
      }

      memory[transferable] = {
        [[transferable.constructor.name]]: undefined
      };
    }

    /**
     * Let serialized be ? StructuredSerializeInternal(value, false, memory).
     */
    const serialized = structuredSerializeInternal(globalObject)(value, false, memory);

    const transferDataHolders = [];

    for (const transferable of transferList) {
      /**
       * If transferable has an [[ArrayBufferData]] internal slot and IsDetachedBuffer(transferable)
       * is true, then throw a "DataCloneError" DOMException.
       */

      if (isArrayBuffer(transferable) && isDetachedBuffer(transferable)) {
        throw DOMException.create(globalObject, [
          "The object can not be cloned.",
          "DataCloneError"
        ]);
      }

      /**
       * @TODO If transferable has a [[Detached]] internal slot and transferable.[[Detached]] is true,
       * then throw a "DataCloneError" DOMException.
       *
       * Comment: How do we detect [[Detached]] internal slot from javascript?
       */

      /**
       * Let dataHolder be memory[transferable].
       */
      const dataHolder = memory[transferable];

      /**
       * If transferable has an [[ArrayBufferData]] internal slot, then:
       */
      if (isArrayBuffer(transferable)) {
        const view = new Uint8Array(transferable);

        /**
         * If transferable has an [[ArrayBufferMaxByteLength]] internal slot, then
         */
        if (isArrayBufferResizable(transferable)) {
          /**
           * Set dataHolder.[[Type]] to "ResizableArrayBuffer".
           * Set dataHolder.[[ArrayBufferData]] to transferable.[[ArrayBufferData]].
           * Set dataHolder.[[ArrayBufferByteLength]] to transferable.[[ArrayBufferByteLength]].
           * Set dataHolder.[[ArrayBufferMaxByteLength]] to transferable.[[ArrayBufferMaxByteLength]].
           */

          dataHolder.Type = "ResizableArrayBuffer";
          dataHolder.ArrayBufferData = Array.from(view);
          dataHolder.ArrayBufferByteLength = transferable.byteLength;
          dataHolder.ArrayBufferMaxByteLength = transferable.maxByteLength || transferable.byteLength;
        } else {
          /**
           * Set dataHolder.[[Type]] to "ArrayBuffer".
           * Set dataHolder.[[ArrayBufferData]] to transferable.[[ArrayBufferData]].
           * Set dataHolder.[[ArrayBufferByteLength]] to transferable.[[ArrayBufferByteLength]].
           */

          dataHolder.Type = "ArrayBuffer";
          dataHolder.ArrayBufferData = Array.from(view);
          dataHolder.ArrayBufferByteLength = transferable.byteLength;
          dataHolder.ArrayBufferMaxByteLength = transferable.maxByteLength;

          /**
           * @TODO Perform ? DetachArrayBuffer(transferable).
           * Comment: should we use a WeakRef perhaps to simulate detaching?
           */
        }
      } else {
      /**
       * @TODO Assert: transferable is a platform object that is a transferable object.
       *
       * Let interfaceName be the identifier of the primary interface of transferable.
       *
       * Set dataHolder.[[Type]] to interfaceName.
       *
       * Perform the appropriate transfer steps for the interface identified by interfaceName,
       * given transferable and dataHolder.
       *
       * Set transferable.[[Detached]] to true.
       */
      }

      transferDataHolders.push(dataHolder);
    }

    return {
      Serialized: serialized,
      TransferDataHolders: transferDataHolders
    };
  };
}

/**
 * @see https://html.spec.whatwg.org/#structuredserializeinternal
 * @param {*} value
 * @param {boolean} forStorage
 * @param {object} memory
 * @returns
 */

function structuredSerializeInternal(globalObject) {
  return function (value, forStorage, memory = {}) {
    if (memory[value]) {
      return memory[value];
    }

    let deep = false;

    /**
     * If Type(value) is Undefined, Null, Boolean, Number, BigInt, or String, then return
     * { [[Type]]: "primitive", [[Value]]: value }.
     */

    const isPrimitiveInstance =
      value === null ||
      value === undefined ||
      value instanceof Boolean ||
      value instanceof BigInt ||
      value instanceof String;

    if (isPrimitiveInstance) {
      return {
        Type: "primitive",
        Value: value
      };
    }

    /**
     * If Type(value) is Symbol, then throw a "DataCloneError" DOMException.
     */

    if (typeof value === "symbol") {
      throw DOMException.create(globalObject, [
        "The object can not be cloned.",
        "DataCloneError"
      ]);
    }

    let serialized;

    if (typeof value === "boolean") {
      /**
       * If value has a [[BooleanData]] internal slot, then set serialized to
       * {
       *  [[Type]]: "Boolean",
       *  [[BooleanData]]: value.[[BooleanData]]
       * }.
       */

      serialized = {
        Type: "Boolean",
        BooleanData: value
      };
    } else if (typeof value === "number") {
      /**
       * Otherwise, if value has a [[NumberData]] internal slot, then set serialized to
       * {
       *    [[Type]]: "Number",
       *    [[NumberData]]: value.[[NumberData]]
       * }.
       */

      serialized = {
        Type: "Number",
        NumberData: value
      };
    } else if (typeof value === "bigint") {
      /**
       * Otherwise, if value has a [[BigIntData]] internal slot, then set serialized to
       * {
       *  [[Type]]: "BigInt",
       *  [[BigIntData]]: value.[[BigIntData]]
       * }.
       */

      serialized = {
        Type: "BigInt",
        BigIntData: value
      };
    } else if (typeof value === "string") {
      /**
       * Otherwise, if value has a [[StringData]] internal slot, then set serialized to
       * {
       *  [[Type]]: "String",
       *  [[StringData]]: value.[[StringData]]
       * }
       */

      serialized = {
        Type: "String",
        StringData: value
      };
    } else if (value instanceof Date) {
      /**
       * Otherwise, if value has a [[DateValue]] internal slot, then set serialized to
       * {
       *  [[Type]]: "Date",
       *  [[DateValue]]: value.[[DateValue]]
       * }
       */

      serialized = {
        Type: "Date",
        DateValue: value
      };

    /**
     * Otherwise, if value has a [[RegExpMatcher]] internal slot, then set serialized to
     * {
     *   [[Type]]: "RegExp",
     *   [[RegExpMatcher]]: value.[[RegExpMatcher]],
     *   [[OriginalSource]]: value.[[OriginalSource]],
     *   [[OriginalFlags]]: value.[[OriginalFlags]]
     * }
     */
    } else if (value instanceof RegExp) {
      serialized = {
        Type: "RegExp",
        /**
         * @TODO verify what is a RegExpMatcher. It might not be available in JS.
         */
        RegExpMatcher: value.source,
        OriginalSource: value.source,
        OriginalFlags: value.flags
      };
    } else if (isArrayBuffer(value)) {
      /**
       * Otherwise, if value has an [[ArrayBufferData]] internal slot, then:
       */

      const bufferView = new Uint8Array(value);

      if (value instanceof SharedArrayBuffer) {
        if (forStorage) {
          throw DOMException.create(globalObject, [
            "The object can not be cloned.",
            "DataCloneError"
          ]);
        }

        /**
         * If value has an [[ArrayBufferMaxByteLength]] internal slot
        */
        if (isArrayBufferResizable(value)) {
          /**
           * set serialized to
           *  {
           *    [[Type]]: "GrowableSharedArrayBuffer",
           *    [[ArrayBufferData]]: value.[[ArrayBufferData]],
           *    [[ArrayBufferByteLengthData]]: value.[[ArrayBufferByteLengthData]],
           *    [[ArrayBufferMaxByteLength]]: value.[[ArrayBufferMaxByteLength]],
           *    [[AgentCluster]]: the surrounding agent's agent cluster
           * }
           */

          serialized = {
            Type: "GrowableSharedArrayBuffer",
            ArrayBufferData: Array.from(bufferView),
            ArrayBufferByteLengthData: value.byteLength,
            ArrayBufferMaxByteLength: value.maxByteLength

            /**
             * @TODO ???
             */

            // AgentCluster: the surrounding agent's agent cluster
          };
        } else {
          /**
           * Otherwise, set serialized to {
           *  [[Type]]: "SharedArrayBuffer",
           *  [[ArrayBufferData]]: value.[[ArrayBufferData]],
           *  [[ArrayBufferByteLength]]: value.[[ArrayBufferByteLength]],
           *  [[AgentCluster]]: the surrounding agent's agent cluster
           * }.
          */

          serialized = {
            Type: "SharedArrayBuffer",
            ArrayBufferData: Array.from(bufferView),
            ArrayBufferByteLength: value.byteLength

            /**
             * @TODO ???
             */

            // AgentCluster: the surrounding agent's agent cluster
          };
        }
      } else {
        /**
         * If IsDetachedBuffer(value) is true, then throw a "DataCloneError" DOMException.
         */

        if (isDetachedBuffer(value)) {
          throw DOMException.create(globalObject, [
            "The object can not be cloned.",
            "DataCloneError"
          ]);
        }

        const size = value.byteLength;
        const view = new Uint8Array(new ArrayBuffer(size)).set(bufferView);

        /**
         * If value has an [[ArrayBufferMaxByteLength]] internal slot,
         */
        if (isArrayBufferResizable(value)) {
          /**
           * Set serialized to
           *      {
           *        [[Type]]: "ResizableArrayBuffer",
           *        [[ArrayBufferData]]: dataCopy,
           *        [[ArrayBufferByteLength]]: size,
           *        [[ArrayBufferMaxByteLength]]: value.[[ArrayBufferMaxByteLength]]
           *      }
           */

          serialized = {
            Type: "ResizableArrayBuffer",
            ArrayBufferData: Array.from(view),
            ArrayBufferByteLength: size,
            ArrayBufferMaxByteLength: value.maxByteLength
          };
        } else {
          /**
           * Otherwise, set serialized to
           * {
           *  [[Type]]: "ArrayBuffer",
           *  [[ArrayBufferData]]: dataCopy,
           *  [[ArrayBufferByteLength]]: size
           * }.
           */

          serialized = {
            Type: "ArrayBuffer",
            ArrayBufferData: Array.from(view),
            ArrayBufferByteLength: size
          };
        }
      }
    } else if (ArrayBuffer.isView(value)) {
      /**
       * @TODO
       * Otherwise, if value has a [[ViewedArrayBuffer]] internal slot, then:
       * If IsArrayBufferViewOutOfBounds(value) is true, then throw a "DataCloneError" DOMException.
       * Let buffer be the value of value's [[ViewedArrayBuffer]] internal slot.
       * Let bufferSerialized be ? StructuredSerializeInternal(buffer, forStorage, memory).
       * Assert: bufferSerialized.
       *   [[Type]] is "ArrayBuffer", "ResizableArrayBuffer", "SharedArrayBuffer", or "GrowableSharedArrayBuffer".
       * If value has a [[DataView]] internal slot, then set serialized to
       *   {
       *     [[Type]]: "ArrayBufferView",
       *     [[Constructor]]: "DataView",
       *     [[ArrayBufferSerialized]]: bufferSerialized,
       *     [[ByteLength]]: value.[[ByteLength]],
       *     [[ByteOffset]]: value.[[ByteOffset]]
       *   }.
       *
       * Otherwise:
       *     Assert: value has a [[TypedArrayName]] internal slot.
       *     Set serialized to {
       *       [[Type]]: "ArrayBufferView",
       *       [[Constructor]]: value.[[TypedArrayName]],
       *       [[ArrayBufferSerialized]]: bufferSerialized,
       *       [[ByteLength]]: value.[[ByteLength]],
       *       [[ByteOffset]]: value.[[ByteOffset]],
       *       [[ArrayLength]]: value.[[ArrayLength]]
       *     }.
       */
    } else if (value instanceof Map) {
      serialized = {
        Type: "Map",
        MapData: []
      };

      deep = true;
    } else if (value instanceof Set) {
      serialized = {
        Type: "Set",
        SetData: []
      };

      deep = true;
    } else if (value instanceof Error) {
      // Let name be ? Get(value, "name").
      let { name } = Reflect.get(value, "name");

      /**
       * If name is not one of
       * "Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", or "URIError",
       * then set name to "Error".
       */

      if (![
        "Error",
        "EvalError",
        "RangeError",
        "ReferenceError",
        "SyntaxError",
        "TypeError",
        "URIError"
      ].includes(name)) {
        name = "Error";
      }

      /**
       * Let valueMessageDesc be ? value.[[GetOwnProperty]]("message").
       */
      const valueMessageDesc = Reflect.getOwnPropertyDescriptor(value, "message");

      /**
       * Let message be undefined if IsDataDescriptor(valueMessageDesc) is false
       *      and ? ToString(valueMessageDesc.[[Value]]) otherwise.
       */

      const message = valueMessageDesc ? String(valueMessageDesc.value) : undefined;

      /**
       * Set serialized to {
       *  [[Type]]: "Error",
       *  [[Name]]: name,
       *  [[Message]]: message
       * }
       */

      serialized = {
        Type: "Error",
        Name: name,
        Message: message
      };

      // User agents should attach a serialized representation of any interesting accompanying data which
      // are not yet specified, notably the stack property, to serialized.
    } else if (value instanceof Array) {
      /**
       * Let valueLenDescriptor be ? OrdinaryGetOwnProperty(value, "length").
       */

      const valueLenDescriptor = Object.getOwnPropertyDescriptor(value, "length");

      /**
       * Let valueLen be valueLenDescriptor.[[Value]].
       */

      const valueLen = valueLenDescriptor.value;

      /**
       * Set serialized to {
       *  [[Type]]: "Array",
       *  [[Length]]: valueLen,
       *  [[Properties]]: a new empty List
       * }.
       */

      serialized = {
        Type: "Array",
        Length: valueLen,
        Properties: []
      };

      /**
       * Set deep to true.
       */

      deep = true;
    // eslint-disable-next-line no-constant-condition, no-dupe-else-if
    } else if (false) {

      /**
       * @TODO HUH?
       *
       * Otherwise, if value is a platform object that is a serializable object:
       * If value has a [[Detached]] internal slot whose value is true, then throw a "DataCloneError" DOMException.
       * Let typeString be the identifier of the primary interface of value.
       * Set serialized to { [[Type]]: typeString }.
       * Set deep to true.
       */

      /**
       * @TODO HUH?
       * Otherwise, if value is a platform object, then throw a "DataCloneError" DOMException.
       */

      /**
       * Otherwise, if IsCallable(value) is true, then throw a "DataCloneError" DOMException.
       */

    } else if (typeof value === "function") {
      throw DOMException.create(globalObject, [
        "The object can not be cloned.",
        "DataCloneError"
      ]);
    // eslint-disable-next-line no-dupe-else-if, no-constant-condition
    } else if (false) {
      /**
       * @TODO HUH?
       *
       * Otherwise, if value has any internal slot other than
       * [[Prototype]] or [[Extensible]], then throw a "DataCloneError" DOMException.
       */
    // eslint-disable-next-line no-dupe-else-if, no-constant-condition
    } else if (false) {
    /**
     * @TODO Otherwise, if value is an exotic object and value is not the %Object.prototype%
     * intrinsic object associated with any realm, then throw a "DataCloneError" DOMException.
     */
    } else {
    /**
     * Set serialized to { [[Type]]: "Object", [[Properties]]: a new empty List }.
     * Set deep to true.
     */

      serialized = {
        Type: "Object",
        Properties: []
      };

      deep = true;
    }

    memory[value] = serialized;

    if (deep) {
      if (serialized.MapData) {
        const copiedList = [];

        /**
         * For each Record { [[Key]], [[Value]] } entry of value.[[MapData]]:
         */

        for (const [key, val] of Object.entries(value)) {
          /**
           * Let copiedEntry be a new Record { [[Key]]: entry.[[Key]], [[Value]]: entry.[[Value]] }.
           */

          const copiedEntry = { Key: key, Value: val };

          /**
           * @TODO If copiedEntry.[[Key]] is not the special value empty,
           * append copiedEntry to copiedList.
           */

          copiedList.push(copiedEntry);
        }

        /**
         * For each Record { [[Key]], [[Value]] } entry of copiedList:
         */

        for (const entry of copiedList) {
          /**
           * Let serializedKey be ? StructuredSerializeInternal(entry.[[Key]], forStorage, memory).
           * Let serializedValue be ? StructuredSerializeInternal(entry.[[Value]], forStorage, memory).
           * Append { [[Key]]: serializedKey, [[Value]]: serializedValue } to serialized.[[MapData]].
           */

          const serializedKey = structuredSerializeInternal(globalObject)(entry.Key, forStorage, memory);
          const serializedValue = structuredSerializeInternal(globalObject)(entry.Value, forStorage, memory);

          serialized.MapData.push({
            Key: serializedKey,
            Value: serializedValue
          });
        }

      // Otherwise, if value has a [[SetData]] internal slot, then:
      } else if (serialized.SetData) {
        /**
         * Let copiedList be a new empty List.
         */

        const copiedList = [];

        // For each entry of value.[[SetData]]:
        for (const val of value) {
          /**
           * @TODO If entry is not the special value empty, append entry to copiedList.
           */

          copiedList.push(val);
        }

        /**
         * For each entry of copiedList:
         * Let serializedEntry be ? StructuredSerializeInternal(entry, forStorage, memory).
         * Append serializedEntry to serialized.[[SetData]].
         */

        for (const entry of copiedList) {
          const serializedEntry = structuredSerializeInternal(globalObject)(entry, forStorage, memory);
          serialized.SetData.push(serializedEntry);
        }

        // eslint-disable-next-line no-dupe-else-if, no-constant-condition
      } else if (false) {
        /**
         * @TODO Otherwise, if value is a platform object that is a serializable object,
         * then perform the serialization steps for value's primary interface,
         * given value, serialized, and forStorage.
         *
         * The serialization steps may need to perform a sub-serialization.
         * This is an operation which takes as input a value subValue, and
         * returns StructuredSerializeInternal(subValue, forStorage, memory).
         *
         * (In other words, a sub-serialization is a specialization of
         * StructuredSerializeInternal to be consistent within this invocation.)
         */
      } else {
        /**
         * Otherwise, for each key in ! EnumerableOwnProperties(value, key):
         */

        for (const key in value) {
          /**
           * If ! HasOwnProperty(value, key) is true, then:
           */

          if (!Object.hasOwnProperty.call(value, key)) {
            // Let inputValue be ? value.[[Get]](key, value).
            const inputValue = value.Get;
            // Let outputValue be ? StructuredSerializeInternal(inputValue, forStorage, memory).
            const outputValue = structuredSerializeInternal(globalObject)(inputValue, forStorage, memory);

            // Append { [[Key]]: key, [[Value]]: outputValue } to serialized.[[Properties]].
            serialized.Properties.push({
              Key: key,
              Value: outputValue
            });
          }
        }
      }
    }

    return serialized;
  };
}

module.exports = {
  structuredSerializeWithTransfer
};
