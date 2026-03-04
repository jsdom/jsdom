"use strict";

const csstree = require("css-tree");
const CSSConditionRuleImpl = require("./CSSConditionRule-impl.js").implementation;
const { serializeGroupingRuleBody } = require("./CSSGroupingRule-impl.js");

class CSSContainerRuleImpl extends CSSConditionRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    // Parse container name from conditionText using css-tree.
    // We extract the name but keep the original text for containerQuery
    // to preserve spacing.
    const text = this._conditionText || "";
    this._containerName = "";
    this._containerQuery = text;

    try {
      const parsed = csstree.parse(text, { context: "atrulePrelude", atrule: "container" });
      const names = [];
      parsed.children.forEach(child => {
        if (child.type === "Identifier") {
          names.push(child.name);
        }
      });
      if (names.length > 0) {
        this._containerName = names.join(" ");
        // containerQuery is the part after the name in the original text
        const nameStr = this._containerName;
        const nameIdx = text.indexOf(nameStr);
        if (nameIdx !== -1) {
          this._containerQuery = text.slice(nameIdx + nameStr.length).trim();
        }
      }
    } catch {
      // Fallback to heuristic
      const parenIdx = text.indexOf("(");
      if (parenIdx > 0) {
        this._containerName = text.slice(0, parenIdx).trim();
        this._containerQuery = text.slice(parenIdx).trim();
      }
    }
  }

  get type() {
    return 0; // No standard type constant for container rules
  }

  get containerName() {
    return this._containerName;
  }

  get containerQuery() {
    return this._containerQuery;
  }

  get cssText() {
    return `@container ${this._conditionText} ${serializeGroupingRuleBody(this._cssRules._list)}`;
  }
}

exports.implementation = CSSContainerRuleImpl;
