"use strict";
const selectorSyntax = require("../utils/selector-syntax.js");

exports.matchElementAgainstSelectors = matchElementAgainstSelectors;
exports.matchSlottedElementAgainstSelectors = matchSlottedElementAgainstSelectors;
exports.matchPartElementAgainstSelectors = matchPartElementAgainstSelectors;
exports.getPartExposures = require("../utils/parts.js").getPartExposures;
exports.matchPseudoElementAgainstSelectors = matchPseudoElementAgainstSelectors;
exports.matchTreesAgainstSelectors = matchTreesAgainstSelectors;
exports.getSelectorCandidateKeys = getSelectorCandidateKeys;
const nodeHelpers = require("../utils/dom.js");
const { getElementLanguageTag } = require("../../helpers/language.js");
const languageHelpers = require("../parse/language.js");
const valueHelpers = require("../values/value.js");
const { structural: structuralPseudoClasses } = require("../values/pseudos.js");
const serialization = require("../serialize.js");
const CSSPseudoElement = require("../../../../generated/idl/CSSPseudoElement.js");
const getDirectionality = require("../../helpers/directionality.js");
const strings = require("../utils/string.js");
const { hasAnOpaquePath, serializeURL, serializeURLOrigin } = require("whatwg-url");
const { isDisabled: isDisabledFormControl } = require("../../helpers/form-controls.js");
const { parseNonNegativeInteger } = require("../../helpers/strings.js");
const { XLINK_NS } = require("../../helpers/namespaces.js");
const { findFlattenedSlotables } = require("../../helpers/shadow-dom.js");
const {
  createHTMLCollectionByClassNames,
  createHTMLCollectionByNamespaceAndLocalName,
} = require("../../helpers/html-collections.js");
const emptyNamespaces = new Map();
const selectorPlans = new WeakMap();
const medias = ["audio", "video"];
const caseInsensitiveAttributes = [
  "accept",
  "accept-charset",
  "align",
  "alink",
  "axis",
  "bgcolor",
  "charset",
  "checked",
  "clear",
  "codetype",
  "color",
  "compact",
  "declare",
  "defer",
  "dir",
  "direction",
  "disabled",
  "enctype",
  "face",
  "frame",
  "hreflang",
  "http-equiv",
  "lang",
  "language",
  "link",
  "media",
  "method",
  "multiple",
  "nohref",
  "noresize",
  "noshade",
  "nowrap",
  "readonly",
  "rel",
  "rev",
  "rules",
  "scope",
  "scrolling",
  "selected",
  "shape",
  "target",
  "text",
  "type",
  "valign",
  "valuetype",
  "vlink",
];
const inputTypeAttributes = {
  button: [],
  checkbox: ["checked", "required"],
  color: ["autocomplete"],
  date: ["autocomplete", "max", "min", "readonly", "required"],
  "datetime-local": ["autocomplete", "max", "min", "readonly", "required"],
  email: ["autocomplete", "placeholder", "readonly", "required"],
  file: ["required"],
  hidden: ["autocomplete"],
  image: [],
  month: ["autocomplete", "max", "min", "readonly", "required"],
  number: ["autocomplete", "max", "min", "placeholder", "readonly", "required"],
  password: ["autocomplete", "placeholder", "readonly", "required"],
  radio: ["checked", "required"],
  range: ["autocomplete", "max", "min"],
  reset: [],
  search: ["autocomplete", "placeholder", "readonly", "required"],
  submit: [],
  tel: ["autocomplete", "placeholder", "readonly", "required"],
  text: ["autocomplete", "placeholder", "readonly", "required"],
  time: ["autocomplete", "max", "min", "readonly", "required"],
  url: ["autocomplete", "placeholder", "readonly", "required"],
  week: ["autocomplete", "max", "min", "readonly", "required"],
};

function createContext(tree, context = {}) {
  return {
    namespaces: emptyNamespaces,
    root: tree.getRootNode(),
    quirksMode: tree._ownerDocument.compatMode === "BackCompat",
    ...context,
  };
}

function createOptions(context, options = {}) {
  return {
    inclusive: context.scopes?.inclusive ?? false,
    limits: context.scopes?.limits,
    ...options,
  };
}

function isAnBTh(a, n, b) {
  if (a === 0) {
    return n === b;
  }
  if (a > 0) {
    return b <= n && (n - b) % a === 0;
  }
  return n <= b && (b - n) % -a === 0;
}

function isCaseInsensitiveAttribute({ localName, ownerElement }, modifier) {
  switch (modifier) {
    case "i":
      return true;
    case undefined:
      return (
        caseInsensitiveAttributes.includes(localName) &&
        nodeHelpers.isHTMLDocument(ownerElement.ownerDocument)
      );
    default:
      return false;
  }
}

// Pseudo matching utilities

function getMeterValueRegion({ high, low, max, min, optimum, value }) {
  if (optimum === low || optimum === high || (low < optimum && optimum < high)) {
    if (low <= value && value <= high) {
      return "optimal";
    }
    if (min <= value && value < low) {
      return "low";
    }
    if (high < value && value <= max) {
      return "high";
    }
    return "out-of-range";
  }
  if (optimum < low) {
    if (min <= value && value <= low) {
      return "optimal";
    }
    if (value <= max) {
      return "high";
    }
    return "out-of-range";
  }
  // high < optimum
  if (high <= value && value <= max) {
    return "optimal";
  }
  if (min <= value) {
    return "low";
  }
  return "out-of-range";
}

// https://drafts.csswg.org/css-view-transitions-2/#active-view-transition-pseudo
function hasActiveViewTransition(element, context) {
  return isRoot(element, context) && element.ownerDocument.activeViewTransition;
}

// https://drafts.csswg.org/css-view-transitions-2/#active-view-transition-type-pseudo
function hasActiveViewTransitionType(element, types, context) {
  const transition = hasActiveViewTransition(element, context);
  return (
    transition &&
    types.some((type) => transition.types.includes(serialization.serializeIdentifier(type)))
  );
}

// https://drafts.csswg.org/selectors-4/#dir-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-ltr
function hasDirection(element, direction) {
  return getDirectionality(element) === direction.value;
}

// https://drafts.csswg.org/selectors-4/#focus-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-focus
function hasFocus(element) {
  let focused = element._ownerDocument._lastFocusedElement;
  while (focused) {
    if (focused === element) {
      return !isNavigableContainer(element);
    }
    focused = focused.getRootNode()._host;
  }
  return false;
}

