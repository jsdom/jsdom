// https://html.spec.whatwg.org/multipage/forms.html#htmlformelement
[Exposed=Window,
// We haven't made named/indexed getters work for HTMLFormElement yet, so don't include these until we do.
// LegacyOverrideBuiltins,
// LegacyUnenumerableNamedProperties,
 HTMLConstructor]
interface HTMLFormElement : HTMLElement {
  [CEReactions, Reflect="accept-charset"] attribute DOMString acceptCharset;
  [CEReactions] attribute USVString action;
//  [CEReactions] attribute DOMString autocomplete;
  [CEReactions] attribute DOMString enctype;
//  [CEReactions] attribute DOMString encoding;
  [CEReactions] attribute DOMString method;
  [CEReactions, Reflect] attribute DOMString name;
  [CEReactions, Reflect] attribute boolean noValidate;
  [CEReactions, Reflect] attribute DOMString target;

  [SameObject] readonly attribute HTMLFormControlsCollection elements;
  readonly attribute unsigned long length;
//  getter Element (unsigned long index);
//  getter (RadioNodeList or Element) (DOMString name);

  void submit();
  void requestSubmit(optional HTMLElement submitter);
  [CEReactions] void reset();
  boolean checkValidity();
  boolean reportValidity();
};
