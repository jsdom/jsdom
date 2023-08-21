"use strict";

// ARIA Element properties that reflect to strings (not Element or FrozenArray<Element>)
const ARIA_STRING_PROPS = [
  "role",
  "ariaAtomic",
  "ariaAutoComplete",
  "ariaBusy",
  "ariaChecked",
  "ariaColCount",
  "ariaColIndex",
  "ariaColIndexText",
  "ariaColSpan",
  "ariaCurrent",
  "ariaDescription",
  "ariaDisabled",
  "ariaExpanded",
  "ariaHasPopup",
  "ariaHidden",
  "ariaInvalid",
  "ariaKeyShortcuts",
  "ariaLabel",
  "ariaLevel",
  "ariaLive",
  "ariaModal",
  "ariaMultiLine",
  "ariaMultiSelectable",
  "ariaOrientation",
  "ariaPlaceholder",
  "ariaPosInSet",
  "ariaPressed",
  "ariaReadOnly",
  "ariaRelevant", // Removed in https://github.com/w3c/aria/issues/1267, but WPT tests require it
  "ariaRequired",
  "ariaRoleDescription",
  "ariaRowCount",
  "ariaRowIndex",
  "ariaRowIndexText",
  "ariaRowSpan",
  "ariaSelected",
  "ariaSetSize",
  "ariaSort",
  "ariaValueMax",
  "ariaValueMin",
  "ariaValueNow",
  "ariaValueText"
];

class ARIAMixinImpl {
}

// TODO: handle element reflection as well
for (const prop of ARIA_STRING_PROPS) {
  // e.g. `ariaPosInSet` -> `aria-posinset`
  const attribute = prop.replace(/[A-Z]/, letter => `-${letter}`).toLowerCase();
  Object.defineProperty(ARIAMixinImpl.prototype, prop, {
    get() {
      return this.getAttributeNS(null, attribute);
    },
    set(value) {
      // Per the spec, only null is treated as removing the attribute. However, Chromium/WebKit currently
      // differ from the spec and allow undefined as well. Here, we follow the standard.
      // See: https://github.com/w3c/aria/issues/1858
      if (value === null) {
        this.removeAttributeNS(null, attribute);
      } else {
        this.setAttributeNS(null, attribute, value);
      }
    },
    configurable: true,
    enumerable: true
  });
}

module.exports = {
  implementation: ARIAMixinImpl
};
