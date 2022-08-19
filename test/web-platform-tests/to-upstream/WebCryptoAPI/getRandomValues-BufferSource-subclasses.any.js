"use strict";

const arrays = [
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "BigInt64Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Uint16Array",
  "Uint32Array",
  "BigUint64Array"
];

for (const array of arrays) {
  const ctor = globalThis[array];
  test(() => {
    class Buffer extends ctor {}
    try {
      self.crypto.getRandomValues(new Buffer(256));
    } catch (e) {
      assert_unreached("No error thrown");
    }
  }, "Subclass of " + array);
}
