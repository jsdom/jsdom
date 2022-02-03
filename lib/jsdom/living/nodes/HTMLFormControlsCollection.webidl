// https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#htmlformcontrolscollection
[Exposed=Window]
interface HTMLFormControlsCollection : HTMLCollection {
  // inherits length and item()
  [WebIDL2JSValueAsUnsupported=_null] getter (RadioNodeList or Element)? namedItem(DOMString name); // shadows inherited namedItem()
};
