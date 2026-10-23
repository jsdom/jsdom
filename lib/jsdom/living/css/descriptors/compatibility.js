"use strict";

// https://compat.spec.whatwg.org/#css-media-queries-webkit-device-pixel-ratio
// https://drafts.csswg.org/css-fonts-4/#font-face-font-stretch
module.exports = {
  "@font-face": {
    aliases: new Map([["font-stretch", "font-width"]])
  },
  "@media": {
    aliases: new Map([
      ["-webkit-device-pixel-ratio", "resolution"],
      ["-webkit-min-device-pixel-ratio", "min-resolution"],
      ["-webkit-max-device-pixel-ratio", "max-resolution"]
    ])
  }
};
