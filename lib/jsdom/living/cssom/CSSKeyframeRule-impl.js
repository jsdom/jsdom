"use strict";

const CSSRuleImpl = require("./CSSRule-impl.js").implementation;
const DOMException = require("../../../generated/idl/DOMException.js");
const { CSSStyleDeclaration } = require("./CSSStyleDeclaration.js");
const { wrapperForImpl } = require("../../../generated/idl/utils.js");

// A keyframe selector is a comma-separated list of: "from", "to", or <percentage>.
const keyframeSelectorPattern = /^(?:from|to|\d+(?:\.\d+)?%)$/;

function normalizeKeyText(text) {
  return text.split(",").map(s => {
    const trimmed = s.trim().toLowerCase();
    if (trimmed === "from") {
      return "0%";
    }
    if (trimmed === "to") {
      return "100%";
    }
    return trimmed;
  }).join(", ");
}

class CSSKeyframeRuleImpl extends CSSRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._keyText = normalizeKeyText(privateData.keyText);

    // Populated by `css-parser.js`'s `populateDeclarations()`.
    this._style = new CSSStyleDeclaration(globalObject, [], {
      context: wrapperForImpl(this)
    });
  }

  get type() {
    return 8; // KEYFRAME_RULE
  }

  get keyText() {
    return this._keyText;
  }

  set keyText(value) {
    const selectors = value.split(",").map(s => s.trim().toLowerCase());
    for (const sel of selectors) {
      if (!keyframeSelectorPattern.test(sel)) {
        throw DOMException.create(this._globalObject, [
          "Invalid keyframe selector.",
          "SyntaxError"
        ]);
      }
    }
    this._keyText = normalizeKeyText(value);
  }

  get style() {
    return this._style;
  }

  // TODO: delete this setter when CSSStyleDeclaration is converted to webidl2js
  // (then [PutForwards=cssText] on the WebIDL attribute will handle it)
  set style(value) {
    this._style.cssText = value;
  }

  get cssText() {
    return `${this._keyText} { ${this._style.cssText} }`;
  }
}

exports.implementation = CSSKeyframeRuleImpl;
exports.normalizeKeyText = normalizeKeyText;
