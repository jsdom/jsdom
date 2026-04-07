"use strict";

const {
  resolve: resolveColor,
  utils: { cssCalc, resolveGradient, splitValue }
} = require("@asamuzakjp/css-color");
const propertyDefinitions = require("../../../../generated/css-property-definitions");
const { asciiLowercase } = require("../../helpers/strings");
const csstree = require("./patched-csstree.js");
const { systemColors } = require("./system-colors");

// Constants
const MAX_CACHE_SIZE = 2046;
const CALC_FUNC_NAMES = "(?:a?(?:cos|sin|tan)|abs|atan2|calc|clamp|exp|hypot|log|max|min|mod|pow|rem|round|sign|sqrt)";

// CSS global keywords
// @see https://drafts.csswg.org/css-cascade-5/#defaulting-keywords
const GLOBAL_KEYS = new Set(["initial", "inherit", "unset", "revert", "revert-layer"]);

// AST node types
const AST_TYPES = Object.freeze({
  CALC: "Calc",
  DIMENSION: "Dimension",
  FUNCTION: "Function",
  GLOBAL_KEYWORD: "GlobalKeyword",
  HASH: "Hash",
  IDENTIFIER: "Identifier",
  NUMBER: "Number",
  PERCENTAGE: "Percentage",
  STRING: "String",
  URL: "Url"
});

