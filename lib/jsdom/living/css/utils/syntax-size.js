"use strict";

exports.syntaxSize = syntaxSize;
// Cache weights estimate retained syntax, rather than exact VM heap usage.
const syntaxObjectSize = (exports.syntaxObjectSize = 64);

// Oversized entries need only a lower bound sufficient to reject admission.
function syntaxSize(value, seen = new Set(), limit = Infinity) {
  if (typeof value === "string") {
    return value.length * 2;
  }
  if (!value || typeof value !== "object" || seen.has(value)) {
    return 0;
  }
  seen.add(value);
  let size = syntaxObjectSize;
  if (value instanceof Map) {
    size += value.size * 16;
    for (const [key, entry] of value) {
      if (size > limit) {
        break;
      }
      size += syntaxSize(key, seen, limit - size);
      size += syntaxSize(entry, seen, limit - size);
    }
    return size;
  }
  if (Array.isArray(value)) {
    size += value.length * 8;
  }
  for (const key of Object.keys(value)) {
    if (size > limit) {
      break;
    }
    // Rule definitions are the shared grammar tables, not cached syntax.
    if (key !== "definition") {
      size += syntaxSize(value[key], seen, limit - size);
    }
  }
  return size;
}
