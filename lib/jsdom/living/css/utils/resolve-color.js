"use strict";

const values = require("../values/value.js");
const { canonicalize } = require("../values/dimension.js");
const colors = require("../values/color.js");
const { simplifyCalculation } = require("../simplify.js");
const { safeFloat } = require("./math.js");
const { convertColor, isSupportedColorSpace } = require("./color-spaces.js");

const componentNames = {
  rgb: ["r", "g", "b"],
  color: ["r", "g", "b"],
  xyz: ["x", "y", "z"],
  hsl: ["h", "s", "l"],
  hwb: ["h", "w", "b"],
  lab: ["l", "a", "b"],
  oklab: ["l", "a", "b"],
  lch: ["l", "c", "h"],
  oklch: ["l", "c", "h"]
};
const percentageScales = {
  rgb: [255, 255, 255],
  color: [1, 1, 1],
  lab: [100, 125, 125],
  lch: [100, 150, 360],
  oklab: [1, 0.4, 0.4],
  oklch: [1, 0.4, 360],
  hsl: [360, 100, 100],
  hwb: [360, 100, 100]
};

function clamp(value, max = 1) {
  return Math.max(0, Math.min(value, max));
}

function hueIndex(space) {
  if (space === "hsl" || space === "hwb") {
    return 0;
  }
  return space === "lch" || space === "oklch" ? 2 : -1;
}

function hue(value) {
  return Number.isFinite(value) || Number.isNaN(value) ? (value % 360 + 360) % 360 : 0;
}

function numberOrNone(value) {
  if (Number.isNaN(value)) {
    return values.keyword("none");
  }
  if (!Number.isFinite(value)) {
    return {
      name: "calc",
      value: values.number(value),
      types: ["<function>", "<calc()>", "<calc-function>", "<number>"]
    };
  }
  return values.number(Math.abs(value) < 1e-12 ? 0 : value);
}

