"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const idlUtils = require("../generated/utils");
const { isConnected, descendantsByHTMLLocalNames } = require("../helpers/traversal");
const { domSymbolTree } = require("../helpers/internal-constants");
const createHTMLCollection = require("../../living/html-collection").create;
const notImplemented = require("../../browser/not-implemented");
const { reflectURLAttribute } = require("../../utils");
const { constructTheFormDataSet } = require("../xhr/FormData-impl");
const { parseURLToResultingURLRecord } = require("../helpers/document-base-url.js");
const { chooseBrowsingContext, navigate } = require("../window/navigation");

// TODO: this needs to be moved to the public API
const { serializeUrlencoded } = require("whatwg-url/lib/urlencoded");

// http://www.whatwg.org/specs/web-apps/current-work/#category-listed
const listedElements = new Set(["button", "fieldset", "input", "keygen", "object", "select", "textarea"]);

const encTypes = new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);

const methods = new Set([
  "get",
  "post",
  "dialog"
]);

class HTMLFormElementImpl extends HTMLElementImpl {
  _descendantAdded(parent, child) {
    const form = this;
    for (const el of domSymbolTree.treeIterator(child)) {
      if (typeof el._changedFormOwner === "function") {
        el._changedFormOwner(form);
      }
    }

    super._descendantAdded.apply(this, arguments);
  }

  _descendantRemoved(parent, child) {
    for (const el of domSymbolTree.treeIterator(child)) {
      if (typeof el._changedFormOwner === "function") {
        el._changedFormOwner(null);
      }
    }

    super._descendantRemoved.apply(this, arguments);
  }

  get elements() {
    return createHTMLCollection(this, () => descendantsByHTMLLocalNames(this, listedElements));
  }

  get length() {
    return this.elements.length;
  }

  submit() {
    this._doSubmit(this, {submittedFromSubmit: true});
  }
  // https://html.spec.whatwg.org/#concept-form-submit
  _doSubmit(submitter, flags = {}) {
    if (!isConnected(this)) {
      return;
    }

    const form = this;
    const document = this._ownerDocument;
    const window = document._defaultView;

    // NOT IMPLEMENTED: validate the form

    if (!flags.submittedFromSubmit) {
      const ev = document.createEvent("HTMLEvents");
      ev.initEvent("submit", true, true);
      if (this.dispatchEvent(ev)) {
        return;
      }
    }

    const formDataSet = constructTheFormDataSet(this, submitter);

    const action = this._getAttributeForSubmission('action', submitter) || document.URL;
    const parsedAction = parseURLToResultingURLRecord(action, document);
    if (!parsedAction) {
      return;
    }
    const scheme = parsedAction.scheme;

    const method = (this._getAttributeForSubmission('method', submitter) || 'get').toLowerCase();

    const target = this._getAttributeForSubmission('target', submitter) || '_self';
    const {chosen: targetWindow} = chooseBrowsingContext(window, target);
    if (!targetWindow) {
      return;
    }

    if (method === 'dialog') {
      notImplemented("dialog method on forms", window);
    }
    switch (scheme) {
      case 'http':
      case 'https':
        if (method === 'get') {
          mutateActionURL();
        } else {
          submitAsEntityBody();
        }
        break;
      case 'ftp':
      case 'javascript':
        getActionURL();
        break;
      case 'data':
        if (method === 'get') {
          mutateActionURL();
        } else {
          getActionURL();
        }
        break;
      default:
        notImplemented("url scheme " + scheme, window);
    }
    // https://html.spec.whatwg.org/#submit-mutate-action
    function mutateActionURL() {
      const query = serializeUrlencoded(formDataSet.map(entry => [entry.name, entry.value]));
      parsedAction.query = query;
      planToNavigate(parsedAction);
    }
    // https://html.spec.whatwg.org/#submit-body
    function submitAsEntityBody() {
      notImplemented('Form submit with method other than get', window);
    }
    // https://html.spec.whatwg.org/#submit-get-action
    function getActionURL() {
      // Note: the form data set is intentionally discarded.
      planToNavigate(parsedAction);
    }
    // https://html.spec.whatwg.org/#plan-to-navigate
    function planToNavigate(destination) {
      if (form._plannedNavigation) {
        window.clearTimeout(form._plannedNavigation);
      }
      form._plannedNavigation = window.setTimeout(() => {
        form._plannedNavigation = null;
        navigate(targetWindow, destination, {});
      }, 0);
    }
  }
  _getAttributeForSubmission(name, submitter) {
    return submitter.hasAttribute('form' + name) ? submitter.getAttribute('form' + name) : this.getAttribute(name);
  }

  reset() {
    Array.prototype.forEach.call(this.elements, el => {
      el = idlUtils.implForWrapper(el);
      if (typeof el._formReset === "function") {
        el._formReset();
      }
    });
  }

  get method() {
    let method = this.getAttribute("method");
    if (method) {
      method = method.toLowerCase();
    }

    if (methods.has(method)) {
      return method;
    }
    return "get";
  }

  set method(V) {
    this.setAttribute("method", V);
  }

  get enctype() {
    let type = this.getAttribute("enctype");
    if (type) {
      type = type.toLowerCase();
    }

    if (encTypes.has(type)) {
      return type;
    }
    return "application/x-www-form-urlencoded";
  }

  set enctype(V) {
    this.setAttribute("enctype", V);
  }

  get action() {
    const attributeValue = this.getAttribute("action");
    if (attributeValue === null || attributeValue === "") {
      return this._ownerDocument.URL;
    }

    return reflectURLAttribute(this, "action");
  }

  set action(V) {
    this.setAttribute("action", V);
  }
}

module.exports = {
  implementation: HTMLFormElementImpl
};
