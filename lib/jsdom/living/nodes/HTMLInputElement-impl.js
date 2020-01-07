"use strict";
const conversions = require("webidl-conversions");
const DOMException = require("domexception/webidl2js-wrapper");
const FileList = require("../generated/FileList");
const Decimal = require("decimal.js");
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const idlUtils = require("../generated/utils");
const DefaultConstraintValidationImpl =
  require("../constraint-validation/DefaultConstraintValidation-impl").implementation;
const ValidityState = require("../generated/ValidityState");
const { mixin } = require("../../utils");
const { domSymbolTree, cloningSteps } = require("../helpers/internal-constants");
const { getLabelsForLabelable, formOwner } = require("../helpers/form-controls");
const { fireAnEvent } = require("../helpers/events");
const {
  isDisabled,
  isValidEmailAddress,
  isValidAbsoluteURL,
  sanitizeValueByType
} = require("../helpers/form-controls");
const {
  parseFloatingPointNumber,
  asciiCaseInsensitiveMatch,
  splitOnCommas
} = require("../helpers/strings");
const { isDate } = require("../helpers/dates-and-times");
const {
  convertStringToNumberByType,
  convertStringToDateByType,
  serializeDateByType,
  convertNumberToStringByType
} = require("../helpers/number-and-date-inputs");

const filesSymbol = Symbol("files");

// https://html.spec.whatwg.org/multipage/input.html#attr-input-type
const inputAllowedTypes = new Set([
  "hidden", "text", "search", "tel", "url", "email", "password", "datetime", "date",
  "month", "week", "time", "datetime-local", "number", "range", "color", "checkbox", "radio",
  "file", "submit", "image", "reset", "button"
]);

const selectAllowedTypes = new Set([
  "text", "search", "tel", "url", "password", "email", "date", "month", "week",
  "time", "datetime-local", "color", "file", "number"
]);

const variableLengthSelectionAllowedTypes = new Set(["text", "search", "tel", "url", "password"]);

const maxMinStepTypes = new Set(["date", "month", "week", "time", "datetime-local", "number", "range", "datetime"]);

const valueAsDateTypes = new Set(["date", "month", "week", "time"]);
const valueAsNumberTypes = new Set(["datetime", "date", "month", "week", "time", "datetime-local", "number", "range"]);

// https://html.spec.whatwg.org/multipage/input.html#concept-input-apply
const applicableTypesForAttribute = {
  max: maxMinStepTypes,
  min: maxMinStepTypes,
  step: maxMinStepTypes,
  pattern: new Set(["text", "search", "tel", "url", "email", "password"]),
  readonly: new Set([
    "text", "search", "url", "tel", "email", "password", "date", "month", "week", "time", "datetime-local",
    "number"
  ])
};

function allowSelect(type) {
  return selectAllowedTypes.has(type.toLowerCase());
}

function allowVariableLengthSelection(type) {
  return variableLengthSelectionAllowedTypes.has(type.toLowerCase());
}

function allowValueAsDate(type) {
  return valueAsDateTypes.has(type.toLowerCase());
}

function allowValueAsNumber(type) {
  return valueAsNumberTypes.has(type.toLowerCase());
}

const valueAttributeDefaultMode = new Set(["hidden", "submit", "image", "reset", "button"]);
const valueAttributeDefaultOnMode = new Set(["checkbox", "radio"]);

function valueAttributeMode(type) {
  if (valueAttributeDefaultMode.has(type)) {
    return "default";
  }
  if (valueAttributeDefaultOnMode.has(type)) {
    return "default/on";
  }
  if (type === "file") {
    return "filename";
  }
  return "value";
}

