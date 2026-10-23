"use strict";

const { invalidateStyle } = require("./utils/style.js");

// https://drafts.csswg.org/cssom-1/#stylesheet
class StyleSheetImpl {
  // https://drafts.csswg.org/cssom-1/#dom-stylesheet-disabled
  _disabled = false;

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    if (this._disabled !== value) {
      this._disabled = value;
      invalidateStyle(this._globalObject, this);
    }
  }

  // https://drafts.csswg.org/cssom-1/#concept-css-style-sheet-type
  type = "text/css";

  // https://drafts.csswg.org/cssom-1/#dom-stylesheet-href
  get href() {
    return this._location;
  }

  // https://drafts.csswg.org/cssom/#dom-stylesheet-title
  get title() {
    return this._title || null;
  }
}
exports.implementation = StyleSheetImpl;