// Regular expressions
const calcRegEx = new RegExp(`^${CALC_FUNC_NAMES}\\(`);
const calcContainedRegEx = new RegExp(`(?<=[*/\\s(])${CALC_FUNC_NAMES}\\(`);
const calcNameRegEx = new RegExp(`^${CALC_FUNC_NAMES}$`);
const varRegEx = /^var\(/;
const varContainedRegEx = /(?<=[*/\s(])var\(/;

// Generational cache
let currentCache = new Map();
let oldCache = new Map();

function getCachedValue(key) {
  let value = currentCache.get(key);
  if (value !== undefined) {
    return value;
  }
  value = oldCache.get(key);
  if (value !== undefined) {
    setCachedValue(key, value);
    return value;
  }
  return undefined;
}

function setCachedValue(key, value) {
  currentCache.set(key, value);
  if (currentCache.size >= MAX_CACHE_SIZE) {
    oldCache = currentCache;
    currentCache = new Map();
  }
}

function getPropertyDefinition(property) {
  if (propertyDefinitions.has(property)) {
    return propertyDefinitions.get(property);
  } else if (property.startsWith("--")) {
    return { inherited: "yes", initial: "" };
  }
  return {};
}

function isGlobalKeyword(val) {
  return GLOBAL_KEYS.has(asciiLowercase(val));
}

function hasVarFunc(val) {
  return varRegEx.test(val) || varContainedRegEx.test(val);
}

function hasCalcFunc(val) {
  return calcRegEx.test(val) || calcContainedRegEx.test(val);
}

// Checks if the value is a valid property value. Returns false for custom properties or values containing var().
function isValidPropertyValue(prop, val) {
  if (!propertyDefinitions.has(prop)) {
    return false;
  }
  val = val.trim();
  if (val === "") {
    return true;
  }
  const cacheKey = `isValidPropertyValue\0${prop}\0${val}`;
  const cachedValue = getCachedValue(cacheKey);
  if (typeof cachedValue === "boolean") {
    return cachedValue;
  }
  let result;
  try {
    const ast = csstree.parse(val, {
      context: "value"
    });
    const { error, matched } = csstree.lexer.matchProperty(prop, ast);
    result = error === null && matched !== null;
  } catch {
    result = false;
  }
  setCachedValue(cacheKey, result);
  return result;
}

// Resolves CSS math functions.
function resolveCalc(val, opt = { format: "specifiedValue" }) {
  val = val.trim();
  if (val === "" || hasVarFunc(val) || !hasCalcFunc(val)) {
    return val;
  }
  const cacheKey = `resolveCalc_${val}_${opt.format}`;
  const cachedValue = getCachedValue(cacheKey);
  if (typeof cachedValue === "string") {
    return cachedValue;
  }
  const ast = csstree.parse(val, { context: "value" });
  if (!ast?.children) {
    return undefined;
  }
  const values = [];
  for (const item of ast.children) {
    const { type: itemType, name: itemName, value: itemValue } = item;
    if (itemType === AST_TYPES.FUNCTION) {
      const value = csstree
        .generate(item)
        .replace(/\)(?!\)|\s|,)/g, ") ")
        .trim();
      if (calcNameRegEx.test(itemName)) {
        const newValue = cssCalc(value, opt);
        values.push(newValue);
      } else {
        values.push(value);
      }
    } else if (itemType === AST_TYPES.STRING) {
      values.push(`"${itemValue}"`);
    } else {
      values.push(itemName ?? itemValue);
    }
  }
  const resolvedValue = values.join(" ");
  setCachedValue(cacheKey, resolvedValue);
  return resolvedValue;
}

// Parses a property value. Returns a string or an array of parsed objects.
function parsePropertyValue(prop, val, opt = {}) {
  if (!propertyDefinitions.has(prop)) {
    return undefined;
  }
  const { caseSensitive } = opt;
  val = val.trim();
  if (val === "" || hasVarFunc(val)) {
    return val;
  } else if (hasCalcFunc(val)) {
    const calculatedValue = resolveCalc(val, {
      format: "specifiedValue"
    });
    if (typeof calculatedValue !== "string") {
      return undefined;
    }
    val = calculatedValue;
  }
  const cacheKey = `parsePropertyValue_${prop}_${val}_${caseSensitive}`;
  const cachedValue = getCachedValue(cacheKey);
  if (cachedValue === false) {
    return undefined;
  } else if (cachedValue !== undefined) {
    return cachedValue;
  }
  let parsedValue;
  const lowerCasedValue = asciiLowercase(val);
  if (GLOBAL_KEYS.has(lowerCasedValue)) {
    parsedValue = [
      {
        type: AST_TYPES.GLOBAL_KEYWORD,
        name: lowerCasedValue
      }
    ];
  } else {
    try {
      const ast = csstree.parse(val, {
        context: "value"
      });
      const { error, matched } = csstree.lexer.matchProperty(prop, ast);
      if (error || !matched) {
        parsedValue = false;
      } else {
        const items = ast.children;
        const itemCount = items.size;
        const values = [];
        for (const item of items) {
          const { children, name, type, value, unit } = item;
          switch (type) {
            case AST_TYPES.DIMENSION: {
              values.push({
                type,
                value,
                unit: asciiLowercase(unit)
              });
              break;
            }
            case AST_TYPES.FUNCTION: {
              const raw = itemCount === 1 ? val : csstree.generate(item).replace(/\)(?!\)|\s|,)/g, ") ");
              // Remove "${name}(" from the start and ")" from the end
              const itemValue = raw.trim().slice(name.length + 1, -1);
              if (name === "calc") {
                if (children.size === 1) {
                  const child = children.first;
                  if (child.type === AST_TYPES.NUMBER) {
                    values.push({
                      type: AST_TYPES.CALC,
                      name,
                      isNumber: true,
                      value: `${parseFloat(child.value)}`
                    });
                  } else {
                    values.push({
                      type: AST_TYPES.CALC,
                      name,
                      isNumber: false,
                      value: asciiLowercase(itemValue)
                    });
                  }
                } else {
                  values.push({
                    type: AST_TYPES.CALC,
                    name,
                    isNumber: false,
                    value: asciiLowercase(itemValue)
                  });
                }
              } else {
                values.push({
                  type,
                  name,
                  value: caseSensitive ? itemValue : asciiLowercase(itemValue)
                });
              }
              break;
            }
            case AST_TYPES.IDENTIFIER: {
              if (caseSensitive) {
                values.push(item);
              } else {
                values.push({
                  type,
                  name: asciiLowercase(name)
                });
              }
              break;
            }
            default: {
              values.push(item);
            }
          }
        }
        parsedValue = values;
      }
    } catch {
      parsedValue = false;
    }
  }
  setCachedValue(cacheKey, parsedValue);
  if (parsedValue === false) {
    return undefined;
  }
  return parsedValue;
}

