"use strict";

const whatwgURL = require("whatwg-url");
const values = require("../values/value.js");
const { toLowerCase } = require("./string.js");
const urlFunctions = new Set(["url", "src", "image", "image-set"]);

function resolveURLString(value, baseURL) {
  // Empty URLs are invalid resources; fragment-only URLs retain their local URL flag.
  if (value === "" || value.startsWith("#")) {
    return value;
  }
  const parsed = whatwgURL.parseURL(value, { baseURL: whatwgURL.parseURL(baseURL) });
  return parsed === null ? value : whatwgURL.serializeURL(parsed);
}

exports.resolveURL = (value, baseURL) => {
  if (value.types.includes("<url-token>")) {
    return { ...value, value: resolveURLString(value.value, baseURL) };
  }
  return {
    ...value,
    value: values.list(
      [
        { ...value.value[0], value: resolveURLString(value.value[0].value, baseURL) },
        value.value[1],
      ],
      value.value.separator,
      value.value.types,
    ),
  };
};

exports.resolveImageString = (value, baseURL) => ({
  types: ["<url-token>", "<url()>", "<url>"],
  value: resolveURLString(value.value, baseURL),
});

// Registered initial values are already typed, but their source base belongs to
// the registration rather than any element that later uses the property.
exports.resolveURLs = function resolveURLs(value, baseURL) {
  if (value.types.includes("<url>")) {
    return exports.resolveURL(value, baseURL);
  }
  if (values.isList(value)) {
    return values.map(value, (component, index) => {
      if (
        index === 0 &&
        value.types.includes("<image-set-option>") &&
        component.types.includes("<string>")
      ) {
        return exports.resolveImageString(component, baseURL);
      }
      return resolveURLs(component, baseURL);
    });
  }
  if (value.types.includes("<image-src>") && value.types.includes("<string>")) {
    return exports.resolveImageString(value, baseURL);
  }
  if (value.value !== null && typeof value.value === "object") {
    return { ...value, value: resolveURLs(value.value, baseURL) };
  }
  return value;
};

const urlDependencies = new WeakMap();

exports.hasURLDependency = function hasURLDependency(value) {
  let result = urlDependencies.get(value);
  if (result !== undefined) {
    return result;
  }
  if (values.isList(value)) {
    result = value.some(hasURLDependency);
  } else {
    result =
      value.types.includes("<url-token>") ||
      (value.name !== undefined && urlFunctions.has(toLowerCase(value.name))) ||
      (value.value !== null && typeof value.value === "object" && hasURLDependency(value.value));
  }
  urlDependencies.set(value, result);
  return result;
};
