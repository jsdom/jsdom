"use strict";

const DOMException = require("../../../generated/idl/DOMException.js");
const idlUtils = require("../../../generated/idl/utils.js");

class MediaListImpl {
  constructor(globalObject, args, privateData) {
    this._globalObject = globalObject;
    this._list = [];

    if (privateData.mediaText) {
      this._parse(privateData.mediaText);
    }
  }

  get mediaText() {
    return this._list.join(", ");
  }

  set mediaText(value) {
    this._list.length = 0;
    if (value !== "") {
      this._parse(value);
    }
  }

  get length() {
    return this._list.length;
  }

  item(index) {
    return this._list[index] || null;
  }

  appendMedium(medium) {
    medium = medium.trim();
    if (!this._list.includes(medium)) {
      this._list.push(medium);
    }
  }

  deleteMedium(medium) {
    medium = medium.trim();
    const index = this._list.indexOf(medium);
    if (index === -1) {
      throw DOMException.create(this._globalObject, [
        `"${medium}" was not found in the media list.`,
        "NotFoundError"
      ]);
    }
    this._list.splice(index, 1);
  }

  get [idlUtils.supportedPropertyIndices]() {
    return this._list.keys();
  }

  _parse(mediaText) {
    const parts = mediaText.split(",");
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed) {
        this._list.push(trimmed);
      }
    }
  }
}

// Evaluate a media query list against jsdom's environment (screen media type).
// Returns true if any query in the list matches, or if the list is empty (= "all").
// Currently only handles plain media types; queries with media features don't match.
function evaluateMediaList(list) {
  if (list.length === 0) {
    return true;
  }
  for (const query of list) {
    if (query === "all" || query === "screen") {
      return true;
    }
  }
  return false;
}

exports.implementation = MediaListImpl;
exports.evaluateMediaList = evaluateMediaList;
