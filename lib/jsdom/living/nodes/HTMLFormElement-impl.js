"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { domSymbolTree } = require("../helpers/internal-constants");
const { fireAnEvent } = require("../helpers/events");
const { HTML_NS } = require("../helpers/namespaces");
const HTMLCollection = require("../generated/HTMLCollection");
const notImplemented = require("../../browser/not-implemented");
const { reflectURLAttribute } = require("../../utils");
const { navigate } = require("../window/navigation");
const whatwgURL = require("whatwg-url");
const { documentBaseURL, parseURLToResultingURLRecord } = require("../helpers/document-base-url");

// http://www.whatwg.org/specs/web-apps/current-work/#category-listed
const listedElements = new Set(["button", "fieldset", "input", "keygen", "object", "output", "select", "textarea"]);

// types which indicate a submit action and are not successful controls
// these will be ignored
var k_r_submitter = /^(?:submit|button|image|reset|file)$/i;

// node names which could be successful controls
var k_r_success_contrls = /^(?:input|select|textarea|keygen)/i;

// Matches bracket notation.
var brackets = /(\[[^\[\]]*\])/g;

// https://html.spec.whatwg.org/multipage/forms.html#category-submit
const submittableElements = new Set(["button", "input", "object", "select", "textarea"]);

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

const constraintValidationPositiveResult = Symbol("positive");
const constraintValidationNegativeResult = Symbol("negative");

function serialize(form, options) {
  if (typeof options != 'object') {
    options = {
      hash: !!options
    };
  } else if (options.hash === undefined) {
    options.hash = true;
  }

  var enctype = options.enctype ? options.enctype : 'application/x-www-form-urlencoded';
  var encoding = options.encoding ? options.encoding : 'UTF-8';
  var result = (options.hash) ? {} : '';
  var serializer = options.serializer || ((options.hash) ? hash_serializer :
    (enctype == 'application/x-www-form-urlencoded' ? urlform_serialize : plain_serialize));

  var elements = form && form.elements ? form.elements : [];

  //Object store each radio and set if it's empty or not
  var radio_store = Object.create(null);

  for (var i = 0; i < elements.length; ++i) {
    var element = elements.item(i);

    // ingore disabled fields
    if ((!options.disabled && element.disabled) || !element.name || element.hidden) {
      continue;
    }
    // ignore anyhting that is not considered a success field
    if (!k_r_success_contrls.test(element.nodeName) ||
      k_r_submitter.test(element.type)) {
      continue;
    }

    var key = element.name;
    var val = element.value;
    var type = element.type;

    // we can't just use element.value for checkboxes cause some browsers lie to us
    // they say "on" for value when the box isn't checked
    if ((type === 'checkbox' || type === 'radio') && !element.getAttribute(
        'checked')) {
      val = undefined;
    }

    // If we want empty elements
    if (options.empty) {
      // for checkbox
      if (type === 'checkbox' && !element.getAttribute('checked')) {
        val = '';
      }

      // for radio
      if (type === 'radio') {
        if (!radio_store[name] && !element.getAttribute('checked')) {
          radio_store[name] = false;
        } else if (element.getAttribute('checked')) {
          radio_store[name] = true;
        }
      }

      // if options empty is true, continue only if its radio
      if (val == undefined && type == 'radio') {
        continue;
      }
    } else {
      // value-less fields are ignored unless options.empty is true
      if (!val) {
        continue;
      }
    }

    // multi select boxes
    if (type === 'select-multiple') {
      val = [];

      var selectOptions = element.getAttribute('options');
      var isSelectedOptions = false;
      for (var j = 0; j < selectOptions.length; ++j) {
        var option = selectOptions[j];
        var allowedEmpty = options.empty && !option.value;
        var hasValue = (option.value || allowedEmpty);
        if (option.selected && hasValue) {
          isSelectedOptions = true;

          // If using a hash serializer be sure to add the
          // correct notation for an array in the multi-select
          // context. Here the name attribute on the select element
          // might be missing the trailing bracket pair. Both names
          // "foo" and "foo[]" should be arrays.
          if (options.hash && key.slice(key.length - 2) !== '[]') {
            result = serializer(result, key + '[]', option.value);
          } else {
            result = serializer(result, key, option.value);
          }
        }
      }

      // Serialize if no selected options and options.empty is true
      if (!isSelectedOptions && options.empty) {
        result = serializer(result, key, '');
      }

      continue;
    }

    result = serializer(result, key, val);
  }

  // Check for all empty radio buttons and serialize them with key=""
  if (options.empty) {
    for (var key in radio_store) {
      if (!radio_store[key]) {
        result = serializer(result, key, '');
      }
    }
  }

  return result;
}

