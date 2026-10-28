"use strict";

const windowEnvironment = require("../../window/environment.js");

module.exports = match;
const fonts = require("../utils/font.js");
const colorSchemes = require("../utils/color-scheme.js");
const values = require("../values/value.js");
const dimensions = require("../values/dimension.js");
const math = require("../utils/math.js");
const definitions = require("../../../../generated/css-descriptor-definitions.js");
const simplifier = require("../simplify.js");
const features = definitions["@media"];
const { aliases } = require("../descriptors/compatibility.js")["@media"];
const associatedOperators = {
  "<": ">",
  "<=": ">=",
  "=": "=",
  ">": "<",
  ">=": "<=",
};
const colorSpaceDepth = {
  p3: 30,
  rec2020: 36,
  srgb: 24,
};
const falsy = ["false", "none", "no-preference"];

function getResolvedCalculationFunction({ range, round, value }, globalObject) {
  value = resolveCalculationComponent(value, globalObject);
  if (
    !values.isNumeric(value, {
      literal: true,
    })
  ) {
    value = simplifier.simplifyCalculation(value, null, windowEnvironment.devicePixelRatio);
  }
  let resolved = math.clamp(range.min, value.value, range.max);
  if (round) {
    resolved = Math.round(resolved);
  }
  return {
    ...value,
    value: resolved,
  };
}

function resolveCalculationComponent(value, globalObject) {
  if (values.isList(value)) {
    return values.map(value, (component) => resolveCalculationComponent(component, globalObject));
  }
  if (value.types[0] === "<dimension-token>") {
    return value.types.includes("<length>")
      ? getResolvedLength(value)
      : dimensions.canonicalize(value);
  }
  if (
    values.isFunction(value) ||
    value.types.includes("<calc-invert>") ||
    value.types.includes("<calc-negate>")
  ) {
    return { ...value, value: resolveCalculationComponent(value.value, globalObject) };
  }
  return value;
}

function getResolvedLength(value) {
  switch (value.unit) {
    case "cap":
    case "rcap":
      return values.length(value.value * fonts.metrics.ascent * fonts.defaultSize, "px");
    case "ch":
    case "em":
    case "ic":
    case "rch":
    case "rem":
    case "ric":
      return values.length(value.value * fonts.defaultSize, "px");
    case "ex":
    case "rex":
      return values.length(value.value * 0.5 * fonts.defaultSize, "px");
    case "lh":
    case "rlh":
      return values.length(value.value * fonts.getNormalLineHeight(fonts.defaultSize), "px");
    case "cqb":
    case "cqh":
    case "dvb":
    case "dvh":
    case "lvb":
    case "lvh":
    case "svb":
    case "svh":
    case "vb":
    case "vh":
      return values.length((value.value * windowEnvironment.innerHeight) / 100, "px");
    case "cqi":
    case "cqw":
    case "dvi":
    case "dvw":
    case "lvi":
    case "lvw":
    case "svi":
    case "svw":
    case "vi":
    case "vw":
      return values.length((value.value * windowEnvironment.innerWidth) / 100, "px");
    case "cqmax":
    case "dvmax":
    case "lvmax":
    case "svmax":
    case "vmax": {
      const { innerHeight, innerWidth } = windowEnvironment;
      return values.length((value.value * Math.max(innerHeight, innerWidth)) / 100, "px");
    }
    case "cqmin":
    case "dvmin":
    case "lvmin":
    case "svmin":
    case "vmin": {
      const { innerHeight, innerWidth } = windowEnvironment;
      return values.length((value.value * Math.min(innerHeight, innerWidth)) / 100, "px");
    }
    case "px":
      return value;
    default:
      return dimensions.canonicalize(value);
  }
}

function getResolvedRatio([width, height], globalObject) {
  width = getResolvedValue(width, globalObject);
  if (values.isOmitted(height)) {
    return width;
  }
  height = getResolvedValue(height[1], globalObject);
  return width / height;
}

