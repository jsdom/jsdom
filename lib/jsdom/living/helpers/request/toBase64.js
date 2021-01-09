"use strict";

function forceString(str) {
  if (typeof str === "string") {
    return str;
  }
  return "";
}

module.exports = function toBase64(str) {
  const buf = Buffer.from(forceString(str), "utf8");
  return buf.toString("base64");
};