class HTMLInputElementImpl extends HTMLElementImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this._selectionStart = this._selectionEnd = 0;
    this._selectionDirection = "none";
    this._value = "";
    this._dirtyValue = false;
    this._checkedness = false;
    this._dirtyCheckedness = false;

    this._preCheckedRadioState = null;

    this.indeterminate = false;

    this._customValidityErrorMessage = "";

    this._labels = null;

    this._hasActivationBehavior = true;
  }

  // https://html.spec.whatwg.org/multipage/input.html#concept-input-value-string-number
  get _convertStringToNumber() {
    return convertStringToNumberByType[this.type];
  }

  get _convertNumberToString() {
    return convertNumberToStringByType[this.type];
  }

  get _convertDateToString() {
    return serializeDateByType[this.type];
  }

  get _convertStringToDate() {
    return convertStringToDateByType[this.type];
  }

  _isStepAligned(v) {
    const relativeDistance = v - this._stepBase;
    return (relativeDistance % this._allowedValueStep) === 0;
  }

  _stepAlign(v, isPositive) {
    if (this._isStepAligned(v)) {
      return v;
    }

    const relativeDistance = v - this._stepBase;
    const stepIntervalCount = Math.trunc(relativeDistance / this._allowedValueStep);
    let candidate = stepIntervalCount * this._allowedValueStep;

    if (isPositive) {
      if (v > candidate) {
        candidate += this._allowedValueStep;
      }
    } else if (v < candidate) {
      candidate -= this._allowedValueStep;
    }
    return candidate + this._stepBase;
  }

  // For <input>, https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#concept-fe-value
  // is a simple value that is gotten and set, not computed.
  _getValue() {
    return this._value;
  }

  _legacyPreActivationBehavior() {
    if (this.type === "checkbox") {
      this.checked = !this.checked;
    } else if (this.type === "radio") {
      this._preCheckedRadioState = this.checked;
      this.checked = true;
    }
  }

  _legacyCanceledActivationBehavior() {
    if (this.type === "checkbox") {
      this.checked = !this.checked;
    } else if (this.type === "radio") {
      if (this._preCheckedRadioState !== null) {
        this.checked = this._preCheckedRadioState;
        this._preCheckedRadioState = null;
      }
    }
  }

  _activationBehavior() {
    if (!this._mutable) {
      return;
    }

    const { form } = this;

    if (this.type === "checkbox" || (this.type === "radio" && !this._preCheckedRadioState)) {
      fireAnEvent("input", this, undefined, { bubbles: true });
      fireAnEvent("change", this, undefined, { bubbles: true });
    } else if (form && this.type === "submit") {
      form._doSubmit();
    } else if (form && this.type === "reset") {
      form._doReset();
    }
  }

  _attrModified(name) {
    const wrapper = idlUtils.wrapperForImpl(this);
    if (!this._dirtyValue && name === "value") {
      this._value = sanitizeValueByType(this, wrapper.defaultValue);
    }
    if (!this._dirtyCheckedness && name === "checked") {
      this._checkedness = wrapper.defaultChecked;
      if (this._checkedness) {
        this._removeOtherRadioCheckedness();
      }
    }

    if (name === "name" || name === "type") {
      if (this._checkedness) {
        this._removeOtherRadioCheckedness();
      }
    }

    super._attrModified.apply(this, arguments);
  }

  _formReset() {
    const wrapper = idlUtils.wrapperForImpl(this);
    this._value = sanitizeValueByType(this, wrapper.defaultValue);
    this._dirtyValue = false;
    this._checkedness = wrapper.defaultChecked;
    this._dirtyCheckedness = false;
    if (this._checkedness) {
      this._removeOtherRadioCheckedness();
    }
  }

  _changedFormOwner() {
    if (this._checkedness) {
      this._removeOtherRadioCheckedness();
    }
  }

  get _otherRadioGroupElements() {
    const wrapper = idlUtils.wrapperForImpl(this);
    const root = this._radioButtonGroupRoot;
    if (!root) {
      return [];
    }

    const result = [];

    const descendants = domSymbolTree.treeIterator(root);
    for (const candidate of descendants) {
      if (candidate._radioButtonGroupRoot !== root) {
        continue;
      }

      const candidateWrapper = idlUtils.wrapperForImpl(candidate);
      if (!candidateWrapper.name || candidateWrapper.name !== wrapper.name) {
        continue;
      }

      if (candidate !== this) {
        result.push(candidate);
      }
    }
    return result;
  }

  _removeOtherRadioCheckedness() {
    for (const radioGroupElement of this._otherRadioGroupElements) {
      radioGroupElement._checkedness = false;
    }
  }

  get _radioButtonGroupRoot() {
    const wrapper = idlUtils.wrapperForImpl(this);
    if (this.type !== "radio" || !wrapper.name) {
      return null;
    }

    let e = domSymbolTree.parent(this);
    while (e) {
      // root node of this home sub tree
      // or the form element we belong to
      if (!domSymbolTree.parent(e) || e.nodeName.toUpperCase() === "FORM") {
        return e;
      }
      e = domSymbolTree.parent(e);
    }
    return null;
  }

  _isRadioGroupChecked() {
    if (this.checked) {
      return true;
    }
    return this._otherRadioGroupElements.some(radioGroupElement => radioGroupElement.checked);
  }

  get _mutable() {
    return !isDisabled(this) && !(this.hasAttributeNS(null, "readonly") && this._attributeApplies("readonly"));
  }

  get labels() {
    return getLabelsForLabelable(this);
  }

  get form() {
    return formOwner(this);
  }

  get checked() {
    return this._checkedness;
  }

  set checked(checked) {
    this._checkedness = Boolean(checked);
    this._dirtyCheckedness = true;
    if (this._checkedness) {
      this._removeOtherRadioCheckedness();
    }
  }

  get value() {
    switch (valueAttributeMode(this.type)) {
      // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-value
      case "value":
        return this._getValue();
      // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-default
      case "default": {
        const attr = this.getAttributeNS(null, "value");
        return attr !== null ? attr : "";
      }
      // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-default-on
      case "default/on": {
        const attr = this.getAttributeNS(null, "value");
        return attr !== null ? attr : "on";
      }
      // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-filename
      case "filename":
        return this.files.length ? "C:\\fakepath\\" + this.files[0].name : "";
      default:
        throw new Error("jsdom internal error: unknown value attribute mode");
    }
  }

  set value(val) {
    switch (valueAttributeMode(this.type)) {
      // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-value
      case "value": {
        const oldValue = this._value;
        this._value = sanitizeValueByType(this, val);
        this._dirtyValue = true;

        if (oldValue !== this._value) {
          this._selectionStart = 0;
          this._selectionEnd = 0;
          this._selectionDirection = "none";
        }
        break;
      }

      // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-default
      // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-default-on
      case "default":
      case "default/on":
        this.setAttributeNS(null, "value", val);
        break;

      // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-filename
      case "filename":
        if (val === "") {
          this.files.length = 0;
        } else {
          throw DOMException.create(this._globalObject, [
            "This input element accepts a filename, which may only be programmatically set to the empty string.",
            "InvalidStateError"
          ]);
        }
        break;

      default:
        throw new Error("jsdom internal error: unknown value attribute mode");
    }
  }

  // https://html.spec.whatwg.org/multipage/input.html#dom-input-valueasdate
  get valueAsDate() {
    if (!allowValueAsDate(this.type)) {
      return null;
    }

    const window = this._ownerDocument._defaultView;
    const convertedValue = this._convertStringToDate(this._value);

    if (convertedValue instanceof Date) {
      return new window.Date(convertedValue.getTime());
    }

    return null;
  }

  set valueAsDate(v) {
    if (!allowValueAsDate(this.type)) {
      throw DOMException.create(this._globalObject, [
        "Failed to set the 'valueAsDate' property on 'HTMLInputElement': This input element does not support Date " +
        "values.",
        "InvalidStateError"
      ]);
    }

    if (v !== null && !isDate(v)) {
      throw new TypeError("Failed to set the 'valueAsDate' property on 'HTMLInputElement': The provided value is " +
        "not a Date.");
    }

    if (v === null || isNaN(v)) {
      this._value = "";
    }

    this._value = this._convertDateToString(v);
  }

  // https://html.spec.whatwg.org/multipage/input.html#dom-input-valueasnumber
  get valueAsNumber() {
    if (!allowValueAsNumber(this.type)) {
      return NaN;
    }

    return this._parsedValue;
  }

  set valueAsNumber(v) {
    if (!isFinite(v)) {
      throw new TypeError("Failed to set infinite value as Number");
    }

    if (!allowValueAsNumber(this.type)) {
      throw DOMException.create(this._globalObject, [
        "Failed to set the 'valueAsNumber' property on 'HTMLInputElement': This input element does not support " +
        "Number values.",
        "InvalidStateError"
      ]);
    }

    this._value = this._convertNumberToString(v);
  }

  // https://html.spec.whatwg.org/multipage/input.html#dom-input-stepup
  _stepUpdate(n, isUp) {
    if (!allowValueAsNumber(this.type)) {
      throw DOMException.create(this._globalObject, [
        `Failed to invoke '${isUp ? "stepUp" : "stepDown"}' method on 'HTMLInputElement': ` +
        "This input element does not support Number values.",
        "InvalidStateError"
      ]);
    }

    const allowedValueStep = this._allowedValueStep;
    if (allowedValueStep === null) {
      throw DOMException.create(this._globalObject, [
        `Failed to invoke '${isUp ? "stepUp" : "stepDown"}' method on 'HTMLInputElement': ` +
        "This input element does not support value step.",
        "InvalidStateError"
      ]);
    }

    const min = this._minimum;
    const max = this._maximum;

    if (min !== null && max !== null) {
      if (min > max) {
        return;
      }

      const candidateStepValue = this._stepAlign(min + allowedValueStep, false);
      if (candidateStepValue < min || candidateStepValue > max) {
        return;
      }
    }

    let value = 0;
    try {
      value = this.valueAsNumber;
      if (isNaN(value)) { // Empty value is parsed as NaN.
        value = 0;
      }
    } catch (error) {
      // Step 5. Default value is 0.
    }

    const valueBeforeStepping = value;

    if (!this._isStepAligned(value)) {
      value = this._stepAlign(value, isUp);
    }

    let delta = n * allowedValueStep;
    if (!isUp) {
      delta *= -1;
    }

    value += delta;

    if (min !== null && value < min) {
      value = this._stepAlign(min, true);
    }

    if (max !== null && value > max) {
      value = this._stepAlign(max, false);
    }

    if (isUp) {
      if (value < valueBeforeStepping) {
        return;
      }
    } else if (value > valueBeforeStepping) {
      return;
    }

    this.valueAsNumber = value;
  }

  stepDown(n = 1) {
    return this._stepUpdate(n, false);
  }

  stepUp(n = 1) {
    return this._stepUpdate(n, true);
  }

  get files() {
    if (this.type === "file") {
      this[filesSymbol] = this[filesSymbol] || FileList.createImpl(this._globalObject);
    } else {
      this[filesSymbol] = null;
    }
    return this[filesSymbol];
  }

  set files(value) {
    if (this.type === "file" && value !== null) {
      this[filesSymbol] = value;
    }
  }

  get type() {
    const typeAttribute = this.getAttributeNS(null, "type");
    const type = typeAttribute && typeAttribute.toLowerCase();
    return inputAllowedTypes.has(type) ? type : "text";
  }

  set type(type) {
    this.setAttributeNS(null, "type", type);
  }

  _dispatchSelectEvent() {
    fireAnEvent("select", this, undefined, { bubbles: true, cancelable: true });
  }

  _getValueLength() {
    return typeof this.value === "string" ? this.value.length : 0;
  }

  select() {
    if (!allowSelect(this.type)) {
      return;
    }

    this._selectionStart = 0;
    this._selectionEnd = this._getValueLength();
    this._selectionDirection = "none";
    this._dispatchSelectEvent();
  }

  get selectionStart() {
    if (!allowVariableLengthSelection(this.type)) {
      return null;
    }

    return this._selectionStart;
  }

  set selectionStart(start) {
    if (!allowVariableLengthSelection(this.type)) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    this.setSelectionRange(start, Math.max(start, this._selectionEnd), this._selectionDirection);
  }

  get selectionEnd() {
    if (!allowVariableLengthSelection(this.type)) {
      return null;
    }

    return this._selectionEnd;
  }

  set selectionEnd(end) {
    if (!allowVariableLengthSelection(this.type)) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    this.setSelectionRange(this._selectionStart, end, this._selectionDirection);
  }

  get selectionDirection() {
    if (!allowVariableLengthSelection(this.type)) {
      return null;
    }

    return this._selectionDirection;
  }

  set selectionDirection(dir) {
    if (!allowVariableLengthSelection(this.type)) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    this.setSelectionRange(this._selectionStart, this._selectionEnd, dir);
  }

  setSelectionRange(start, end, dir) {
    if (!allowVariableLengthSelection(this.type)) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    this._selectionEnd = Math.min(end, this._getValueLength());
    this._selectionStart = Math.min(start, this._selectionEnd);
    this._selectionDirection = dir === "forward" || dir === "backward" ? dir : "none";
    this._dispatchSelectEvent();
  }

  setRangeText(repl, start, end, selectionMode = "preserve") {
    if (!allowVariableLengthSelection(this.type)) {
      throw DOMException.create(this._globalObject, ["The object is in an invalid state.", "InvalidStateError"]);
    }

    if (arguments.length < 2) {
      start = this._selectionStart;
      end = this._selectionEnd;
    } else if (start > end) {
      throw DOMException.create(this._globalObject, ["The index is not in the allowed range.", "IndexSizeError"]);
    }

    start = Math.min(start, this._getValueLength());
    end = Math.min(end, this._getValueLength());

    const val = this.value;
    let selStart = this._selectionStart;
    let selEnd = this._selectionEnd;

    this.value = val.slice(0, start) + repl + val.slice(end);

    const newEnd = start + this.value.length;

    if (selectionMode === "select") {
      this.setSelectionRange(start, newEnd);
    } else if (selectionMode === "start") {
      this.setSelectionRange(start, start);
    } else if (selectionMode === "end") {
      this.setSelectionRange(newEnd, newEnd);
    } else { // preserve
      const delta = repl.length - (end - start);

      if (selStart > end) {
        selStart += delta;
      } else if (selStart > start) {
        selStart = start;
      }

      if (selEnd > end) {
        selEnd += delta;
      } else if (selEnd > start) {
        selEnd = newEnd;
      }

      this.setSelectionRange(selStart, selEnd);
    }
  }

  // https://html.spec.whatwg.org/multipage/input.html#the-list-attribute
  get list() {
    const id = this.getAttributeNS(null, "list");
    const el = this.getRootNode({}).getElementById(id);

    if (el && el.localName === "datalist") {
      return el;
    }

    return null;
  }

  set maxLength(value) {
    if (value < 0) {
      throw DOMException.create(this._globalObject, ["The index is not in the allowed range.", "IndexSizeError"]);
    }
    this.setAttributeNS(null, "maxlength", String(value));
  }

  get maxLength() {
    if (!this.hasAttributeNS(null, "maxlength")) {
      return 524288; // stole this from chrome
    }
    return parseInt(this.getAttributeNS(null, "maxlength"));
  }

  set minLength(value) {
    if (value < 0) {
      throw DOMException.create(this._globalObject, ["The index is not in the allowed range.", "IndexSizeError"]);
    }
    this.setAttributeNS(null, "minlength", String(value));
  }

  get minLength() {
    if (!this.hasAttributeNS(null, "minlength")) {
      return 0;
    }
    return parseInt(this.getAttributeNS(null, "minlength"));
  }

  get size() {
    if (!this.hasAttributeNS(null, "size")) {
      return 20;
    }
    return parseInt(this.getAttributeNS(null, "size"));
  }

  set size(value) {
    if (value <= 0) {
      throw DOMException.create(this._globalObject, ["The index is not in the allowed range.", "IndexSizeError"]);
    }
    this.setAttributeNS(null, "size", String(value));
  }

  get src() {
    return conversions.USVString(this.getAttributeNS(null, "src"));
  }

  set src(value) {
    this.setAttributeNS(null, "src", value);
  }

  // https://html.spec.whatwg.org/multipage/input.html#the-min-and-max-attributes
  get _minimum() {
    let min = this._defaultMinimum;
    const attr = this.getAttributeNS(null, "min");
    if (attr !== null && this._convertStringToNumber !== undefined) {
      const parsed = this._convertStringToNumber(attr);
      if (!isNaN(parsed)) {
        min = parsed;
      }
    }
    return min;
  }

  get _maximum() {
    let max = this._defaultMaximum;
    const attr = this.getAttributeNS(null, "max");
    if (attr !== null && this._convertStringToNumber !== undefined) {
      const parsed = this._convertStringToNumber(attr);
      if (!isNaN(parsed)) {
        max = parsed;
      }
    }
    return max;
  }

  get _defaultMinimum() {
    if (this.type === "range") {
      return 0;
    }
    return null;
  }

  get _defaultMaximum() {
    if (this.type === "range") {
      return 100;
    }
    return null;
  }

  get _parsedValue() {
    if (this._convertStringToNumber !== undefined) {
      return this._convertStringToNumber(this.value);
    }
    return this.value;
  }

  // https://html.spec.whatwg.org/multipage/input.html#concept-input-step
  get _allowedValueStep() {
    const attr = this.getAttributeNS(null, "step");
    if (attr === null) {
      return this._defaultStep * this._stepScaleFactor;
    }
    if (asciiCaseInsensitiveMatch(attr, "any")) {
      return null;
    }
    const parsedStep = parseFloatingPointNumber(this.getAttributeNS(null, "step"));
    if (isNaN(parsedStep) || parsedStep <= 0) {
      return this._defaultStep * this._stepScaleFactor;
    }
    return parsedStep * this._stepScaleFactor;
  }

  // https://html.spec.whatwg.org/multipage/input.html#concept-input-step-scale
  get _stepScaleFactor() {
    const dayInMilliseconds = 24 * 60 * 60 * 1000;
    switch (this.type) {
      case "week":
        return 7 * dayInMilliseconds;
      case "date":
        return dayInMilliseconds;
      case "datetime-local":
      case "datetime":
      case "time":
        return 1000;
    }
    return 1;
  }

  // https://html.spec.whatwg.org/multipage/input.html#concept-input-step-default
  get _defaultStep() {
    if (this.type === "datetime-local" || this.type === "datetime" || this.type === "time") {
      return 60;
    }
    return 1;
  }

  // https://html.spec.whatwg.org/multipage/input.html#concept-input-min-zero
  get _stepBase() {
    if (this.hasAttributeNS(null, "min")) {
      const min = this._convertStringToNumber(this.getAttributeNS(null, "min"));
      if (!isNaN(min)) {
        return min;
      }
    }
    if (this.hasAttributeNS(null, "value")) {
      const value = this._convertStringToNumber(this.getAttributeNS(null, "value"));
      if (!isNaN(value)) {
        return value;
      }
    }
    return this._defaultStepBase;
  }

  // https://html.spec.whatwg.org/multipage/input.html#concept-input-step-default-base
  get _defaultStepBase() {
    if (this.type === "week") {
      // The start of week 1970-W01
      return -259200000;
    }
    return 0;
  }

  _attributeApplies(attribute) {
    return applicableTypesForAttribute[attribute].has(this.type);
  }

  _barredFromConstraintValidationSpecialization() {
    // https://html.spec.whatwg.org/multipage/input.html#hidden-state-(type=hidden)
    // https://html.spec.whatwg.org/multipage/input.html#reset-button-state-(type=reset)
    // https://html.spec.whatwg.org/multipage/input.html#button-state-(type=button)
    const willNotValidateTypes = new Set(["hidden", "reset", "button"]);
    // https://html.spec.whatwg.org/multipage/input.html#attr-input-readonly
    const readOnly = this.hasAttributeNS(null, "readonly") && this._attributeApplies("readonly");

    // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-disabled
    return willNotValidateTypes.has(this.type) || readOnly;
  }

  // https://html.spec.whatwg.org/multipage/input.html#concept-input-required
  get _required() {
    return this.hasAttributeNS(null, "required");
  }

  get validity() {
    if (!this._validity) {
      const state = {
        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#suffering-from-being-missing
        valueMissing: () => {
          // https://html.spec.whatwg.org/multipage/input.html#the-required-attribute
          // Constraint validation: If the element is required, and its value IDL attribute applies
          // and is in the mode value, and the element is mutable, and the element's value is the
          // empty string, then the element is suffering from being missing.
          //
          // Note: As of today, the value IDL attribute always applies.
          if (this._required && valueAttributeMode(this.type) === "value" && this._mutable && this._value === "") {
            return true;
          }

          switch (this.type) {
            // https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox)
            // Constraint validation: If the element is required and its checkedness is
            // false, then the element is suffering from being missing.
            case "checkbox":
              if (this._required && !this._checkedness) {
                return true;
              }
              break;

            // https://html.spec.whatwg.org/multipage/input.html#radio-button-state-(type=radio)
            // Constraint validation: If an element in the radio button group is required,
            // and all of the input elements in the radio button group have a checkedness
            // that is false, then the element is suffering from being missing.
            case "radio":
              if (this._required && !this._isRadioGroupChecked()) {
                return true;
              }
              break;

            // https://html.spec.whatwg.org/multipage/input.html#file-upload-state-(type=file)
            // Constraint validation: If the element is required and the list of selected files is
            // empty, then the element is suffering from being missing.
            case "file":
              if (this._required && this.files.length === 0) {
                return true;
              }
              break;
          }

          return false;
        },

        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#suffering-from-being-too-long
        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-maxlength
        // jsdom has no way at the moment to emulate a user interaction, so tooLong/tooShort have
        // to be set to false.
        tooLong: () => false,

        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#suffering-from-being-too-short
        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-minlength
        tooShort: () => false,

        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#suffering-from-an-overflow
        // https://html.spec.whatwg.org/multipage/input.html#attr-input-max
        rangeOverflow: () => this._attributeApplies("max") && this._maximum !== null &&
          this._parsedValue > this._maximum,

        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#suffering-from-an-underflow
        // https://html.spec.whatwg.org/multipage/input.html#attr-input-min
        rangeUnderflow: () => this._attributeApplies("min") && this._minimum !== null &&
          this._parsedValue < this._minimum,

        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#suffering-from-a-pattern-mismatch
        patternMismatch: () => {
          if (!this.hasAttributeNS(null, "pattern") || !this._attributeApplies("pattern") || this.value === "") {
            return false;
          }
          let regExp;
          try {
            const pattern = this.getAttributeNS(null, "pattern");
            // The pattern attribute should be matched against the entire value, not just any
            // subset, so add ^ and $ anchors. But also check the validity of the regex itself
            // first.
            new RegExp(pattern, "u"); // eslint-disable-line no-new
            regExp = new RegExp("^(?:" + pattern + ")$", "u");
          } catch (e) {
            return false;
          }
          if (this.type === "email" && this.hasAttributeNS(null, "multiple")) {
            return !splitOnCommas(this.value).every(value => regExp.test(value));
          }
          return !regExp.test(this.value);
        },

        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#suffering-from-a-step-mismatch
        // https://html.spec.whatwg.org/multipage/input.html#attr-input-step
        stepMismatch: () => {
          const allowedValueStep = this._allowedValueStep;
          if (allowedValueStep === null) {
            return false;
          }
          if (this._convertStringToNumber === undefined) {
            return false;
          }
          const number = this._parsedValue;
          if (typeof number !== "number" || isNaN(number)) {
            return false;
          }

          const isIntegralMultiple =
            new Decimal(number - this._stepBase)
              .modulo(allowedValueStep)
              .isZero();
          return !isIntegralMultiple;
        },

        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#suffering-from-a-type-mismatch
        typeMismatch: () => {
          if (this.value === "") {
            return false;
          }
          if (this.type === "email") {
            // https://html.spec.whatwg.org/multipage/input.html#e-mail-state-(type=email)
            // Constraint validation [multiple=false]: While the value of the element is neither the empty
            // string nor a single valid e - mail address, the element is suffering from a type mismatch.

            // Constraint validation [multiple=true]: While the value of the element is not a valid e-mail address list,
            // the element is suffering from a type mismatch.
            return !isValidEmailAddress(this.value, this.hasAttributeNS(null, "multiple"));
          } else if (this.type === "url") {
            // https://html.spec.whatwg.org/multipage/input.html#url-state-(type=url)
            // Constraint validation: While the value of the element is neither the empty string
            // nor a valid absolute URL, the element is suffering from a type mismatch.
            return !isValidAbsoluteURL(this.value);
          }
          return false;
        }
      };

      this._validity = ValidityState.createImpl(this._globalObject, [], {
        element: this,
        state
      });
    }
    return this._validity;
  }

  [cloningSteps](copy, node) {
    copy._value = node._value;
    copy._checkedness = node._checkedness;
    copy._dirtyValue = node._dirtyValue;
    copy._dirtyCheckedness = node._dirtyCheckedness;
  }
}

mixin(HTMLInputElementImpl.prototype, DefaultConstraintValidationImpl.prototype);

module.exports = {
  implementation: HTMLInputElementImpl
};