// https://drafts.csswg.org/selectors-4/#focus-visible-pseudo
function hasFocusVisible(element) {
  return hasFocus(element);
}

// https://drafts.csswg.org/selectors-4/#focus-within-pseudo
function hasFocusWithin(element) {
  for (
    let focused = element._ownerDocument._lastFocusedElement;
    focused;
    focused = focused._assignedSlot ?? focused.parentNode ?? focused._host
  ) {
    if (focused === element) {
      return true;
    }
  }
  return false;
}

// https://drafts.csswg.org/selectors-4/#lang-pseudo
// https://github.com/w3c/csswg-drafts/issues/8720
function hasLanguage(element, ranges) {
  let tag = getElementLanguageTag(element);
  if (tag === null) {
    return false;
  }
  if (tag === "") {
    return ranges.some((range) => range.value === "");
  }
  tag = languageHelpers.parseLanguageTag(tag);
  if (tag) {
    return ranges.some(({ value }) => {
      value &&= languageHelpers.parseLanguageTag(value, true);
      return value && languageHelpers.matchesLanguageRange(tag, value);
    });
  }
  return false;
}

// https://drafts.csswg.org/css-forms-1/#selectordef-high-value
// https://drafts.csswg.org/css-forms-1/#selectordef-low-value
// https://drafts.csswg.org/css-forms-1/#selectordef-optimal-value
function hasMeterValue(element, value) {
  return nodeHelpers.isHTMLElement(element, "meter") && getMeterValueRegion(element) === value;
}

// https://drafts.csswg.org/selectors-4/#has-pseudo
function hasRelativeMatching(element, selectors, context, options) {
  const selectorCache = (options.selectorCache ??= new Map());
  let cache = selectorCache.get(element);
  if (cache === undefined) {
    selectorCache.set(element, (cache = new Map()));
  }
  return selectors.some((selector) => {
    if (cache.has(selector)) {
      return cache.get(selector);
    }
    function matchRight(left, index = 0) {
      const unit = selector.units[index];
      for (const right of nodeHelpers.rightCombinedElements(left, unit.combinator, context)) {
        if (
          matchCompoundSelector(right, unit, context, options) &&
          (index + 1 === selector.units.length || matchRight(right, index + 1))
        ) {
          return true;
        }
      }
      return false;
    }
    const result = matchRight(element);
    cache.set(selector, result);
    return result;
  });
}

function hasSlotted(element) {
  return nodeHelpers.isHTMLElement(element, "slot") && findFlattenedSlotables(element).length > 0;
}

function haveSameType(a, b) {
  return a.localName === b.localName && a.namespaceURI === b.namespaceURI;
}

function isAnBOfSelector(element, { value: { a, b } }, selector, context, options, reverse) {
  if (selector === valueHelpers.omitted) {
    return isAnBTh(a, nodeHelpers.getElementSiblingIndex(element, false, reverse), b);
  }
  function predicate(sibling) {
    return selector[1].some((branch) => matchComplexSelector(sibling, branch, context, options));
  }
  const index = getSiblingIndex(element, selector, predicate, options, reverse);
  return index > 0 && isAnBTh(a, index, b);
}

function getSiblingIndex(element, key, predicate, options, reverse) {
  const parent = element.parentNode;
  if (parent === null) {
    return predicate(element) ? 1 : 0;
  }
  const siblingIndexes = (options.siblingIndexes ??= new Map());
  let indexes = siblingIndexes.get(parent);
  if (indexes === undefined) {
    indexes = new Map();
    siblingIndexes.set(parent, indexes);
  }
  let directions = indexes.get(key);
  if (directions === undefined) {
    directions = {};
    indexes.set(key, directions);
  }
  const direction = reverse ? "reverse" : "forward";
  let siblings = directions[direction];
  if (siblings === undefined) {
    siblings = {
      next: reverse ? parent.lastChild : parent.firstChild,
      count: 0,
      indexes: new Map(),
    };
    directions[direction] = siblings;
  }
  const cached = siblings.indexes.get(element);
  if (cached !== undefined) {
    return cached;
  }
  while (siblings.next !== null) {
    const child = siblings.next;
    siblings.next = reverse ? child.previousSibling : child.nextSibling;
    if (child.nodeType === 1) {
      const index = predicate(child) ? ++siblings.count : 0;
      siblings.indexes.set(child, index);
      if (child === element) {
        return index;
      }
    }
  }
  return 0;
}

function isAnBOfType(element, { value: { a, b } }, reverse) {
  return isAnBTh(a, nodeHelpers.getElementSiblingIndex(element, true, reverse), b);
}

// https://drafts.csswg.org/css-nesting-1/#selectordef-
function isAnchor(element, context) {
  if (context.nesting) {
    return (
      matchElementAgainstSelectors(element, context.nesting.selectors, context.nesting.context) !==
      null
    );
  }
  return context.anchors?.includes(element) ?? isScopingRoot(element, context);
}

// https://drafts.csswg.org/selectors-4/#any-link-pseudo
// https://drafts.csswg.org/selectors-4/#link-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-link
function isAnyLink(element) {
  if (nodeHelpers.isHTMLElement(element, "a", "area")) {
    return element.hasAttributeNS(null, "href");
  }
  return (
    nodeHelpers.isSVGElement(element, "a") &&
    (element.hasAttributeNS(null, "href") || element.hasAttributeNS(XLINK_NS, "href"))
  );
}

// https://drafts.csswg.org/selectors-5/#blank-pseudo
function isBlank(element) {
  if (nodeHelpers.isHTMLElement(element, "input")) {
    switch (element.type) {
      case "button":
      case "image":
      case "reset":
      case "submit":
        return false;
      case "checkbox":
      case "radio":
        return !element.checked;
    }
    return element.value === "";
  }
  if (nodeHelpers.isHTMLElement(element, "select")) {
    return element.selectedIndex === -1;
  }
  if (nodeHelpers.isHTMLElement(element, "textarea")) {
    return element.value === "";
  }
  return false;
}

// https://drafts.csswg.org/selectors-4/#selectordef-buffering
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-buffering
function isBuffering(element) {
  return (
    nodeHelpers.isHTMLElement(element, ...medias) &&
    !element.paused &&
    element.networkState === 2 &&
    element.readyState <= 2
  );
}

// https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#candidate-for-constraint-validation
function isCandidateForConstraintValidation(element) {
  return element.willValidate === true;
}

