// https://dom.spec.whatwg.org/#nonelementparentnode
interface mixin NonElementParentNode {
  Element? getElementById(DOMString elementId);
};
Document includes NonElementParentNode;
DocumentFragment includes NonElementParentNode;
