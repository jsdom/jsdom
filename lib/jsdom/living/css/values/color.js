"use strict";

exports.getContrast = getContrast;
exports.getLabLuminance = getLabLuminance;
exports.getRelativeLuminance = getRelativeLuminance;
const { convertColor } = require("../utils/color-spaces.js");
// Definitions

// https://drafts.csswg.org/css-color-5/#component-keyword
// https://drafts.csswg.org/css-color-5/#resolve-to-srgb
exports.colorFunctions = {
  alpha: {
    keywords: "alpha",
  },
  color: {},
  "color-hdr": {},
  "color-mix": {},
  "contrast-color": {},
  hsl: {
    colorSpace: "srgb",
    keywords: "h | s | l | alpha",
  },
  hsla: {
    colorSpace: "srgb",
    keywords: "h | s | l | alpha",
  },
  hwb: {
    colorSpace: "srgb",
    keywords: "h | w | b | alpha",
  },
  ictcp: {
    keywords: "i | ct | cp | alpha",
  },
  jzazbz: {
    keywords: "jz | az | bz | alpha",
  },
  jzczhz: {
    keywords: "jz | cz | hz | alpha",
  },
  lab: {
    keywords: "l | a | b | alpha",
  },
  lch: {
    keywords: "l | c | h | alpha",
  },
  "light-dark": {},
  oklab: {
    keywords: "l | a | b | alpha",
  },
  oklch: {
    keywords: "l | c | h | alpha",
  },
  rgb: {
    colorSpace: "srgb",
    keywords: "r | g | b | alpha",
  },
  rgba: {
    colorSpace: "srgb",
    keywords: "r | g | b | alpha",
  },
};
const colorSpaceKeywords = (exports.colorSpaceKeywords = {
  "<predefined-rgb>": "r | g | b | alpha",
  "<xyz-space>": "x | y | z | alpha",
});
exports.colorSpaces = Object.keys(colorSpaceKeywords);
// https://drafts.csswg.org/css-color-4/#typedef-deprecated-color
exports.deprecated = {
  activeborder: "buttonborder",
  activecaption: "canvas",
  appworkspace: "canvas",
  background: "canvas",
  buttonhighlight: "buttonface",
  buttonshadow: "buttonface",
  captiontext: "canvastext",
  inactiveborder: "buttonborder",
  inactivecaption: "canvas",
  inactivecaptiontext: "graytext",
  infobackground: "canvas",
  infotext: "canvastext",
  menu: "canvas",
  menutext: "canvastext",
  scrollbar: "canvas",
  threeddarkshadow: "buttonborder",
  threedface: "buttonface",
  threedhighlight: "buttonborder",
  threedlightshadow: "buttonborder",
  threedshadow: "buttonborder",
  window: "canvas",
  windowframe: "buttonborder",
  windowtext: "canvastext",
};
// https://drafts.csswg.org/css-color-4/#typedef-named-color
exports.named = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32",
};
// https://drafts.csswg.org/css-color-4/#typedef-system-color
// https://drafts.csswg.org/css-color-adjust-1/#forced-color-palettes
exports.system = {
  accentcolor: {
    dark: "#0033ff",
    light: "#0099ff",
  },
  accentcolortext: {
    dark: "#ffffff",
    light: "#000000",
  },
  activetext: {
    dark: "#ff6666",
    light: "#ff0000",
  },
  buttonborder: {
    dark: "#cccccc",
    light: "#333333",
  },
  buttonface: {
    dark: "#333333",
    light: "#cccccc",
  },
  buttontext: {
    dark: "#ffffff",
    light: "#000000",
  },
  canvas: {
    dark: "#000000",
    light: "#ffffff",
  },
  canvastext: {
    dark: "#ffffff",
    light: "#000000",
  },
  field: {
    dark: "#000000",
    light: "#ffffff",
  },
  fieldtext: {
    dark: "#ffffff",
    light: "#000000",
  },
  graytext: {
    dark: "#999999",
    light: "#666666",
  },
  highlight: {
    dark: "#0033ff",
    light: "#0099ff",
  },
  highlighttext: {
    dark: "#000000",
    light: "#ffffff",
  },
  linktext: {
    dark: "#00ccff",
    light: "#0000ff",
  },
  mark: {
    dark: "#cc0099",
    light: "#ffff00",
  },
  marktext: {
    dark: "#ffffff",
    light: "#000000",
  },
  selecteditem: {
    dark: "#0033ff",
    light: "#0099ff",
  },
  selecteditemtext: {
    dark: "#000000",
    light: "#ffffff",
  },
  visitedtext: {
    dark: "#ff33ff",
    light: "#800080",
  },
}; // Utilities
// https://w3c.github.io/wcag/guidelines/22/#dfn-contrast-ratio
function getContrast(c1, c2) {
  const l1 = getRelativeLuminance(c1) + 0.05;
  const l2 = getRelativeLuminance(c2) + 0.05;
  return l1 < l2 ? l2 / l1 : l1 / l2;
}

function getLabLuminance(rgb) {
  const color = {
    space: "srgb",
    channels: rgb.value[0].map((component) => component.value / 255),
    alpha: 1,
  };
  return convertColor(color, "lab").channels[0];
}

function getRelativeLuminance(rgb) {
  const color = {
    space: "srgb",
    channels: rgb.value[0].map((component) => component.value / 255),
    alpha: 1,
  };
  const [r, g, b] = convertColor(color, "srgb-linear").channels;
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}