// https://drafts.csswg.org/selectors-4/#checked-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-checked
function isChecked(element) {
  if (nodeHelpers.isHTMLElement(element, "input")) {
    return element.checked && inputTypeAttributes[element.type].includes("checked");
  }
  if (nodeHelpers.isHTMLElement(element, "option")) {
    return element.selected;
  }
  return false;
}

// https://drafts.csswg.org/selectors-4/#default-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-default
function isDefault(element) {
  if (
    nodeHelpers.isHTMLElement(element, "input") &&
    inputTypeAttributes[element.type].includes("checked")
  ) {
    return element.hasAttributeNS(null, "checked");
  }
  if (nodeHelpers.isHTMLElement(element, "option")) {
    return element.hasAttributeNS(null, "selected");
  }
  if (element.form) {
    for (const child of nodeHelpers.traverse(element.getRootNode({}))) {
      if (child.form === element.form && isSubmitButton(child)) {
        return element === child;
      }
    }
  }
  return false;
}

// https://drafts.csswg.org/selectors-4/#disabled-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-disabled
function isDisabled(element) {
  if (element._ceState === "custom" && element._ceDefinition.formAssociated) {
    return element.hasAttributeNS(null, "disabled") || isDisabledFormControl(element);
  }
  if (nodeHelpers.isHTMLElement(element, "optgroup")) {
    return element.hasAttributeNS(null, "disabled");
  }
  if (nodeHelpers.isHTMLElement(element, "option")) {
    if (element.hasAttributeNS(null, "disabled")) {
      return true;
    }
    const group = nodeHelpers.findAncestorElement(
      element,
      (ancestor) => nodeHelpers.isHTMLElement(ancestor, "optgroup"),
      (ancestor) => nodeHelpers.isHTMLElement(ancestor, "datalist", "hr", "option", "select"),
    );
    return group?.hasAttributeNS(null, "disabled");
  }
  if (nodeHelpers.isHTMLElement(element, "fieldset")) {
    return element.hasAttributeNS(null, "disabled") || isDisabledFormControl(element);
  }
  if (nodeHelpers.isHTMLElement(element, "button", "input", "select", "textarea")) {
    return isDisabledFormControl(element);
  }
  return false;
}

// https://drafts.csswg.org/selectors-4/#empty-pseudo
function isEmpty(element) {
  for (const child of element._children()) {
    if (
      child.nodeType === 1 ||
      ((child.nodeType === 3 || child.nodeType === 4) && child.data.length > 0)
    ) {
      return false;
    }
  }
  return true;
}

// https://drafts.csswg.org/selectors-4/#enabled-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-enabled
function isEnabled(element) {
  const isFormControl = nodeHelpers.isHTMLElement(
    element,
    "button",
    "fieldset",
    "input",
    "optgroup",
    "option",
    "select",
    "textarea",
  );
  return (
    (isFormControl || (element._ceState === "custom" && element._ceDefinition.formAssociated)) &&
    !isDisabled(element)
  );
}

// https://drafts.csswg.org/selectors-4/#first-child-pseudo
function isFirstChild(element) {
  return !element.previousElementSibling;
}

// https://drafts.csswg.org/selectors-4/#first-of-type-pseudo
function isFirstOfType(element) {
  return !nodeHelpers.findPreviousSiblingElement(element, (sibling) =>
    haveSameType(element, sibling),
  );
}

// https://drafts.csswg.org/selectors-4/#selectordef-fullscreen
// https://fullscreen.spec.whatwg.org/#:fullscreen-pseudo-class
function isFullscreen(element) {
  return element === element.getRootNode({}).fullscreenElement;
}

// https://drafts.csswg.org/selectors-5/#heading-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-heading
function isHeading(element) {
  return nodeHelpers.isHTMLElement(element, "h1", "h2", "h3", "h4", "h5", "h6");
}

// https://drafts.csswg.org/selectors-5/#heading-functional-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-heading-functional
function isHeadingLevel(element, levels) {
  if (isHeading(element)) {
    let level = Number(element._localName[1]);
    for (let ancestor = element; ancestor; ancestor = nodeHelpers.getParentElement(ancestor)) {
      if (nodeHelpers.isHTMLElement(ancestor)) {
        const offset = ancestor.getAttributeNS(null, "headingoffset");
        if (offset !== null) {
          level += parseNonNegativeInteger(offset) ?? 0;
        }
        if (ancestor.hasAttributeNS(null, "headingreset")) {
          break;
        }
      }
    }
    level = Math.min(level, 9);
    return levels.some((number) => number.value === level);
  }
  return false;
}

// https://drafts.csswg.org/css-shadow-1/#selectordef-host
function isHost(element, context) {
  return element === context.root.host;
}

// https://drafts.csswg.org/css-shadow-1/#selectordef-host-function
function isHostMatching(element, selector, context, options) {
  return (
    isHost(element, context) &&
    matchCompoundSelector(
      element,
      selector,
      {
        ...context,
        root: element.getRootNode({}),
      },
      options,
    )
  );
}

// https://drafts.csswg.org/css-shadow-1/#selectordef-host-context
function isHostContextMatching(element, selector, context, options) {
  if (isHost(element, context)) {
    context = {
      ...context,
      root: element.getRootNode({}),
    };
    return (
      matchCompoundSelector(element, selector, context, options) ||
      nodeHelpers.findAncestorElement(element, (ancestor) =>
        matchCompoundSelector(ancestor, selector, context, options),
      )
    );
  }
  return false;
}

// https://drafts.csswg.org/selectors-4/#in-range-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-in-range
function isInRange(element) {
  return (
    isRangeLimited(element) &&
    isCandidateForConstraintValidation(element) &&
    !element.validity.rangeOverflow &&
    !element.validity.rangeUnderflow
  );
}

// https://drafts.csswg.org/selectors-4/#indeterminate-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-indeterminate
function isIndeterminate(element) {
  if (nodeHelpers.isHTMLElement(element, "progress")) {
    return !element.hasAttributeNS(null, "value");
  }
  if (nodeHelpers.isHTMLElement(element, "input")) {
    if (element.type === "checkbox") {
      return element.indeterminate;
    }
    if (element.type === "radio") {
      return !element._someInRadioGroup("checked");
    }
  }
  return false;
}

// https://drafts.csswg.org/selectors-4/#invalid-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-invalid
function isInvalid(element) {
  if (nodeHelpers.isHTMLElement(element, "form", "fieldset")) {
    const controls = nodeHelpers.isHTMLElement(element, "form")
      ? element._getElementNodes()
      : element._descendants();
    for (const control of controls) {
      if (isCandidateForConstraintValidation(control) && !control.validity.valid) {
        return true;
      }
    }
    return false;
  }
  return isCandidateForConstraintValidation(element) && !element.validity.valid;
}

