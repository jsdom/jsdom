"use strict";

const CSSContainerRule = require("../../../../generated/idl/CSSContainerRule.js");
const CSSFontFaceRule = require("../../../../generated/idl/CSSFontFaceRule.js");
const CSSKeyframesRule = require("../../../../generated/idl/CSSKeyframesRule.js");
const CSSLayerBlockRule = require("../../../../generated/idl/CSSLayerBlockRule.js");
const CSSMediaRule = require("../../../../generated/idl/CSSMediaRule.js");
const CSSNamespaceRule = require("../../../../generated/idl/CSSNamespaceRule.js");
const CSSStyleRule = require("../../../../generated/idl/CSSStyleRule.js");
const CSSSupportsRule = require("../../../../generated/idl/CSSSupportsRule.js");
const selectors = require("../match/selector.js");
const { asciiLowercase } = require("../../helpers/strings.js");

// Index stylesheet rule lists by necessary conditions on the selector's subject: ID, class, tag, or
// attribute name, or a class on its parent across a child combinator. Elements and pseudo-elements
// match disjoint selectors, so each has its own buckets. A pseudo-element looks up its originating
// element's keys.
// Rules with an unindexable selector also enter `fallback`, so they are considered for every element
// or pseudo-element. The resolver still performs full selector matching and evaluates conditional
// rules. Lookups must return each candidate rule once, in source order.

function createBuckets() {
  return {
    ids: new Map(),
    classes: new Map(),
    tags: new Map(),
    attributes: new Map(),
    parentClasses: new Map(),
    fallback: [],
  };
}

function add(index, key, entry) {
  key = asciiLowercase(key);
  let entries = index.get(key);
  if (!entries) {
    entries = [];
    index.set(key, entries);
  }
  // Selectors such as `div, div:hover` add the same rule to a bucket more than once.
  // We finish all selectors of one rule before starting the next, so an existing
  // entry for this rule must be the last entry in the bucket.
  if (entries.at(-1) !== entry) {
    entries.push(entry);
  }
}

function addFallback(buckets, entry) {
  if (buckets.fallback.at(-1) !== entry) {
    buckets.fallback.push(entry);
  }
}

// Keys are necessary conditions, never substitutes for matching. Folding ASCII case can only
// admit extra candidates, and makes one index usable in HTML, XML, and quirks mode.
function createRuleIndex(rules, getSelectors) {
  const index = { elements: createBuckets(), pseudoElements: createBuckets() };
  for (const [order, rule] of rules.entries()) {
    // Share one entry across buckets, preserving rule identity and source order.
    const entry = { order, rule };
    const ruleSelectors = getSelectors(rule);
    if (!ruleSelectors) {
      addFallback(index.elements, entry);
      addFallback(index.pseudoElements, entry);
      continue;
    }
    for (const selector of ruleSelectors) {
      const { pseudos } = selector.units.at(-1);
      // `::slotted()` and `::part()` match elements in another tree; the keys describe a slot or
      // host. Pseudo-elements after them are not elements.
      if (pseudos?.[0].name === "slotted" || pseudos?.[0].name === "part") {
        addFallback(pseudos.length === 1 ? index.elements : index.pseudoElements, entry);
        continue;
      }
      const buckets = pseudos ? index.pseudoElements : index.elements;
      const { id, className, localName, attributeName } =
        selectors.getSelectorCandidateKeys(selector);
      const parentKeys = selectors.getSelectorParentCandidateKeys(selector);
      if (id !== undefined) {
        add(buckets.ids, id, entry);
      } else if (className !== undefined) {
        add(buckets.classes, className, entry);
      } else if (localName !== undefined) {
        add(buckets.tags, localName, entry);
      } else if (attributeName !== undefined) {
        add(buckets.attributes, attributeName, entry);
      } else if (parentKeys?.className !== undefined) {
        add(buckets.parentClasses, parentKeys.className, entry);
      } else {
        addFallback(buckets, entry);
      }
    }
  }
  return index;
}

