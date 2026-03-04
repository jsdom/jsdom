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
    this.containerName = "";
    this.containerQuery = text;

    try {
      const parsed = csstree.parse(text, { context: "atrulePrelude", atrule: "container" });
      const names = [];
      parsed.children.forEach(child => {
        if (child.type === "Identifier") {
          names.push(child.name);
        }
      });
      if (names.length > 0) {
        this.containerName = names.join(" ");
        // containerQuery is the part after the name in the original text
        const nameStr = this.containerName;
        const nameIdx = text.indexOf(nameStr);
        if (nameIdx !== -1) {
          this.containerQuery = text.slice(nameIdx + nameStr.length).trim();
        }
      }
    } catch {
      // Fallback to heuristic
      const parenIdx = text.indexOf("(");
      if (parenIdx > 0) {
        this.containerName = text.slice(0, parenIdx).trim();
        this.containerQuery = text.slice(parenIdx).trim();
      }
    }
  }

  get type() {
    return 0; // No standard type constant for container rules
  }

  get cssText() {
    return `@container ${this._conditionText} ${serializeGroupingRuleBody(this.cssRules._list)}`;
  }
}

exports.implementation = CSSContainerRuleImpl;