// https://drafts.csswg.org/selectors-4/#last-child-pseudo
function isLastChild(element) {
  return !element.nextElementSibling;
}

// https://drafts.csswg.org/selectors-4/#last-of-type-pseudo
function isLastOfType(element) {
  return !nodeHelpers.findNextSiblingElement(element, (sibling) => haveSameType(element, sibling));
}

// https://drafts.csswg.org/selectors-5/#local-link-pseudo
function isLocalLink(element, level) {
  if (!isAnyLink(element)) {
    return false;
  }
  const document = element._ownerDocument;
  const href = element.getAttributeNS(null, "href") ?? element.getAttributeNS(XLINK_NS, "href");
  const link = document.encodingParseAURL(href);
  if (link === null) {
    return false;
  }
  const current = document._URL;
  if (level === undefined) {
    return serializeURL(current, true) === serializeURL(link, true);
  }
  if (hasAnOpaquePath(current) || hasAnOpaquePath(link)) {
    return false;
  }
  const origin = serializeURLOrigin(current);
  if (origin === "null" || origin !== serializeURLOrigin(link)) {
    return false;
  }
  const count = level.value;
  return (
    current.path.length >= count &&
    link.path.length >= count &&
    current.path.slice(0, count).every((segment, index) => segment === link.path[index])
  );
}

// https://drafts.csswg.org/selectors-4/#matches-pseudo
// https://drafts.csswg.org/selectors-4/#where-pseudo
function isMatching(element, selectors, context, options) {
  return selectors.some(
    (selector) =>
      selector.kind !== "invalid-selector" &&
      matchComplexSelector(element, selector, context, options, true),
  );
}

function isModal(element) {
  return isFullscreen(element);
}

// https://drafts.csswg.org/selectors-4/#selectordef-muted
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-muted
function isMuted(element) {
  return nodeHelpers.isHTMLElement(element, ...medias) && element.muted;
}

// https://html.spec.whatwg.org/multipage/document-sequences.html#navigable-container
function isNavigableContainer(element) {
  return nodeHelpers.isHTMLElement(element, "frame", "iframe", "embed", "object");
}

// https://drafts.csswg.org/selectors-4/#only-child-pseudo
function isOnlyChild(element) {
  return isFirstChild(element) && isLastChild(element);
}

// https://drafts.csswg.org/selectors-4/#only-of-type-pseudo
function isOnlyOfType(element) {
  return isFirstOfType(element) && isLastOfType(element);
}

// https://drafts.csswg.org/selectors-4/#selectordef-open
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-open
function isOpen(element) {
  return (
    element.hasAttributeNS(null, "open") && nodeHelpers.isHTMLElement(element, "details", "dialog")
  );
}

// https://drafts.csswg.org/selectors-4/#optional-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-optional
function isOptional(element) {
  if (nodeHelpers.isHTMLElement(element, "input")) {
    return (
      !element.hasAttributeNS(null, "required") &&
      inputTypeAttributes[element.type].includes("required")
    );
  }
  if (nodeHelpers.isHTMLElement(element, "select", "textarea")) {
    return !element.hasAttributeNS(null, "required");
  }
  return false;
}

// https://drafts.csswg.org/selectors-4/#out-of-range-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-out-of-range
function isOutOfRange(element) {
  return (
    isRangeLimited(element) &&
    isCandidateForConstraintValidation(element) &&
    (element.validity.rangeOverflow || element.validity.rangeUnderflow)
  );
}

// https://drafts.csswg.org/selectors-4/#selectordef-paused
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-paused
function isPaused(element) {
  return nodeHelpers.isHTMLElement(element, ...medias) && element.paused;
}

// https://drafts.csswg.org/selectors-4/#selectordef-picture-in-picture
// https://w3c.github.io/picture-in-picture/#css-pseudo-class
function isPictureInPicture(element) {
  return element === element.getRootNode({}).pictureInPictureElement;
}

// https://drafts.csswg.org/selectors-4/#placeholder-shown-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-placeholder-shown
function isShowingPlaceholder(element) {
  if (nodeHelpers.isHTMLElement(element, "input")) {
    return (
      inputTypeAttributes[element.type].includes("placeholder") &&
      element.value === "" &&
      element.hasAttributeNS(null, "placeholder")
    );
  }
  if (nodeHelpers.isHTMLElement(element, "textarea")) {
    return element.value === "" && element.hasAttributeNS(null, "placeholder");
  }
  return false;
}

// https://drafts.csswg.org/selectors-4/#selectordef-playing
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-playing
function isPlaying(element) {
  return nodeHelpers.isHTMLElement(element, ...medias) && !element.paused;
}

// https://html.spec.whatwg.org/multipage/input.html#have-range-limitations
function isRangeLimited(element) {
  return (
    nodeHelpers.isHTMLElement(element, "input") &&
    inputTypeAttributes[element.type].includes("min") &&
    (element.type === "range" ||
      element.hasAttributeNS(null, "min") ||
      element.hasAttributeNS(null, "max"))
  );
}

// https://drafts.csswg.org/selectors-4/#read-only-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-read-only
function isReadOnly(element) {
  return !isReadWrite(element);
}

// https://drafts.csswg.org/selectors-4/#read-write-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-read-write
function isReadWrite(element) {
  if (nodeHelpers.isHTMLElement(element, "input")) {
    return (
      !element.hasAttributeNS(null, "readonly") &&
      isEnabled(element) &&
      inputTypeAttributes[element.type].includes("readonly")
    );
  }
  if (nodeHelpers.isHTMLElement(element, "textarea")) {
    return !element.hasAttributeNS(null, "readonly") && isEnabled(element);
  }
  for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
    const value = ancestor.getAttributeNS(null, "contenteditable");
    if (value !== null) {
      const state = strings.toLowerCase(value);
      if (state === "" || state === "true" || state === "plaintext-only") {
        return true;
      }
      if (state === "false") {
        return false;
      }
    }
  }
  return false;
}

// https://drafts.csswg.org/selectors-4/#required-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-required
function isRequired(element) {
  if (nodeHelpers.isHTMLElement(element, "input")) {
    return (
      element.hasAttributeNS(null, "required") &&
      inputTypeAttributes[element.type].includes("required")
    );
  }
  if (nodeHelpers.isHTMLElement(element, "select", "textarea")) {
    return element.hasAttributeNS(null, "required");
  }
  return false;
}

