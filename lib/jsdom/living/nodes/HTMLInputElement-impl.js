"use strict";
const conversions = require("webidl-conversions");
const DOMException = require("domexception");
const Event = require("../generated/Event");
const FileList = require("../generated/FileList");
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const idlUtils = require("../generated/utils");
const DefaultConstraintValidationImpl =
  require("../constraint-validation/DefaultConstraintValidation-impl").implementation;
const ValidityState = require("../generated/ValidityState");
const { mixin } = require("../../utils");
const { domSymbolTree, cloningSteps } = require("../helpers/internal-constants");
const { closest } = require("../helpers/traversal");
const {
  isDisabled,
  isValidEmailAddress,
  isValidUrl,
  sanitizeValueByType
} = require("../helpers/form-controls");
const { parseFloatingPointNumber } = require("../helpers/strings");
const {
  parseDateString,
  parseLocalDateAndTimeString,
  parseMonthString,
  parseTimeString,
  parseWeekString
} = require("../helpers/dates-and-times");

const filesSymbol = Symbol("files");

const selectAllowedTypes = new Set([
  "text", "search", "tel", "url", "password", "email", "date", "month", "week",
  "time", "datetime-local", "color", "file", "number"
]);

const variableLengthSelectionAllowedTypes = new Set(["text", "search", "tel", "url", "password"]);

function allowSelect(type) {
  return selectAllowedTypes.has(type.toLowerCase());
}