function getResolvedValue(value, globalObject, nested) {
  for (let index = value.types.length - 1; index >= 0; index--) {
    switch (value.types[index]) {
      case "<angle>":
      case "<frequency>":
      case "<resolution>":
      case "<time>":
        return dimensions.canonicalize(value).value;
      case "<calc-function>": {
        value = getResolvedCalculationFunction(value, globalObject);
        return nested ? value : value.value;
      }
      case "<calc-invert>":
      case "<calc-negate>":
        return {
          ...value,
          value: getResolvedValue(value.value, globalObject, true),
        };
      case "<dimension-token>": {
        value = getResolvedLength(value);
        return nested ? value : value.value;
      }
      case "<integer>":
      case "<number>":
        return value.value;
      case "<keyword>":
        return Infinity;
      case "<ratio>":
        return getResolvedRatio(value, globalObject);
    }
  }
  throw new RangeError("Unexpected feature value type");
}

function compareNumerics(a, operator, b) {
  switch (operator) {
    case "<":
      return a < b;
    case "<=":
      return a <= b;
    case ">":
      return b < a;
    case ">=":
      return b <= a;
    default:
      return a === b;
  }
}

function matchFeature(feature, operator, value, globalObject) {
  feature = aliases.get(feature) ?? feature;
  switch (feature) {
    case "-webkit-transform-3d":
      return compareNumerics(value, operator, 1);
    case "any-hover":
      return value === "hover";
    case "any-pointer":
      return value === "fine";
    case "aspect-ratio": {
      const ratio = windowEnvironment.innerWidth / windowEnvironment.innerHeight;
      return (
        compareNumerics(value, operator, ratio) ||
        (operator.endsWith("=") && Number.isNaN(value) && Number.isNaN(ratio))
      );
    }
    case "color":
      return compareNumerics(value, operator, Math.floor(windowEnvironment.screen.colorDepth / 3));
    case "color-gamut":
    case "video-color-gamut":
      return compareNumerics(colorSpaceDepth[value], operator, windowEnvironment.screen.colorDepth);
    case "color-index":
      return compareNumerics(value, operator, 0);
    case "device-aspect-ratio": {
      const ratio = windowEnvironment.screen.width / windowEnvironment.screen.height;
      return (
        compareNumerics(value, operator, ratio) ||
        (operator.endsWith("=") && Number.isNaN(value) && Number.isNaN(ratio))
      );
    }
    case "device-height":
      return compareNumerics(value, operator, windowEnvironment.screen.height);
    case "device-width":
      return compareNumerics(value, operator, windowEnvironment.screen.width);
    case "display-mode":
      return value === "browser";
    case "display-state":
      return value === "normal";
    case "dynamic-range":
    case "video-dynamic-range":
      return value === "standard";
    case "environment-blending":
      return value === "opaque";
    case "forced-colors":
      return value === "none";
    case "grid":
      return value === 0;
    case "height":
      return compareNumerics(value, operator, windowEnvironment.innerHeight);
    case "horizontal-viewport-segments":
      return compareNumerics(value, operator, 1);
    case "vertical-viewport-segments":
      return compareNumerics(value, operator, 1);
    case "hover":
      return value === "hover";
    case "inverted-colors":
      return value === "none";
    case "monochrome":
      return compareNumerics(value, operator, 0);
    case "nav-controls":
      return value === "back";
    case "orientation":
      return (
        value ===
        (windowEnvironment.innerHeight < windowEnvironment.innerWidth ? "landscape" : "portrait")
      );
    case "overflow-block":
      return value === "scroll";
    case "overflow-inline":
      return value === "scroll";
    case "pointer":
      return value === "fine";
    case "prefers-color-scheme":
      return value === colorSchemes.getPageColorScheme(globalObject)[0];
    case "prefers-contrast":
      return value === "no-preference";
    case "prefers-reduced-data":
      return value === "no-preference";
    case "prefers-reduced-motion":
      return value === "no-preference";
    case "prefers-reduced-transparency":
      return value === "no-preference";
    case "resizable":
      return value === "true";
    case "resolution": {
      return compareNumerics(value, operator, windowEnvironment.devicePixelRatio);
    }
    case "scan":
      return value === "progressive";
    case "scripting":
      return value === (globalObject._document._scriptingDisabled ? "none" : "enabled");
    case "shape":
      return value === "rect";
    case "ua-color-scheme":
      return value === "light";
    case "update":
      return value === "fast";
    case "width":
      return compareNumerics(value, operator, windowEnvironment.innerWidth);
    default:
      throw new RangeError("Unexpected feature");
  }
}