// Parses a numeric value (number, dimension, percentage).
// Helper function for serializeNumber, serializeLength, etc.
function parseNumericValue(val, opt, validateType) {
  const [item] = val;
  const { type, value, unit } = item ?? {};
  if (!validateType(type, value, unit)) {
    return undefined;
  }
  const { clamp } = opt || {};
  const max = opt?.max ?? Number.INFINITY;
  const min = opt?.min ?? Number.NEGATIVE_INFINITY;
  let num = parseFloat(value);
  if (clamp) {
    if (num > max) {
      num = max;
    } else if (num < min) {
      num = min;
    }
  } else if (num > max || num < min) {
    return undefined;
  }
  return {
    num,
    unit: unit ? asciiLowercase(unit) : null,
    type
  };
}

// Serializes a <number> value.
function serializeNumber(val, opt = {}) {
  const res = parseNumericValue(val, opt, type => type === AST_TYPES.NUMBER);
  if (!res) {
    return undefined;
  }
  return `${res.num}`;
}

// Serializes an <angle> value.
function serializeAngle(val, opt = {}) {
  const res = parseNumericValue(
    val,
    opt,
    (type, value) => type === AST_TYPES.DIMENSION || (type === AST_TYPES.NUMBER && value === "0")
  );
  if (!res) {
    return undefined;
  }
  const { num, unit } = res;
  if (unit) {
    if (!/^(?:deg|g?rad|turn)$/i.test(unit)) {
      return undefined;
    }
    return `${num}${unit}`;
  } else if (num === 0) {
    return `${num}deg`;
  }
  return undefined;
}

// Serializes a <length> value.
function serializeLength(val, opt = {}) {
  const res = parseNumericValue(
    val,
    opt,
    (type, value) => type === AST_TYPES.DIMENSION || (type === AST_TYPES.NUMBER && value === "0")
  );
  if (!res) {
    return undefined;
  }
  const { num, unit } = res;
  if (num === 0 && !unit) {
    return `${num}px`;
  } else if (unit) {
    return `${num}${unit}`;
  }
  return undefined;
}

// Serializes a <dimension> value, e.g. <frequency>, <time> and <resolution>.
function serializeDimension(val, opt = {}) {
  const res = parseNumericValue(val, opt, type => type === AST_TYPES.DIMENSION);
  if (!res) {
    return undefined;
  }
  const { num, unit } = res;
  if (unit) {
    return `${num}${unit}`;
  }
  return undefined;
}

// Serializes a <percentage> value.
function serializePercentage(val, opt = {}) {
  const res = parseNumericValue(
    val,
    opt,
    (type, value) => type === AST_TYPES.PERCENTAGE || (type === AST_TYPES.NUMBER && value === "0")
  );
  if (!res) {
    return undefined;
  }
  const { num } = res;
  return `${num}%`;
}

// Serializes a <url> value.
function serializeURL(val) {
  const [item] = val;
  const { type, value } = item ?? {};
  if (type !== AST_TYPES.URL) {
    return undefined;
  }
  // https://drafts.csswg.org/cssom/#serialize-a-url
  // https://github.com/csstree/csstree/issues/360
  return `url(${csstree.string.encode(value)})`;
}

// Serializes a <string> value.
function serializeString(val) {
  const [item] = val;
  const { type, value } = item ?? {};
  if (type !== AST_TYPES.STRING) {
    return undefined;
  }
  // https://drafts.csswg.org/cssom/#serialize-a-string
  return csstree.string.encode(value);
}

