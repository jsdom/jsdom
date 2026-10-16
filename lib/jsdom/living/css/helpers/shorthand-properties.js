"use strict";

const { isGlobalKeyword } = require("./css-values");
const background = require("../properties/background");
const backgroundPosition = require("../properties/backgroundPosition");
const border = require("../properties/border");
const borderWidth = require("../properties/borderWidth");
const borderStyle = require("../properties/borderStyle");
const borderColor = require("../properties/borderColor");
const borderTop = require("../properties/borderTop");
const borderRight = require("../properties/borderRight");
const borderBottom = require("../properties/borderBottom");
const borderLeft = require("../properties/borderLeft");
const flex = require("../properties/flex");
const font = require("../properties/font");
const margin = require("../properties/margin");
const padding = require("../properties/padding");

const BORDER_IMAGE = "border-image";
const TRBL_INDICES = { top: 0, right: 1, bottom: 2, left: 3 };

const shorthandProperties = new Map([
  [background.property, background],
  [backgroundPosition.property, backgroundPosition],
  [
    border.property,
    {
      descriptor: border.descriptor,
      parse: border.parse,
      initialValues: border.initialValues,
      shorthandFor: new Map([...border.shorthandFor, [BORDER_IMAGE, null]])
    }
  ],
  [borderWidth.property, borderWidth],
  [borderStyle.property, borderStyle],
  [borderColor.property, borderColor],
  [borderTop.property, borderTop],
  [borderRight.property, borderRight],
  [borderBottom.property, borderBottom],
  [borderLeft.property, borderLeft],
  ["flex", flex],
  ["font", font],
  ["margin", margin],
  ["padding", padding]
]);

function getPositionValue(positionValues, position) {
  const [val1, val2, val3, val4] = positionValues;
  const index = TRBL_INDICES[position] ?? -1;
  // If a specific position (top, right, bottom, left) is requested.
  if (index !== -1) {
    switch (positionValues.length) {
      case 2: {
        // Index 0 (Top) & 2 (Bottom) -> val1
        // Index 1 (Right) & 3 (Left) -> val2
        return index % 2 === 0 ? val1 : val2;
      }
      case 3: {
        // Index 0 (Top) -> val1
        // Index 1 (Right) & 3 (Left) -> val2
        // Index 2 (Bottom) -> val3
        if (index === 2) {
          return val3;
        }
        return index % 2 === 0 ? val1 : val2;
      }
      case 4: {
        return positionValues[index];
      }
      case 1:
      default: {
        return val1;
      }
    }
  }
  // Fallback logic for when no specific position is requested.
  switch (positionValues.length) {
    case 2: {
      if (val1 === val2) {
        return val1;
      }
      return `${val1} ${val2}`;
    }
    case 3: {
      if (val1 === val3) {
        if (val1 === val2) {
          return val1;
        }
        return `${val1} ${val2}`;
      }
      return `${val1} ${val2} ${val3}`;
    }
    case 4: {
      if (val2 === val4) {
        if (val1 === val3) {
          if (val1 === val2) {
            return val1;
          }
          return `${val1} ${val2}`;
        }
        return `${val1} ${val2} ${val3}`;
      }
      return `${val1} ${val2} ${val3} ${val4}`;
    }
    case 1:
    default: {
      return val1;
    }
  }
}

// Parse an implemented shorthand into canonical leaf updates. Defaults belong to expansion,
// while shorthand serialization is independent of the declaration's mutation history.
function parseShorthand(property, value) {
  const shorthand = shorthandProperties.get(property);
  if (isGlobalKeyword(value)) {
    return expand(shorthand, value.toLowerCase());
  }
  if (property === "background-position") {
    const parsed = backgroundPosition.parseLonghands(value);
    return parsed && new Map([["background-position-x", parsed.x], ["background-position-y", parsed.y]]);
  }
  const parsed = shorthand.parse(value);
  if (parsed === undefined) {
    return undefined;
  }
  if (property === "background") {
    const updates = new Map();
    for (const layer of parsed) {
      for (const [name, layerValue] of Object.entries(layer)) {
        if (name !== "background-position") {
          const previous = updates.get(name);
          updates.set(name, previous && name !== "background-color" ? `${previous}, ${layerValue}` : layerValue);
        }
      }
    }
    return updates;
  }
  return expand(shorthand, parsed);
}

function expand(shorthand, parsed) {
  const updates = new Map();
  let index = 0;
  for (const [name, longhand] of shorthand.shorthandFor) {
    let value;
    if (typeof parsed === "string") {
      value = parsed;
    } else if (Array.isArray(parsed)) {
      value = getPositionValue(parsed, ["top", "right", "bottom", "left"][index]);
    } else {
      value = parsed[name] ?? shorthand.initialValues?.get(name);
    }
    index++;
    if (value === undefined) {
      continue;
    }
    if (longhand?.shorthandFor) {
      for (const entry of expand(longhand, value)) {
        updates.set(...entry);
      }
    } else {
      updates.set(name, value);
    }
  }
  if (shorthand === shorthandProperties.get("border")) {
    updates.set("border-image", typeof parsed === "string" && isGlobalKeyword(parsed) ? parsed : "none");
  }
  return updates;
}

exports.getPositionValue = getPositionValue;
exports.parseShorthand = parseShorthand;
exports.shorthandProperties = shorthandProperties;
