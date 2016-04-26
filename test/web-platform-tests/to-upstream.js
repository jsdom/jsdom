"use strict";
const path = require("path");
const describe = require("mocha-sugar-free").describe;

const testsPath = path.resolve(__dirname, "to-upstream");
const runWebPlatformTest = require("./run-to-upstream-web-platform-test")(testsPath);

describe("Local tests in Web Platform Test format (to-upstream)", () => {
  // jscs:disable maximumLineLength
  [
    "dom/attributes-are-not-nodes.html",
    "dom/events/EventTarget-add-remove-listener.html",
    "dom/events/EventTarget-prototype-constructor.html",
    "dom/events/EventTarget-this-of-listener.html",
    "dom/nodes/Element-hasAttribute.html",
    "dom/nodes/Element-removeAttribute.html",
    "dom/nodes/Element-setAttribute.html",
    "dom/nodes/Element-tagName.html",
    "dom/nodes/Node-isEqualNode.html",
    "dom/nodes/Node-mutation-adoptNode.html",
    "dom/nodes/getElementsByClassName-32.html",
    "domparsing/insert-adjacent.html",
    "html/dom/elements/elements-in-the-dom/click-in-progress-flag.html",
    "html/editing/focus/focus-management/active-element.html",
    "html/semantics/forms/the-input-element/checkbox-click-events.html",
    "html/semantics/forms/the-input-element/disabled-checkbox.html",
    "html/semantics/forms/the-input-element/radio-input-cancel.html",
    "html/semantics/forms/the-label-element/proxy-click-to-associated-element.html",
    "html/semantics/forms/the-option-element/option-index.html",
    "html/semantics/forms/the-textarea-element/select.html",
    "html/semantics/forms/the-textarea-element/set-value-reset-selection.html",
    "html/semantics/forms/the-textarea-element/setRangeText.html",
    "html/semantics/forms/the-textarea-element/setSelectionRange.html",
    "html/semantics/links/links-created-by-a-and-area-elements/html-hyperlink-element-utils-href.html",
    "html/semantics/scripting-1/the-script-element/script-languages-02.html",
    "html/semantics/tabular-data/the-table-element/parentless-props.html",
    "html/webappapis/timers/arguments.html",
    "html/webappapis/timers/errors.html",
    "html/webappapis/timers/settimeout-setinterval-handles.html"
  ]
  .forEach(runWebPlatformTest);
});
