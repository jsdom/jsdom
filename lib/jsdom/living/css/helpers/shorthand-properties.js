"use strict";

const { LRUCache } = require("lru-cache");
const propertyDefinitions = require("../../../../generated/css-property-definitions");
const background = require("../properties/background");
const backgroundColor = require("../properties/backgroundColor");
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
const { hasVarFunc, isGlobalKeyword, isValidPropertyValue, splitValue } = require("./css-values");

// Constants
const BORDER_IMAGE = "border-image";
const TOP = "top";
const RIGHT = "right";
const BOTTOM = "bottom";
const LEFT = "left";
const WIDTH = "width";
const STYLE = "style";
const COLOR = "color";
const NONE = "none";
const TRBL_INDICES = {
  [TOP]: 0,
  [RIGHT]: 1,
  [BOTTOM]: 2,
  [LEFT]: 3
};

// Cache
const lruCache = new LRUCache({
  max: 2048
});

const shorthandProperties = new Map([
  [background.property, background],
  [
    border.property,
    {
      descriptor: border.descriptor,
      parse: border.parse,
      shorthandFor: new Map([...border.shorthandFor, ...border.positionShorthandFor, [BORDER_IMAGE, null]])
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

const borderProperties = new Set([
  border.property,
  BORDER_IMAGE,
  ...border.shorthandFor.keys(),
  ...border.positionShorthandFor.keys(),
  ...borderTop.shorthandFor.keys(),
  ...borderRight.shorthandFor.keys(),
  ...borderBottom.shorthandFor.keys(),
  ...borderLeft.shorthandFor.keys()
]);
const borderLines = new Set([WIDTH, STYLE, COLOR]);
const borderPositions = new Set([TOP, RIGHT, BOTTOM, LEFT]);
const borderCollectionConfig = {
  [WIDTH]: {
    shorthand: borderWidth.property,
    generator: generateBorderLineShorthand
  },
  [STYLE]: {
    shorthand: borderStyle.property,
    generator: generateBorderLineShorthand
  },
  [COLOR]: {
    shorthand: borderColor.property,
    generator: generateBorderLineShorthand
  },
  [TOP]: {
    shorthand: borderTop.property,
    generator: generateBorderPositionShorthand
  },
  [RIGHT]: {
    shorthand: borderRight.property,
    generator: generateBorderPositionShorthand
  },
  [BOTTOM]: {
    shorthand: borderBottom.property,
    generator: generateBorderPositionShorthand
  },
  [LEFT]: {
    shorthand: borderLeft.property,
    generator: generateBorderPositionShorthand
  }
};

// Safely deep-clones the parsed object/array to prevent cache mutation.
function safeClone(obj) {
  if (!obj || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    const len = obj.length;
    const arr = new Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = safeClone(obj[i]);
    }
    return arr;
  }
  return { ...obj };
}

// Memoizes the shorthand parsing execution.
function parseShorthand(shorthandParser, property, value) {
  const cacheKey = `parseShorthand_${property}_${value}`;
  const cached = lruCache.get(cacheKey);
  if (cached !== undefined) {
    return safeClone(cached);
  }

  const parsed = shorthandParser(value);
  lruCache.set(cacheKey, parsed);

  return safeClone(parsed);
}

// Ensures consistent object shape.
function createPropertyItem(property, value = "", priority = "") {
  return {
    property,
    value,
    priority
  };
}

// Retrieves a property item from the map or creates a default one if it doesn't exist.
function getPropertyItem(property, properties) {
  const propertyItem = properties.get(property) ?? createPropertyItem(property);
  return propertyItem;
}

// Calculates the value for a specific position from shorthand values.
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

// Replaces the background shorthand property based on individual longhand values.
function replaceBackgroundShorthand(property, properties) {
  const { value: propertyValue } = properties.get(property);
  const values = splitValue(propertyValue, {
    delimiter: ","
  });
  const { value: shorthandValue } = properties.get(background.property);
  const bgValues = parseShorthand(background.parse, background.property, shorthandValue);
  const bgLength = bgValues.length;
  if (property === backgroundColor.property) {
    bgValues[bgLength - 1][property] = values[0];
  } else {
    for (let i = 0; i < bgLength; i++) {
      bgValues[i][property] = values[i] !== undefined ? values[i] : values[0];
    }
  }
  const backgrounds = [];
  for (const bgValue of bgValues) {
    const bg = [];
    let hasPosition = false;
    const originValue = bgValue["background-origin"];
    const clipValue = bgValue["background-clip"];
    const isDefaultBox =
      originValue === background.initialValues.get("background-origin") &&
      clipValue === background.initialValues.get("background-clip");
    for (const longhand of background.initialValues.keys()) {
      const value = bgValue[longhand];
      if (!value) {
        continue;
      }
      if (longhand === "background-origin") {
        if (!isDefaultBox) {
          bg.push(originValue);
        }
      } else if (longhand === "background-clip") {
        if (!isDefaultBox && originValue !== clipValue) {
          bg.push(clipValue);
        }
      } else if (value !== background.initialValues.get(longhand)) {
        if (longhand === "background-position") {
          hasPosition = true;
          bg.push(value);
        } else if (longhand === "background-size") {
          if (hasPosition) {
            bg.push(`/ ${value}`);
          } else {
            bg.push(background.initialValues.get("background-position"), `/ ${value}`);
          }
        } else {
          bg.push(value);
        }
      }
    }
    backgrounds.push(bg.join(" "));
  }
  return backgrounds.join(", ");
}

// Checks if a property value matches the value within a border shorthand.
function matchesBorderShorthandValue(property, value, shorthandValue) {
  const obj = parseShorthand(border.parse, border.property, shorthandValue);
  if (typeof obj !== "object") {
    return false;
  }
  if (Object.hasOwn(obj, property)) {
    return value === obj[property];
  }
  return value === border.initialValues.get(property);
}

// Replaces or updates a value within a border shorthand string.
function replaceBorderShorthandValue(value, shorthandValue) {
  const borderFirstInitialKey = border.initialValues.keys().next().value;
  const borderFirstInitialValue = border.initialValues.get(borderFirstInitialKey);
  const valueObj = parseShorthand(border.parse, border.property, value);
  const shorthandObj = shorthandValue ?
    parseShorthand(border.parse, border.property, shorthandValue) :
    {
      [borderFirstInitialKey]: borderFirstInitialValue
    };
  if (shorthandObj && typeof shorthandObj !== "object") {
    return "";
  }

  const keys = border.shorthandFor.keys();
  for (const key of keys) {
    const initialValue = border.initialValues.get(key);
    let parsedValue = initialValue;
    if (Object.hasOwn(valueObj, key)) {
      parsedValue = valueObj[key];
    }
    if (parsedValue === initialValue) {
      if (key === borderFirstInitialKey) {
        if (!Object.hasOwn(shorthandObj, key)) {
          shorthandObj[key] = parsedValue;
        }
      } else {
        delete shorthandObj[key];
      }
    } else {
      shorthandObj[key] = parsedValue;
      if (shorthandObj[borderFirstInitialKey] && shorthandObj[borderFirstInitialKey] === borderFirstInitialValue) {
        delete shorthandObj[borderFirstInitialKey];
      }
    }
  }

  return Object.values(shorthandObj).join(" ");
}

// Replaces a value at a specific position (top, right, bottom, left) within a position shorthand.
function replacePositionValue(value, positionValues, position) {
  const index = TRBL_INDICES[position] ?? -1;
  let currentValues = positionValues;
  if (index !== -1) {
    // Loop for reducing array length (instead of recursion)
    while (true) {
      const [val1, val2, val3, val4] = currentValues;
      switch (currentValues.length) {
        case 2: {
          if (val1 === val2) {
            currentValues = [val1];
            continue;
          }
          switch (index) {
            // Top
            case 0: {
              if (val1 === value) {
                return currentValues.join(" ");
              }
              return `${value} ${val2} ${val1}`;
            }
            // Right
            case 1: {
              if (val2 === value) {
                return currentValues.join(" ");
              }
              return `${val1} ${value} ${val1} ${val2}`;
            }
            // Bottom
            case 2: {
              if (val1 === value) {
                return currentValues.join(" ");
              }
              return `${val1} ${val2} ${value}`;
            }
            // Left
            case 3:
            default: {
              if (val2 === value) {
                return currentValues.join(" ");
              }
              return `${val1} ${val2} ${val1} ${value}`;
            }
          }
        }
        case 3: {
          if (val1 === val3) {
            currentValues = [val1, val2];
            continue;
          }
          switch (index) {
            // Top
            case 0: {
              if (val1 === value) {
                return currentValues.join(" ");
              } else if (val3 === value) {
                return `${value} ${val2}`;
              }
              return `${value} ${val2} ${val3}`;
            }
            // Right
            case 1: {
              if (val2 === value) {
                return currentValues.join(" ");
              }
              return `${val1} ${value} ${val3} ${val2}`;
            }
            // Bottom
            case 2: {
              if (val3 === value) {
                return currentValues.join(" ");
              } else if (val1 === value) {
                return `${val1} ${val2}`;
              }
              return `${val1} ${val2} ${value}`;
            }
            // Left
            case 3:
            default: {
              if (val2 === value) {
                return currentValues.join(" ");
              }
              return `${val1} ${val2} ${val3} ${value}`;
            }
          }
        }
        case 4: {
          if (val2 === val4) {
            currentValues = [val1, val2, val3];
            continue;
          }
          switch (index) {
            // Top
            case 0: {
              if (val1 === value) {
                return currentValues.join(" ");
              }
              return `${value} ${val2} ${val3} ${val4}`;
            }
            // Right
            case 1: {
              if (val2 === value) {
                return currentValues.join(" ");
              } else if (val4 === value) {
                return `${val1} ${value} ${val3}`;
              }
              return `${val1} ${value} ${val3} ${val4}`;
            }
            // Bottom
            case 2: {
              if (val3 === value) {
                return currentValues.join(" ");
              }
              return `${val1} ${val2} ${value} ${val4}`;
            }
            // Left
            case 3:
            default: {
              if (val4 === value) {
                return currentValues.join(" ");
              } else if (val2 === value) {
                return `${val1} ${val2} ${val3}`;
              }
              return `${val1} ${val2} ${val3} ${value}`;
            }
          }
        }
        case 1:
        default: {
          const [val] = currentValues;
          if (val === value) {
            return currentValues.join(" ");
          }
          switch (index) {
            // Top
            case 0: {
              return `${value} ${val} ${val}`;
            }
            // Right
            case 1: {
              return `${val} ${value} ${val} ${val}`;
            }
            // Bottom
            case 2: {
              return `${val} ${val} ${value}`;
            }
            // Left
            case 3:
            default: {
              return `${val} ${val} ${val} ${value}`;
            }
          }
        }
      }
    }
  }
  // Fallback logic for when no specific position is requested.
  const [val1, val2, val3, val4] = currentValues;
  switch (currentValues.length) {
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

// Handles border property preparation when the value is a string.
function prepareBorderStringValue({ property, value, priority, properties, parts, borderItems }) {
  const { prop1, prop2, prop3 } = parts;
  const shorthandItem = getPropertyItem(border.property, properties);
  const imageItem = getPropertyItem(BORDER_IMAGE, properties);
  if (prop3) {
    // Handle longhand properties.
    const lineProperty = `${prop1}-${prop3}`;
    const lineItem = getPropertyItem(lineProperty, properties);
    const positionProperty = `${prop1}-${prop2}`;
    const positionItem = getPropertyItem(positionProperty, properties);
    const longhandProperty = `${prop1}-${prop2}-${prop3}`;
    const longhandItem = getPropertyItem(longhandProperty, properties);
    longhandItem.value = value;
    longhandItem.priority = priority;
    const propertyValue = hasVarFunc(value) ? "" : value;
    if (propertyValue === "") {
      shorthandItem.value = "";
      lineItem.value = "";
      positionItem.value = "";
    } else if (isGlobalKeyword(propertyValue)) {
      if (shorthandItem.value !== propertyValue) {
        shorthandItem.value = "";
      }
      if (lineItem.value !== propertyValue) {
        lineItem.value = "";
      }
      if (positionItem.value !== propertyValue) {
        positionItem.value = "";
      }
    } else {
      if (shorthandItem.value && !matchesBorderShorthandValue(lineProperty, propertyValue, shorthandItem.value)) {
        shorthandItem.value = "";
      }
      if (lineItem.value) {
        if (isGlobalKeyword(lineItem.value)) {
          lineItem.value = "";
        } else {
          lineItem.value = replacePositionValue(propertyValue, splitValue(lineItem.value), prop2);
        }
      }
      if (positionItem.value && !matchesBorderShorthandValue(lineProperty, propertyValue, positionItem.value)) {
        positionItem.value = "";
      }
    }
    borderItems.set(border.property, shorthandItem);
    borderItems.set(BORDER_IMAGE, imageItem);
    borderItems.set(lineProperty, lineItem);
    borderItems.set(positionProperty, positionItem);
    borderItems.set(longhandProperty, longhandItem);
  } else if (prop2 && borderPositions.has(prop2)) {
    // Handle side-specific border shorthands (border-top, border-right, border-bottom, border-left).
    const lineWidthProperty = `${prop1}-width`;
    const lineWidthItem = getPropertyItem(lineWidthProperty, properties);
    const lineStyleProperty = `${prop1}-style`;
    const lineStyleItem = getPropertyItem(lineStyleProperty, properties);
    const lineColorProperty = `${prop1}-color`;
    const lineColorItem = getPropertyItem(lineColorProperty, properties);
    const positionProperty = `${prop1}-${prop2}`;
    const positionItem = getPropertyItem(positionProperty, properties);
    positionItem.value = value;
    positionItem.priority = priority;

    const propertyValue = hasVarFunc(value) ? "" : value;
    if (propertyValue === "") {
      shorthandItem.value = "";
      lineWidthItem.value = "";
      lineStyleItem.value = "";
      lineColorItem.value = "";
    } else if (isGlobalKeyword(propertyValue)) {
      if (shorthandItem.value !== propertyValue) {
        shorthandItem.value = "";
      }
      if (lineWidthItem.value !== propertyValue) {
        lineWidthItem.value = "";
      }
      if (lineStyleItem.value !== propertyValue) {
        lineStyleItem.value = "";
      }
      if (lineColorItem.value !== propertyValue) {
        lineColorItem.value = "";
      }
    } else {
      if (shorthandItem.value && !matchesBorderShorthandValue(property, propertyValue, shorthandItem.value)) {
        shorthandItem.value = "";
      }
      if (lineWidthItem.value && isValidPropertyValue(lineWidthProperty, propertyValue)) {
        lineWidthItem.value = propertyValue;
      }
      if (lineStyleItem.value && isValidPropertyValue(lineStyleProperty, propertyValue)) {
        lineStyleItem.value = propertyValue;
      }
      if (lineColorItem.value && isValidPropertyValue(lineColorProperty, propertyValue)) {
        lineColorItem.value = propertyValue;
      }
    }

    for (const line of borderLines) {
      const longhandProperty = `${prop1}-${prop2}-${line}`;
      const longhandItem = getPropertyItem(longhandProperty, properties);
      longhandItem.value = propertyValue;
      longhandItem.priority = priority;
      borderItems.set(longhandProperty, longhandItem);
    }

    borderItems.set(border.property, shorthandItem);
    borderItems.set(BORDER_IMAGE, imageItem);
    borderItems.set(lineWidthProperty, lineWidthItem);
    borderItems.set(lineStyleProperty, lineStyleItem);
    borderItems.set(lineColorProperty, lineColorItem);
    borderItems.set(positionProperty, positionItem);
  } else if (prop2 && borderLines.has(prop2)) {
    // Handle property-specific border shorthands (border-width, border-style, border-color).
    const lineProperty = `${prop1}-${prop2}`;
    const lineItem = getPropertyItem(lineProperty, properties);
    lineItem.value = value;
    lineItem.priority = priority;

    const propertyValue = hasVarFunc(value) ? "" : value;
    if (propertyValue === "") {
      shorthandItem.value = "";
    } else if (isGlobalKeyword(propertyValue)) {
      if (shorthandItem.value !== propertyValue) {
        shorthandItem.value = "";
      }
    }

    for (const position of borderPositions) {
      const positionProperty = `${prop1}-${position}`;
      const positionItem = getPropertyItem(positionProperty, properties);
      const longhandProperty = `${prop1}-${position}-${prop2}`;
      const longhandItem = getPropertyItem(longhandProperty, properties);
      if (propertyValue) {
        positionItem.value = replaceBorderShorthandValue(propertyValue, positionItem.value);
      } else {
        positionItem.value = "";
      }
      longhandItem.value = propertyValue;
      longhandItem.priority = priority;
      borderItems.set(positionProperty, positionItem);
      borderItems.set(longhandProperty, longhandItem);
    }

    borderItems.set(border.property, shorthandItem);
    borderItems.set(BORDER_IMAGE, imageItem);
    borderItems.set(lineProperty, lineItem);
  } else {
    // Handle border shorthand.
    const propertyValue = hasVarFunc(value) ? "" : value;
    imageItem.value = propertyValue ? NONE : "";
    for (const line of borderLines) {
      const lineProperty = `${prop1}-${line}`;
      const lineItem = getPropertyItem(lineProperty, properties);
      lineItem.value = propertyValue;
      lineItem.priority = priority;
      borderItems.set(lineProperty, lineItem);
    }
    for (const position of borderPositions) {
      const positionProperty = `${prop1}-${position}`;
      const positionItem = getPropertyItem(positionProperty, properties);
      positionItem.value = propertyValue;
      positionItem.priority = priority;
      borderItems.set(positionProperty, positionItem);
      for (const line of borderLines) {
        const longhandProperty = `${positionProperty}-${line}`;
        const longhandItem = getPropertyItem(longhandProperty, properties);
        longhandItem.value = propertyValue;
        longhandItem.priority = priority;
        borderItems.set(longhandProperty, longhandItem);
      }
    }
    borderItems.set(property, shorthandItem);
    borderItems.set(BORDER_IMAGE, imageItem);
  }
}

// Handles border property preparation when the value is an array.
function prepareBorderArrayValue({ value, priority, properties, parts, borderItems }) {
  const { prop1, prop2 } = parts;
  if (!value.length || !borderLines.has(prop2)) {
    return;
  }

  const shorthandItem = getPropertyItem(border.property, properties);
  const imageItem = getPropertyItem(BORDER_IMAGE, properties);
  const lineProperty = `${prop1}-${prop2}`;
  const lineItem = getPropertyItem(lineProperty, properties);
  if (value.length === 1) {
    const [propertyValue] = value;
    if (shorthandItem.value) {
      if (hasVarFunc(shorthandItem.value)) {
        shorthandItem.value = "";
      } else if (propertyValue) {
        shorthandItem.value = replaceBorderShorthandValue(propertyValue, shorthandItem.value);
      }
    }
  } else {
    shorthandItem.value = "";
  }
  lineItem.value = value.join(" ");
  lineItem.priority = priority;

  const positionValues = {};
  const [val1, val2, val3, val4] = value;
  switch (value.length) {
    case 2: {
      positionValues.top = val1;
      positionValues.right = val2;
      positionValues.bottom = val1;
      positionValues.left = val2;
      break;
    }
    case 3: {
      positionValues.top = val1;
      positionValues.right = val2;
      positionValues.bottom = val3;
      positionValues.left = val2;
      break;
    }
    case 4: {
      positionValues.top = val1;
      positionValues.right = val2;
      positionValues.bottom = val3;
      positionValues.left = val4;
      break;
    }
    case 1:
    default: {
      positionValues.top = val1;
      positionValues.right = val1;
      positionValues.bottom = val1;
      positionValues.left = val1;
    }
  }

  for (const position of borderPositions) {
    const positionProperty = `${prop1}-${position}`;
    const positionItem = getPropertyItem(positionProperty, properties);
    if (positionItem.value && positionValues[position]) {
      positionItem.value = replaceBorderShorthandValue(positionValues[position], positionItem.value);
    }
    const longhandProperty = `${positionProperty}-${prop2}`;
    const longhandItem = getPropertyItem(longhandProperty, properties);
    longhandItem.value = positionValues[position];
    longhandItem.priority = priority;
    borderItems.set(positionProperty, positionItem);
    borderItems.set(longhandProperty, longhandItem);
  }

  borderItems.set(border.property, shorthandItem);
  borderItems.set(BORDER_IMAGE, imageItem);
  borderItems.set(lineProperty, lineItem);
}

// Handles border property preparation when the value is an object.
function prepareBorderObjectValue({ property, value, priority, properties, parts, borderItems }) {
  const { prop1, prop2 } = parts;
  const imageItem = getPropertyItem(BORDER_IMAGE, properties);
  // Handle position shorthands.
  if (prop2) {
    if (!borderPositions.has(prop2)) {
      return;
    }

    const shorthandItem = getPropertyItem(border.property, properties);
    const lineWidthProperty = `${prop1}-width`;
    const lineWidthItem = getPropertyItem(lineWidthProperty, properties);
    const lineStyleProperty = `${prop1}-style`;
    const lineStyleItem = getPropertyItem(lineStyleProperty, properties);
    const lineColorProperty = `${prop1}-color`;
    const lineColorItem = getPropertyItem(lineColorProperty, properties);
    const positionProperty = `${prop1}-${prop2}`;
    const positionItem = getPropertyItem(positionProperty, properties);
    if (shorthandItem.value) {
      for (const positionValue of Object.values(value)) {
        if (!matchesBorderShorthandValue(property, positionValue, shorthandItem.value)) {
          shorthandItem.value = "";
          break;
        }
      }
    }
    positionItem.value = Object.values(value).join(" ");
    positionItem.priority = priority;

    for (const line of borderLines) {
      const longhandProperty = `${prop1}-${prop2}-${line}`;
      const longhandItem = getPropertyItem(longhandProperty, properties);
      const itemValue = Object.hasOwn(value, longhandProperty) ?
        value[longhandProperty] :
        border.initialValues.get(`${prop1}-${line}`);
      if (line === WIDTH && lineWidthItem.value) {
        if (isGlobalKeyword(lineWidthItem.value)) {
          lineWidthItem.value = "";
        } else {
          lineWidthItem.value = replacePositionValue(itemValue, splitValue(lineWidthItem.value), prop2);
        }
      } else if (line === STYLE && lineStyleItem.value) {
        if (isGlobalKeyword(lineStyleItem.value)) {
          lineStyleItem.value = "";
        } else {
          lineStyleItem.value = replacePositionValue(itemValue, splitValue(lineStyleItem.value), prop2);
        }
      } else if (line === COLOR && lineColorItem.value) {
        if (isGlobalKeyword(lineColorItem.value)) {
          lineColorItem.value = "";
        } else {
          lineColorItem.value = replacePositionValue(itemValue, splitValue(lineColorItem.value), prop2);
        }
      }
      longhandItem.value = itemValue;
      longhandItem.priority = priority;
      borderItems.set(longhandProperty, longhandItem);
    }

    borderItems.set(border.property, shorthandItem);
    borderItems.set(BORDER_IMAGE, imageItem);
    borderItems.set(lineWidthProperty, lineWidthItem);
    borderItems.set(lineStyleProperty, lineStyleItem);
    borderItems.set(lineColorProperty, lineColorItem);
    borderItems.set(positionProperty, positionItem);
  } else {
    // Handle border shorthand.
    const shorthandItem = getPropertyItem(prop1, properties);
    const lineWidthProperty = `${prop1}-width`;
    const lineWidthItem = getPropertyItem(lineWidthProperty, properties);
    const lineStyleProperty = `${prop1}-style`;
    const lineStyleItem = getPropertyItem(lineStyleProperty, properties);
    const lineColorProperty = `${prop1}-color`;
    const lineColorItem = getPropertyItem(lineColorProperty, properties);
    const propertyValue = Object.values(value).join(" ");
    shorthandItem.value = propertyValue;
    shorthandItem.priority = priority;
    imageItem.value = propertyValue ? NONE : "";

    if (Object.hasOwn(value, lineWidthProperty)) {
      lineWidthItem.value = value[lineWidthProperty];
    } else {
      lineWidthItem.value = border.initialValues.get(lineWidthProperty);
    }
    lineWidthItem.priority = priority;

    if (Object.hasOwn(value, lineStyleProperty)) {
      lineStyleItem.value = value[lineStyleProperty];
    } else {
      lineStyleItem.value = border.initialValues.get(lineStyleProperty);
    }
    lineStyleItem.priority = priority;

    if (Object.hasOwn(value, lineColorProperty)) {
      lineColorItem.value = value[lineColorProperty];
    } else {
      lineColorItem.value = border.initialValues.get(lineColorProperty);
    }
    lineColorItem.priority = priority;

    for (const position of borderPositions) {
      const positionProperty = `${prop1}-${position}`;
      const positionItem = getPropertyItem(positionProperty, properties);
      positionItem.value = propertyValue;
      positionItem.priority = priority;
      for (const line of borderLines) {
        const longhandProperty = `${positionProperty}-${line}`;
        const longhandItem = getPropertyItem(longhandProperty, properties);
        const lineProperty = `${prop1}-${line}`;
        if (Object.hasOwn(value, lineProperty)) {
          longhandItem.value = value[lineProperty];
        } else {
          longhandItem.value = border.initialValues.get(lineProperty);
        }
        longhandItem.priority = priority;
        borderItems.set(longhandProperty, longhandItem);
      }
      borderItems.set(positionProperty, positionItem);
    }

    borderItems.set(property, shorthandItem);
    borderItems.set(BORDER_IMAGE, imageItem);
    borderItems.set(lineWidthProperty, lineWidthItem);
    borderItems.set(lineStyleProperty, lineStyleItem);
    borderItems.set(lineColorProperty, lineColorItem);
  }
}

// Prepares border properties by splitting shorthands and handling updates.
function prepareBorderProperties(property, value, priority, properties) {
  if (typeof property !== "string" || value === null) {
    return undefined;
  }
  if (!property.startsWith(border.property)) {
    return undefined;
  }
  let prop2, prop3;
  if (property.length > border.property.length) {
    // Check if next char is '-'
    if (property.charCodeAt(border.property.length) !== 45) {
      return undefined;
    }
    // property is like "border-..."
    const remainder = property.substring(border.property.length + 1);
    const hyphenIndex = remainder.indexOf("-");
    if (hyphenIndex !== -1) {
      prop2 = remainder.substring(0, hyphenIndex);
      prop3 = remainder.substring(hyphenIndex + 1);
    } else {
      prop2 = remainder;
    }
  }
  if ((borderPositions.has(prop2) && prop3 && !borderLines.has(prop3)) || (borderLines.has(prop2) && prop3)) {
    return undefined;
  }

  const parts = {
    prop1: border.property,
    prop2,
    prop3
  };
  const borderItems = new Map();
  if (typeof value === "string") {
    prepareBorderStringValue({
      property,
      value,
      priority,
      properties,
      parts,
      borderItems
    });
  } else if (Array.isArray(value)) {
    prepareBorderArrayValue({
      value,
      priority,
      properties,
      parts,
      borderItems
    });
  } else if (value && typeof value === "object") {
    prepareBorderObjectValue({
      property,
      value,
      priority,
      properties,
      parts,
      borderItems
    });
  }
  if (!borderItems.has(border.property)) {
    return undefined;
  }

  const borderProps = new Map([[border.property, borderItems.get(border.property)]]);
  for (const line of borderLines) {
    const lineProperty = `${border.property}-${line}`;
    const lineItem = borderItems.get(lineProperty) ?? getPropertyItem(lineProperty, properties);
    borderProps.set(lineProperty, lineItem);
  }
  for (const position of borderPositions) {
    const positionProperty = `${border.property}-${position}`;
    const positionItem = borderItems.get(positionProperty) ?? getPropertyItem(positionProperty, properties);
    borderProps.set(positionProperty, positionItem);
    for (const line of borderLines) {
      const longhandProperty = `${border.property}-${position}-${line}`;
      const longhandItem = borderItems.get(longhandProperty) ?? getPropertyItem(longhandProperty, properties);
      borderProps.set(longhandProperty, longhandItem);
    }
  }

  const borderImageItem = borderItems.get(BORDER_IMAGE) ?? createPropertyItem(BORDER_IMAGE);
  borderProps.set(BORDER_IMAGE, borderImageItem);

  return borderProps;
}

// Generates a border line shorthand property if all line components are present.
function generateBorderLineShorthand(items, property, priority = "") {
  const values = [];
  const line = property.substring(property.indexOf("-") + 1);

  for (const position of borderPositions) {
    const longhandProperty = `border-${position}-${line}`;
    const item = items.get(longhandProperty);
    if (item) {
      values.push(item.value);
    }
  }

  const value = getPositionValue(values);
  return [property, createPropertyItem(property, value, priority)];
}

// Generates a border position shorthand property if all position components are present.
function generateBorderPositionShorthand(items, property, priority = "") {
  const values = [];
  for (const line of borderLines) {
    const longhandProperty = `${property}-${line}`;
    const item = items.get(longhandProperty);
    if (item) {
      values.push(item.value);
    }
  }

  const value = values.join(" ");
  return [property, createPropertyItem(property, value, priority)];
}

// Generates a border shorthand property if all components match.
function generateBorderShorthand(items, property, priority = "") {
  const values = new Set(items);
  if (values.size === 1) {
    const { value } = values.keys().next();
    return [property, createPropertyItem(property, value, priority)];
  }

  return undefined;
}

// Processes and consolidates border-related longhands into shorthands where possible.
function prepareBorderShorthands(properties) {
  const borderCollections = {};
  for (const [property, item] of properties) {
    const { priority, value } = item;
    let positionPart, linePart;
    const firstHyphen = property.indexOf("-");
    if (firstHyphen !== -1) {
      const remainder = property.substring(firstHyphen + 1);
      const secondHyphen = remainder.indexOf("-");
      if (secondHyphen !== -1) {
        positionPart = remainder.substring(0, secondHyphen);
        linePart = remainder.substring(secondHyphen + 1);
      } else {
        positionPart = remainder;
        linePart = undefined;
      }
    }

    if (linePart && borderCollectionConfig[linePart]) {
      if (!borderCollections[linePart]) {
        borderCollections[linePart] = { items: new Map(), priorityItems: new Map() };
      }
      if (priority) {
        borderCollections[linePart].priorityItems.set(property, { property, value, priority });
      } else {
        borderCollections[linePart].items.set(property, { property, value, priority });
      }
    }

    if (positionPart && borderCollectionConfig[positionPart]) {
      if (!borderCollections[positionPart]) {
        borderCollections[positionPart] = { items: new Map(), priorityItems: new Map() };
      }
      if (priority) {
        borderCollections[positionPart].priorityItems.set(property, { property, value, priority });
      } else {
        borderCollections[positionPart].items.set(property, { property, value, priority });
      }
    }
  }

  const shorthandItems = [];
  const shorthandPriorityItems = [];
  for (const [key, collection] of Object.entries(borderCollections)) {
    const { shorthand, generator } = borderCollectionConfig[key];
    const { items, priorityItems } = collection;
    const requiredSize = borderLines.has(key) ? 4 : 3;
    if (items.size === requiredSize) {
      const [property, item] = generator(items, shorthand) ?? [];
      if (property && item) {
        properties.set(property, item);
        if (borderPositions.has(key) && properties.has(BORDER_IMAGE)) {
          const { value: imageValue } = properties.get(BORDER_IMAGE);
          if (imageValue === NONE) {
            shorthandItems.push(item.value);
          }
        }
      }
    } else if (priorityItems.size === requiredSize) {
      const [property, item] = generator(priorityItems, shorthand, "important") ?? [];
      if (property && item) {
        properties.set(property, item);
        if (borderPositions.has(key) && properties.has(BORDER_IMAGE)) {
          const { value: imageValue } = properties.get(BORDER_IMAGE);
          if (imageValue === NONE) {
            shorthandPriorityItems.push(item.value);
          }
        }
      }
    }
  }

  const mixedPriorities = shorthandItems.length && shorthandPriorityItems.length;
  const imageItem = createPropertyItem(BORDER_IMAGE, NONE);
  if (shorthandItems.length === 4) {
    const [property, item] = generateBorderShorthand(shorthandItems, border.property) ?? [];
    if (property && item) {
      properties.set(property, item);
      properties.delete(BORDER_IMAGE);
      properties.set(BORDER_IMAGE, imageItem);
    }
  } else if (shorthandPriorityItems.length === 4) {
    const [property, item] = generateBorderShorthand(shorthandPriorityItems, border.property, "important") ?? [];
    if (property && item) {
      properties.set(property, item);
      properties.delete(BORDER_IMAGE);
      properties.set(BORDER_IMAGE, imageItem);
    }
  } else if (properties.has(BORDER_IMAGE)) {
    const { value: imageValue } = properties.get(BORDER_IMAGE);
    if (imageValue === NONE) {
      if (mixedPriorities) {
        properties.delete(BORDER_IMAGE);
        properties.set(BORDER_IMAGE, imageItem);
      } else {
        properties.delete(BORDER_IMAGE);
      }
    }
  }
  if (mixedPriorities) {
    const items = [];
    const priorityItems = [];
    for (const item of properties) {
      const [, { priority }] = item;
      if (priority) {
        priorityItems.push(item);
      } else {
        items.push(item);
      }
    }
    const firstPropertyKey = properties.keys().next().value;
    const { priority: firstPropertyPriority } = properties.get(firstPropertyKey);
    if (firstPropertyPriority) {
      return new Map([...priorityItems, ...items]);
    }
    return new Map([...items, ...priorityItems]);
  }

  if (properties.has(BORDER_IMAGE)) {
    properties.delete(BORDER_IMAGE);
    properties.set(BORDER_IMAGE, imageItem);
  }

  return properties;
}

// Processes shorthand properties from the shorthands map.
function processShorthandProperties(shorthands) {
  const shorthandItems = new Map();
  for (const [property, item] of shorthands) {
    const shorthandItem = shorthandProperties.get(property);
    if (item.size === shorthandItem.shorthandFor.size && shorthandItem.position) {
      const positionValues = [];
      let priority = "";
      for (const longhandProperty of shorthandItem.shorthandFor.keys()) {
        const longhandItem = item.get(longhandProperty);
        if (longhandItem) {
          positionValues.push(longhandItem.value);
          if (longhandItem.priority) {
            priority = longhandItem.priority;
          }
        }
      }

      const value = getPositionValue(positionValues, shorthandItem.position);
      shorthandItems.set(property, createPropertyItem(property, value, priority));
    }
  }

  return shorthandItems;
}

// Updates the longhand properties map with a new property item.
// If a property with normal priority already exists, it will be overwritten by the new item.
// If the existing property has "important" priority, it will not be overwritten.
function updateLonghandProperties(property, item, longhandProperties) {
  if (longhandProperties.has(property)) {
    const { priority: longhandPriority } = longhandProperties.get(property);
    if (!longhandPriority) {
      longhandProperties.delete(property);
      longhandProperties.set(property, item);
    }
  } else {
    longhandProperties.set(property, item);
  }
}

// Processes border properties from the borders map, expanding and normalizing them.
function processBorderProperties(borders) {
  const longhandProperties = new Map();
  for (const [property, item] of borders) {
    if (shorthandProperties.has(property)) {
      const { value, priority } = item;
      if (isGlobalKeyword(value)) {
        longhandProperties.set(property, createPropertyItem(property, value, priority));
        continue;
      }
      if (property === border.property) {
        const lineItems = parseShorthand(border.parse, border.property, value);
        for (const [key, initialValue] of border.initialValues) {
          if (!Object.hasOwn(lineItems, key)) {
            lineItems[key] = initialValue;
          }
        }
        for (const lineProperty of Object.keys(lineItems)) {
          let namePart, linePart;
          const hyphenIndex = lineProperty.indexOf("-");
          if (hyphenIndex !== -1) {
            namePart = lineProperty.substring(0, hyphenIndex);
            linePart = lineProperty.substring(hyphenIndex + 1);
          } else {
            namePart = lineProperty;
            linePart = "";
          }

          const lineValue = lineItems[lineProperty];
          for (const position of borderPositions) {
            const longhandProperty = `${namePart}-${position}-${linePart}`;
            const longhandItem = createPropertyItem(longhandProperty, lineValue, priority);
            updateLonghandProperties(longhandProperty, longhandItem, longhandProperties);
          }
        }

        if (value) {
          longhandProperties.set(BORDER_IMAGE, createPropertyItem(BORDER_IMAGE, NONE, priority));
        }
      } else {
        const shorthandItem = shorthandProperties.get(property);
        const parsedItem = parseShorthand(shorthandItem.parse, property, value);
        if (Array.isArray(parsedItem)) {
          let namePart, linePart;
          const hyphenIndex = property.indexOf("-");
          if (hyphenIndex !== -1) {
            namePart = property.substring(0, hyphenIndex);
            linePart = property.substring(hyphenIndex + 1);
          } else {
            namePart = property;
          }
          for (const position of borderPositions) {
            const longhandProperty = `${namePart}-${position}-${linePart}`;
            const longhandValue = getPositionValue(parsedItem, position);
            const longhandItem = createPropertyItem(longhandProperty, longhandValue, priority);
            updateLonghandProperties(longhandProperty, longhandItem, longhandProperties);
          }
        } else if (parsedItem) {
          for (const [key, initialValue] of shorthandItem.initialValues) {
            if (!Object.hasOwn(parsedItem, key)) {
              parsedItem[key] = initialValue;
            }
          }
          for (const longhandProperty of Object.keys(parsedItem)) {
            const longhandValue = parsedItem[longhandProperty];
            const longhandItem = createPropertyItem(longhandProperty, longhandValue, priority);
            updateLonghandProperties(longhandProperty, longhandItem, longhandProperties);
          }
        }
      }
    } else if (longhandProperties.has(property)) {
      const { priority } = longhandProperties.get(property);
      if (!priority) {
        longhandProperties.delete(property);
        longhandProperties.set(property, item);
      }
    } else {
      longhandProperties.set(property, item);
    }
  }

  const borderItems = prepareBorderShorthands(longhandProperties);
  return borderItems;
}

// Normalize and prepare CSS properties, handling shorthands and longhands.
function prepareProperties(properties) {
  const parsedProperties = new Map();
  const shorthands = new Map();
  const borders = new Map();
  let hasPrecedingBackground = false;
  for (const [property, item] of properties) {
    const { value, priority } = item;
    const { logicalPropertyGroup: shorthandProperty } = propertyDefinitions.get(property) ?? {};
    if (borderProperties.has(property) && !hasVarFunc(value)) {
      borders.set(property, { property, value, priority });
    } else if (shorthandProperties.has(shorthandProperty)) {
      if (!shorthands.has(shorthandProperty)) {
        shorthands.set(shorthandProperty, new Map());
      }

      const longhandItems = shorthands.get(shorthandProperty);
      if (longhandItems.size) {
        const firstPropertyKey = longhandItems.keys().next().value;
        const { priority: firstPropertyPriority } = longhandItems.get(firstPropertyKey);
        if (priority === firstPropertyPriority) {
          longhandItems.set(property, { property, value, priority });
          shorthands.set(shorthandProperty, longhandItems);
        } else {
          parsedProperties.delete(shorthandProperty);
        }
      } else {
        longhandItems.set(property, { property, value, priority });
        shorthands.set(shorthandProperty, longhandItems);
      }
      parsedProperties.set(property, item);
    } else if (shorthandProperties.has(property)) {
      const shorthandItem = shorthandProperties.get(property);
      const parsedValues = parseShorthand(shorthandItem.parse, property, value);
      let omitShorthandProperty = false;
      if (Array.isArray(parsedValues)) {
        const [parsedValue] = parsedValues;
        if (typeof parsedValue === "string") {
          for (const [longhandProperty, longhandItem] of shorthandItem.shorthandFor) {
            if (!priority && properties.has(longhandProperty)) {
              const { priority: longhandPriority } = properties.get(longhandProperty);
              if (longhandPriority) {
                omitShorthandProperty = true;
                continue;
              }
            }

            const { position } = longhandItem;
            const longhandValue = getPositionValue([parsedValue], position);
            parsedProperties.set(longhandProperty, createPropertyItem(longhandProperty, longhandValue, priority));
          }
        } else if (parsedValue) {
          for (const longhandProperty of Object.keys(parsedValue)) {
            const longhandValue = parsedValue[longhandProperty];
            parsedProperties.set(longhandProperty, createPropertyItem(longhandProperty, longhandValue, priority));
          }
        }
      } else if (parsedValues && typeof parsedValues !== "string") {
        for (const longhandProperty of Object.keys(parsedValues)) {
          const longhandValue = parsedValues[longhandProperty];
          parsedProperties.set(longhandProperty, createPropertyItem(longhandProperty, longhandValue, priority));
        }
      }
      if (!omitShorthandProperty) {
        if (property === background.property) {
          hasPrecedingBackground = true;
        }
        parsedProperties.set(property, createPropertyItem(property, value, priority));
      }
    } else {
      parsedProperties.set(property, createPropertyItem(property, value, priority));
      if (hasPrecedingBackground) {
        const { value: shorthandValue, priority: shorthandPriority } = properties.get(background.property);
        if ((!shorthandPriority || priority) && !hasVarFunc(shorthandValue) && !isGlobalKeyword(shorthandValue)) {
          const replacedShorthandValue = replaceBackgroundShorthand(property, parsedProperties);
          parsedProperties.set(
            background.property,
            createPropertyItem(background.property, replacedShorthandValue, shorthandPriority)
          );
        }
      }
    }
  }

  if (shorthands.size) {
    const shorthandItems = processShorthandProperties(shorthands);
    for (const [property, item] of shorthandItems) {
      parsedProperties.set(property, item);
    }
  }
  if (borders.size) {
    const borderItems = processBorderProperties(borders);
    for (const [property, item] of borderItems) {
      parsedProperties.set(property, item);
    }
  }

  return parsedProperties;
}

// Cleans up redundancy in border properties by removing longhands that are covered by shorthands.
function normalizeProperties(properties) {
  if (properties.has(border.property)) {
    for (const line of borderLines) {
      properties.delete(`${border.property}-${line}`);
    }
    for (const position of borderPositions) {
      properties.delete(`${border.property}-${position}`);
      for (const line of borderLines) {
        properties.delete(`${border.property}-${position}-${line}`);
      }
    }
    properties.delete(`${border.property}-image`);
  }
  for (const line of borderLines) {
    const lineProperty = `${border.property}-${line}`;
    if (properties.has(lineProperty)) {
      for (const position of borderPositions) {
        const positionProperty = `${border.property}-${position}`;
        const longhandProperty = `${border.property}-${position}-${line}`;
        properties.delete(positionProperty);
        properties.delete(longhandProperty);
      }
    }
  }
  for (const position of borderPositions) {
    const positionProperty = `${border.property}-${position}`;
    if (properties.has(positionProperty)) {
      const longhandProperties = [];
      for (const line of borderLines) {
        const longhandProperty = `${border.property}-${position}-${line}`;
        longhandProperties.push(longhandProperty);
      }
      if (longhandProperties.length === 3) {
        for (const longhandProperty of longhandProperties) {
          properties.delete(longhandProperty);
        }
      } else {
        properties.delete(positionProperty);
      }
    }
  }

  return properties;
}

exports.borderProperties = borderProperties;
exports.getPositionValue = getPositionValue;
exports.normalizeProperties = normalizeProperties;
exports.prepareBorderProperties = prepareBorderProperties;
exports.prepareProperties = prepareProperties;
exports.shorthandProperties = shorthandProperties;
