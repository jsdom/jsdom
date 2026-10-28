"use strict";

exports.angle = angle;
exports.block = block;
exports.customIdentifier = customIdentifier;
exports.dashedIdentifier = dashedIdentifier;
exports.delimiter = delimiter;
exports.dimension = dimension;
exports.dimensionToken = dimensionToken;
exports.filter = filter;
exports.flex = flex;
exports.frequency = frequency;
exports.hash = hash;
exports.identifier = identifier;
exports.identifierToken = identifierToken;
exports.integer = integer;
exports.isBlock = isBlock;
exports.isCalculation = isCalculation;
exports.isCalculationOperator = isCalculationOperator;
exports.isCombinable = isCombinable;
exports.isComputationallyIndependent = isComputationallyIndependent;
exports.isDelimiter = isDelimiter;
exports.isFailure = isFailure;
exports.isFunction = isFunction;
exports.isList = isList;
exports.isNull = isNull;
exports.isNumeric = isNumeric;
exports.isOmitted = isOmitted;
exports.isParseErrorInfo = isParseErrorInfo;
exports.isUndefined = isUndefined;
exports.keyword = keyword;
exports.length = length;
exports.list = list;
exports.map = map;
exports.number = number;
exports.numberToken = numberToken;
exports.percentage = percentage;
exports.resolution = resolution;
exports.string = string;
exports.time = time;
const { ParseErrorInfo } = require("../parse/errors.js");
const lengthUnits = require("./length-units.js");
const dimensions = require("./dimension.js");
const calculationOperators = ["<calc-invert>", "<calc-negate>", "<calc-product>", "<calc-sum>"];
const computationallyDependentUnits = [...lengthUnits.container, ...lengthUnits.font];
const omitted = (exports.omitted = {
  types: [],
});

function isBlock(value, associatedToken) {
  if (value.types[0] === "<block>") {
    if (typeof associatedToken === "string") {
      return associatedToken === value.associatedToken;
    }
    return true;
  }
  return false;
}

function isCalculation(value) {
  return value.types.includes("<calc-value>") || isCalculationOperator(value);
}

function isCalculationOperator(value) {
  return calculationOperators.includes(value.types[0]);
}

exports.isCloseCurlyBrace = isDelimiter("}");
exports.isCloseParen = isDelimiter(")");
exports.isColon = isDelimiter(":");
function isCombinable(value, resolutionType) {
  if (value.types.includes("<calc-invert>")) {
    value = value.value;
  }
  return isNumeric(value, {
    resolutionType,
    resolved: true,
  });
}

exports.isComma = isDelimiter(",");
// https://drafts.css-houdini.org/css-properties-values-api-1/#computationally-independent
function isComputationallyIndependent(value) {
  if (isList(value)) {
    return value.every(isComputationallyIndependent);
  }
  switch (value.types[0]) {
    case "<dimension-token>":
      return !computationallyDependentUnits.includes(value.unit);
    case "<function>":
      return isComputationallyIndependent(value.value);
    default:
      if (Array.isArray(value.value)) {
        return value.value.every(isComputationallyIndependent);
      }
      return true;
  }
}

function isDelimiter(expected, token) {
  if (token) {
    if (Array.isArray(expected)) {
      return expected.some((candidate) => isDelimiter(candidate, token));
    }
    return token.types[0] === "<delimiter-token>" && token.value === expected;
  }
  return (value) => value && isDelimiter(expected, value);
}

function isParseErrorInfo(value) {
  return value instanceof ParseErrorInfo;
}

function isFailure(value) {
  return isNull(value) || isParseErrorInfo(value);
}

function isFunction(value, name) {
  if (value.types[0] === "<function>") {
    if (typeof name === "string") {
      return name === value.name;
    }
    return true;
  }
  return false;
}

function isList(value, separator) {
  if (Array.isArray(value) && Object.hasOwn(value, "separator")) {
    if (typeof separator === "string") {
      return value.separator === separator;
    }
    return true;
  }
  return false;
}

function isNull(value) {
  return value === null;
}

