"use strict";

// Color conversion algorithms adapted from CSS Color 4:
// https://drafts.csswg.org/css-color-4/conversions.js
// Copyright © 2026 World Wide Web Consortium. See the root `LICENSE.txt`.

const D50 = [0.3457 / 0.3585, 1, (1 - 0.3457 - 0.3585) / 0.3585];
const supportedSpaces = new Set([
  "srgb", "srgb-linear", "display-p3", "display-p3-linear", "a98-rgb", "prophoto-rgb", "rec2020",
  "xyz-d50", "xyz-d65", "lab", "lch", "oklab", "oklch", "hsl", "hwb"
]);
function linearizeSRGB(rgb) {
  return rgb.map(val => {
    const sign = val < 0 ? -1 : 1;
    const abs = Math.abs(val);
    if (abs <= 0.04045) {
      return val / 12.92;
    }
    return sign * ((abs + 0.055) / 1.055) ** 2.4;
  });
}
function encodeSRGB(rgb) {
  return rgb.map(val => {
    const sign = val < 0 ? -1 : 1;
    const abs = Math.abs(val);
    if (abs > 0.0031308) {
      return sign * (1.055 * abs ** (1 / 2.4) - 0.055);
    }
    return 12.92 * val;
  });
}
function linearSRGBToXYZ(rgb) {
  const M = [
    [506752 / 1228815, 87881 / 245763, 12673 / 70218],
    [87098 / 409605, 175762 / 245763, 12673 / 175545],
    [7918 / 409605, 87881 / 737289, 1001167 / 1053270]
  ];
  return multiplyMatrices(M, rgb);
}
function xyzToLinearSRGB(xyz) {
  const M = [
    [12831 / 3959, -329 / 214, -1974 / 3959],
    [-851781 / 878810, 1648619 / 878810, 36519 / 878810],
    [705 / 12673, -2585 / 12673, 705 / 667]
  ];
  return multiplyMatrices(M, xyz);
}
function linearizeP3(rgb) {
  return linearizeSRGB(rgb);
}
function encodeP3(rgb) {
  return encodeSRGB(rgb);
}
function linearP3ToXYZ(rgb) {
  const M = [
    [608311 / 1250200, 189793 / 714400, 198249 / 1000160],
    [35783 / 156275, 247089 / 357200, 198249 / 2500400],
    [0 / 1, 32229 / 714400, 5220557 / 5000800]
  ];
  return multiplyMatrices(M, rgb);
}
function xyzToLinearP3(xyz) {
  const M = [
    [446124 / 178915, -333277 / 357830, -72051 / 178915],
    [-14852 / 17905, 63121 / 35810, 423 / 17905],
    [11844 / 330415, -50337 / 660830, 316169 / 330415]
  ];
  return multiplyMatrices(M, xyz);
}
function linearizeProPhoto(rgb) {
  const Et2 = 16 / 512;
  return rgb.map(val => {
    const sign = val < 0 ? -1 : 1;
    const abs = Math.abs(val);
    if (abs <= Et2) {
      return val / 16;
    }
    return sign * abs ** 1.8;
  });
}
function encodeProPhoto(rgb) {
  const Et = 1 / 512;
  return rgb.map(val => {
    const sign = val < 0 ? -1 : 1;
    const abs = Math.abs(val);
    if (abs >= Et) {
      return sign * abs ** (1 / 1.8);
    }
    return 16 * val;
  });
}
function linearProPhotoToXYZ(rgb) {
  const M = [
    [0.7977666449006423, 0.13518129740053308, 0.0313477341283922],
    [0.2880748288194013, 0.711835234241873, 0.00008993693872564],
    [0, 0, 0.8251046025104602]
  ];
  return multiplyMatrices(M, rgb);
}
function xyzToLinearProPhoto(xyz) {
  const M = [
    [1.3457868816471583, -0.25557208737979464, -0.05110186497554526],
    [-0.5446307051249019, 1.5082477428451468, 0.02052744743642139],
    [0, 0, 1.2119675456389452]
  ];
  return multiplyMatrices(M, xyz);
}
function linearizeA98RGB(rgb) {
  return rgb.map(val => {
    const sign = val < 0 ? -1 : 1;
    const abs = Math.abs(val);
    return sign * abs ** (563 / 256);
  });
}
function encodeA98RGB(rgb) {
  return rgb.map(val => {
    const sign = val < 0 ? -1 : 1;
    const abs = Math.abs(val);
    return sign * abs ** (256 / 563);
  });
}
function linearA98RGBToXYZ(rgb) {
  const M = [
    [573536 / 994567, 263643 / 1420810, 187206 / 994567],
    [591459 / 1989134, 6239551 / 9945670, 374412 / 4972835],
    [53769 / 1989134, 351524 / 4972835, 4929758 / 4972835]
  ];
  return multiplyMatrices(M, rgb);
}
function xyzToLinearA98RGB(xyz) {
  const M = [
    [1829569 / 896150, -506331 / 896150, -308931 / 896150],
    [-851781 / 878810, 1648619 / 878810, 36519 / 878810],
    [16779 / 1248040, -147721 / 1248040, 1266979 / 1248040]
  ];
  return multiplyMatrices(M, xyz);
}
function linearizeRec2020(rgb) {
  return rgb.map(val => {
    const sign = val < 0 ? -1 : 1;
    const abs = Math.abs(val);
    return sign * abs ** 2.4;
  });
}
function encodeRec2020(rgb) {
  return rgb.map(val => {
    const sign = val < 0 ? -1 : 1;
    const abs = Math.abs(val);
    return sign * abs ** (1 / 2.4);
  });
}
function linearRec2020ToXYZ(rgb) {
  const M = [
    [63426534 / 99577255, 20160776 / 139408157, 47086771 / 278816314],
    [26158966 / 99577255, 472592308 / 697040785, 8267143 / 139408157],
    [0 / 1, 19567812 / 697040785, 295819943 / 278816314]
  ];
  return multiplyMatrices(M, rgb);
}
function xyzToLinearRec2020(xyz) {
  const M = [
    [30757411 / 17917100, -6372589 / 17917100, -4539589 / 17917100],
    [-19765991 / 29648200, 47925759 / 29648200, 467509 / 29648200],
    [792561 / 44930125, -1921689 / 44930125, 42328811 / 44930125]
  ];
  return multiplyMatrices(M, xyz);
}
function d65ToD50(xyz) {
  const M = [
    [1.0479297925449969, 0.022946870601609652, -0.05019226628920524],
    [0.02962780877005599, 0.9904344267538799, -0.017073799063418826],
    [-0.009243040646204504, 0.015055191490298152, 0.7518742814281371]
  ];
  return multiplyMatrices(M, xyz);
}
function d50ToD65(xyz) {
  const M = [
    [0.955473421488075, -0.02309845494876471, 0.06325924320057072],
    [-0.0283697093338637, 1.0099953980813041, 0.021041441191917323],
    [0.012314014864481998, -0.020507649298898964, 1.330365926242124]
  ];
  return multiplyMatrices(M, xyz);
}
function xyzToLab(xyz) {
  const epsilon = 216 / 24389;
  const kappa = 24389 / 27;
  xyz = xyz.map((value, i) => value / D50[i]);
  const f = xyz.map(value => {
    return value > epsilon ? Math.cbrt(value) : (kappa * value + 16) / 116;
  });
  return [116 * f[1] - 16, 500 * (f[0] - f[1]), 200 * (f[1] - f[2])];
}
function labToXYZ(lab) {
  const kappa = 24389 / 27;
  const epsilon = 216 / 24389;
  const f = [];
  f[1] = (lab[0] + 16) / 116;
  f[0] = lab[1] / 500 + f[1];
  f[2] = f[1] - lab[2] / 200;
  const xyz = [
    f[0] ** 3 > epsilon ? f[0] ** 3 : (116 * f[0] - 16) / kappa,
    lab[0] > kappa * epsilon ? ((lab[0] + 16) / 116) ** 3 : lab[0] / kappa,
    f[2] ** 3 > epsilon ? f[2] ** 3 : (116 * f[2] - 16) / kappa
  ];
  return xyz.map((value, i) => value * D50[i]);
}
function labToLCH(lab) {
  const epsilon = 0.0015;
  const chroma = Math.sqrt(lab[1] ** 2 + lab[2] ** 2);
  let hue = Math.atan2(lab[2], lab[1]) * 180 / Math.PI;
  if (hue < 0) {
    hue += 360;
  }
  if (chroma <= epsilon) {
    hue = NaN;
  }
  return [lab[0], chroma, hue];
}
function lchToLab(lch) {
  return [lch[0], lch[1] * Math.cos(lch[2] * Math.PI / 180), lch[1] * Math.sin(lch[2] * Math.PI / 180)];
}
function xyzToOKLab(xyz) {
  const xyzToLMS = [
    [0.819022437996703, 0.3619062600528904, -0.1288737815209879],
    [0.0329836539323885, 0.9292868615863434, 0.0361446663506424],
    [0.0481771893596242, 0.2642395317527308, 0.6335478284694309]
  ];
  const lmsToOKLab = [
    [0.210454268309314, 0.7936177747023054, -0.0040720430116193],
    [1.9779985324311684, -2.42859224204858, 0.450593709617411],
    [0.0259040424655478, 0.7827717124575296, -0.8086757549230774]
  ];
  const lms = multiplyMatrices(xyzToLMS, xyz);
  return multiplyMatrices(lmsToOKLab, lms.map(c => Math.cbrt(c)));
}
function oklabToXYZ(oklab) {
  const lmsToXYZ = [
    [1.2268798758459243, -0.5578149944602171, 0.2813910456659647],
    [-0.0405757452148008, 1.112286803280317, -0.0717110580655164],
    [-0.0763729366746601, -0.4214933324022432, 1.5869240198367816]
  ];
  const oklabToLMS = [
    [1, 0.3963377773761749, 0.2158037573099136],
    [1, -0.1055613458156586, -0.0638541728258133],
    [1, -0.0894841775298119, -1.2914855480194092]
  ];
  const nonlinearLMS = multiplyMatrices(oklabToLMS, oklab);
  return multiplyMatrices(lmsToXYZ, nonlinearLMS.map(c => c ** 3));
}
function oklabToOKLCH(oklab) {
  const epsilon = 0.000004;
  let hue = Math.atan2(oklab[2], oklab[1]) * 180 / Math.PI;
  const chroma = Math.sqrt(oklab[1] ** 2 + oklab[2] ** 2);
  if (hue < 0) {
    hue += 360;
  }
  if (chroma <= epsilon) {
    hue = NaN;
  }
  return [oklab[0], chroma, hue];
}
function oklchToOKLab(oklch) {
  return [oklch[0], oklch[1] * Math.cos(oklch[2] * Math.PI / 180), oklch[1] * Math.sin(oklch[2] * Math.PI / 180)];
}
function multiplyMatrices(matrix, vector) {
  return matrix.map(row => row.reduce((sum, coefficient, index) => sum + coefficient * vector[index], 0));
}

