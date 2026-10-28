"use strict";

const definitionsModule = require("../../../../generated/css-descriptor-definitions.js");

const { "@container": container, "@media": media } = definitionsModule;

// https://drafts.csswg.org/css-conditional-5/#dfn-support-named-feature
exports.named = ["anchor-position-follows-transforms", "single-axis-scroll-container"];
exports.definitions = {
  "@container": {
    // https://drafts.csswg.org/css-anchor-position-2/#typedef-anchored-feature
    "<anchored-feature>": {
      fallback: container.fallback,
    },
    // https://drafts.csswg.org/css-conditional-5/#typedef-scroll-state-feature
    "<scroll-state-feature>": {
      scrollable: container.scrollable,
      scrolled: container.scrolled,
      snapped: container.snapped,
      stuck: container.stuck,
    },
    // https://drafts.csswg.org/css-conditional-5/#typedef-size-feature
    "<size-feature>": {
      "aspect-ratio": container["aspect-ratio"],
      "block-size": container["block-size"],
      height: container.height,
      "inline-size": container["inline-size"],
      orientation: container.orientation,
      width: container.width,
    },
  },
  "@media": media,
};