function isNumeric(value, { literal, resolved, resolutionType } = {}) {
  switch (value.types[0]) {
    case "<dimension-token>":
      if (resolved) {
        for (const dimensionDefinition of dimensions.definitions.values()) {
          if (dimensionDefinition.canonicalUnit === value.unit) {
            return true;
          }
        }
        return false;
      }
      return true;
    case "<ident-token>":
      return !resolved && !literal && value.types.includes("<calc-keyword>");
    case "<number-token>":
      return true;
    case "<percentage-token>":
      return !resolutionType || !resolved;
    default:
      return false;
  }
}

function isOmitted(candidate) {
  if (isList(candidate)) {
    if (candidate.separator && candidate.separator !== " ") {
      return candidate.every((value) => isList(value) && value.every(isOmitted));
    }
    return candidate.every(isOmitted);
  }
  return candidate === omitted;
}

exports.isOpenCurlyBrace = isDelimiter("{");
exports.isSemicolon = isDelimiter(";");
function isUndefined(value) {
  return value === undefined;
}

exports.isWhitespace = isDelimiter(" ");
function filter(value, predicate, types = value.types) {
  return list(value.filter(predicate), value.separator, types);
}

function map(value, transform, types = []) {
  types = [...value.types, ...types];
  if (isList(value)) {
    return list(value.map(transform), value.separator, types);
  }
  const result = {
    ...value,
    types,
    value: transform(value.value),
  };
  delete result.start;
  delete result.end;
  return result;
}

function list(values = [], separator = " ", types = []) {
  const value = new Array(values.length);
  value.types = [];
  for (let index = 0; index < values.length; index++) {
    value[index] = values[index];
  }
  value.separator = separator;
  value.types.push(...types);
  return value;
}
function block(value = [], types = [], associatedToken = "[") {
  return {
    associatedToken,
    types: ["<block>", ...types],
    value: list(value),
  };
}
function delimiter(value, types = []) {
  return {
    types: ["<delimiter-token>", ...types],
    value,
  };
}
function dimensionToken(value, unit, types = []) {
  return {
    types: ["<dimension-token>", ...types],
    unit,
    value,
  };
}
function identifierToken(value, types = []) {
  return {
    types: ["<ident-token>", ...types],
    value,
  };
}
function numberToken(value, types = []) {
  return {
    types: ["<number-token>", ...types],
    value,
  };
}
function identifier(value, types = []) {
  return identifierToken(value, ["<ident>", ...types]);
}
function customIdentifier(value, types = []) {
  return identifier(value, ["<custom-ident>", ...types]);
}
function dashedIdentifier(value, types = []) {
  return customIdentifier(value, ["<dashed-ident>", ...types]);
}
function keyword(value, types = []) {
  return identifier(value, ["<keyword>", ...types]);
}
function hash(value, types = []) {
  return {
    types: ["<hash-token>", ...types],
    value,
  };
}
function integer(value, types = []) {
  return numberToken(value, ["<integer>", ...types]);
}
function string(value, types = []) {
  return {
    types: ["<string-token>", "<string>", ...types],
    value,
  };
}
function number(value, types = []) {
  return numberToken(value, ["<number>", ...types]);
}
function percentage(value, types = []) {
  return {
    types: ["<percentage-token>", "<percentage>", ...types],
    unit: "%",
    value,
  };
}
function dimension(value, unit, types = []) {
  return dimensionToken(value, unit, ["<dimension>", ...types]);
}
function angle(value, unit, types = []) {
  return dimension(value, unit, ["<angle>", ...types]);
}
function flex(value, types = []) {
  return dimension(value, "fr", ["<flex>", ...types]);
}
function frequency(value, unit, types = []) {
  return dimension(value, unit, ["<frequency>", ...types]);
}
function length(value, unit, types = []) {
  return dimension(value, unit, ["<length>", ...types]);
}
function resolution(value, unit, types = []) {
  return dimension(value, unit, ["<resolution>", ...types]);
}
function time(value, unit, types = []) {
  return dimension(value, unit, ["<time>", ...types]);
}
