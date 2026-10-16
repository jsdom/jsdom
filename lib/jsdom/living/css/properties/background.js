"use strict";

const parsers = require("../helpers/css-values");
const backgroundImage = require("./backgroundImage");
const backgroundPosition = require("./backgroundPosition");
const backgroundPositionX = require("./backgroundPositionX");
const backgroundPositionY = require("./backgroundPositionY");
const backgroundSize = require("./backgroundSize");
const backgroundRepeat = require("./backgroundRepeat");
const backgroundOrigin = require("./backgroundOrigin");
const backgroundClip = require("./backgroundClip");
const backgroundAttachment = require("./backgroundAttachment");
const backgroundColor = require("./backgroundColor");

const property = "background";

const initialValues = new Map([
  [backgroundImage.property, "none"],
  [backgroundPosition.property, "0% 0%"],
  [backgroundPositionX.property, "0%"],
  [backgroundPositionY.property, "0%"],
  [backgroundSize.property, "auto"],
  [backgroundRepeat.property, "repeat"],
  [backgroundOrigin.property, "padding-box"],
  [backgroundClip.property, "border-box"],
  [backgroundAttachment.property, "scroll"],
  [backgroundColor.property, "transparent"]
]);

const shorthandFor = new Map([
  [backgroundImage.property, backgroundImage],
  [backgroundPosition.property, backgroundPosition],
  [backgroundPositionX.property, backgroundPositionX],
  [backgroundPositionY.property, backgroundPositionY],
  [backgroundSize.property, backgroundSize],
  [backgroundRepeat.property, backgroundRepeat],
  [backgroundOrigin.property, backgroundOrigin],
  [backgroundClip.property, backgroundClip],
  [backgroundAttachment.property, backgroundAttachment],
  [backgroundColor.property, backgroundColor]
]);

const descriptor = {
  set(value, priority = "") {
    this._setShorthand(property, value.trim(), priority);
  },
  get() {
    return this._getPropertyValue(property);
  },
  enumerable: true,
  configurable: true
};

/**
 * Parses the background property value.
 *
 * @param {string} v - The value to parse.
 * @returns {Array<object>|undefined} The parsed background values or undefined if invalid.
 */