function allowVariableLengthSelection(type) {
  return variableLengthSelectionAllowedTypes.has(type.toLowerCase());
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

// Necessary because Date.UTC() treats year within [0, 99] as [1900, 1999].
function getUTCMs(year, month = 1, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0) {
  if (year > 99 || year < 0) {
    return Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  }
  const d = new Date(0);
  d.setUTCFullYear(year);
  d.setUTCMonth(month - 1);
  d.setUTCDate(day);
  d.setUTCHours(hour);
  d.setUTCMinutes(minute);
  d.setUTCSeconds(second, millisecond);
  return d.valueOf();
}

const dayOfWeekRelMondayLUT = [-1, 0, 1, 2, 3, -3, -2];

const convertStringToNumberByTypeMap = new Map([
  [
    // https://html.spec.whatwg.org/multipage/input.html#date-state-(type=date):concept-input-value-string-number
    "date", input => {
      const date = parseDateString(input);
      if (date === null) {
        return NaN;
      }
      return getUTCMs(date.year, date.month, date.day);
    }
  ],
  [
    // https://html.spec.whatwg.org/multipage/input.html#month-state-(type=month):concept-input-value-string-number
    "month", input => {
      const date = parseMonthString(input);
      if (date === null) {
        return NaN;
      }
      return (date.year - 1970) * 12 + (date.month - 1);
    }
  ],
  [
    // https://html.spec.whatwg.org/multipage/input.html#week-state-(type=week):concept-input-value-string-number
    "week", input => {
      const date = parseWeekString(input);
      if (date === null) {
        return NaN;
      }
      const dateObj = new Date(getUTCMs(date.year));
      // An HTML week starts on Monday, while 0 represents Sunday. Account for such.
      const dayOfWeekRelMonday = dayOfWeekRelMondayLUT[dateObj.getUTCDay()];
      return dateObj.setUTCDate(1 + 7 * (date.week - 1) - dayOfWeekRelMonday);
    }
  ],
  [
    // https://html.spec.whatwg.org/multipage/input.html#time-state-(type=time):concept-input-value-string-number
    "time", input => {
      const time = parseTimeString(input);
      if (time === null) {
        return NaN;
      }
      return ((time.hour * 60 + time.minute) * 60 + time.second) * 1000 + time.millisecond;
    }
  ],
  [
    // https://html.spec.whatwg.org/multipage/input.html#local-date-and-time-state-(type=datetime-local):concept-input-value-string-number
    "datetime-local", input => {
      const dateAndTime = parseLocalDateAndTimeString(input);
      if (dateAndTime === null) {
        return NaN;
      }
      const { date: { year, month, day }, time: { hour, minute, second, millisecond } } = dateAndTime;
      // Doesn't quite matter whether or not UTC is used, since the offset from 1970-01-01 local time is returned.
      return getUTCMs(year, month, day, hour, minute, second, millisecond);
    }
  ],
  // https://html.spec.whatwg.org/multipage/input.html#number-state-(type=number):concept-input-value-string-number
  ["number", parseFloatingPointNumber],
  // https://html.spec.whatwg.org/multipage/input.html#range-state-(type=range):concept-input-value-string-number
  ["range", parseFloatingPointNumber]
]);

class HTMLInputElementImpl extends HTMLElementImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this._selectionStart = this._selectionEnd = 0;
    this._selectionDirection = "none";
    this._value = null;
    this._dirtyValue = false;
    this._checkedness = false;
    this._dirtyCheckedness = false;

    // This is used to implement the canceled activation steps for radio inputs:
    // "The canceled activation steps consist of setting the checkedness and the element's indeterminate IDL
    // attribute back to the values they had before the pre-click activation steps were run."
    this._preCheckedRadioState = null;

    this.indeterminate = false;
  }

  // https://html.spec.whatwg.org/multipage/input.html#concept-input-value-string-number
  get _convertStringToNumber() {
    return convertStringToNumberByTypeMap.get(this.type);
  }

  _getValue() {
    return this._value;
  }

  _preClickActivationSteps() {
    if (this.type === "checkbox") {
      this.checked = !this.checked;
    } else if (this.type === "radio") {
      this._preCheckedRadioState = this.checked;
      this.checked = true;
    }
  }

  _canceledActivationSteps() {
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
    if (isDisabled(this)) {
      return;
    }

    if (this.type === "checkbox" || (this.type === "radio" && !this._preCheckedRadioState)) {
      const inputEvent = Event.createImpl(["input", { bubbles: true, cancelable: true }], {});
      this.dispatchEvent(inputEvent);

      const changeEvent = Event.createImpl(["change", { bubbles: true, cancelable: true }], {});
      this.dispatchEvent(changeEvent);
    } else if (this.type === "submit") {
      const { form } = this;
      if (form) {
        form._doSubmit();
      }
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
  _removeOtherRadioCheckedness() {
    const wrapper = idlUtils.wrapperForImpl(this);
    const root = this._radioButtonGroupRoot;
    if (!root) {
      return;
    }

    const name = wrapper.name.toLowerCase();

    const descendants = domSymbolTree.treeIterator(root);
    for (const candidate of descendants) {
      if (candidate._radioButtonGroupRoot !== root) {
        continue;
      }

      const candidateWrapper = idlUtils.wrapperForImpl(candidate);
      if (!candidateWrapper.name || candidateWrapper.name.toLowerCase() !== name) {
        continue;
      }

      if (candidate !== this) {
        candidate._checkedness = false;
      }
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
  get form() {
    return closest(this, "form");
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
        return this._value !== null ? this._value : "";
      // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-default
      case "default": {
        const attr = this.getAttribute("value");
        return attr !== null ? attr : "";
      }
      // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-default-on
      case "default/on": {
        const attr = this.getAttribute("value");
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
        if (val === null) {
          this._value = null;
        } else {
          this._value = sanitizeValueByType(this, String(val));
        }
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
        this.setAttribute("value", val);
        break;

      // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-filename
      case "filename":
        if (val === "") {
          this.files.length = 0;
        } else {
          throw new DOMException("This input element accepts a filename, which may only be programmatically set to " +
                                 "the empty string.", "InvalidStateError");
        }
        break;

      default:
        throw new Error("jsdom internal error: unknown value attribute mode");
    }
  }

  get files() {
    if (this.type === "file") {
      this[filesSymbol] = this[filesSymbol] || FileList.createImpl();
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
    const type = this.getAttribute("type");
    return type ? type.toLowerCase() : "text";
  }
  set type(type) {
    this.setAttribute("type", type);
  }

  _dispatchSelectEvent() {
    const event = this._ownerDocument.createEvent("HTMLEvents");
    event.initEvent("select", true, true);
    this.dispatchEvent(event);
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
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
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
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
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
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
    }

    this.setSelectionRange(this._selectionStart, this._selectionEnd, dir);
  }

  setSelectionRange(start, end, dir) {
    if (!allowVariableLengthSelection(this.type)) {
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
    }

    this._selectionEnd = Math.min(end, this._getValueLength());
    this._selectionStart = Math.min(start, this._selectionEnd);
    this._selectionDirection = dir === "forward" || dir === "backward" ? dir : "none";
    this._dispatchSelectEvent();
  }

  setRangeText(repl, start, end, selectionMode = "preserve") {
    if (!allowVariableLengthSelection(this.type)) {
      throw new DOMException("The object is in an invalid state.", "InvalidStateError");
    }

    if (arguments.length < 2) {
      start = this._selectionStart;
      end = this._selectionEnd;
    } else if (start > end) {
      throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
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

  set maxLength(value) {
    if (value < 0) {
      throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
    }
    this.setAttribute("maxlength", String(value));
  }

  get maxLength() {
    if (!this.hasAttribute("maxlength")) {
      return 524288; // stole this from chrome
    }
    return parseInt(this.getAttribute("maxlength"));
  }

  set minLength(value) {
    if (value < 0) {
      throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
    }
    this.setAttribute("minlength", String(value));
  }

  get minLength() {
    if (!this.hasAttribute("minlength")) {
      return 0;
    }
    return parseInt(this.getAttribute("minlength"));
  }

  get size() {
    if (!this.hasAttribute("size")) {
      return 20;
    }
    return parseInt(this.getAttribute("size"));
  }

  set size(value) {
    if (value <= 0) {
      throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
    }
    this.setAttribute("size", String(value));
  }

  get src() {
    return conversions.USVString(this.getAttribute("src"));
  }

  set src(value) {
    this.setAttribute("src", value);
  }

  // https://html.spec.whatwg.org/multipage/input.html#the-min-and-max-attributes
  get _minimum() {
    let min = this._defaultMinimum;
    const attr = this.getAttribute("min");
    const convertStringToNumber = this._convertStringToNumber;
    if (attr !== null && convertStringToNumber !== undefined) {
      const parsed = convertStringToNumber(attr);
      if (!isNaN(parsed)) {
        min = parsed;
      }
    }
    return min;
  }

  get _maximum() {
    let max = this._defaultMaximum;
    const attr = this.getAttribute("max");
    const convertStringToNumber = this._convertStringToNumber;
    if (attr !== null && convertStringToNumber !== undefined) {
      const parsed = convertStringToNumber(attr);
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
    const converter = this._convertStringToNumber;
    if (converter !== undefined) {
      return converter(this.value);
    }
    return this.value;
  }

  get willValidate() {
    const willNotValidateTypes = new Set(["hidden", "reset", "button"]);
    if (willNotValidateTypes.has(this.type) || this.hasAttribute("readonly") || isDisabled(this)) {
      return false;
    }
    return closest(this, "datalist") === null;
  }

  get validity() {
    const typesWithMaxMin = new Set(["date", "month", "week", "time", "datetime-local", "number", "range", "datetime"]);

    if (!this._validity) {
      const supportsRange = () => typesWithMaxMin.has(this.type);

      this._validity = ValidityState.createImpl(this, {

        valueMissing: () => {
          if (this.hasAttribute("required")) {
            if (this.type === "checkbox" || this.type === "radio") {
              return !this.checked;
            }
            return this.value === "";
          }
          return false;
        },

        // If an element has a maximum allowed value length,
        // its dirty value flag is true, its value was last changed by a user
        // edit(as opposed to a change made by a script), and the JavaScript string length
        // of the element's API value is greater than the element's maximum allowed value length,
        // then the element is suffering from being too long.
        // jsdom has no way at the moment to emulate a user interaction, so tooLong/tooShort have
        // to be set to false.
        tooLong: () => false,

        tooShort: () => false,

        rangeOverflow: () => supportsRange() && this._maximum !== null && this._parsedValue > this._maximum,

        rangeUnderflow: () => supportsRange() && this._minimum !== null && this._parsedValue < this._minimum,

        patternMismatch: () => {
          if (this.hasAttribute("pattern")) {
            return this.value !== "" && !new RegExp(this.getAttribute("pattern")).test(this.value);
          }
          return false;
        },

        stepMismatch: () => {
          if (supportsRange() && this.hasAttribute("step")) {
            let number = this._parsedValue;
            if (typeof number !== "number" || this.value === "") {
              return false;
            }
            let step = parseFloatingPointNumber(this.getAttribute("step"));
            if (!isNaN(step)) {
              switch (this.type) {
                case "week":
                  number = parseWeekString(this.value).week - 1;
                  break;
                case "month":
                  number = parseMonthString(this.value).month - 1;
                  break;
                case "date":
                  number = parseDateString(this.value).day - 1;
                  break;
                case "datetime-local":
                case "datetime":
                case "time":
                  // The step is provided in seconds, convert to milliseconds
                  step *= 1000;
                  break;
              }
              return number % step !== 0;
            }
          }
          return false;
        },

        typeMismatch: () => {
          if (this.value === "") {
            return false;
          }
          if (this.type === "email") {
            return !isValidEmailAddress(this.value, this.hasAttribute("multiple"));
          } else if (this.type === "url") {
            return !isValidUrl(this.value);
          }
          return false;
        }
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
