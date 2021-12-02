"use strict";

// Properties for which getResolvedValue is implemented. This is less than
// every supported property.
// https://drafts.csswg.org/indexes/#properties
const initialColor = '#000000';

const COMPUTED_TYPE = {
  AS_SPECIFIED: 1,
  COLOR: 2,
  LIST: 3,
  SHORTHAND: 4,
};

exports.isValidComputedType = function(computedType) {
  return Object.values(COMPUTED_TYPE).includes(computedType);
};

exports.propertiesWithResolvedValueImplemented = new Proxy(
  {
    __proto__: null,

    "background-attachment": {
      inherited: false,
      initial: "scroll",
      computedValue: COMPUTED_TYPE.AS_SPECIFIED,
    },
    "background-clip": {
      inherited: false,
      initial: "border-box",
      computedValue: COMPUTED_TYPE.AS_SPECIFIED,
    },
    "background-color": {
      inherited: false,
      initial: "transparent",
      computedValue: COMPUTED_TYPE.COLOR,
    },
    "background-image": {
      inherited: false,
      initial: "none",
      computedValue: COMPUTED_TYPE.AS_SPECIFIED,
    },
    "background-origin": {
      inherited: false,
      initial: "padding-box",
      computedValue: COMPUTED_TYPE.AS_SPECIFIED,
    },
    "background-position": {
      inherited: false,
      initial: "0% 0%",
      computedValue: COMPUTED_TYPE.SHORTHAND,
    },
    "background-repeat": {
      inherited: false,
      initial: "repeat",
      computedValue: COMPUTED_TYPE.LIST,
    },
    "background-size": {
      inherited: false,
      initial: "auto auto",
      computedValue: COMPUTED_TYPE.AS_SPECIFIED,
    },
    "border": {
      inherited: false,
      initial: `medium none ${initialColor}`,
      computedValue: COMPUTED_TYPE.SHORTHAND,
    },
    "color": {
      inherited: true,
      initial: initialColor,
      computedValue: COMPUTED_TYPE.COLOR,
    },
    "margin": {
      inherited: false,
      initial: "0 0 0 0",
      computedValue: COMPUTED_TYPE.SHORTHAND,
    },
    // https://drafts.csswg.org/css2/visufx.html#visibility
    "visibility": {
      inherited: true,
      initial: "visible",
      computedValue: COMPUTED_TYPE.AS_SPECIFIED,
    },
  },
  {
    get: function(target, prop, receiver) {
      if (typeof prop === "string" && prop.indexOf("--") === 0) {
        return {
          inherited: true,
          initial: "",
          computedValue: COMPUTED_TYPE.AS_SPECIFIED,
        };
      }
      return Reflect.get(...arguments);
    }
  }
);