// https://drafts.csswg.org/mediaqueries-5/#typedef-mf-boolean
function matchBoolean(name, globalObject) {
  name = aliases.get(name) ?? name;
  if (name.endsWith("aspect-ratio")) {
    return true;
  }
  const {
    [name]: { type, value },
  } = features;
  if (type === "range" || value === "<mq-boolean>") {
    return !matchFeature(name, "=", 0, globalObject);
  }
  const falseInBooleanContext = falsy.find((keyword) => value.includes(keyword));
  if (falseInBooleanContext) {
    return !matchFeature(name, "=", falseInBooleanContext, globalObject);
  }
  return true;
}

// https://drafts.csswg.org/mediaqueries-5/#typedef-mf-plain
function matchDeclaration(name, value, globalObject) {
  name = aliases.get(name) ?? name;
  let operator;
  if (name.startsWith("min-")) {
    operator = "<=";
    name = name.slice(4);
  } else if (name.startsWith("max-")) {
    operator = ">=";
    name = name.slice(4);
  } else {
    operator = "=";
  }
  const definition = features[name];
  if (definition.type === "range" || definition.value === "<mq-boolean>") {
    value = getResolvedValue(value, globalObject);
  } else {
    value = value.value;
  }
  return matchFeature(name, operator, value, globalObject);
}

// https://drafts.csswg.org/mediaqueries-5/#typedef-mf-range
function matchRange(range, globalObject) {
  const hasLeft = Object.hasOwn(range, "left");
  const hasRight = Object.hasOwn(range, "right");
  const left = hasLeft ? getResolvedValue(range.left, globalObject) : undefined;
  const right = hasRight ? getResolvedValue(range.right, globalObject) : undefined;
  return (
    (!hasLeft || matchFeature(range.name, range.leftOperator, left, globalObject)) &&
    (!hasRight ||
      matchFeature(range.name, associatedOperators[range.rightOperator], right, globalObject))
  );
}

function matchType(type) {
  switch (type) {
    case "all":
      return true;
    case "print":
    case "screen":
      return type === "screen";
    default:
      return false;
  }
}

function every(conditions, globalObject) {
  let hasUnknown = false;
  for (const condition of conditions) {
    const result = match(condition, globalObject);
    if (!result) {
      return false;
    }
    if (result === "unknown") {
      hasUnknown = true;
    }
  }
  return hasUnknown ? "unknown" : true;
}

function some(conditions, globalObject) {
  let hasUnknown = false;
  for (const condition of conditions) {
    const result = match(condition, globalObject);
    if (result === true) {
      return true;
    }
    if (result === "unknown") {
      hasUnknown = true;
    }
  }
  return hasUnknown ? "unknown" : false;
}

function match(query, globalObject) {
  if (values.isList(query) && query.types.includes("<media-query-list>")) {
    if (query.length === 0) {
      return true;
    }
    const result = some(query, globalObject);
    return result && result !== "unknown";
  }
  switch (query.kind) {
    case "media-group":
      return match(query.value, globalObject);
    case "media-unknown":
      return "unknown";
    case "media-feature":
      if (Object.hasOwn(query, "value")) {
        return matchDeclaration(query.name, query.value, globalObject);
      }
      return !Object.hasOwn(query, "left") && !Object.hasOwn(query, "right")
        ? matchBoolean(query.name, globalObject)
        : matchRange(query, globalObject);
    case "media-not": {
      const result = match(query.value, globalObject);
      return result === "unknown" ? "unknown" : !result;
    }
    case "media-condition":
      return query.operator === "and"
        ? every(query.values, globalObject)
        : some(query.values, globalObject);
    case "media-query": {
      const result =
        matchType(query.type, globalObject) &&
        (query.condition === null || match(query.condition, globalObject));
      if (result === "unknown") {
        return result;
      }
      return query.modifier === "not" ? !result : result;
    }
    default:
      throw new TypeError("Expected native media syntax");
  }
}