function selectRules(index, element) {
  const isElement = element.nodeType === 1;
  const subject = isElement ? element : element.element;
  const buckets = isElement ? index.elements : index.pseudoElements;
  const tagEntries = buckets.tags.get(asciiLowercase(subject._localName)) ?? [];
  // The tag bucket is already ordered and unique. Only allocate a union and sort
  // when another bucket contributes entries; merge `fallback` separately below.
  let entries;
  function include(bucket) {
    if (bucket) {
      entries ??= new Set(tagEntries);
      for (const entry of bucket) {
        entries.add(entry);
      }
    }
  }
  if (buckets.ids.size > 0) {
    const id = subject.getAttributeNS(null, "id");
    if (id !== null) {
      include(buckets.ids.get(asciiLowercase(id)));
    }
  }
  const classes = buckets.classes.size > 0 ? subject.getAttributeNS(null, "class") : null;
  if (classes !== null) {
    for (const name of classes.split(/[\t\n\f\r ]+/)) {
      include(buckets.classes.get(asciiLowercase(name)));
    }
  }
  if (buckets.attributes.size > 0) {
    for (const attribute of subject._attributeList) {
      include(buckets.attributes.get(asciiLowercase(attribute._localName)));
    }
  }
  if (buckets.parentClasses.size > 0) {
    // Matching treats a shadow root's host as the parent of the root's children.
    const parent =
      subject.parentNode?.nodeType === 1 ? subject.parentNode : subject.parentNode?._host;
    const parentClasses = parent ? parent.getAttributeNS(null, "class") : null;
    if (parentClasses !== null) {
      for (const name of parentClasses.split(/[\t\n\f\r ]+/)) {
        include(buckets.parentClasses.get(asciiLowercase(name)));
      }
    }
  }
  const keyed = entries ? [...entries].sort((a, b) => a.order - b.order) : tagEntries;
  // The fallback bucket is already in source order. Merge it with the keyed
  // candidates instead of repeatedly sorting it, without duplicating rules
  // reached through both kinds of selector.
  const rules = [];
  const { fallback } = buckets;
  let i = 0;
  let j = 0;
  while (i < keyed.length && j < fallback.length) {
    if (keyed[i].order < fallback[j].order) {
      rules.push(keyed[i++].rule);
    } else {
      if (keyed[i] === fallback[j]) {
        ++i;
      }
      rules.push(fallback[j++].rule);
    }
  }
  while (i < keyed.length) {
    rules.push(keyed[i++].rule);
  }
  while (j < fallback.length) {
    rules.push(fallback[j++].rule);
  }
  return rules;
}

// Plans contain only stylesheet-dependent data, so they survive DOM mutations and focus changes.
// CSSOM writes discard the sheet's plan through `invalidateStyle()` in `style.js`.
function getStyleSheetPlan(sheet) {
  let plan = sheet._stylePlan;
  if (!plan) {
    const namespaces = new Map();
    for (const rule of sheet._rules) {
      if (CSSNamespaceRule.isImpl(rule)) {
        namespaces.set(rule.prefix, rule.namespaceURI);
      }
    }
    plan = { namespaces, indexes: new WeakMap(), selectors: undefined };
    sheet._stylePlan = plan;
  }
  return plan;
}

// Conditional groups only contribute their descendants' rules, so index them by those selectors.
// Share an accumulator across grouping levels, but reuse standalone style rules' selector lists.
function getIndexableSelectors(rule, result) {
  if (CSSStyleRule.isImpl(rule)) {
    // Parent rules must always be visited: a nested selector can match outside its parent.
    if (rule._rules.length > 0) {
      return null;
    }
    if (result === undefined) {
      return rule._selectors;
    }
    for (const selector of rule._selectors) {
      result.push(selector);
    }
    return result;
  }
  if (
    CSSMediaRule.isImpl(rule) ||
    CSSSupportsRule.isImpl(rule) ||
    CSSLayerBlockRule.isImpl(rule) ||
    CSSContainerRule.isImpl(rule)
  ) {
    result ??= [];
    for (const child of rule._rules) {
      if (getIndexableSelectors(child, result) === null) {
        return null;
      }
    }
    return result;
  }
  // These rules never contribute declarations to an element, so nothing needs to visit them.
  if (CSSKeyframesRule.isImpl(rule) || CSSFontFaceRule.isImpl(rule)) {
    return result ?? [];
  }
  return null;
}

// Index each rule list separately instead of flattening the sheet. The resolver traverses grouping
// and nested rules with their conditions and cascade context, then selects candidates from each list.
function getRuleListIndex(plan, rules) {
  let index = plan.indexes.get(rules);
  if (!index) {
    index = createRuleIndex(rules, getIndexableSelectors);
    plan.indexes.set(rules, index);
  }
  return index;
}

// A stylesheet only contributes its rules' candidates, so index a tree's stylesheets like a rule list
// whose entries are conditional groups. `selectRules()` then returns the stylesheets to visit.
function getStyleSheetSelectors(sheet) {
  const plan = getStyleSheetPlan(sheet);
  if (plan.selectors === undefined) {
    plan.selectors = [];
    for (const rule of sheet._rules) {
      if (getIndexableSelectors(rule, plan.selectors) === null) {
        plan.selectors = null;
        break;
      }
    }
  }
  return plan.selectors;
}

function createStyleSheetIndex(sheets) {
  return createRuleIndex(sheets, getStyleSheetSelectors);
}

exports.createRuleIndex = createRuleIndex;
exports.createStyleSheetIndex = createStyleSheetIndex;
exports.selectRules = selectRules;
exports.getStyleSheetPlan = getStyleSheetPlan;
exports.getRuleListIndex = getRuleListIndex;