// https://drafts.csswg.org/selectors-4/#root-pseudo
function isRoot(element, context) {
  return element === context.root.documentElement;
}

// https://drafts.csswg.org/selectors-4/#scope-pseudo
function isScopingRoot(element, { root, scopes }) {
  if (scopes) {
    return scopes.roots.some((scope) => scope === element || scope.documentElement === element);
  }
  return element === (root.host ?? root.documentElement);
}

// https://drafts.csswg.org/selectors-4/#selectordef-seeking
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-seeking
function isSeeking(element) {
  return nodeHelpers.isHTMLElement(element, ...medias) && element.seeking;
}

// https://html.spec.whatwg.org/multipage/forms.html#concept-submit-button
function isSubmitButton(element) {
  return (
    (nodeHelpers.isHTMLElement(element, "button") && element.type === "submit") ||
    (nodeHelpers.isHTMLElement(element, "input") &&
      (element.type === "image" || element.type === "submit"))
  );
}

// https://drafts.csswg.org/selectors-4/#target-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-target
function isTarget(element) {
  return element === element._ownerDocument._targetElement;
}

// https://drafts.csswg.org/selectors-4/#unchecked-pseudo
function isUnchecked(element) {
  if (nodeHelpers.isHTMLElement(element, "input")) {
    return !element.checked && inputTypeAttributes[element.type].includes("checked");
  }
  if (nodeHelpers.isHTMLElement(element, "option")) {
    return !element.selected;
  }
  return false;
}

// https://drafts.csswg.org/selectors-4/#valid-pseudo
// https://html.spec.whatwg.org/multipage/semantics-other.html#selector-valid
function isValid(element) {
  if (nodeHelpers.isHTMLElement(element, "form", "fieldset")) {
    return !isInvalid(element);
  }
  return isCandidateForConstraintValidation(element) && element.validity.valid;
}

// Match against selectors

function matchPseudoClassSelector(element, { name, value }, context, options) {
  if (
    context.elementBacked &&
    Object.hasOwn(structuralPseudoClasses, name === undefined ? value : `${name}()`)
  ) {
    return false;
  }
  // Part and slotted aliases supply real elements. Other pseudo-elements have no
  // rendered interaction or tree state; only logical combinations can match them.
  if (element.nodeType !== 1 && name !== "is" && name !== "not" && name !== "where") {
    return false;
  }
  switch (name) {
    case undefined:
      break;
    case "active-view-transition-type":
      return hasActiveViewTransitionType(element, value, context);
    case "dir":
      return hasDirection(element, value);
    case "has":
      return hasRelativeMatching(element, value, context, options);
    case "host":
      return isHostMatching(element, value, context, options);
    case "host-context":
      return isHostContextMatching(element, value, context, options);
    case "heading":
      return isHeadingLevel(element, value);
    case "is":
      return isMatching(element, value, context, options);
    case "lang":
      return hasLanguage(element, value);
    case "local-link":
      return isLocalLink(element, value);
    case "not":
      return !isMatching(element, value, context, options);
    case "nth-child":
      return isAnBOfSelector(element, ...value, context, options);
    case "nth-last-child":
      return isAnBOfSelector(element, ...value, context, options, true);
    case "nth-last-of-type":
      return isAnBOfType(element, value, true);
    case "nth-of-type":
      return isAnBOfType(element, value);
    case "where":
      return isMatching(element, value, context, options);
    default:
      return false;
  }
  switch (value) {
    case "active-view-transition":
      return hasActiveViewTransition(element, context);
    case "any-link":
      return isAnyLink(element);
    case "blank":
      return isBlank(element);
    case "buffering":
      return isBuffering(element);
    case "checked":
      return isChecked(element);
    case "default":
      return isDefault(element);
    case "defined":
      return element._ceState === "uncustomized" || element._ceState === "custom";
    case "disabled":
      return isDisabled(element);
    case "empty":
      return isEmpty(element);
    case "enabled":
      return isEnabled(element);
    case "focus":
      return hasFocus(element);
    case "focus-visible":
      return hasFocusVisible(element);
    case "focus-within":
      return hasFocusWithin(element);
    case "first-child":
      return isFirstChild(element);
    case "first-of-type":
      return isFirstOfType(element);
    case "fullscreen":
      return isFullscreen(element);
    case "has-slotted":
      return hasSlotted(element);
    case "high-value":
      return hasMeterValue(element, "high");
    case "heading":
      return isHeading(element);
    case "host":
      return isHost(element, context);
    case "in-range":
      return isInRange(element);
    case "indeterminate":
      return isIndeterminate(element);
    case "invalid":
      return isInvalid(element);
    case "last-child":
      return isLastChild(element);
    case "last-of-type":
      return isLastOfType(element);
    case "link":
      return isAnyLink(element);
    case "local-link":
      return isLocalLink(element);
    case "low-value":
      return hasMeterValue(element, "low");
    case "modal":
      return isModal(element);
    case "muted":
      return isMuted(element);
    case "only-child":
      return isOnlyChild(element);
    case "only-of-type":
      return isOnlyOfType(element);
    case "open":
      return isOpen(element);
    case "optimal-value":
      return hasMeterValue(element, "optimal");
    case "optional":
      return isOptional(element);
    case "out-of-range":
      return isOutOfRange(element);
    case "paused":
      return isPaused(element);
    case "placeholder-shown":
      return isShowingPlaceholder(element);
    case "playing":
      return isPlaying(element);
    case "picture-in-picture":
      return isPictureInPicture(element);
    case "read-only":
      return isReadOnly(element);
    case "read-write":
      return isReadWrite(element);
    case "required":
      return isRequired(element);
    case "root":
      return isRoot(element, context);
    case "scope":
      return isScopingRoot(element, context);
    case "seeking":
      return isSeeking(element);
    case "target":
      return isTarget(element);
    case "unchecked":
      return isUnchecked(element);
    case "valid":
      return isValid(element);
    default:
      return false;
  }
}

function matchPseudoCompoundSelector(element, pseudo, context, options) {
  const wildcard =
    pseudo.name === "highlight"
      ? valueHelpers.isDelimiter("*", pseudo.value)
      : pseudo.value?.types?.includes("<pt-name-and-class-selector>") &&
        valueHelpers.isDelimiter("*", pseudo.value[0]) &&
        valueHelpers.isOmitted(pseudo.value[1]);
  return (
    (wildcard
      ? element.type === `::${pseudo.name}`
      : element.selectorText === serialization.serializeComponentValue(pseudo)) &&
    (pseudo.classes === null ||
      pseudo.classes.every((selector) =>
        matchPseudoClassSelector(element, selector, context, options),
      ))
  );
}

