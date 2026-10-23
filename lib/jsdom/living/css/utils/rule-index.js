"use strict";

const CSSNamespaceRule = require("../../../../generated/idl/CSSNamespaceRule.js");
const CSSStyleRule = require("../../../../generated/idl/CSSStyleRule.js");
const selectors = require("../match/selector.js");
const { asciiLowercase } = require("../../helpers/strings.js");

function add(index, key, entry) {
  key = asciiLowercase(key);
  let entries = index.get(key);
  if (!entries) {
    entries = [];
    index.set(key, entries);
  }
  entries.push(entry);
}

// Keys are necessary conditions, never substitutes for matching. Folding ASCII case can only
// admit extra candidates, and makes one index usable in HTML, XML, and quirks mode.
function createRuleIndex(rules, getSelectors) {
  const index = { ids: new Map(), classes: new Map(), tags: new Map(), fallback: [] };
  for (const [order, rule] of rules.entries()) {
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
  const entries = new Set(index.fallback);
  function include(bucket) {
    if (bucket) {
      for (const entry of bucket) {
        entries.add(entry);
      }
    }
  }
  include(index.tags.get(asciiLowercase(subject._localName)));
  const id = subject.getAttributeNS(null, "id");
  if (id !== null) {
    include(index.ids.get(asciiLowercase(id)));
  }
  const classes = subject.getAttributeNS(null, "class");
  if (classes !== null && index.classes.size > 0) {
    for (const name of classes.split(/[\t\n\f\r ]+/)) {
      include(index.classes.get(asciiLowercase(name)));
    }
  }
  return [...entries].sort((a, b) => a.order - b.order).map(entry => entry.rule);
}

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

function getRuleListIndex(plan, rules) {
  let index = plan.indexes.get(rules);
  if (!index) {
    index = createRuleIndex(rules, rule => {
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
