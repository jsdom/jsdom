"use strict";

exports.areEqual = areEqual;
exports.clamp = clamp;
exports.isDegenerate = isDegenerate;
exports.isInfinite = isInfinite;
exports.isNegativeZero = isNegativeZero;
exports.round = round;
exports.safeFloat = safeFloat;
exports.sign = sign;
exports.toDegrees = toDegrees;
exports.toEightBit = toEightBit;
exports.toRadians = toRadians;
// https://drafts.csswg.org/css-values-4/#funcdef-clamp
function clamp(min, value, max) {
  return Math.max(min, Math.min(value, max));
}

function areEqual(a, b, precision) {
  return Math.abs(a - b) <= precision;
}

function isDegenerate(value) {
  return typeof value === "number" && !isFinite(value);
}

function isInfinite(value) {
  return value === Infinity || value === -Infinity;
}

function isNegativeZero(value) {
  return Object.is(-0, value);
}

function round(strategy, value, precision) {
  precision = Math.abs(precision);
  // Preserve 0⁻ or 0⁺
  if (value % precision === 0) {
    return value;
  }
  const isInfinitePrecision = isInfinite(precision);
  if (precision === 0 || (isInfinitePrecision && isInfinite(value))) {
    return NaN;
  }
  if (isInfinitePrecision) {
    switch (strategy) {
      case "nearest":
      case "to-zero":
        return value < 0 || isNegativeZero(value) ? -0 : 0;
      case "up":
        if (value > 0) {
          return Infinity;
        }
        if (value < 0 || isNegativeZero(value)) {
          return -0;
        }
        return value;
      case "down":
        if (value < 0) {
          return -Infinity;
        }
        if (isNegativeZero(value)) {
          return value;
        }
        return 0;
      default:
        throw new RangeError("Unexpected rounding strategy");
    }
  }
  const half = value / precision;
  const down = Math.floor(half) * precision;
  const up = Math.ceil(half) * precision;
  switch (strategy) {
    case "down":
      return down;
    case "up":
      return up;
    case "to-zero":
      return Math.abs(down) < Math.abs(up) ? down : up;
    case "nearest":
      return Math.abs(down - value) < Math.abs(up - value) ? down : up;
    default:
      throw new RangeError("Unexpected rounding strategy");
  }
}

function safeFloat(number) {
  return Number(number.toFixed(6));
}

function sign(number) {
  if (number === -Infinity || 1 / number < 0) {
    return -1;
  }
  return 1;
}

function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function toEightBit(number) {
  return clamp(0, Math.round(safeFloat(number * 255)), 255);
}