function matchPseudoCompoundSelectors(element, pseudos, context, options, start = 0) {
  if (pseudos) {
    for (let index = pseudos.length - 1; index >= start; --index) {
      if (
        !CSSPseudoElement.isImpl(element) ||
        !matchPseudoCompoundSelector(element, pseudos[index], context, options)
      ) {
        return false;
      }
      element = element.parent;
    }
  }
  return element.nodeType === 1;
}

function matchPseudoElementAgainstComplexSelector(element, selector, context, options) {
  const subject = subjectCompound(selector);
  return (
    matchPseudoCompoundSelectors(element, subject.pseudos, context, options) &&
    matchComplexSelector(
      element.element,
      selectorSyntax.withoutSubjectPseudos(selector),
      context,
      options,
    )
  );
}

function matchPseudoElementAgainstSelectors(element, selectors, context, options) {
  context = createContext(element.element, context);
  options = createOptions(context, options);
  if (options.all) {
    return selectors.filter((selector) =>
      matchPseudoElementAgainstComplexSelector(element, selector, context, options),
    );
  }
  return (
    selectors.find((selector) => {
      return matchPseudoElementAgainstComplexSelector(element, selector, context, options);
    }) ?? null
  );
}

function matchAttributeValueSelector(actual, matcher, expected) {
  switch (serialization.serializeComponentValue(matcher)) {
    case "*=":
      return expected && actual.includes(expected);
    case "^=":
      return expected && actual.startsWith(expected);
    case "=":
      return expected === actual;
    case "|=":
      return expected === actual || actual.startsWith(`${expected}-`);
    case "~=":
      return expected && actual.split(/[\t\n\f\r ]+/).some((word) => word === expected);
    case "$=":
      return expected && actual.endsWith(expected);
    default:
      return false;
  }
}

// https://html.spec.whatwg.org/multipage/semantics-other.html#case-sensitivity-of-selectors
function* matchAttributeNameSelector(element, [prefix, name], { namespaces }) {
  const wildcard = prefix !== valueHelpers.omitted && valueHelpers.isDelimiter("*", prefix[0]);
  prefix = prefix === valueHelpers.omitted ? null : (prefix[0].value ?? null);
  name = name.value;
  if (nodeHelpers.isHTMLElement(element) && nodeHelpers.isHTMLDocument(element._ownerDocument)) {
    name = strings.toLowerCase(name);
  }
  if (wildcard) {
    for (const attribute of element._attributeList) {
      if (attribute.localName === name) {
        yield attribute;
      }
    }
    return;
  }
  const namespace = prefix === null ? null : namespaces.get(prefix);
  const attribute = element.getAttributeNodeNS(namespace, name);
  if (attribute !== null) {
    yield attribute;
  }
}

function matchAttributeSelector(element, { value: selector }, context) {
  if (selector.types.at(-1) === "<wq-name>") {
    return !matchAttributeNameSelector(element, selector, context).next().done;
  }
  const [name, matcher, { value: specified }, { value: modifier }] = selector;
  const lowercase = strings.toLowerCase(specified);
  for (const attribute of matchAttributeNameSelector(element, name, context)) {
    let expected, actual;
    if (
      modifier === "i" ||
      (modifier === undefined &&
        attribute.namespaceURI === null &&
        nodeHelpers.isHTMLElement(element) &&
        isCaseInsensitiveAttribute(attribute, modifier))
    ) {
      expected = lowercase;
      actual = strings.toLowerCase(attribute.value);
    } else {
      expected = specified;
      actual = attribute.value;
    }
    if (matchAttributeValueSelector(actual, matcher, expected)) {
      return true;
    }
  }
  return false;
}

function matchIdentifier(actual, expected, context) {
  return (
    actual !== null &&
    (context.quirksMode
      ? strings.toLowerCase(actual) === strings.toLowerCase(expected)
      : actual === expected)
  );
}

function matchClassSelector(element, expected, context) {
  if (!context.quirksMode) {
    return element.classList.contains(expected);
  }
  const classes = element.getAttributeNS(null, "class");
  return (
    classes !== null &&
    classes.split(/[\t\n\f\r ]+/).some((value) => matchIdentifier(value, expected, context))
  );
}

function matchSubclassSelector(element, selector, context, options) {
  for (const subclass of selector) {
    let matches;
    switch (subclass.kind) {
      case "nesting":
        matches = isAnchor(element, context);
        break;
      case "id":
        matches = matchIdentifier(element.getAttributeNS(null, "id"), subclass.value, context);
        break;
      case "class":
        matches = matchClassSelector(element, subclass.value, context);
        break;
      case "attribute":
        matches = matchAttributeSelector(element, subclass, context);
        break;
      default:
        matches = matchPseudoClassSelector(element, subclass, context, options);
    }
    if (!matches) {
      return false;
    }
  }
  return true;
}

function matchTypeNameSelector(element, { value: selector, universal }) {
  if (nodeHelpers.isHTMLElement(element) && nodeHelpers.isHTMLDocument(element.ownerDocument)) {
    selector = strings.toLowerCase(selector);
  }
  return universal || selector === element.localName;
}

function matchTypeNamespacePrefixSelector(element, prefix, { namespaces }) {
  if (prefix === undefined) {
    return !namespaces.has("") || (namespaces.get("") || null) === element._namespaceURI;
  }
  return (
    prefix === null ||
    (prefix === "" ? null : namespaces.get(prefix) || null) === element._namespaceURI
  );
}

function matchTypeSelector(element, selector, context, ignoreDefaultNamespace) {
  if (selector === null) {
    return (
      ignoreDefaultNamespace ||
      isHost(element, context) ||
      matchTypeNamespacePrefixSelector(element, undefined, context)
    );
  }
  if (selector.kind === "nesting") {
    return isAnchor(element, context);
  }
  if (isHost(element, context)) {
    return false;
  }
  return (
    matchTypeNamespacePrefixSelector(element, selector.prefix, context) &&
    matchTypeNameSelector(element, selector)
  );
}

