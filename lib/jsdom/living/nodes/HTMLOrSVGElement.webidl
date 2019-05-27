interface mixin HTMLOrSVGElement {
  [SameObject] readonly attribute DOMStringMap dataset;
// TODO: Shouldn't be directly [Reflect]ed
  [Reflect] attribute DOMString nonce; // intentionally no [CEReactions]

  [CEReactions] attribute long tabIndex;
//  We don't support FocusOptions yet
//  void focus(optional FocusOptions options);
  void focus();
  void blur();
};
