"use strict";

// Arbitrary substitution values preserve token spelling; typed property values
// continue to use their canonical serializers. Metadata stays outside shared syntax.
const sources = new WeakMap();

function getRange(value) {
  if (value.start !== undefined) {
    return [value.start, value.end];
  }
  if (Array.isArray(value)) {
    const ranges = value.map(getRange).filter(Boolean);
    if (ranges.length > 0) {
      return [ranges[0][0], ranges.at(-1)[1]];
    }
  }
  return undefined;
}

exports.capture = function capture(value, input) {
  if (!value || typeof value !== "object" || sources.has(value) || input.source === undefined) {
    return;
  }
  const range = getRange(value);
  if (!range) {
    return;
  }
  const [start, end] = range;
  const metadata = { text: input.sliceSource(start, end) };
  if (Array.isArray(value)) {
    let position = start;
    metadata.gaps = value.map(component => {
      capture(component, input);
      const componentRange = getRange(component);
      if (!componentRange) {
        return "";
      }
      const gap = input.sliceSource(position, componentRange[0]);
      position = componentRange[1];
      return gap;
    });
    metadata.suffix = input.sliceSource(position, end);
  } else if (value.value !== null && typeof value.value === "object") {
    capture(value.value, input);
    const inner = getRange(value.value);
    if (inner) {
      metadata.prefix = input.sliceSource(start, inner[0]);
      metadata.suffix = input.sliceSource(inner[1], end);
    }
  }
  sources.set(value, metadata);
};

// CSS Syntax requires comments at token boundaries which would otherwise merge.
// https://drafts.csswg.org/css-syntax-3/#serialization
function boundary(value, first) {
  if (Array.isArray(value)) {
    for (let index = first ? 0 : value.length - 1; first ? index < value.length : index >= 0; index += first ? 1 : -1) {
      const token = boundary(value[index], first);
      if (token) {
        return token;
      }
    }
    return undefined;
  }
  const type = value.types[0];
  if (type === "<function>") {
    return first ? "function" : ")";
  }
  if (type === "<block>") {
    return first ? value.associatedToken : ")";
  }
  if (type === "<delimiter-token>") {
    return value.value === "-->" ? "CDC" : value.value;
  }
  return type?.slice(1, -7);
}

function needsSeparator(before, after) {
  const a = boundary(before, false);
  const b = boundary(after, true);
  const name = ["ident", "function", "url", "bad-url", "-", "number", "percentage", "dimension", "CDC"];
  if (["ident", "at-keyword", "hash", "dimension", "#", "-"].includes(a)) {
    return name.includes(b) || (a === "ident" && b === "(");
  }
  if (a === "number") {
    return (name.includes(b) && b !== "-") || b === "%";
  }
  if (a === "@") {
    return ["ident", "function", "url", "bad-url", "-", "CDC"].includes(b);
  }
  if (a === "." || a === "+") {
    return ["number", "percentage", "dimension"].includes(b);
  }
  return a === "/" && b === "*";
}

function serializeList(components, gaps, suffix, serializeComponentValue) {
  let text = "";
  let previous;
  for (let index = 0; index < components.length; ++index) {
    const component = components[index];
    const serialized = exports.serialize(component, serializeComponentValue);
    const gap = gaps[index];
    // Escaped spaces and non-ASCII whitespace can belong to identifiers, so
    // decide separation from the tokens rather than their serialized spelling.
    if (previous && gap === "" && text && serialized &&
        !text.endsWith("*/") && !serialized.startsWith("/*") && needsSeparator(previous, component)) {
      text += "/**/";
    }
    text += gap + serialized;
    if (boundary(component, false)) {
      previous = component;
    }
  }
  return text + suffix;
}

exports.serialize = function serialize(value, serializeComponentValue) {
  const source = sources.get(value);
  if (source) {
    return source.text;
  }
  if (Array.isArray(value)) {
    const gaps = value.map((_, index) => {
      return index === 0 ? "" : value.separator;
    });
    return serializeList(value, gaps, "", serializeComponentValue);
  }
  return serializeComponentValue(value);
};

exports.substitute = (original, replacement, components, serialize) => {
  const source = sources.get(original);
  if (!source) {
    return replacement;
  }
  let text;
  if (source.gaps) {
    text = serializeList(components, source.gaps, source.suffix, serialize);
  } else if (source.prefix !== undefined) {
    text = source.prefix + exports.serialize(components, serialize) + source.suffix;
  }
  if (text !== undefined) {
    sources.set(replacement, { text });
  }
  return replacement;
};

exports.copy = (original, replacement) => {
  const source = sources.get(original);
  if (source) {
    sources.set(replacement, source);
  }
  return replacement;
};