function canMatchShadowHost(selector, context) {
  if (selector.kind !== "compound" || selector.pseudos) {
    return false;
  }
  const { type, subclasses } = selector;
  let hasAllowedSelector = false;
  if (type !== null) {
    if (
      type.kind !== "nesting" ||
      !context.nesting ||
      !context.nesting.selectors.some((branch) =>
        canMatchShadowHost(subjectCompound(branch), context.nesting.context),
      )
    ) {
      return false;
    }
    hasAllowedSelector = true;
  }
  for (const subclass of subclasses) {
    if (subclass.kind !== "pseudo-class") {
      return false;
    }
    const { name, value } = subclass;
    if (name === "has") {
      continue;
    }
    if (name === "host" || name === "host-context" || (name === undefined && value === "host")) {
      hasAllowedSelector = true;
      continue;
    }
    if (
      (name === "is" || name === "not" || name === "where") &&
      value.some((branch) => {
        return (
          branch.kind !== "invalid-selector" && canMatchShadowHost(subjectCompound(branch), context)
        );
      })
    ) {
      hasAllowedSelector = true;
      continue;
    }
    return false;
  }
  return hasAllowedSelector;
}

function subjectCompound(selector) {
  return selector.units[selector.units.length - 1];
}

function matchCompoundSelector(element, selector, context, options, ignoreDefaultNamespace) {
  if (selector.pseudos !== undefined) {
    if (!matchPseudoCompoundSelectors(element, selector.pseudos, context, options)) {
      return false;
    }
    element = element.nodeType === 1 ? element : element.element;
  }
  const { type, subclasses } = selector;
  if (type === null && subclasses.length === 0) {
    return (
      !isHost(element, context) && matchTypeNamespacePrefixSelector(element, undefined, context)
    );
  }
  if (isHost(element, context) && !canMatchShadowHost(selector, context)) {
    return false;
  }
  return (
    matchTypeSelector(element, type, context, ignoreDefaultNamespace) &&
    matchSubclassSelector(element, subclasses, context, options)
  );
}

function createComplexSelectorMatcher(selector, context, options, ignoreDefaultNamespace) {
  const { units } = selector;
  if (units.length === 1) {
    return (element) =>
      matchCompoundSelector(element, units[0], context, options, ignoreDefaultNamespace);
  }
  let prefixes;
  if (options.prefixMatches !== undefined) {
    let selectors = options.prefixMatches.get(context);
    if (selectors === undefined) {
      selectors = new Map();
      options.prefixMatches.set(context, selectors);
    }
    prefixes = selectors.get(selector);
    if (prefixes === undefined) {
      prefixes = Array.from({ length: units.length - 1 }, () => new Map());
      selectors.set(selector, prefixes);
    }
  }
  function matchLeft(right, index = units.length - 1) {
    const cache = prefixes?.[index];
    const cached = cache?.get(right);
    if (cached !== undefined) {
      return cached;
    }
    let result = false;
    if (index === 0) {
      result = matchCompoundSelector(right, units[0], context, options);
    } else {
      const compound = units[index];
      const relation = compound.combinator;
      const ignoreSubjectNamespace = ignoreDefaultNamespace && index === units.length - 1;
      if (
        matchCompoundSelector(right, compound, context, options, ignoreSubjectNamespace) &&
        right !== context.root._host &&
        (relation === null || (typeof relation === "string" && relation !== "||"))
      ) {
        if (relation === "+" || relation === "~") {
          for (let left = right.previousElementSibling; left; left = left.previousElementSibling) {
            if (matchLeft(left, index - 1)) {
              result = true;
              break;
            }
            if (relation === "+") {
              break;
            }
          }
        } else {
          for (let parent = right.parentNode; parent; parent = parent.parentNode) {
            let left = parent;
            if (parent.nodeType !== 1) {
              left = parent === context.root ? parent._host : null;
            }
            if (!left) {
              break;
            }
            if (matchLeft(left, index - 1)) {
              result = true;
              break;
            }
            if (relation === ">" || left === context.root._host) {
              break;
            }
          }
        }
      }
    }
    cache?.set(right, result);
    return result;
  }
  return matchLeft;
}

function matchComplexSelector(element, selector, context, options, ignoreDefaultNamespace) {
  if (selector.units.length === 1) {
    return matchCompoundSelector(
      element,
      selector.units[0],
      context,
      options,
      ignoreDefaultNamespace,
    );
  }
  return createComplexSelectorMatcher(selector, context, options, ignoreDefaultNamespace)(element);
}

function matchElementAgainstSelectors(element, selectors, context, options) {
  context = createContext(element, context);
  options = createOptions(context, options);
  if (options.all) {
    return selectors.filter((selector) =>
      matchComplexSelector(element, selector, context, options),
    );
  }
  return (
    selectors.find((selector) => matchComplexSelector(element, selector, context, options)) ?? null
  );
}

// `::slotted()` aliases the assigned element, but selectors before it match the slot.
function matchSlottedElementAgainstSelectors(element, selectors, context, options) {
  const origin = element.nodeType === 1 ? element : element.element;
  context = createContext(origin, context);
  options = createOptions(context, options);
  let slot = origin._assignedSlot;
  while (slot && slot.getRootNode() !== context.root) {
    slot = slot._assignedSlot;
  }
  if (!slot) {
    return options.all ? [] : null;
  }
  const elementContext = { ...context, root: origin.getRootNode() };
  function matches(selector) {
    const { pseudos } = subjectCompound(selector);
    if (!pseudos) {
      return false;
    }
    const { name, value, classes } = pseudos[0];
    if (
      name !== "slotted" ||
      !matchPseudoCompoundSelectors(element, pseudos, elementContext, options, 1) ||
      !matchCompoundSelector(origin, value, elementContext, options) ||
      (classes !== null &&
        !classes.every((pseudo) => {
          return matchPseudoClassSelector(origin, pseudo, elementContext, options);
        }))
    ) {
      return false;
    }
    return matchComplexSelector(
      slot,
      selectorSyntax.withoutSubjectPseudos(selector),
      context,
      options,
    );
  }
  return options.all ? selectors.filter(matches) : (selectors.find(matches) ?? null);
}

function matchPartElementAgainstSelectors(element, selectors, context, options) {
  const origin = element.nodeType === 1 ? element : element.element;
  context = createContext(origin, context);
  options = createOptions(context, options);
  const elementContext = { ...context, root: origin.getRootNode(), elementBacked: true };
  function matches(selector) {
    const { pseudos } = subjectCompound(selector);
    if (!pseudos) {
      return false;
    }
    const { name, value, classes } = pseudos[0];
    if (
      name !== "part" ||
      !matchPseudoCompoundSelectors(element, pseudos, elementContext, options, 1) ||
      (classes !== null &&
        !classes.every((pseudo) => {
          return matchPseudoClassSelector(origin, pseudo, elementContext, options);
        }))
    ) {
      return false;
    }
    const hostSelector = selectorSyntax.withoutSubjectPseudos(selector);
    return context.parts.some(
      ({ host, names }) =>
        value.every((part) => names.has(part.value)) &&
        matchComplexSelector(host, hostSelector, context, options),
    );
  }
  return options.all ? selectors.filter(matches) : (selectors.find(matches) ?? null);
}

