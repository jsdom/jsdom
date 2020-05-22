// https://dom.spec.whatwg.org/#interface-shadowroot
[Exposed=Window]
interface ShadowRoot : DocumentFragment {
  readonly attribute ShadowRootMode mode;
  readonly attribute Element host;

  // https://github.com/w3c/DOM-Parsing/issues/21
  [CEReactions] attribute [LegacyNullToEmptyString] DOMString innerHTML;
};

enum ShadowRootMode { "open", "closed" };
