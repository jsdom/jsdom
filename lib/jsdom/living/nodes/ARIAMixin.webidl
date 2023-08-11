// https://w3c.github.io/aria/#ARIAMixin
interface mixin ARIAMixin {
	[CEReactions] attribute DOMString? role;
	// TODO: not implemented
	// [CEReactions] attribute Element? ariaActiveDescendantElement;
	[CEReactions] attribute DOMString? ariaAtomic;
	[CEReactions] attribute DOMString? ariaAutoComplete;
	[CEReactions] attribute DOMString? ariaBusy;
	[CEReactions] attribute DOMString? ariaChecked;
	[CEReactions] attribute DOMString? ariaColCount;
	[CEReactions] attribute DOMString? ariaColIndex;
	[CEReactions] attribute DOMString? ariaColIndexText;
	[CEReactions] attribute DOMString? ariaColSpan;
	// TODO: not implemented
	// [CEReactions] attribute FrozenArray<Element>? ariaControlsElements;
	[CEReactions] attribute DOMString? ariaCurrent;
	// TODO: not implemented
	// [CEReactions] attribute FrozenArray<Element>? ariaDescribedByElements;
	[CEReactions] attribute DOMString? ariaDescription;
	// TODO: not implemented
	// [CEReactions] attribute FrozenArray<Element>? ariaDetailsElements;
	[CEReactions] attribute DOMString? ariaDisabled;
	// TODO: not implemented
	// [CEReactions] attribute FrozenArray<Element>? ariaErrorMessageElements;
	[CEReactions] attribute DOMString? ariaExpanded;
	// TODO: not implemented
	// [CEReactions] attribute FrozenArray<Element>? ariaFlowToElements;
	[CEReactions] attribute DOMString? ariaHasPopup;
	[CEReactions] attribute DOMString? ariaHidden;
	[CEReactions] attribute DOMString? ariaInvalid;
	[CEReactions] attribute DOMString? ariaKeyShortcuts;
	[CEReactions] attribute DOMString? ariaLabel;
	// TODO: not implemented
	// [CEReactions] attribute FrozenArray<Element>? ariaLabelledByElements;
	[CEReactions] attribute DOMString? ariaLevel;
	[CEReactions] attribute DOMString? ariaLive;
	[CEReactions] attribute DOMString? ariaModal;
	[CEReactions] attribute DOMString? ariaMultiLine;
	[CEReactions] attribute DOMString? ariaMultiSelectable;
	[CEReactions] attribute DOMString? ariaOrientation;
	// TODO: not implemented
	// [CEReactions] attribute FrozenArray<Element>? ariaOwnsElements;
	[CEReactions] attribute DOMString? ariaPlaceholder;
	[CEReactions] attribute DOMString? ariaPosInSet;
	[CEReactions] attribute DOMString? ariaPressed;
	[CEReactions] attribute DOMString? ariaReadOnly;
	// Removed in https://github.com/w3c/aria/issues/1267, but WPT tests require it
  [CEReactions] attribute DOMString? ariaRelevant;
	[CEReactions] attribute DOMString? ariaRequired;
	[CEReactions] attribute DOMString? ariaRoleDescription;
	[CEReactions] attribute DOMString? ariaRowCount;
	[CEReactions] attribute DOMString? ariaRowIndex;
	[CEReactions] attribute DOMString? ariaRowIndexText;
	[CEReactions] attribute DOMString? ariaRowSpan;
	[CEReactions] attribute DOMString? ariaSelected;
	[CEReactions] attribute DOMString? ariaSetSize;
	[CEReactions] attribute DOMString? ariaSort;
	[CEReactions] attribute DOMString? ariaValueMax;
	[CEReactions] attribute DOMString? ariaValueMin;
	[CEReactions] attribute DOMString? ariaValueNow;
	[CEReactions] attribute DOMString? ariaValueText;
};
Element includes ARIAMixin;
