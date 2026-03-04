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

module.exports = {
  implementation: MediaListImpl
};