function parse_keys(string) {
  var keys = [];
  var prefix = /^([^\[\]]*)/;
  var children = new RegExp(brackets);
  var match = prefix.exec(string);

  if (match[1]) {
    keys.push(match[1]);
  }

  while ((match = children.exec(string)) !== null) {
    keys.push(match[1]);
  }

  return keys;
}

function hash_assign(result, keys, value) {
  if (keys.length === 0) {
    result = value;
    return result;
  }

  var key = keys.shift();
  var between = key.match(/^\[(.+?)\]$/);

  if (key === '[]') {
    result = result || [];

    if (Array.isArray(result)) {
      result.push(hash_assign(null, keys, value));
    } else {
      // This might be the result of bad name attributes like "[][foo]",
      // in this case the original `result` object will already be
      // assigned to an object literal. Rather than coerce the object to
      // an array, or cause an exception the attribute "_values" is
      // assigned as an array.
      result._values = result._values || [];
      result._values.push(hash_assign(null, keys, value));
    }

    return result;
  }

  // Key is an attribute name and can be assigned directly.
  if (!between) {
    result[key] = hash_assign(result[key], keys, value);
  } else {
    var string = between[1];
    // +var converts the variable into a number
    // better than parseInt because it doesn't truncate away trailing
    // letters and actually fails if whole thing is not a number
    var index = +string;

    // If the characters between the brackets is not a number it is an
    // attribute name and can be assigned directly.
    if (isNaN(index)) {
      result = result || {};
      result[string] = hash_assign(result[string], keys, value);
    } else {
      result = result || [];
      result[index] = hash_assign(result[index], keys, value);
    }
  }

  return result;
}