function parseHex(value) {
  value = value.replace(/^#/, "");
  if (value.length < 5) {
    value = Array.from(value, digit => digit + digit).join("");
  }
  return {
    space: "srgb",
    channels: [0, 2, 4].map(index => parseInt(value.slice(index, index + 2), 16) / 255),
    alpha: value.length === 8 ? parseInt(value.slice(6), 16) / 255 : 1,
    legacy: true
  };
}

// https://drafts.csswg.org/css-color-4/#resolving-color-function-values
function invalidColor(context) {
  return context.used ? parseHex("000000") : null;
}

function replaceKeywords(value, keywords, percentScale, context) {
  if (values.isList(value)) {
    return values.map(value, child => replaceKeywords(child, keywords, percentScale, context));
  }
  if (value.name && context.resolveNumeric) {
    value = context.resolveNumeric(value);
  }
  if (Object.hasOwn(keywords, value.value)) {
    const number = keywords[value.value];
    return values.number(Number.isNaN(number) ? 0 : number);
  }
  if (value.types.includes("<length>") && context.resolveDimension) {
    return context.resolveDimension(value);
  }
  if (value.types.includes("<percentage>")) {
    return values.number(value.value * percentScale / 100);
  }
  if (value.value && typeof value.value === "object") {
    return { ...value, value: replaceKeywords(value.value, keywords, percentScale, context) };
  }
  return value;
}

function componentValue(component, keywords, percentScale, context) {
  if (component.value === "none") {
    return NaN;
  }
  if (Object.hasOwn(keywords, component.value)) {
    return keywords[component.value];
  }
  if (component.types.includes("<calc-function>")) {
    component = simplifyCalculation(
      replaceKeywords(component.value, keywords, percentScale, context),
      undefined,
      context.devicePixelRatio
    );
    if (Number.isNaN(component.value)) {
      return 0;
    }
  }
  if (component.types.includes("<angle>")) {
    return canonicalize(component).value;
  }
  return component.types.includes("<percentage>") ? component.value * percentScale / 100 : component.value;
}

function resolveModel(color, context) {
  let { name } = color;
  if (name === "rgba" || name === "hsla") {
    name = name.slice(0, -1);
  }
  let source;
  const parts = color.value.flat(2).filter(part => {
    if (values.isOmitted(part) || part.types[0] === "<delimiter-token>" || part.value === "from") {
      return false;
    }
    if (part.types.includes("<color>")) {
      source = part;
      return false;
    }
    return true;
  });
  let space = name;
  if (name === "color") {
    space = parts.shift().value.replace(/^xyz$/, "xyz-d65");
  } else if (name === "rgb") {
    space = "srgb";
  }
  if (!isSupportedColorSpace(space)) {
    return invalidColor(context);
  }
  const relative = source !== undefined;
  let alpha = 1;
  const keywords = {};
  if (relative) {
    source = resolveRecord(source, context);
    if (source === null) {
      return null;
    }
    source = convertColor(source, space);
    alpha = source.alpha;
    const { channels } = source;
    const names = componentNames[space.startsWith("xyz") ? "xyz" : name];
    for (let index = 0; index < 3; ++index) {
      keywords[names[index]] = channels[index] * (name === "rgb" ? 255 : 1);
    }
    keywords.alpha = alpha;
  }
  const scales = percentageScales[name];
  const channels = parts.slice(0, 3).map((part, index) => componentValue(part, keywords, scales[index], context));
  if (parts[3]) {
    alpha = componentValue(parts[3], keywords, 1, context);
  }
  alpha = clamp(alpha);
  if (name === "rgb") {
    for (let index = 0; index < 3; ++index) {
      channels[index] = (relative ? channels[index] : clamp(channels[index], 255)) / 255;
    }
  } else if (space === "lab" || space === "lch") {
    channels[0] = clamp(channels[0], 100);
    if (space === "lch") {
      channels[1] = Math.max(0, channels[1]);
    }
  } else if (space === "oklab" || space === "oklch") {
    channels[0] = clamp(channels[0]);
    if (space === "oklch") {
      channels[1] = Math.max(0, channels[1]);
    }
  } else if (space === "hsl") {
    channels[1] = Math.max(0, channels[1]);
  }
  const index = hueIndex(space);
  if (index !== -1) {
    channels[index] = hue(channels[index]);
  }
  return { space, channels, alpha, legacy: !relative && ["rgb", "hsl", "hwb"].includes(name) };
}

function interpolateHue(a, b, method) {
  a = hue(a);
  b = hue(b);
  const difference = b - a;
  if (method === "shorter") {
    if (difference > 180) {
      a += 360;
    } else if (difference < -180) {
      b += 360;
    }
  } else if (method === "longer") {
    if (difference >= 0 && difference < 180) {
      a += 360;
    } else if (difference > -180 && difference < 0) {
      b += 360;
    }
  } else if (method === "increasing" && b < a) {
    b += 360;
  } else if (method === "decreasing" && a < b) {
    a += 360;
  }
  return [a, b];
}

function interpolate(a, b, amount, method) {
  let alphaA = a.alpha;
  let alphaB = b.alpha;
  if (Number.isNaN(alphaA)) {
    alphaA = alphaB;
  }
  if (Number.isNaN(alphaB)) {
    alphaB = alphaA;
  }
  const alpha = alphaA * (1 - amount) + alphaB * amount;
  const usedAlphaA = Number.isNaN(alphaA) ? 1 : alphaA;
  const usedAlphaB = Number.isNaN(alphaB) ? 1 : alphaB;
  const usedAlpha = Number.isNaN(alpha) ? 1 : alpha;
  const indexOfHue = hueIndex(a.space);
  const channels = a.channels.map((left, index) => {
    let right = b.channels[index];
    if (Number.isNaN(left)) {
      left = right;
    }
    if (Number.isNaN(right)) {
      right = left;
    }
    if (index === indexOfHue) {
      [left, right] = interpolateHue(left, right, method);
      return hue(left * (1 - amount) + right * amount);
    }
    const premultiplied = left * usedAlphaA * (1 - amount) + right * usedAlphaB * amount;
    return usedAlpha === 0 ? premultiplied : premultiplied / usedAlpha;
  });
  return { space: a.space, channels, alpha };
}

function resolveMix(color, context) {
  const [interpolation, , items] = color.value;
  let space = "oklab";
  let method = "shorter";
  if (!values.isOmitted(interpolation)) {
    const parts = interpolation.flat(2).filter(part => !values.isOmitted(part));
    space = parts[1].value.replace(/^xyz$/, "xyz-d65");
    if (parts[2]) {
      method = parts[2].value;
    }
  }
  if (!isSupportedColorSpace(space)) {
    return invalidColor(context);
  }
  const weights = items.map(([, weight]) => {
    return values.isOmitted(weight) ? undefined : componentValue(weight, {}, 100, context) / 100;
  });
  const specified = weights.reduce((sum, value) => sum + (value ?? 0), 0);
  const missing = weights.filter(value => value === undefined).length;
  for (let index = 0; index < weights.length; ++index) {
    weights[index] ??= Math.max(0, 1 - specified) / missing;
  }
  const sum = weights.reduce((total, value) => total + value, 0);
  let result;
  let total = 0;
  for (let index = 0; index < items.length; ++index) {
    const record = resolveRecord(items[index][0], context);
    if (record === null) {
      return null;
    }
    const next = convertColor(record, space);
    if (result === undefined) {
      result = next;
    } else {
      const combined = total + weights[index];
      result = interpolate(result, next, combined === 0 ? 0.5 : weights[index] / combined, method);
    }
    total += weights[index];
  }
  result.alpha *= Math.min(1, sum);
  result.legacy = false;
  return result;
}

function resolveRecord(color, context) {
  if (color.value === "currentcolor") {
    return context.currentColor === undefined ? null : resolveRecord(context.currentColor, context);
  }
  if (color.value === "transparent") {
    return { space: "srgb", channels: [0, 0, 0], alpha: 0, legacy: true };
  }
  if (color.types.includes("<named-color>")) {
    return parseHex(colors.named[color.value]);
  }
  if (color.types.includes("<deprecated-color>")) {
    return parseHex(colors.system[colors.deprecated[color.value]][context.colorScheme()]);
  }
  if (color.types.includes("<system-color>")) {
    return parseHex(colors.system[color.value][context.colorScheme()]);
  }
  if (color.types.includes("<hex-color>")) {
    return parseHex(color.value);
  }
  switch (color.name) {
    case "alpha": {
      const source = resolveRecord(color.value[1], context);
      if (source === null) {
        return null;
      }
      const alpha = clamp(componentValue(color.value[3], { alpha: source.alpha }, 1, context));
      return { ...source, alpha, legacy: false };
    }
    case "light-dark":
      return resolveRecord(color.value[context.colorScheme() === "dark" ? 2 : 0], context);
    case "color-mix":
      return resolveMix(color, context);
    case "contrast-color": {
      const source = resolveRecord(color.value, context);
      if (source === null) {
        return null;
      }
      const luminance = convertColor(source, "xyz-d65").channels[1];
      return parseHex((luminance + 0.05) ** 2 > 0.0525 ? "000000" : "ffffff");
    }
    case "rgb": case "rgba": case "hsl": case "hsla": case "hwb":
    case "lab": case "lch": case "oklab": case "oklch": case "color":
      return resolveModel(color, context);
    default:
      return null;
  }
}

function toValue(record) {
  const missing = record.channels.some(Number.isNaN) || Number.isNaN(record.alpha);
  if (!missing && (record.space === "hsl" || record.space === "hwb")) {
    record = { ...convertColor(record, "srgb"), legacy: record.legacy };
  }
  const { space } = record;
  const legacy = record.legacy && !missing;
  let name = "color";
  if (legacy) {
    name = "rgb";
  } else if (["lab", "lch", "oklab", "oklch", "hsl", "hwb"].includes(space)) {
    name = space;
  }
  const channels = values.list(record.channels.map((value, index) => {
    if ((name === "hsl" || name === "hwb") && index > 0 && !Number.isNaN(value)) {
      return values.percentage(value);
    }
    const result = numberOrNone(legacy ? safeFloat(clamp(value) * 255) : value);
    if (index === hueIndex(name)) {
      result.types.push("<hue>");
    }
    return result;
  }));
  let alpha = values.omitted;
  if (record.alpha !== 1) {
    const component = numberOrNone(record.alpha);
    component.types.push("<alpha-value>");
    alpha = values.list([values.delimiter("/"), component]);
  }
  const body = name === "color" ? values.list([values.keyword(space), channels]) : channels;
  const value = values.list([values.omitted, body, alpha]);
  return { name, value, types: ["<function>", `<${name}()>`, "<color-function>", "<color-base>", "<color>"] };
}

exports.resolveColor = (color, context) => {
  const record = resolveRecord(color, context);
  return record === null ? null : toValue(record);
};
