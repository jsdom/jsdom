"use strict";

const CSSNamespaceRule = require("../../../../generated/idl/CSSNamespaceRule.js");
const CSSStyleRule = require("../../../../generated/idl/CSSStyleRule.js");
const selectors = require("../match/selector.js");
const { asciiLowercase } = require("../../helpers/strings.js");

// Index stylesheet rule lists by necessary conditions on the selector's subject: ID, class, or tag.
// Rules with an unindexable selector also enter `fallback`, so they are considered for every element.
// The resolver still performs full selector matching and evaluates conditional rules. Lookups must
// return each candidate rule once, in source order.

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

// Keys are necessary conditions, never substitutes for matching. Folding ASCII case can only
// admit extra candidates, and makes one index usable in HTML, XML, and quirks mode.
function createRuleIndex(rules, getSelectors) {
  const index = { ids: new Map(), classes: new Map(), tags: new Map(), fallback: [] };
  for (const [order, rule] of rules.entries()) {
    // Share one entry across buckets, preserving rule identity and source order.
    const entry = { order, rule };
    const ruleSelectors = getSelectors(rule);
    if (!ruleSelectors) {
      index.fallback.push(entry);
      continue;
    }
    let fallback = false;
    for (const selector of ruleSelectors) {
      const { id, className, localName, hasPseudo } = selectors.getSelectorCandidateKeys(selector);
      if (hasPseudo) {
        // These keys can describe a different element, e.g. the slot in `slot::slotted(...)`.
        fallback = true;
      } else if (id !== undefined) {
        add(index.ids, id, entry);
      } else if (className !== undefined) {
        add(index.classes, className, entry);
      } else if (localName !== undefined) {
        add(index.tags, localName, entry);
      } else {
        fallback = true;
      }
    }
    if (fallback) {
      index.fallback.push(entry);
    }
  }
  return index;
}

function selectRules(index, element) {
  const subject = element.nodeType === 1 ? element : element.element;
  const tagEntries = index.tags.get(asciiLowercase(subject._localName)) ?? [];
  // The tag bucket is already ordered and unique. Only allocate a union and sort
  // when an ID or class bucket contributes entries; merge `fallback` separately below.
  let entries;
  function include(bucket) {
    if (bucket) {
      entries ??= new Set(tagEntries);
      for (const entry of bucket) {
        entries.add(entry);
      }
    }
  }
  if (index.ids.size > 0) {
    const id = subject.getAttributeNS(null, "id");
    if (id !== null) {
      include(index.ids.get(asciiLowercase(id)));
    }
  }
  const classes = index.classes.size > 0 ? subject.getAttributeNS(null, "class") : null;
  if (classes !== null) {
    for (const name of classes.split(/[\t\n\f\r ]+/)) {
      include(index.classes.get(asciiLowercase(name)));
    }
  }
  const keyed = entries ? [...entries].sort((a, b) => a.order - b.order) : tagEntries;
  // The fallback bucket is already in source order. Merge it with the keyed
  // candidates instead of repeatedly sorting it, without duplicating rules
  // reached through both kinds of selector.
  const rules = [];
  const { fallback } = index;
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
    plan = { namespaces, indexes: new WeakMap() };
    sheet._stylePlan = plan;
  }
  return plan;
}

// Index each rule list separately instead of flattening the sheet. The resolver traverses grouping
// and nested rules with their conditions and cascade context, then selects candidates from each list.
function getRuleListIndex(plan, rules) {
  let index = plan.indexes.get(rules);
  if (!index) {
    index = createRuleIndex(rules, (rule) => {
      // Parent rules must always be visited: a nested selector can match outside its parent.
      return CSSStyleRule.isImpl(rule) && rule._rules.length === 0 ? rule._selectors : null;
    });
    plan.indexes.set(rules, index);
  }
  return index;
}

exports.createRuleIndex = createRuleIndex;
exports.selectRules = selectRules;
exports.getStyleSheetPlan = getStyleSheetPlan;
exports.getRuleListIndex = getRuleListIndex;