// Object/hash encoding serializer.
function hash_serializer(result, key, value) {
  var matches = key.match(brackets);

  // Has brackets? Use the recursive assignment function to walk the keys,
  // construct any missing objects in the result tree and make the assignment
  // at the end of the chain.
  if (matches) {
    var keys = parse_keys(key);
    hash_assign(result, keys, value);
  } else {
    // Non bracket notation can make assignments directly.
    var existing = result[key];

    // If the value has been assigned already (for instance when a radio and
    // a checkbox have the same name attribute) convert the previous value
    // into an array before pushing into it.
    //
    // NOTE: If this requirement were removed all hash creation and
    // assignment could go through `hash_assign`.
    if (existing) {
      if (!Array.isArray(existing)) {
        result[key] = [existing];
      }

      result[key].push(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

// urlform encoding serializer
function urlform_serialize(result, key, value) {
  // encode newlines as \r\n cause the html spec says so
  value = value.replace(/(\r)?\n/g, '\r\n');
  value = encodeURIComponent(value);

  // spaces should be '+' rather than '%20'.
  value = value.replace(/%20/g, '+');
  return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + value;
}

function plain_serialize(result, key, value) {
  return result + (result ? '\r\n' : '') + key + '=' + value;
}

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

  // https://html.spec.whatwg.org/multipage/forms.html#dom-form-elements
  get elements() {
    // TODO: Return a HTMLFormControlsCollection
    return HTMLCollection.createImpl([], {
      element: this,
      query: () => domSymbolTree.treeToArray(this, {
        filter: node => listedElements.has(node._localName) &&
                        node._namespaceURI === HTML_NS &&
                        node.type !== "image"
      })
    });
  }

  get length() {
    return this.elements.length;
  }

  _doSubmit() {
    if (!this.isConnected) {
      return;
    }

    this.submit();
  }

  _encoding() {
    var encoding = this.ownerDocument.characterSet;
    if (this.getAttribute('accept-charset')) {
      const candidateEncodingLabel = this.getAttribute('accept-charset').split(' ');
      var candidateEncoding = [];
      for (var coding in candidateEncodingLabel) {
        // should push when 'get an encoding' no error
        if (whatwgEncoding.isSupported(coding)) {
          candidateEncoding.push(coding);
        }
      }
      if (candidateEncoding.length == 0) {
        return 'UTF-8';
      }
      return candidateEncoding[0];
    }
    if (encoding) {
      return encoding;
    }
    return 'UTF-8';
  }

  // https://w3c.github.io/html/sec-forms.html#form-submission
  submit() {
    if (this._submitted) {
      return;
    }
    if (this.enctype == 'multipart/form-data') {
      notImplemented("HTMLFormElement.prototype.submit.MultiPartFormData", this._ownerDocument._defaultView);
    }

    if (!fireAnEvent("submit", this, undefined, { bubbles: true, cancelable: true })) {
      return
    }

    const encoding = this._encoding();
    // Support 'Mutate action URL' and 'Submit as entity body'
    var dataSet = serialize(this, {
      hash: false,
      empty: true,
      enctype: this.enctype,
      encoding: encoding
    });

    let requestArgs = {
      method: this.method
    }
    if (this.method == 'get') {
      if (dataSet.length) {
        requestArgs.url = this.action + (this.action.indexOf('?') == -1 ? '?' : '&') + dataSet;
      } else {
        requestArgs.url = this.action
      }
    } else if (this.method == 'post') {
      requestArgs.url = this.action;
      requestArgs.body = dataSet;
      requestArgs.contentType = this.enctype + '; charset=' + encoding;
    } else {
      // notImplemented("HTMLFormElement.prototype.submit.Method.Dialog", this._ownerDocument._defaultView);
      console.warn("HTMLFormElement.prototype.submit.Method.Dialog", this.outerHTML);
    }

    const newURL = whatwgURL.parseURL(requestArgs.url, { baseURL: documentBaseURL(this._ownerDocument) });
    if (newURL === null) {
      throw new TypeError(`Could not parse "${v}" as a URL`);
    }
    navigate(this._ownerDocument._defaultView, newURL, { replacement: false, exceptionsEnabled: true }, requestArgs);

    this._submitted = true;
  }

  _doReset() {
    if (!this.isConnected) {
      return;
    }

    this.reset();
  }

  reset() {
    if (!fireAnEvent("reset", this, undefined, { bubbles: true, cancelable: true })) {
      return;
    }

    for (const el of this.elements) {
      if (typeof el._formReset === "function") {
        el._formReset();
      }
    }

    this._submitted = false;
  }

  get method() {
    let method = this.getAttributeNS(null, "method");
    if (method) {
      method = method.toLowerCase();
    }

    if (methods.has(method)) {
      return method;
    }
    return "get";
  }

  set method(V) {
    this.setAttributeNS(null, "method", V);
  }

  get enctype() {
    let type = this.getAttributeNS(null, "enctype");
    if (type) {
      type = type.toLowerCase();
    }

    if (encTypes.has(type)) {
      return type;
    }
    return "application/x-www-form-urlencoded";
  }

  set enctype(V) {
    this.setAttributeNS(null, "enctype", V);
  }

  get action() {
    const attributeValue = this.getAttributeNS(null, "action");
    if (attributeValue === null || attributeValue === "") {
      return this._ownerDocument.URL;
    }

    return reflectURLAttribute(this, "action");
  }

  set action(V) {
    this.setAttributeNS(null, "action", V);
  }

  // If the checkValidity() method is invoked, the user agent must statically validate the
  // constraints of the form element, and return true if the constraint validation returned
  // a positive result, and false if it returned a negative result.
  checkValidity() {
    return this._staticallyValidateConstraints().result === constraintValidationPositiveResult;
  }

  // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#interactively-validate-the-constraints
  reportValidity() {
    return this.checkValidity();
  }

  // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#statically-validate-the-constraints
  _staticallyValidateConstraints() {
    const controls = [];
    for (const el of domSymbolTree.treeIterator(this)) {
      if (el.form === this && submittableElements.has(el.nodeName.toLowerCase())) {
        controls.push(el);
      }
    }

    const invalidControls = [];

    for (const control of controls) {
      if (control._isCandidateForConstraintValidation() && !control._satisfiesConstraints()) {
        invalidControls.push(control);
      }
    }

    if (invalidControls.length === 0) {
      return { result: constraintValidationPositiveResult };
    }

    const unhandledInvalidControls = [];
    for (const invalidControl of invalidControls) {
      const notCancelled = fireAnEvent("invalid", invalidControl, undefined, { cancelable: true });
      if (notCancelled) {
        unhandledInvalidControls.push(invalidControl);
      }
    }

    return { result: constraintValidationNegativeResult, unhandledInvalidControls };
  }
}

module.exports = {
  implementation: HTMLFormElementImpl
};
