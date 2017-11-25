"use strict";

const {
  isValidFloatingPointNumber,
  isValidSimpleColor,
  parseFloatingPointNumber,
  stripLeadingAndTrailingASCIIWhitespace,
  stripNewlines
} = require("./strings");
const {
  isValidDateString,
  isValidMonthString,
  isValidTimeString,
  isValidWeekString,
  parseLocalDateAndTimeString,
  serializeNormalizedDateAndTime
} = require("./dates-and-times");

const submittableLocalNames = new Set(["button", "input", "keygen", "object", "select", "textarea"]);

exports.isDisabled = formControl => {
  if (formControl.localName === "button" || formControl.localName === "input" || formControl.localName === "select" ||
      formControl.localName === "textarea") {
    if (formControl.hasAttribute("disabled")) {
      return true;
    }
  }

  let e = formControl.parentNode;
  while (e) {
    if (e.localName === "fieldset" && e.hasAttribute("disabled")) {
      const firstLegendElementChild = e.querySelector("legend");
      if (!firstLegendElementChild || !firstLegendElementChild.contains(formControl)) {
        return true;
      }
    }
    e = e.parentNode;
  }

  return false;
};

exports.isSubmittable = formControl => {
  // https://html.spec.whatwg.org/multipage/forms.html#category-submit
  return submittableLocalNames.has(formControl.localName);
};

exports.isButton = formControl => {
  // https://html.spec.whatwg.org/multipage/forms.html#concept-button
  return formControl.type === "button" || formControl.type === "submit" || formControl.type === "reset" ||
         formControl.type === "image" || formControl.localName === "button";
};

exports.normalizeToCRLF = string => {
  return string.replace(/\r([^\n])/g, "\r\n$1")
    .replace(/\r$/, "\r\n")
    .replace(/([^\r])\n/g, "$1\r\n")
    .replace(/^\n/, "\r\n");
};

exports.sanitizeValueByType = (input, val) => {
  switch (input.type.toLowerCase()) {
    case "password":
    case "search":
    case "tel":
    case "text":
      val = stripNewlines(val);
      break;

    case "color":
      // https://html.spec.whatwg.org/multipage/forms.html#color-state-(type=color):value-sanitization-algorithm
      val = isValidSimpleColor(val) ? val.toLowerCase() : "#000000";
      break;

    case "date":
      // https://html.spec.whatwg.org/multipage/input.html#date-state-(type=date):value-sanitization-algorithm
      if (!isValidDateString(val)) {
        val = "";
      }
      break;

    case "datetime-local": {
      // https://html.spec.whatwg.org/multipage/input.html#local-date-and-time-state-(type=datetime-local):value-sanitization-algorithm
      const dateAndTime = parseLocalDateAndTimeString(val);
      val = dateAndTime !== null ? serializeNormalizedDateAndTime(dateAndTime) : "";
      break;
    }

    case "email":
      // https://html.spec.whatwg.org/multipage/forms.html#e-mail-state-(type=email):value-sanitization-algorithm
      // https://html.spec.whatwg.org/multipage/forms.html#e-mail-state-(type=email):value-sanitization-algorithm-2
      if (input.hasAttribute("multiple")) {
        val = val.split(",").map(token => stripLeadingAndTrailingASCIIWhitespace(token)).join(",");
      } else {
        val = stripNewlines(val);
        val = stripLeadingAndTrailingASCIIWhitespace(val);
      }
      break;

    case "month":
      // https://html.spec.whatwg.org/multipage/input.html#month-state-(type=month):value-sanitization-algorithm
      if (!isValidMonthString(val)) {
        val = "";
      }
      break;

    case "number":
      // https://html.spec.whatwg.org/multipage/input.html#number-state-(type=number):value-sanitization-algorithm
      // TODO: using parseFloatingPointNumber in addition to isValidFloatingPointNumber to pass number.html WPT.
      // Possible spec bug.
      if (!isValidFloatingPointNumber(val) || isNaN(parseFloatingPointNumber(val))) {
        val = "";
      }
      break;

    case "range":
      // https://html.spec.whatwg.org/multipage/input.html#range-state-(type=range):value-sanitization-algorithm
      // TODO: using parseFloatingPointNumber in addition to isValidFloatingPointNumber to pass number.html WPT.
      // Possible spec bug.
      if (!isValidFloatingPointNumber(val) || isNaN(parseFloatingPointNumber(val))) {
        const minimum = input._minimum;
        const maximum = input._maximum;
        const defaultValue = maximum < minimum ? minimum : (minimum + maximum) / 2;
        val = `${defaultValue}`;
      }
      break;

    case "time":
      // https://html.spec.whatwg.org/multipage/input.html#time-state-(type=time):value-sanitization-algorithm
      if (!isValidTimeString(val)) {
        val = "";
      }
      break;

    case "url":
      // https://html.spec.whatwg.org/multipage/forms.html#url-state-(type=url):value-sanitization-algorithm
      val = stripNewlines(val);
      val = stripLeadingAndTrailingASCIIWhitespace(val);
      break;

    case "week":
      // https://html.spec.whatwg.org/multipage/input.html#week-state-(type=week):value-sanitization-algorithm
      if (!isValidWeekString(val)) {
        val = "";
      }
  }

  return val;
};
