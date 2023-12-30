// https://dom.spec.whatwg.org/#interface-shadowroot
[Exposed=Window]
interface ShadowRoot : DocumentFragment {
  readonly attribute ShadowRootMode mode;
  readonly attribute Element host;
  readonly attribute boolean delegatesFocus;
};

enum ShadowRootMode { "open", "closed" };