// Serializes a <color> value.
function serializeColor(val, opt = { format: "specifiedValue" }) {
  const [item] = val;
  const { name, type, value } = item ?? {};
  const lowerCasedName = asciiLowercase(`${name}`);
  switch (type) {
    case AST_TYPES.FUNCTION: {
      const res = resolveColor(`${lowerCasedName}(${value})`, opt);
      if (res) {
        return res;
      }
      break;
    }
    case AST_TYPES.HASH: {
      const res = resolveColor(`#${value}`, opt);
      if (res) {
        return res;
      }
      break;
    }
    case AST_TYPES.IDENTIFIER: {
      if (systemColors.has(lowerCasedName)) {
        if (opt.format === "specifiedValue") {
          return lowerCasedName;
        }
        return resolveSystemColorValue(lowerCasedName, opt.colorScheme);
      }
      const res = resolveColor(lowerCasedName, opt);
      if (res) {
        return res;
      }
      break;
    }
    default:
  }
  return undefined;
}

// Serializes a <gradient> value.
function serializeGradient(val) {
  const [item] = val;
  const { name, type, value } = item ?? {};
  if (type !== AST_TYPES.FUNCTION) {
    return undefined;
  }
  const res = resolveGradient(`${name}(${value})`, {
    format: "specifiedValue"
  });
  if (res) {
    return res;
  }
  return undefined;
}

function resolveKeywordValue(value, opt = {}) {
  const [{ name, type }] = value;
  const { length } = opt;
  switch (type) {
    case AST_TYPES.GLOBAL_KEYWORD: {
      if (length > 1) {
        return undefined;
      }
      return name;
    }
    case AST_TYPES.IDENTIFIER: {
      return name;
    }
    default:
  }
  return undefined;
}

function resolveFunctionValue(value, opt = {}) {
  const [{ name, type, value: itemValue }] = value;
  const { length } = opt;
  switch (type) {
    case AST_TYPES.FUNCTION: {
      return `${name}(${itemValue})`;
    }
    case AST_TYPES.GLOBAL_KEYWORD: {
      if (length > 1) {
        return undefined;
      }
      return name;
    }
    case AST_TYPES.IDENTIFIER: {
      return name;
    }
    default:
  }
  return undefined;
}

function resolveNumericValue(value, opt = {}) {
  const [{ name, type: itemType, value: itemValue }] = value;
  const { length, type } = opt;
  switch (itemType) {
    case AST_TYPES.CALC: {
      return `${name}(${itemValue})`;
    }
    case AST_TYPES.DIMENSION: {
      if (type === "angle") {
        return serializeAngle(value, opt);
      } else if (type === "length") {
        return serializeLength(value, opt);
      }
      return serializeDimension(value, opt);
    }
    case AST_TYPES.GLOBAL_KEYWORD: {
      if (length > 1) {
        return undefined;
      }
      return name;
    }
    case AST_TYPES.IDENTIFIER: {
      return name;
    }
    case AST_TYPES.NUMBER: {
      switch (type) {
        case "angle": {
          return serializeAngle(value, opt);
        }
        case "length": {
          return serializeLength(value, opt);
        }
        case "percentage": {
          return serializePercentage(value, opt);
        }
        default: {
          return serializeNumber(value, opt);
        }
      }
    }
    case AST_TYPES.PERCENTAGE: {
      return serializePercentage(value, opt);
    }
    default:
  }
  return undefined;
}

function resolveColorValue(value, opt = {}) {
  const [{ name, type }] = value;
  const { length } = opt;
  switch (type) {
    case AST_TYPES.GLOBAL_KEYWORD: {
      if (length > 1) {
        return undefined;
      }
      return name;
    }
    default: {
      return serializeColor(value);
    }
  }
}

function resolveImageValue(value, opt = {}) {
  const [{ name, type }] = value;
  const { length } = opt;
  switch (type) {
    case AST_TYPES.GLOBAL_KEYWORD: {
      if (length > 1) {
        return undefined;
      }
      return name;
    }
    case AST_TYPES.IDENTIFIER: {
      return name;
    }
    case AST_TYPES.URL: {
      return serializeURL(value);
    }
    default: {
      return serializeGradient(value);
    }
  }
}

