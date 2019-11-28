// https://dom.spec.whatwg.org/#documentorshadowroot
interface mixin DocumentOrShadowRoot {
};
Document includes DocumentOrShadowRoot;
ShadowRoot includes DocumentOrShadowRoot;

// https://html.spec.whatwg.org/multipage/dom.html#documentorshadowroot
partial interface mixin DocumentOrShadowRoot {
  readonly attribute Element? activeElement;
};
