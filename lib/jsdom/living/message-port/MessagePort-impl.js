"use strict";

const DOMException = require("domexception/webidl2js-wrapper");
const MessageEvent = require("../generated/MessageEvent");
const { isArrayBuffer, isArrayBufferResizable } = require("../generated/utils");
const { fireAnEvent } = require("../helpers/events");
const { isDetachedBuffer } = require("../../utils");

class PortMessageQueue {
  constructor() {
    this._enabled = false;
    this.queue = [];
  }

  enable() {
    if (this._enabled) {
      return;
    }

    this._enabled = true;
  }
}

function structuredSerializeInternal(value, forStorage, memory = {}) {
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
    throw DOMException.create(this.globalObject, [
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
        throw DOMException.create(this.globalObject, [
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
          ArrayBufferData: value.bufferView,
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
          ArrayBufferData: value.bufferView,
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
        throw DOMException.create(this.globalObject, [
          "The object can not be cloned.",
          "DataCloneError"
        ]);
      }

      const size = value.byteLength;
      const dataCopy = new ArrayBuffer(size);
      new Uint8Array(dataCopy).set(bufferView);

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
          ArrayBufferData: dataCopy,
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
          ArrayBufferData: dataCopy,
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
     * @TODO Let message be undefined if IsDataDescriptor(valueMessageDesc) is false
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
    throw DOMException.create(this.globalObject, [
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

        const serializedKey = structuredSerializeInternal(entry.Key, forStorage, memory);
        const serializedValue = structuredSerializeInternal(entry.Value, forStorage, memory);

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
        const serializedEntry = structuredSerializeInternal(entry, forStorage, memory);
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
          const outputValue = structuredSerializeInternal(inputValue, forStorage, memory);

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
      throw DOMException.create(window, [
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
      throw DOMException.create(window, [
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
      value = Reflect.construct(window[serialized.Constructor], [
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
    value = Reflect.construct(window[interfaceName], []);

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
      value.set(transferDataHolder.ArrayBufferData, 0);
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
      value.set(transferDataHolder.ArrayBufferData);
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
      value = Reflect.construct(window[interfaceName], []);
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

function structuredSerializeWithTransfer(value, transferList) {
  const memory = {};

  for (const transferable of transferList) {
    /**
     * @TODO If transferable has neither an [[ArrayBufferData]] internal slot nor a [[Detached]] internal slot,
     *    then throw a "DataCloneError" DOMException.
     *
     * Missing check on [[ArrayBufferData]]
     */

    if (!Object.prototype.hasOwnProperty.call(transferable, "_detached")) {
      throw DOMException.create(this.globalObject, [
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
      throw DOMException.create(this.globalObject, [
        "The object can not be cloned.",
        "DataCloneError"
      ]);
    }

    if (memory[transferable]) {
      throw DOMException.create(this.globalObject, [
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
  const serialized = structuredSerializeInternal(value, false, memory);

  const transferDataHolders = [];

  for (const transferable of transferList) {
    /**
     * If transferable has an [[ArrayBufferData]] internal slot and IsDetachedBuffer(transferable)
     * is true, then throw a "DataCloneError" DOMException.
     */

    if (isArrayBuffer(transferable) && isDetachedBuffer(transferable)) {
      throw DOMException.create(this.globalObject, [
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
      /**
       * WARNING: experimental and not property
       */

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
        dataHolder.ArrayBufferData = transferable.ArrayBufferData;
        dataHolder.ArrayBufferByteLength = transferable.byteLength;
        dataHolder.ArrayBufferMaxByteLength = transferable.maxByteLength || transferable.byteLength;
      } else {
        /**
         * Set dataHolder.[[Type]] to "ArrayBuffer".
         * Set dataHolder.[[ArrayBufferData]] to transferable.[[ArrayBufferData]].
         * Set dataHolder.[[ArrayBufferByteLength]] to transferable.[[ArrayBufferByteLength]].
         */

        dataHolder.Type = "ArrayBuffer";
        dataHolder.ArrayBufferData = transferable.ArrayBufferData;
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
}

class MessagePortImpl {
  constructor(globalObject, remotePort) {
    this._globalObject = globalObject;
    this._detached = false;
    this._onmessage = undefined;
    this._onmessageerror = undefined;
    this._dataHolder = {
      _remotePort: remotePort,
      _portMessageQueue: new PortMessageQueue()
    };
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

    queueMicrotask(() => {
      const finalTargetPort = targetPort;
      /**
       * @TODO Let deserializeRecord be StructuredDeserializeWithTransfer(serializeWithTransferResult, targetRealm).
       * @TODO If this throws an exception, catch it, fire an event named messageerror at finalTargetPort, using
       *        MessageEvent, and then return.
       */

      let deserializeRecord;

      try {
        deserializeRecord = structuredDeserializeWithTransfer(serializeWithTransferResult);
      } catch (err) {
        fireAnEvent("messageerror", finalTargetPort, MessageEvent, { data: err })
      }


      /**
       * @TODO Let messageClone be deserializeRecord.[[Deserialized]].
       */

      const messageClone = undefined;

      const newPorts = Object.freeze([]);

      fireAnEvent("message", finalTargetPort, MessageEvent, { data: messageClone, ports: newPorts });
    });
  }

  start() {
    this._dataHolder._portMessageQueue.enable();
  }

  close() {
    this._detached = true;
    this._dataHolder._remotePort = null;
  }
}

module.exports = {
  implementation: MessagePortImpl
};
