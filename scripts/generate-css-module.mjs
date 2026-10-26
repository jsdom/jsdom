import values from "../lib/jsdom/living/css/values/value.js";

const { isList, omitted } = values;

export function generateCSSModule(syntax, source) {
  const identifiers = new WeakMap();
  const visiting = new Set();
  const statements = [];
  let identifiersCounter = 0;
  function emit(value) {
    if (value === omitted) {
      return "omitted";
    }
    if (value === undefined) {
      return "undefined";
    }
    if (typeof value === "number") {
      return Object.is(value, -0) ? "-0" : String(value);
    }
    if (value === null || typeof value === "string" || typeof value === "boolean") {
      return JSON.stringify(value);
    }
    if (typeof value !== "object" || visiting.has(value)) {
      throw new Error("CSS syntax contains a non-serializable or cyclic value");
    }
    const previous = identifiers.get(value);
    if (previous) {
      return previous;
    }
    visiting.add(value);
    let expression;
    let properties = Object.entries(value);
    if (isList(value)) {
      expression = `list([${value.map(emit).join(",")}],${emit(value.separator)},${emit(value.types)})`;
      properties = properties.filter(([key]) => key !== "types" && key !== "separator" && !/^\d+$/.test(key));
    } else if (Array.isArray(value)) {
      expression = `[${value.map(emit).join(",")}]`;
      properties = properties.filter(([key]) => !/^\d+$/.test(key));
    } else if (value instanceof Map) {
      expression = `new Map([${[...value].map(([key, entry]) => `[${emit(key)},${emit(entry)}]`).join(",")}])`;
    } else if (Object.getPrototypeOf(value) === Object.prototype) {
      expression = `{${properties.map(([key, entry]) => `${JSON.stringify(key)}:${emit(entry)}`).join(",")}}`;
      properties = [];
    } else {
      throw new Error(`CSS syntax contains a non-syntax object: ${value.constructor.name}`);
    }
    if (Reflect.ownKeys(value).some(key => typeof key === "symbol")) {
      throw new Error("CSS syntax contains unexpected symbol properties");
    }
    if (properties.length !== 0) {
      const entries = properties.map(([key, entry]) => `${JSON.stringify(key)}:${emit(entry)}`).join(",");
      expression = `Object.assign(${expression},{${entries}})`;
    }
    visiting.delete(value);
    const identifier = `v${identifiersCounter++}`;
    identifiers.set(value, identifier);
    statements.push(`const ${identifier} = ${expression};`);
    return identifier;
  }
  const root = emit(syntax);
  return '"use strict";\n\n' +
    `// Generated from ${source}.\n` +
    'const { list, omitted } = require("../jsdom/living/css/values/value.js");\n' +
    `${statements.join("\n")}\nmodule.exports = ${root};\n`;
}
