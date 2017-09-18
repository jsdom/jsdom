"use strict";
const idlUtils = require("../generated/utils");
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const HTMLHyperlinkElementUtilsImpl = require("./HTMLHyperlinkElementUtils-impl").implementation;
const {navigate} = require("../window/navigation");

// https://html.spec.whatwg.org/#the-a-element
class HTMLAnchorElementImpl extends HTMLElementImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this._htmlHyperlinkElementUtilsSetup();
  }

  _activationBehavior() {
    if (!this.href || !this.url) {
      return;
    }

    const document = this._ownerDocument;

    // TODO: fully active check

    // https://html.spec.whatwg.org/#following-hyperlinks-2

    // NOT IMPLEMENTED: alternative values for "target"

    document._defaultView.setTimeout(() => {
      // not implemented: replacement, referrer policy etc.
      navigate(document._defaultView, this.url, {});
    }, 0);
  }

  get text() {
    return this.textContent;
  }
  set text(v) {
    this.textContent = v;
  }
}

idlUtils.mixin(HTMLAnchorElementImpl.prototype, HTMLHyperlinkElementUtilsImpl.prototype);

module.exports = {
  implementation: HTMLAnchorElementImpl
};
