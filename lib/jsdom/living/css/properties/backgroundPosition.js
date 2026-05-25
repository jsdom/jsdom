"use strict";

const parsers = require("../helpers/css-values");

// Constants
const { AST_TYPES } = parsers;

const property = "background-position";
const propertyX = "background-position-x";
const propertyY = "background-position-y";
const background = "background";
const keyX = ["left", "right", "x-start", "x-end"];
const keyY = ["top", "bottom", "y-start", "y-end"];
const keywordsX = ["center", ...keyX];
const keywordsY = ["center", ...keyY];
const keywords = ["center", ...keyX, ...keyY];

const shorthandFor = new Map([
  [propertyX, { property: propertyX, position: "x" }],
  [propertyY, { property: propertyY, position: "y" }]
]);

const descriptor = {
  set(v) {
    v = v.trim();
    if (parsers.hasVarFunc(v)) {
      this._setProperty(background, "");
      this._setProperty(propertyX, "");
      this._setProperty(propertyY, "");
      this._setProperty(property, v);
    } else {
      const val = parseLonghands(v);
      if (val) {
        const priority =
          !this._priorities.get(background) && this._priorities.has(property) ?
            this._priorities.get(property) :
            "";
        this._setProperty(background, "");
        this._setProperty(propertyX, val.x, priority);
        this._setProperty(propertyY, val.y, priority);
        this._setProperty(property, val.value, priority);
      }
    }
  },
  get() {
    return this.getPropertyValue(property);
  },
  enumerable: true,
  configurable: true
};

function toValue(part) {
  if (part.type === AST_TYPES.IDENTIFIER || part.type === AST_TYPES.GLOBAL_KEYWORD) {
    return part.name;
  }
  return parsers.resolveNumericValue([part], { type: "length" });
}

function isX(value) {
  return keywordsX.includes(value);
}

function isY(value) {
  return keywordsY.includes(value);
}

function isKeyX(value) {
  return keyX.includes(value);
}

function isKeyY(value) {
  return keyY.includes(value);
}

function isKeyword(value) {
  return keywords.includes(value);
}

function isOffset(value) {
  return Boolean(value) && !isKeyword(value);
}

function parseLayer(value) {
  if (!Array.isArray(value) || !value.length || value.length > 4) {
    return undefined;
  }

  const parts = value.map(toValue);
  if (parts.some(part => !part)) {
    return undefined;
  }

  let x = "";
  let y = "";
  let shorthandValue = "";

  switch (parts.length) {
    case 1: {
      const [val] = parts;
      if (parsers.isGlobalKeyword(val)) {
        x = val;
        y = val;
      } else if (val === "center") {
        x = val;
        y = val;
      } else if (isKeyY(val)) {
        x = "center";
        y = val;
      } else {
        x = val;
        y = "center";
      }
      break;
    }

    case 2: {
      const [val1, val2] = parts;
      if (isX(val1) && isY(val2)) {
        x = val1;
        y = val2;
      } else if (isY(val1) && isX(val2)) {
        x = val2;
        y = val1;
      } else if (isKeyX(val1) && isOffset(val2)) {
        x = `${val1} ${val2}`;
        y = "center";
        shorthandValue = `${val1} ${val2}`;
      } else if (val1 === "center" && isOffset(val2)) {
        x = val1;
        y = val2;
      } else if (isKeyY(val1) && isOffset(val2)) {
        x = "center";
        y = `${val1} ${val2}`;
      } else if (isOffset(val1) && isKeyY(val2)) {
        x = val1;
        y = val2;
      } else if (isOffset(val1) && val2 === "center") {
        x = val1;
        y = val2;
      } else if (isOffset(val1) && isOffset(val2)) {
        x = val1;
        y = val2;
      }
      break;
    }

    case 3: {
      const [val1, val2, val3] = parts;
      if (val1 === "center" && isKeyX(val2) && isOffset(val3)) {
        x = `${val2} ${val3}`;
        y = val1;
      } else if (val1 === "center" && isKeyY(val2) && isOffset(val3)) {
        x = val1;
        y = `${val2} ${val3}`;
      } else if (isKeyX(val1) && isOffset(val2) && isY(val3)) {
        x = `${val1} ${val2}`;
        y = val3;
      } else if (isKeyX(val1) && isKeyY(val2) && isOffset(val3)) {
        x = val1;
        y = `${val2} ${val3}`;
      } else if (isKeyY(val1) && isOffset(val2) && isX(val3)) {
        x = val3;
        y = `${val1} ${val2}`;
      } else if (isKeyY(val1) && isKeyX(val2) && isOffset(val3)) {
        x = `${val2} ${val3}`;
        y = val1;
      }
      break;
    }

    case 4: {
      const [val1, val2, val3, val4] = parts;
      if (isKeyX(val1) && isOffset(val2) && isKeyY(val3) && isOffset(val4)) {
        x = `${val1} ${val2}`;
        y = `${val3} ${val4}`;
      } else if (isKeyY(val1) && isOffset(val2) && isKeyX(val3) && isOffset(val4)) {
        x = `${val3} ${val4}`;
        y = `${val1} ${val2}`;
      }
      break;
    }

    default:
  }

  if (!x || !y) {
    return undefined;
  }

  return {
    value: shorthandValue || serializeLayer(x, y),
    x,
    y
  };
}

