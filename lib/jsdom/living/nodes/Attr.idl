// https://dom.spec.whatwg.org/#interface-attr

[Exposed=Window]
interface Attr {
  readonly attribute DOMString? namespaceURI;
  readonly attribute DOMString? prefix;
  readonly attribute DOMString localName;
  readonly attribute DOMString name;
  readonly attribute DOMString nodeName; // historical alias of .name
           attribute DOMString value;
  [TreatNullAs=EmptyString] attribute DOMString nodeValue; // historical alias of .value
  [TreatNullAs=EmptyString] attribute DOMString textContent; // historical alias of .value

  readonly attribute Element? ownerElement;

  readonly attribute boolean specified; // useless; always returns true
};
