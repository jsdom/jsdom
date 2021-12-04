"use strict";

const { getComputedValue, PropertyRequest } = require("./style-rules");

const initialColor = "rgb(0, 0, 0)";

const properties = {
  __proto__: null,

  createProperty(name, initial = "", func = null, inherited = "") {
    const resolvedFunc = func ? func : getComputedValue;
    const doesInherit = Boolean(inherited);

    this[name] = element => {
      const request = new PropertyRequest(element, name, initial, doesInherit);
      return resolvedFunc(request);
    };
  }
};

// https://drafts.csswg.org/cssom/#resolved-value
//
// Specifically, to meet this spec:
// https://drafts.csswg.org/css-color-4/#resolving-color-values
function resolveColor(element) {
  // TODO: not implemented
  return getComputedValue(element);
}

// https://drafts.csswg.org/cssom/#resolved-values
//
// Specfically, to meet the specifications here:
// https://drafts.csswg.org/css-sizing-3/#propdef-height
function resolveSizeProperty(element) {
  // TODO: not implemented
  return getComputedValue(element);
}

// Properties where default and resolved values are implemented. This is less
// than every supported property. Those that don"t appear in this object may
// not have correct behavior.
//
// https://drafts.csswg.org/indexes/#properties
properties.createProperty("background-attachment", "scroll");
properties.createProperty("background-clip", "border-box");
properties.createProperty("background-color", "transparent", resolveColor);
properties.createProperty("background-image", "none");
properties.createProperty("background-origin", "padding-box");
properties.createProperty("background-position", "0% 0%");
properties.createProperty("background-repeat", "repeat");
properties.createProperty("background-size", "auto auto");
properties.createProperty("border", `medium none ${initialColor}`);
properties.createProperty("border-bottom", "medium none currentcolor");
properties.createProperty("border-bottom-color", "currentcolor", resolveColor);
properties.createProperty("border-bottom-style", "none");
properties.createProperty("border-bottom-width", "medium");
properties.createProperty("border-left", "medium none currentcolor");
properties.createProperty("border-left-color", "currentcolor", resolveColor);
properties.createProperty("border-left-style", "none");
properties.createProperty("border-left-width", "medium");
properties.createProperty("border-right", "medium none currentcolor");
properties.createProperty("border-right-color", "currentcolor", resolveColor);
properties.createProperty("border-right-style", "none");
properties.createProperty("border-right-width", "medium");
properties.createProperty("border-spacing", "0px");
properties.createProperty("border-style", "none");
properties.createProperty("border-top", "medium none currentcolor");
properties.createProperty("border-top-color", "currentcolor", resolveColor);
properties.createProperty("border-top-style", "none");
properties.createProperty("border-top-width", "medium");
properties.createProperty("box-shadow", "none", resolveColor);
properties.createProperty("color", initialColor, resolveColor, "inherited");
properties.createProperty("filter", "none");
properties.createProperty("height", "auto", resolveSizeProperty);
properties.createProperty("margin", "0px 0px 0px 0px");
properties.createProperty("margin-bottom", "0px", resolveSizeProperty);
properties.createProperty("margin-left", "0px", resolveSizeProperty);
properties.createProperty("margin-right", "0px", resolveSizeProperty);
properties.createProperty("margin-top", "0px", resolveSizeProperty);
properties.createProperty("text-indent", "0px", getComputedValue, "inherited");
properties.createProperty("text-shadow", "none", getComputedValue, "inherited");
properties.createProperty("visibility", "visible", getComputedValue, "inherited");
properties.createProperty("width", "auto", resolveSizeProperty);

delete properties.createProperty;

// Not yet implemented and custom properties are proxied through this default
// handler.
module.exports = new Proxy(
  properties,
  {
    get: (target, prop) => {
      const property = Reflect.get(target, prop);
      if (property) {
        return property;
      }
      return element => {
        const request = new PropertyRequest(element, prop);
        return getComputedValue(request);
      };
    }
  }
);

