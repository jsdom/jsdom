"use strict";

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
}