function getCompoundCandidateKeys(compound) {
  const { type, subclasses } = compound;
  const hasPseudo = Boolean(compound.pseudos);
  let id, className, localName;
  for (const subclass of subclasses) {
    if (subclass.kind === "id") {
      id = subclass.value;
    }
    if (subclass.kind === "class") {
      className = subclass.value;
    }
  }
  if (type !== null && type.kind !== "nesting" && !type.universal) {
    localName = type.value;
  }
  return { id, className, localName, hasPseudo };
}

function getSelectorPlan(selector) {
  let plan = selectorPlans.get(selector);
  if (plan === undefined) {
    const { units } = selector;
    const subject = subjectCompound(selector);
    plan = { subject, keys: getCompoundCandidateKeys(subject), ancestors: [] };
    for (let index = units.length - 1; index > 0; --index) {
      const { combinator } = units[index];
      if (combinator !== null && combinator !== ">") {
        break;
      }
      const compound = units[index - 1];
      plan.ancestors.push({ compound, keys: getCompoundCandidateKeys(compound), index: index - 1 });
    }
    selectorPlans.set(selector, plan);
  }
  return plan;
}

function getSelectorCandidateKeys(selector) {
  return getSelectorPlan(selector).keys;
}

function indexedCandidates(tree, compound, keys, context) {
  let { id, className, localName, hasPseudo } = keys;
  if (hasPseudo) {
    return [];
  }
  if (id !== undefined && !context.quirksMode && (tree.nodeType === 9 || tree._isInDocumentTree)) {
    const cache = tree._ownerDocument._byIdCache;
    const entry = cache._map.get(id);
    if (entry === undefined) {
      return [];
    }
    if (entry.count === 1) {
      const element = cache.get(id);
      return element !== tree && tree.contains(element) ? [element] : [];
    }
  }
  if (
    localName !== undefined &&
    nodeHelpers.isHTMLDocument(tree._ownerDocument) &&
    localName !== strings.toLowerCase(localName)
  ) {
    localName = undefined;
  }
  if (className !== undefined || localName !== undefined) {
    const queries = tree._getMemoizedQueries();
    // Mutation drops the collections; parsed-selector cache eviction drops their weak keys.
    queries.selectorCandidates ??= new WeakMap();
    let collection = queries.selectorCandidates.get(compound);
    if (collection === undefined) {
      collection =
        className === undefined
          ? createHTMLCollectionByNamespaceAndLocalName("*", localName, tree)
          : createHTMLCollectionByClassNames(className, tree);
      queries.selectorCandidates.set(compound, collection);
    }
    collection._update();
    return collection._list;
  }
  return null;
}

function* descendantCandidates(ancestors, subjects, index, matchesSelector) {
  let previous = null;
  let start = 0;
  for (const ancestor of ancestors) {
    if (previous !== null && previous.contains(ancestor)) {
      continue;
    }
    if (matchesSelector(ancestor, index)) {
      previous = ancestor;
      if (subjects === null) {
        yield* nodeHelpers.traverse(ancestor);
        continue;
      }
      // Native candidate collections are in tree order. Find the subtree's range without scanning unrelated nodes.
      if (start < subjects.length && !ancestor.contains(subjects[start])) {
        let end = subjects.length;
        while (start < end) {
          const middle = (start + end) >>> 1;
          if (ancestor._compareTreePosition(subjects[middle]) & 4) {
            end = middle;
          } else {
            start = middle + 1;
          }
        }
      }
      while (start < subjects.length && ancestor.contains(subjects[start])) {
        const subject = subjects[start++];
        yield subject;
      }
    }
  }
}

function selectorCandidates(tree, selector, context, options, matchesSelector) {
  if (options.includeSubtrees || options.inclusive || options.limits) {
    return nodeHelpers.traverse(tree, options);
  }
  const plan = getSelectorPlan(selector);
  const subjects = indexedCandidates(tree, plan.subject, plan.keys, context);
  let smallest = subjects;
  let seed;
  for (const ancestor of plan.ancestors) {
    const candidates = indexedCandidates(tree, ancestor.compound, ancestor.keys, context);
    if (candidates !== null && (smallest === null || candidates.length < smallest.length)) {
      smallest = candidates;
      seed = ancestor;
    }
  }
  if (seed !== undefined) {
    // An element query can use ancestors outside its result subtree.
    for (let ancestor = tree; ancestor; ancestor = ancestor.parentNode) {
      if (ancestor.nodeType === 1 && matchesSelector(ancestor, seed.index)) {
        return subjects ?? nodeHelpers.traverse(tree, options);
      }
    }
    return descendantCandidates(smallest, subjects, seed.index, matchesSelector);
  }
  return subjects ?? nodeHelpers.traverse(tree, options);
}

function matchTreesAgainstSelectors(trees, selectors, context, options) {
  context = createContext(trees[0], context);
  options = createOptions(context, options);
  options.prefixMatches ??= new Map();
  const roots = context.scopes?.roots ?? trees;
  const matches = [];
  const seen = roots.length > 1 || selectors.length > 1 ? new Set() : null;
  for (const tree of roots) {
    const localMatches = roots.length === 1 ? matches : [];
    for (const selector of selectors) {
      const matchesSelector = createComplexSelectorMatcher(selector, context, options);
      for (const element of selectorCandidates(tree, selector, context, options, matchesSelector)) {
        if (seen !== null && seen.has(element)) {
          continue;
        }
        if (matchesSelector(element)) {
          if (options.first && selectors.length === 1) {
            return element;
          }
          localMatches.push(element);
          if (seen !== null) {
            seen.add(element);
          }
          if (options.first) {
            break;
          }
        }
      }
    }
    if (selectors.length > 1) {
      localMatches.sort((a, b) => {
        return a._compareTreePosition(b) & 4 ? -1 : 1;
      });
    }
    if (options.first && localMatches.length > 0) {
      return localMatches[0];
    }
    if (roots.length > 1) {
      for (const element of localMatches) {
        matches.push(element);
      }
    }
  }
  return options.first ? null : matches;
}
