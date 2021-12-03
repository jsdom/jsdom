"use strict";

// https://drafts.csswg.org/indexes/#properties
const initialColor = "rgb(0, 0, 0)";

// Properties for which getResolvedValue is implemented. This is less than
// every supported property.
exports.propertiesWithResolvedValueImplemented = new Proxy(
  {
    __proto__: null,

    "background-attachment": {
      inherited: false,
      initial: "scroll",
    },
    "background-clip": {
      inherited: false,
      initial: "border-box",
    },
    "background-color": {
      inherited: false,
      initial: "transparent",
    },
    "background-image": {
      inherited: false,
      initial: "none",
    },
    "background-origin": {
      inherited: false,
      initial: "padding-box",
    },
    "background-position": {
      inherited: false,
      initial: "0% 0%",
    },
    "background-repeat": {
      inherited: false,
      initial: "repeat",
    },
    "background-size": {
      inherited: false,
      initial: "auto auto",
    },
    "border": {
      inherited: false,
      initial: `medium none ${initialColor}`,
    },
    "border-bottom": {
      inherited: false,
      initial: "medium none currentcolor",
    },
    "border-bottom-color": {
      inherited: false,
      initial: "currentcolor",
    },
    "border-bottom-style": {
      inherited: false,
      initial: "none",
    },
    "border-bottom-width": {
      inerited: false,
      initial: "medium",
    },
    "border-left": {
      inherited: false,
      initial: "medium none currentcolor",
    },
    "border-left-color": {
      inherited: false,
      initial: "currentcolor",
    },
    "border-left-style": {
      inherited: false,
      initial: "none",
    },
    "border-left-width": {
      inerited: false,
      initial: "medium",
    },
    "border-right": {
      inherited: false,
      initial: "medium none currentcolor",
    },
    "border-right-color": {
      inherited: false,
      initial: "currentcolor",
    },
    "border-right-style": {
      inherited: false,
      initial: "none",
    },
    "border-right-width": {
      inerited: false,
      initial: "medium",
    },
    "border-spacing": {
      inherited: true,
      initial: "0px",
    },
    "border-style": {
      inherited: false,
      initial: "none",
    },
    "border-top": {
      inherited: false,
      initial: "medium none currentcolor",
    },
    "border-top-color": {
      inherited: false,
      initial: "currentcolor",
    },
    "border-top-style": {
      inherited: false,
      initial: "none",
    },
    "border-top-width": {
      inerited: false,
      initial: "medium",
    },
    "box-shadow": {
      inherited: false,
      initial: "none",
    },
    "color": {
      inherited: true,
      initial: initialColor,
    },
    "filter": {
      inherited: false,
      initial: "none",
    },
    "height": {
      inherited: false,
      initial: "auto",
    },
    "margin": {
      inherited: false,
      initial: "0px 0px 0px 0px",
    },
    "margin-bottom": {
      inherited: false,
      initial: "0px",
    },
    "margin-left": {
      inherited: false,
      initial: "0px",
    },
    "margin-right": {
      inherited: false,
      initial: "0px",
    },
    "margin-top": {
      inherited: false,
      initial: "0px",
    },
    "text-indent": {
      inherited: true,
      initial: "0px",
    },
    "text-shadow": {
      inherited: true,
      initial: "none",
    },
    // https://drafts.csswg.org/css2/visufx.html#visibility
    "visibility": {
      inherited: true,
      initial: "visible",
    },
    "width": {
      inherited: false,
      initial: "auto",
    },
  },
  {
    get: function(target, prop, receiver) {
      if (typeof prop === "string" && prop.indexOf("--") === 0) {
        return {
          inherited: true,
          initial: "",
        };
      }
      return Reflect.get(...arguments);
    }
  }
);

