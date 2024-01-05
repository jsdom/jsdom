// https://w3c.github.io/aria/#ARIAMixin
// with https://github.com/w3c/aria/pull/1876 applied

interface mixin ARIAMixin {
  [CEReactions, Reflect] attribute DOMString? role;
  // [CEReactions] attribute Element? ariaActiveDescendantElement;
  [CEReactions, Reflect="aria-atomic"] attribute DOMString? ariaAtomic;
  [CEReactions, Reflect="aria-autocomplete"] attribute DOMString? ariaAutoComplete;
  [CEReactions, Reflect="aria-busy"] attribute DOMString? ariaBusy;
  [CEReactions, Reflect="aria-checked"] attribute DOMString? ariaChecked;
  [CEReactions, Reflect="aria-colcount"] attribute DOMString? ariaColCount;
  [CEReactions, Reflect="aria-colindex"] attribute DOMString? ariaColIndex;
  [CEReactions, Reflect="aria-colindextext"] attribute DOMString? ariaColIndexText;
  [CEReactions, Reflect="aria-colspan"] attribute DOMString? ariaColSpan;
  // [CEReactions] attribute FrozenArray<Element>? ariaControlsElements;
  [CEReactions, Reflect="aria-current"] attribute DOMString? ariaCurrent;
  // [CEReactions] attribute FrozenArray<Element>? ariaDescribedByElements;
  [CEReactions, Reflect="aria-description"] attribute DOMString? ariaDescription;
  // [CEReactions] attribute FrozenArray<Element>? ariaDetailsElements;
  [CEReactions, Reflect="aria-disabled"] attribute DOMString? ariaDisabled;
  // [CEReactions] attribute FrozenArray<Element>? ariaErrorMessageElements;
  [CEReactions, Reflect="aria-expanded"] attribute DOMString? ariaExpanded;
  // [CEReactions] attribute FrozenArray<Element>? ariaFlowToElements;
  [CEReactions, Reflect="aria-haspopup"] attribute DOMString? ariaHasPopup;
  [CEReactions, Reflect="aria-hidden"] attribute DOMString? ariaHidden;
  [CEReactions, Reflect="aria-invalid"] attribute DOMString? ariaInvalid;
  [CEReactions, Reflect="aria-keyshortcuts"] attribute DOMString? ariaKeyShortcuts;
  [CEReactions, Reflect="aria-label"] attribute DOMString? ariaLabel;
  // [CEReactions] attribute FrozenArray<Element>? ariaLabelledByElements;
  [CEReactions, Reflect="aria-level"] attribute DOMString? ariaLevel;
  [CEReactions, Reflect="aria-live"] attribute DOMString? ariaLive;
  [CEReactions, Reflect="aria-modal"] attribute DOMString? ariaModal;
  [CEReactions, Reflect="aria-multiline"] attribute DOMString? ariaMultiLine;
  [CEReactions, Reflect="aria-multiselectable"] attribute DOMString? ariaMultiSelectable;
  [CEReactions, Reflect="aria-orientation"] attribute DOMString? ariaOrientation;
  // [CEReactions] attribute FrozenArray<Element>? ariaOwnsElements;
  [CEReactions, Reflect="aria-placeholder"] attribute DOMString? ariaPlaceholder;
  [CEReactions, Reflect="aria-posinset"] attribute DOMString? ariaPosInSet;
  [CEReactions, Reflect="aria-pressed"] attribute DOMString? ariaPressed;
  [CEReactions, Reflect="aria-readonly"] attribute DOMString? ariaReadOnly;
  [CEReactions, Reflect="aria-required"] attribute DOMString? ariaRequired;
  [CEReactions, Reflect="aria-roledescription"] attribute DOMString? ariaRoleDescription;
  [CEReactions, Reflect="aria-rowcount"] attribute DOMString? ariaRowCount;
  [CEReactions, Reflect="aria-rowindex"] attribute DOMString? ariaRowIndex;
  [CEReactions, Reflect="aria-rowindextext"] attribute DOMString? ariaRowIndexText;
  [CEReactions, Reflect="aria-rowspan"] attribute DOMString? ariaRowSpan;
  [CEReactions, Reflect="aria-selected"] attribute DOMString? ariaSelected;
  [CEReactions, Reflect="aria-setsize"] attribute DOMString? ariaSetSize;
  [CEReactions, Reflect="aria-sort"] attribute DOMString? ariaSort;
  [CEReactions, Reflect="aria-valuemax"] attribute DOMString? ariaValueMax;
  [CEReactions, Reflect="aria-valuemin"] attribute DOMString? ariaValueMin;
  [CEReactions, Reflect="aria-valuenow"] attribute DOMString? ariaValueNow;
  [CEReactions, Reflect="aria-valuetext"] attribute DOMString? ariaValueText;
};

// ariaRelevant is nonstandard, but the WPT tests still require it and all browsers implement it:
// See https://github.com/w3c/aria/issues/1267.
partial interface mixin ARIAMixin {
  [CEReactions, Reflect="aria-relevant"] attribute DOMString? ariaRelevant;
};
