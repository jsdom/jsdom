// https://dom.spec.whatwg.org/#interface-shadowroot
[Exposed=Window]
interface ShadowRoot : DocumentFragment {
  readonly attribute ShadowRootMode mode;
  readonly attribute Element host;
};

enum ShadowRootMode { "open", "closed" };