function parse(v) {
  if (v === "" || parsers.isGlobalKeyword(v)) {
    return v;
  } else if (parsers.hasCalcFunc(v)) {
    v = parsers.resolveCalc(v);
    if (v === undefined) {
      return undefined;
    }
  }
  const prepared = parsers.prepareShorthandValue(v);
  if (!prepared) {
    return undefined;
  }
  if (!parsers.isValidPropertyValue(property, prepared)) {
    return undefined;
  }
  const values = parsers.splitValue(prepared, {
    delimiter: ","
  });
  const bgValues = [];
  const l = values.length;
  for (let i = 0; i < l; i++) {
    let bg = {
      [backgroundImage.property]: initialValues.get(backgroundImage.property),
      [backgroundPosition.property]: initialValues.get(backgroundPosition.property),
      [backgroundPositionX.property]: initialValues.get(backgroundPositionX.property),
      [backgroundPositionY.property]: initialValues.get(backgroundPositionY.property),
      [backgroundSize.property]: initialValues.get(backgroundSize.property),
      [backgroundRepeat.property]: initialValues.get(backgroundRepeat.property),
      [backgroundOrigin.property]: initialValues.get(backgroundOrigin.property),
      [backgroundClip.property]: initialValues.get(backgroundClip.property),
      [backgroundAttachment.property]: initialValues.get(backgroundAttachment.property),
      [backgroundColor.property]: initialValues.get(backgroundColor.property)
    };
    if (l > 1 && i !== l - 1) {
      bg = {
        [backgroundImage.property]: initialValues.get(backgroundImage.property),
        [backgroundPosition.property]: initialValues.get(backgroundPosition.property),
        [backgroundPositionX.property]: initialValues.get(backgroundPositionX.property),
        [backgroundPositionY.property]: initialValues.get(backgroundPositionY.property),
        [backgroundSize.property]: initialValues.get(backgroundSize.property),
        [backgroundRepeat.property]: initialValues.get(backgroundRepeat.property),
        [backgroundOrigin.property]: initialValues.get(backgroundOrigin.property),
        [backgroundClip.property]: initialValues.get(backgroundClip.property),
        [backgroundAttachment.property]: initialValues.get(backgroundAttachment.property)
      };
    }
    const bgPosition = [];
    const bgSize = [];
    const bgRepeat = [];
    const bgParts = parsers.splitValue(values[i], {
      delimiter: "/"
    });
    if (!bgParts.length || bgParts.length > 2) {
      return undefined;
    }
    const [bgPart1, bgPart2 = ""] = bgParts;
    const parts1 = parsers.splitValue(bgPart1);
    let originFilled = false;
    for (const part of parts1) {
      let partValid = false;
      for (const [longhand, value] of shorthandFor) {
        if (parsers.isValidPropertyValue(longhand, part)) {
          partValid = true;
          switch (longhand) {
            case backgroundClip.property: {
              const parsedValue = value.parse(part);
              if (parsedValue) {
                bg[longhand] = parsedValue;
              }
              break;
            }
            case backgroundOrigin.property: {
              const parsedValue = value.parse(part);
              if (parsedValue && !originFilled) {
                bg[longhand] = parsedValue;
                originFilled = true;
              }
              break;
            }
            case backgroundColor.property: {
              if (i !== values.length - 1) {
                return undefined;
              }
              const parsedValue = value.parse(part);
              if (parsedValue) {
                bg[longhand] = parsedValue;
              }
              break;
            }
            case backgroundPosition.property: {
              if (value.parse(part)) {
                bgPosition.push(part);
              }
              break;
            }
            case backgroundPositionX.property:
            case backgroundPositionY.property: {
              break;
            }
            case backgroundRepeat.property: {
              const parsedValue = value.parse(part);
              if (parsedValue) {
                bgRepeat.push(parsedValue);
              }
              break;
            }
            case backgroundSize.property: {
              break;
            }
            default: {
              const parsedValue = value.parse(part);
              if (parsedValue) {
                bg[longhand] = parsedValue;
              }
            }
          }
        }
      }
      if (!partValid) {
        return undefined;
      }
    }
    if (bgPart2) {
      const parts2 = parsers.splitValue(bgPart2);
      for (const part of parts2) {
        let partValid = false;
        for (const [longhand, value] of shorthandFor) {
          if (parsers.isValidPropertyValue(longhand, part)) {
            partValid = true;
            switch (longhand) {
              case backgroundClip.property: {
                const parsedValue = value.parse(part);
                if (parsedValue) {
                  bg[longhand] = parsedValue;
                }
                break;
              }
              case backgroundOrigin.property: {
                const parsedValue = value.parse(part);
                if (parsedValue && !originFilled) {
                  bg[longhand] = parsedValue;
                  originFilled = true;
                }
                break;
              }
              case backgroundColor.property: {
                if (i !== l - 1) {
                  return undefined;
                }
                const parsedValue = value.parse(part);
                if (parsedValue) {
                  bg[longhand] = parsedValue;
                }
                break;
              }
              case backgroundPosition.property: {
                break;
              }
              case backgroundPositionX.property:
              case backgroundPositionY.property: {
                break;
              }
              case backgroundRepeat.property: {
                const parsedValue = value.parse(part);
                if (parsedValue) {
                  bgRepeat.push(parsedValue);
                }
                break;
              }
              case backgroundSize.property: {
                const parsedValue = value.parse(part);
                if (parsedValue) {
                  bgSize.push(parsedValue);
                }
                break;
              }
              default: {
                const parsedValue = value.parse(part);
                if (parsedValue) {
                  bg[longhand] = parsedValue;
                }
              }
            }
          }
        }
        if (!partValid) {
          return undefined;
        }
      }
    }
    if (bgPosition.length) {
      const value = backgroundPosition.parseLonghands(bgPosition.join(" "));
      if (value) {
        bg[backgroundPosition.property] = value.value;
        bg[backgroundPositionX.property] = value.x;
        bg[backgroundPositionY.property] = value.y;
      }
    }
    if (bgSize.length) {
      const { parse: parser } = shorthandFor.get(backgroundSize.property);
      const value = parser(bgSize.join(" "));
      if (value) {
        bg[backgroundSize.property] = value;
      }
    }
    if (bgRepeat.length) {
      const { parse: parser } = shorthandFor.get(backgroundRepeat.property);
      const value = parser(bgRepeat.join(" "));
      if (value) {
        bg[backgroundRepeat.property] = value;
      }
    }
    bgValues.push(bg);
  }
  return bgValues;
}

module.exports = {
  descriptor,
  initialValues,
  parse,
  property,
  shorthandFor
};
