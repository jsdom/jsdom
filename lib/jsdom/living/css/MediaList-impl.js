"use strict";

const idlUtils = require("../../../generated/idl/utils.js");
const DOMException = require("../../../generated/idl/DOMException.js");
const serialize = require("./serialize.js");
const values = require("./values/value.js");
const parser = require("./parse/parser.js");
const { invalidateStyle } = require("./utils/style.js");
// https://drafts.csswg.org/cssom-1/#compare-media-queries
function compareMediaQueries(a, b) {
  return serialize.serializeComponentValue(a) === serialize.serializeComponentValue(b);
}

// https://drafts.csswg.org/cssom-1/#parse-a-media-query
function parseMediaQuery(input, globalObject) {
  input = parser.parseGrammar(input, "<media-query-list>", globalObject);
  return input.length === 1 ? input[0] : null;
}

// https://drafts.csswg.org/cssom-1/#medialist
class MediaListImpl {
  constructor(
    globalObject,
    args,
    { list = values.list([], ",", ["<media-query-list>"]), owner = null },
  ) {
    this._globalObject = globalObject;
    this._list = values.list([...list], list.separator, list.types);
    this._owner = owner;
  }

  get [idlUtils.supportedPropertyIndices]() {
    return this._list.keys();
  }

  [idlUtils.supportsPropertyIndex](index) {
    return index >= 0 && index < this._list.length;
  }

  // https://drafts.csswg.org/cssom-1/#dom-medialist-length
  get length() {
    return this._list.length;
  }

  // https://drafts.csswg.org/cssom-1/#dom-medialist-mediatext
  get mediaText() {
    return serialize.serializeComponentValues(this._list);
  }

  // https://drafts.csswg.org/cssom-1/#dom-medialist-mediatext
  set mediaText(text) {
    this._list.splice(
      0,
      this._list.length,
      ...parser.parseGrammar(text, "<media-query-list>", this._globalObject),
    );
    invalidateStyle(
      this._globalObject,
      this._owner?._rules ? this._owner : this._owner?.parentStyleSheet,
    );
  }

  // https://drafts.csswg.org/cssom-1/#dom-medialist-appendmedium
  appendMedium(medium) {
    medium = parseMediaQuery(medium, this._globalObject);
    if (medium && this._list.every((a) => !compareMediaQueries(a, medium))) {
      this._list.push(medium);
      invalidateStyle(
        this._globalObject,
        this._owner?._rules ? this._owner : this._owner?.parentStyleSheet,
      );
    }
  }

  // https://drafts.csswg.org/cssom-1/#dom-medialist-deletemedium
  deleteMedium(medium) {
    const { _globalObject, _list } = this;
    medium = parseMediaQuery(medium, _globalObject);
    if (medium) {
      let index = _list.length - 1;
      let removed = 0;
      for (; index >= 0; index--) {
        if (compareMediaQueries(_list[index], medium)) {
          _list.splice(index, 1);
          removed++;
        }
      }
      if (removed > 0) {
        invalidateStyle(
          this._globalObject,
          this._owner?._rules ? this._owner : this._owner?.parentStyleSheet,
        );
      }
      if (removed === 0) {
        throw DOMException.create(_globalObject, [
          "Cannot delete a medium that is not in the media list.",
          "NotFoundError",
        ]);
      }
    }
  }

  // https://drafts.csswg.org/cssom-1/#dom-medialist-item
  item(index) {
    const item = this._list[index];
    return item ? serialize.serializeComponentValue(item) : null;
  }
}
exports.implementation = MediaListImpl;
