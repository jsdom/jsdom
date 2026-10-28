"use strict";

// Native APIs and CSS share these fixed values. Replacing a public property does
// not change the underlying environment.
module.exports = Object.freeze({
  innerWidth: 1024,
  innerHeight: 768,
  devicePixelRatio: 1,
  screen: Object.freeze({
    availWidth: 0,
    availHeight: 0,
    width: 0,
    height: 0,
    colorDepth: 24,
    pixelDepth: 24,
  }),
});