/**
 * Parses the background-position property value into shorthand and longhand values.
 *
 * @param {string} v - The value to parse.
 * @returns {object|undefined} The parsed values or undefined if invalid.
 */
function parseLonghands(v) {
  if (v === "") {
    return {
      value: v,
      x: v,
      y: v
    };
  }
  const values = parsers.splitValue(v, {
    delimiter: ","
  });
  const parsedValues = [];
  const xValues = [];
  const yValues = [];
  for (const val of values) {
    const value = parsers.parsePropertyValue(property, val);
    if (Array.isArray(value) && value.length) {
      const parsed = parseLayer(value);
      if (!parsed) {
        return undefined;
      }
      parsedValues.push(parsed.value);
      xValues.push(parsed.x);
      yValues.push(parsed.y);
    } else if (typeof value === "string") {
      parsedValues.push(value);
      xValues.push(value);
      yValues.push(value);
    } else {
      return undefined;
    }
  }
  if (parsedValues.length) {
    return {
      value: parsedValues.join(", "),
      x: xValues.join(", "),
      y: yValues.join(", ")
    };
  }
  return undefined;
}

/**
 * Parses the background-position property value.
 *
 * @param {string} v - The value to parse.
 * @returns {string|undefined} The parsed value or undefined if invalid.
 */
function parse(v) {
  const parsed = parseLonghands(v);
  return parsed?.value;
}

function parseLonghand(propertyName, v) {
  if (v === "") {
    return v;
  }
  const values = parsers.splitValue(v, {
    delimiter: ","
  });
  const parsedValues = [];
  for (const val of values) {
    const value = parsers.parsePropertyValue(propertyName, val);
    if (Array.isArray(value) && value.length) {
      if (value.length > 2) {
        return undefined;
      }
      const [part1, part2] = value;
      if (part1.type === AST_TYPES.GLOBAL_KEYWORD && value.length === 1) {
        parsedValues.push(part1.name);
      } else if (part1.type === AST_TYPES.IDENTIFIER && value.length === 1) {
        parsedValues.push(part1.name);
      } else if (value.length === 1) {
        const parsedValue = parsers.resolveNumericValue([part1], { type: "length" });
        if (!parsedValue) {
          return undefined;
        }
        parsedValues.push(parsedValue);
      } else if (part1.type === AST_TYPES.IDENTIFIER) {
        const offset = parsers.resolveNumericValue([part2], { type: "length" });
        if (!offset) {
          return undefined;
        }
        parsedValues.push(`${part1.name} ${offset}`);
      } else {
        return undefined;
      }
    } else if (typeof value === "string") {
      parsedValues.push(value);
    } else {
      return undefined;
    }
  }
  if (parsedValues.length) {
    return parsedValues.join(", ");
  }
  return undefined;
}

function serializeLayer(x, y) {
  if (parsers.isGlobalKeyword(x) || parsers.isGlobalKeyword(y)) {
    return x === y ? x : "";
  }
  if (x === "center" && y === "center") {
    return "center center";
  }
  return `${x} ${y}`;
}

function serialize(x, y) {
  const xValues = parsers.splitValue(x, {
    delimiter: ","
  });
  const yValues = parsers.splitValue(y, {
    delimiter: ","
  });
  const length = Math.max(xValues.length, yValues.length);
  const values = [];
  for (let i = 0; i < length; i++) {
    const xValue = xValues[i] !== undefined ? xValues[i] : xValues[0];
    const yValue = yValues[i] !== undefined ? yValues[i] : yValues[0];
    const value = serializeLayer(xValue, yValue);
    if (!value) {
      return undefined;
    }
    values.push(value);
  }
  return values.join(", ");
}

function setLonghand(style, longhand, value, priority) {
  const otherLonghand = longhand === propertyX ? propertyY : propertyX;
  style._setProperty(background, "");
  style._setProperty(property, "");
  style._setProperty(longhand, value, priority);

  const otherValue = style.getPropertyValue(otherLonghand);
  if (!value || !otherValue || parsers.hasVarFunc(value) || parsers.hasVarFunc(otherValue)) {
    return;
  }

  const otherPriority = style.getPropertyPriority(otherLonghand);
  if (priority !== otherPriority) {
    return;
  }

  const x = longhand === propertyX ? value : otherValue;
  const y = longhand === propertyY ? value : otherValue;
  const shorthandValue = serialize(x, y);
  if (shorthandValue) {
    style._setProperty(property, shorthandValue, priority);
  }
}

module.exports = {
  descriptor,
  parse,
  parseLonghand,
  parseLonghands,
  property,
  propertyX,
  propertyY,
  serialize,
  setLonghand,
  shorthandFor
};