function resolveSystemColorValue(value, colorScheme = "normal") {
  if (!systemColors.has(value)) {
    return value;
  }
  const { light, dark } = systemColors.get(value);
  if (colorScheme === "dark") {
    return dark;
  }
  return light;
}

function resolveBorderShorthandValue(value, subProps, parsedValues) {
  const [{ isNumber, name, type, value: itemValue }] = value;
  const { color: colorProp, style: styleProp, width: widthProp } = subProps;
  switch (type) {
    case AST_TYPES.CALC: {
      if (isNumber || parsedValues.has(widthProp)) {
        return undefined;
      }
      return [widthProp, `${name}(${itemValue}`];
    }
    case AST_TYPES.DIMENSION:
    case AST_TYPES.NUMBER: {
      if (parsedValues.has(widthProp)) {
        return undefined;
      }
      const parsedValue = serializeLength(value, { min: 0 });
      if (!parsedValue) {
        return undefined;
      }
      return [widthProp, parsedValue];
    }
    case AST_TYPES.FUNCTION:
    case AST_TYPES.HASH: {
      if (parsedValues.has(colorProp)) {
        return undefined;
      }
      const parsedValue = serializeColor(value);
      if (!parsedValue) {
        return undefined;
      }
      return [colorProp, parsedValue];
    }
    case AST_TYPES.GLOBAL_KEYWORD: {
      return name;
    }
    case AST_TYPES.IDENTIFIER: {
      if (isValidPropertyValue(widthProp, name)) {
        if (parsedValues.has(widthProp)) {
          return undefined;
        }
        return [widthProp, name];
      } else if (isValidPropertyValue(styleProp, name)) {
        if (parsedValues.has(styleProp)) {
          return undefined;
        }
        return [styleProp, name];
      } else if (isValidPropertyValue(colorProp, name)) {
        if (parsedValues.has(colorProp)) {
          return undefined;
        }
        return [colorProp, name];
      }
      break;
    }
    default:
  }
  return undefined;
}

// https://drafts.csswg.org/css-values-4/#custom-idents
// <custom-ident> excludes CSS-wide keywords and "default". When serializing a value that was
// accepted as a <custom-ident> but is such a keyword, it must be serialized as a <string>.
// Some productions exclude additional keywords (e.g. <keyframes-name> excludes "none").
function serializeCustomIdent(name, additionalExclusions) {
  const lower = asciiLowercase(name);
  if (GLOBAL_KEYS.has(lower) || lower === "default" || additionalExclusions?.has(lower)) {
    return csstree.string.encode(name);
  }
  return csstree.ident.encode(name);
}

exports.AST_TYPES = AST_TYPES;
exports.getPropertyDefinition = getPropertyDefinition;
exports.hasCalcFunc = hasCalcFunc;
exports.hasVarFunc = hasVarFunc;
exports.isGlobalKeyword = isGlobalKeyword;
exports.isValidPropertyValue = isValidPropertyValue;
exports.parsePropertyValue = parsePropertyValue;
exports.resolveBorderShorthandValue = resolveBorderShorthandValue;
exports.resolveCalc = resolveCalc;
exports.resolveColor = resolveColor;
exports.resolveColorValue = resolveColorValue;
exports.resolveFunctionValue = resolveFunctionValue;
exports.resolveImageValue = resolveImageValue;
exports.resolveKeywordValue = resolveKeywordValue;
exports.resolveNumericValue = resolveNumericValue;
exports.resolveSystemColorValue = resolveSystemColorValue;
exports.serializeAngle = serializeAngle;
exports.serializeColor = serializeColor;
exports.serializeCustomIdent = serializeCustomIdent;
exports.serializeDimension = serializeDimension;
exports.serializeGradient = serializeGradient;
exports.serializeLength = serializeLength;
exports.serializeNumber = serializeNumber;
exports.serializePercentage = serializePercentage;
exports.serializeString = serializeString;
exports.serializeURL = serializeURL;
exports.splitValue = splitValue;
