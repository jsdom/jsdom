// https://dom.spec.whatwg.org/#interface-shadowroot
[Exposed=Window]
interface ShadowRoot : DocumentFragment {
  readonly attribute ShadowRootMode mode;
  readonly attribute boolean delegatesFocus;
  readonly attribute boolean serializable;
  readonly attribute boolean clonable;
  readonly attribute Element host;

  // https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-shadowroot-gethtml
  DOMString getHTML(optional GetHTMLOptions options = {});
};

enum ShadowRootMode { "open", "closed" };