function rgbToHue([r, g, b], min, max) {
  const delta = max - min;
  let hue = NaN;
  if (delta !== 0) {
    if (max === r) {
      hue = (g - b) / delta + (g < b ? 6 : 0);
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
    hue *= 60;
  }
  return hue;
}

function rgbToHSL(rgb) {
  const min = Math.min(...rgb);
  const max = Math.max(...rgb);
  const lightness = (min + max) / 2;
  let hue = rgbToHue(rgb, min, max);
  let saturation = lightness === 0 || lightness === 1 ?
    0 :
    (max - lightness) / Math.min(lightness, 1 - lightness);
  if (saturation < 0) {
    hue += 180;
    saturation = -saturation;
  }
  return [hue % 360, saturation * 100, lightness * 100];
}

function hslToRGB([hue, saturation, lightness]) {
  saturation /= 100;
  lightness /= 100;
  const amplitude = saturation * Math.min(lightness, 1 - lightness);
  return [0, 8, 4].map(offset => {
    const k = (offset + hue / 30) % 12;
    return lightness - amplitude * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  });
}

function hwbToRGB([hue, whiteness, blackness]) {
  whiteness /= 100;
  blackness /= 100;
  if (whiteness + blackness >= 1) {
    const gray = whiteness / (whiteness + blackness);
    return [gray, gray, gray];
  }
  return hslToRGB([hue, 100, 50]).map(value => value * (1 - whiteness - blackness) + whiteness);
}

function rgbToHWB(rgb) {
  const min = Math.min(...rgb);
  const max = Math.max(...rgb);
  return [rgbToHue(rgb, min, max), min * 100, (1 - max) * 100];
}

function toXYZ(space, value) {
  switch (space) {
    case "srgb": return linearSRGBToXYZ(linearizeSRGB(value));
    case "srgb-linear": return linearSRGBToXYZ(value);
    case "display-p3": return linearP3ToXYZ(linearizeP3(value));
    case "display-p3-linear": return linearP3ToXYZ(value);
    case "a98-rgb": return linearA98RGBToXYZ(linearizeA98RGB(value));
    case "prophoto-rgb": return d50ToD65(linearProPhotoToXYZ(linearizeProPhoto(value)));
    case "rec2020": return linearRec2020ToXYZ(linearizeRec2020(value));
    case "xyz-d50": return d50ToD65(value);
    case "xyz-d65": return value;
    case "lab": return d50ToD65(labToXYZ(value));
    case "lch": return d50ToD65(labToXYZ(lchToLab(value)));
    case "oklab": return oklabToXYZ(value);
    case "oklch": return oklabToXYZ(oklchToOKLab(value));
    case "hsl": return toXYZ("srgb", hslToRGB(value));
    case "hwb": return toXYZ("srgb", hwbToRGB(value));
    default: throw new Error(`Unknown color space ${space}`);
  }
}

function fromXYZ(space, value) {
  switch (space) {
    case "srgb": return encodeSRGB(xyzToLinearSRGB(value));
    case "srgb-linear": return xyzToLinearSRGB(value);
    case "display-p3": return encodeP3(xyzToLinearP3(value));
    case "display-p3-linear": return xyzToLinearP3(value);
    case "a98-rgb": return encodeA98RGB(xyzToLinearA98RGB(value));
    case "prophoto-rgb": return encodeProPhoto(xyzToLinearProPhoto(d65ToD50(value)));
    case "rec2020": return encodeRec2020(xyzToLinearRec2020(value));
    case "xyz-d50": return d65ToD50(value);
    case "xyz-d65": return value;
    case "lab": return xyzToLab(d65ToD50(value));
    case "lch": return labToLCH(xyzToLab(d65ToD50(value)));
    case "oklab": return xyzToOKLab(value);
    case "oklch": return oklabToOKLCH(xyzToOKLab(value));
    case "hsl": return rgbToHSL(fromXYZ("srgb", value));
    case "hwb": return rgbToHWB(fromXYZ("srgb", value));
    default: throw new Error(`Unknown color space ${space}`);
  }
}

// https://drafts.csswg.org/css-color-4/#missing-analogous
function componentGroups(space) {
  switch (space) {
    case "lab":
    case "oklab": return ["lightness", "a", "b"];
    case "lch":
    case "oklch": return ["lightness", "colorfulness", "hue"];
    case "hsl": return ["hue", "colorfulness", "lightness"];
    case "hwb": return ["hue", "whiteness", "blackness"];
    default: return ["red", "green", "blue"];
  }
}

function removePowerlessHue(space, channels) {
  if (space === "hsl" && channels[1] <= 0.001) {
    channels[0] = NaN;
    if (channels[1] > 0) {
      channels[1] = 0;
    }
  } else if (space === "hwb") {
    const whiteness = Number.isNaN(channels[1]) ? 0 : channels[1];
    const blackness = Number.isNaN(channels[2]) ? 0 : channels[2];
    if (whiteness + blackness >= 99.999) {
      channels[0] = NaN;
      if (whiteness + blackness < 100) {
        if (Number.isNaN(channels[2])) {
          channels[1] = 100;
        } else {
          channels[2] = 100 - whiteness;
        }
      }
    }
  } else if ((space === "lch" && channels[1] <= 0.0015) || (space === "oklch" && channels[1] <= 0.000004)) {
    channels[2] = NaN;
    if (channels[1] > 0) {
      channels[1] = 0;
    }
  }
}

function convertChannels(source, destination, channels) {
  if (["srgb", "hsl", "hwb"].includes(source) && ["srgb", "hsl", "hwb"].includes(destination)) {
    let rgb = channels;
    if (source === "hsl") {
      rgb = hslToRGB(channels);
    } else if (source === "hwb") {
      rgb = hwbToRGB(channels);
    }
    if (destination === "hsl") {
      return rgbToHSL(rgb);
    }
    return destination === "hwb" ? rgbToHWB(rgb) : rgb;
  }
  return fromXYZ(destination, toXYZ(source, channels));
}

exports.convertColor = (color, space) => {
  if (space === color.space) {
    return { ...color, channels: color.channels.slice() };
  }
  const sourceGroups = componentGroups(color.space);
  const targetGroups = componentGroups(space);
  const source = color.channels.map(value => {
    return Number.isNaN(value) ? 0 : value;
  });
  removePowerlessHue(color.space, source);
  const missing = sourceGroups.filter((_, index) => {
    return Number.isNaN(color.channels[index]) || Number.isNaN(source[index]);
  });
  const remaining = sourceGroups.filter(group => !targetGroups.includes(group));
  const remainingMissing = remaining.length > 0 && remaining.every(group => missing.includes(group));
  const numericChannels = source.map(value => {
    return Number.isNaN(value) ? 0 : value;
  });
  const channels = convertChannels(color.space, space, numericChannels);
  for (const [index, group] of targetGroups.entries()) {
    if (missing.includes(group) || (remainingMissing && !sourceGroups.includes(group))) {
      channels[index] = NaN;
    }
  }
  removePowerlessHue(space, channels);
  return { space, channels, alpha: color.alpha };
};

exports.isSupportedColorSpace = space => supportedSpaces.has(space);
exports.hslToRGB = hslToRGB;
exports.hwbToRGB = hwbToRGB;
