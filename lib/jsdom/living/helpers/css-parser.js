"use strict";

const DOMException = require("../../../generated/idl/DOMException.js");
const csstree = require("css-tree");
const { wrapperForImpl, implForWrapper } = require("../../../generated/idl/utils.js");

// csstree.generate() can corrupt Raw nodes by inserting spaces between tokens
// (e.g. "span#foo" becomes "span #foo"). Use the Raw node's .value directly.
function generateFromNode(node) {
  if (node.type === "Raw") {
    return node.value;
  }
  return csstree.generate(node);
}

// Lazy-loaded generated wrappers to avoid circular dependencies
let CSSStyleSheet, CSSStyleRule, CSSMediaRule, CSSImportRule, CSSFontFaceRule,
  CSSKeyframesRule, CSSKeyframeRule, CSSSupportsRule, CSSContainerRule,
  CSSScopeRule, CSSLayerBlockRule, CSSLayerStatementRule, CSSNamespaceRule,
  CSSPageRule, CSSNestedDeclarations, CSSCounterStyleRule;

function lazyLoad() {
  if (CSSStyleSheet) {
    return;
  }
  CSSStyleSheet = require("../../../generated/idl/CSSStyleSheet.js");
  CSSStyleRule = require("../../../generated/idl/CSSStyleRule.js");
  CSSMediaRule = require("../../../generated/idl/CSSMediaRule.js");
  CSSImportRule = require("../../../generated/idl/CSSImportRule.js");
  CSSFontFaceRule = require("../../../generated/idl/CSSFontFaceRule.js");
  CSSKeyframesRule = require("../../../generated/idl/CSSKeyframesRule.js");
  CSSKeyframeRule = require("../../../generated/idl/CSSKeyframeRule.js");
  CSSSupportsRule = require("../../../generated/idl/CSSSupportsRule.js");
  CSSContainerRule = require("../../../generated/idl/CSSContainerRule.js");
  CSSScopeRule = require("../../../generated/idl/CSSScopeRule.js");
  CSSLayerBlockRule = require("../../../generated/idl/CSSLayerBlockRule.js");
  CSSLayerStatementRule = require("../../../generated/idl/CSSLayerStatementRule.js");
  CSSNamespaceRule = require("../../../generated/idl/CSSNamespaceRule.js");
  CSSPageRule = require("../../../generated/idl/CSSPageRule.js");
  CSSNestedDeclarations = require("../../../generated/idl/CSSNestedDeclarations.js");
  CSSCounterStyleRule = require("../../../generated/idl/CSSCounterStyleRule.js");
}

/**
 * Parse a CSS stylesheet string into a CSSStyleSheet impl.
 *
 * @param {string} cssText - The CSS text to parse.
 * @param {object} globalObject - The global object.
 * @param {object} [options] - Options.
 * @param {object} [options.ownerNode] - The owner node.
 * @param {object} [options.ownerRule] - The owner CSSRule (for @import).
 * @param {object} [options.styleSheet] - Existing CSSStyleSheet impl to populate (for @import).
 * @param {Function} [options.onError] - Error callback.
 * @returns {object} CSSStyleSheet impl.
 */
function parseStylesheet(cssText, globalObject, options = {}) {
  lazyLoad();

  let ast;
  try {
    ast = csstree.parse(cssText, {
      context: "stylesheet",
      parseCustomProperty: true,
      parseAtrulePrelude: false,
      parseRulePrelude: false,
      parseValue: false,
      tolerant: true,
      onParseError(error) {
        if (options.onError) {
          options.onError(error);
        }
      }
    });
  } catch (e) {
    if (options.onError) {
      options.onError(e);
    }
    // Return an empty stylesheet on parse failure
    ast = {
      type: "StyleSheet",
      children: {
        toArray() {
          return [];
        }
      }
    };
  }

  const sheetImpl = options.styleSheet || CSSStyleSheet.createImpl(globalObject, [], {
    ownerNode: options.ownerNode || null,
    ownerRule: options.ownerRule || null,
    mediaText: options.mediaText || "",
    constructed: false
  });


  const sheetWrapper = wrapperForImpl(sheetImpl);

  const children = ast.children ? ast.children.toArray() : [];
  for (const node of children) {
    const ruleImpl = translateNode(node, globalObject, sheetWrapper, null);
    if (ruleImpl) {
      sheetImpl.cssRules._list.push(ruleImpl);
    }
  }

  return sheetImpl;
}

/**
 * Parse a single CSS rule string into a CSSRule impl.
 *
 * @param {string} ruleText - The CSS rule text.
 * @param {object} globalObject - The global object.
 * @returns {object} CSSRule impl.
 */
function parseRule(ruleText, globalObject) {
  lazyLoad();

  // Parse the text as a stylesheet to check for exactly one rule.
  // We check the AST directly because translateNode returns null for
  // unrecognized nodes (e.g. trailing garbage parsed as Raw).
  let ast;
  try {
    ast = csstree.parse(ruleText, {
      context: "stylesheet",
      parseCustomProperty: true,
      parseAtrulePrelude: false,
      parseRulePrelude: false,
      parseValue: false,
      tolerant: true
    });
  } catch {
    throw DOMException.create(globalObject, [
      "Failed to parse the rule.",
      "SyntaxError"
    ]);
  }

  const astChildren = ast.children ? ast.children.toArray() : [];
  if (astChildren.length !== 1) {
    throw DOMException.create(globalObject, [
      "Failed to parse the rule.",
      "SyntaxError"
    ]);
  }

  // Now parse through the normal path
  const sheetImpl = parseStylesheet(ruleText, globalObject);
  const rules = sheetImpl.cssRules._list;
  if (rules.length === 0) {
    throw DOMException.create(globalObject, [
      "Failed to parse the rule.",
      "SyntaxError"
    ]);
  }

  const rule = rules[0];
  // Detach from the temporary sheet
  rule.parentStyleSheet = null;
  return rule;
}

/**
 * Parse a keyframe rule string into a CSSKeyframeRule impl.
 *
 * @param {string} ruleText - The keyframe rule text (e.g. "from { opacity: 0 }").
 * @param {object} globalObject - The global object.
 * @returns {object} CSSKeyframeRule impl.
 */
function parseKeyframeRule(ruleText, globalObject) {
  lazyLoad();

  // Parse as a keyframes block to get individual keyframe rules
  const wrapped = `@keyframes _temp { ${ruleText} }`;
  const sheetImpl = parseStylesheet(wrapped, globalObject);
  const keyframesRule = sheetImpl.cssRules._list[0];
  if (!keyframesRule || !keyframesRule.cssRules || keyframesRule.cssRules._list.length === 0) {
    throw DOMException.create(globalObject, [
      "Failed to parse the keyframe rule.",
      "SyntaxError"
    ]);
  }

  const rule = keyframesRule.cssRules._list[0];
  rule.parentStyleSheet = null;
  rule.parentRule = null;
  return rule;
}

function translateNode(node, globalObject, parentSheet, parentRule) {
  if (node.type === "Rule") {
    return translateStyleRule(node, globalObject, parentSheet, parentRule);
  } else if (node.type === "Atrule") {
    return translateAtRule(node, globalObject, parentSheet, parentRule);
  } else if (node.type === "Declaration") {
    // Standalone declarations shouldn't appear at top level in a well-formed stylesheet.
    // They would be inside rules. Skip them.
    return null;
  }
  return null;
}

function translateStyleRule(node, globalObject, parentSheet, parentRule) {
  let selectorText = node.prelude ? generateFromNode(node.prelude) : "";

  // Normalize nested selectors: prepend implicit & to selectors that don't contain it.
  // Skip for rules directly inside @scope, which uses :scope scoping instead.

  const parentIsScope = parentRule && "start" in implForWrapper(parentRule);
  if (parentRule && isInsideStyleRule(parentRule) && !parentIsScope) {
    selectorText = normalizeNestedSelector(selectorText);

    // Reject selectors where & is immediately followed by a type selector (e.g. "&div").
    // Type selectors must come first in a compound selector.
    if (/&[a-zA-Z]/.test(selectorText)) {
      return null;
    }
  }

  const ruleImpl = CSSStyleRule.createImpl(globalObject, [], {
    selectorText,
    parentStyleSheet: parentSheet,
    parentRule
  });

  if (node.block && node.block.children) {
    populateDeclarationsAndNestedRules(node.block, ruleImpl, globalObject, parentSheet);
  }

  return ruleImpl;
}

// Split a selector list on commas, respecting parentheses and brackets.
function splitSelectorList(text) {
  const result = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "(" || ch === "[") {
      depth++;
    } else if (ch === ")" || ch === "]") {
      depth--;
    } else if (ch === "," && depth === 0) {
      result.push(text.slice(start, i));
      start = i + 1;
    }
  }
  result.push(text.slice(start));
  return result;
}

// Per the CSS Nesting spec, nested selectors get an implicit & prepended when:
// - The selector starts with a combinator (relative selector): always prepend "& "
// - The selector doesn't start with a combinator: prepend "& " only if it doesn't contain "&"
function normalizeNestedSelector(selectorText) {
  const selectors = splitSelectorList(selectorText);
  return selectors.map(sel => {
    const trimmed = sel.trim();
    const startsWithCombinator = /^[>+~|]/.test(trimmed);
    if (startsWithCombinator) {
      return "& " + trimmed;
    }
    if (trimmed.includes("&")) {
      return trimmed;
    }
    return "& " + trimmed;
  }).join(", ");
}

function isInsideStyleRule(parentRule) {
  let rule = parentRule;
  while (rule) {
    const impl = implForWrapper(rule);
    if (impl.type === 1) {
      return true;
    }
    rule = impl.parentRule;
  }
  return false;
}

// Check if text contains a top-level { (not inside parentheses or brackets).
function containsTopLevelBrace(text) {
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "(" || ch === "[") {
      depth++;
    } else if (ch === ")" || ch === "]") {
      depth--;
    } else if (ch === "{" && depth === 0) {
      return true;
    }
  }
  return false;
}

// When css-tree misinterprets a nested rule as a declaration (e.g. property "color",
// value "hover {} --y: 2"), split it back into a CSSStyleRule and remaining declarations.
function splitMisinterpretedRule(property, rawValue, globalObject, parentSheet, parentRule) {
  const fullText = property + ":" + rawValue;

  // Find the first top-level {
  let depth = 0;
  let braceStart = -1;
  for (let i = 0; i < fullText.length; i++) {
    const ch = fullText[i];
    if (ch === "(" || ch === "[") {
      depth++;
    } else if (ch === ")" || ch === "]") {
      depth--;
    } else if (ch === "{" && depth === 0) {
      braceStart = i;
      break;
    }
  }
  if (braceStart === -1) {
    return null;
  }

  // Find matching }
  depth = 0;
  let braceEnd = -1;
  for (let i = braceStart; i < fullText.length; i++) {
    const ch = fullText[i];
    if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        braceEnd = i;
        break;
      }
    }
  }
  if (braceEnd === -1) {
    return null;
  }

  let selectorText = fullText.slice(0, braceStart).trim();
  const blockContent = fullText.slice(braceStart + 1, braceEnd).trim();
  const remaining = fullText.slice(braceEnd + 1).trim();

  // Only split if css-tree actually gobbled subsequent content into the value.
  // When remaining is empty, the {} was self-contained and css-tree already
  // correctly parsed subsequent declarations as separate nodes.
  if (!remaining) {
    return null;
  }

  // Normalize nested selector

  const parentIsScope = parentRule && "start" in implForWrapper(parentRule);
  if (parentRule && isInsideStyleRule(parentRule) && !parentIsScope) {
    selectorText = normalizeNestedSelector(selectorText);
    if (/&[a-zA-Z]/.test(selectorText)) {
      return null;
    }
  }

  // Create the nested style rule
  const ruleImpl = CSSStyleRule.createImpl(globalObject, [], {
    selectorText,
    parentStyleSheet: parentSheet,
    parentRule
  });

  // Parse block content as declarations
  if (blockContent) {
    try {
      const blockAst = csstree.parse(blockContent, {
        context: "declarationList",
        parseCustomProperty: true,
        parseValue: false,
        tolerant: true
      });
      for (const decl of blockAst.children.toArray()) {
        if (decl.type === "Declaration") {
          const priority = decl.important ? "important" : "";
          ruleImpl._style.setProperty(decl.property, generateFromNode(decl.value).trim(), priority);
        }
      }
    } catch {
      // empty block is fine
    }
  }

  // Parse remaining text as declarations
  const remainingDeclarations = [];
  if (remaining) {
    try {
      const remAst = csstree.parse(remaining, {
        context: "declarationList",
        parseCustomProperty: true,
        parseValue: false,
        tolerant: true
      });
      for (const decl of remAst.children.toArray()) {
        if (decl.type === "Declaration") {
          remainingDeclarations.push(decl);
        }
      }
    } catch {
      // ignore
    }
  }

  return { rule: ruleImpl, remainingDeclarations };
}

function translateAtRule(node, globalObject, parentSheet, parentRule) {
  const name = node.name.toLowerCase();

  switch (name) {
    case "media":
      return translateMediaRule(node, globalObject, parentSheet, parentRule);
    case "import":
      return translateImportRule(node, globalObject, parentSheet, parentRule);
    case "font-face":
      // @font-face is not valid inside a style rule (nesting context)
      if (parentRule && isInsideStyleRule(parentRule)) {
        return null;
      }
      return translateFontFaceRule(node, globalObject, parentSheet, parentRule);
    case "keyframes":
    case "-webkit-keyframes":
    case "-moz-keyframes":
      return translateKeyframesRule(node, globalObject, parentSheet, parentRule);
    case "supports":
      return translateSupportsRule(node, globalObject, parentSheet, parentRule);
    case "container":
      return translateContainerRule(node, globalObject, parentSheet, parentRule);
    case "scope":
      return translateScopeRule(node, globalObject, parentSheet, parentRule);
    case "layer":
      return translateLayerRule(node, globalObject, parentSheet, parentRule);
    case "namespace":
      return translateNamespaceRule(node, globalObject, parentSheet, parentRule);
    case "page":
      return translatePageRule(node, globalObject, parentSheet, parentRule);
    case "counter-style":
      return translateCounterStyleRule(node, globalObject, parentSheet, parentRule);
    default:
      // Unknown at-rules are skipped
      return null;
  }
}

/**
 * Populate a grouping rule's child rules from a css-tree block.
 * When in nesting context (inside a style rule), declarations are wrapped as
 * CSSNestedDeclarations rules rather than being ignored.
 */
function populateGroupingRuleChildren(block, ruleImpl, globalObject, parentSheet, parentRule) {
  const ruleWrapper = wrapperForImpl(ruleImpl);
  const inNestingContext = parentRule && isInsideStyleRule(parentRule);

  if (inNestingContext) {
    let pendingDeclarations = [];
    for (const child of block.children.toArray()) {
      if (child.type === "Declaration") {
        pendingDeclarations.push(child);
      } else if (child.type === "Rule" || child.type === "Atrule") {
        if (pendingDeclarations.length > 0) {
          flushNestedDeclarations(pendingDeclarations, globalObject, parentSheet, ruleWrapper, ruleImpl);
          pendingDeclarations = [];
        }
        const childRule = translateNode(child, globalObject, parentSheet, ruleWrapper);
        if (childRule) {
          ruleImpl.cssRules._list.push(childRule);
        }
      } else if (child.type === "Raw") {
        const nestedRules = parseRawAsNestedRules(child.value, globalObject, parentSheet, ruleWrapper);
        if (nestedRules.length > 0) {
          if (pendingDeclarations.length > 0) {
            flushNestedDeclarations(pendingDeclarations, globalObject, parentSheet, ruleWrapper, ruleImpl);
            pendingDeclarations = [];
          }
          for (const nestedRule of nestedRules) {
            ruleImpl.cssRules._list.push(nestedRule);
          }
        }
      }
    }
    if (pendingDeclarations.length > 0) {
      flushNestedDeclarations(pendingDeclarations, globalObject, parentSheet, ruleWrapper, ruleImpl);
    }
  } else {
    for (const child of block.children.toArray()) {
      if (child.type === "Raw") {
        const nestedRules = parseRawAsNestedRules(child.value, globalObject, parentSheet, ruleWrapper);
        for (const nestedRule of nestedRules) {
          ruleImpl.cssRules._list.push(nestedRule);
        }
      } else {
        const childRule = translateNode(child, globalObject, parentSheet, ruleWrapper);
        if (childRule) {
          ruleImpl.cssRules._list.push(childRule);
        }
      }
    }
  }
}

function translateMediaRule(node, globalObject, parentSheet, parentRule) {
  const conditionText = node.prelude ? generateFromNode(node.prelude) : "";

  const ruleImpl = CSSMediaRule.createImpl(globalObject, [], {
    conditionText,
    parentStyleSheet: parentSheet,
    parentRule
  });

  if (node.block && node.block.children) {
    populateGroupingRuleChildren(node.block, ruleImpl, globalObject, parentSheet, parentRule);
  }

  return ruleImpl;
}

function translateImportRule(node, globalObject, parentSheet, parentRule) {
  // Use the raw prelude text (preserves spacing) for string extraction
  const preludeText = node.prelude ? generateFromNode(node.prelude) : "";

  let href = "";
  let mediaText = "";
  let layerName = null;
  let supportsText = null;

  // Use css-tree to parse the prelude structurally for href and layer
  try {
    const parsed = csstree.parse(preludeText, { context: "atrulePrelude", atrule: "import" });

    csstree.walk(parsed, {
      visit: "Url",
      enter(urlNode) {
        href = urlNode.value;
      }
    });

    csstree.walk(parsed, {
      visit: "String",
      enter(strNode) {
        if (!href) {
          href = strNode.value;
        }
      }
    });

    let layerFnNode = null;
    csstree.walk(parsed, {
      visit: "Function",
      enter(fnNode) {
        if (fnNode.name === "layer") {
          layerFnNode = fnNode;
          if (fnNode.children) {
            layerName = csstree.generate({ type: "Value", children: fnNode.children });
          } else {
            layerName = "";
          }
        }
      }
    });

    // Check for bare "layer" keyword (without parens)
    if (layerName === null) {
      csstree.walk(parsed, {
        visit: "Identifier",
        enter(idNode) {
          if (idNode.name === "layer") {
            layerName = "";
          }
        }
      });
    }

    // Validate layer name: layer() with function syntax must have a valid <layer-name>.
    // Invalid layer() declarations (empty, spaces, commas) should be treated as
    // <general-enclosed> media queries per the CSS spec.
    if (layerFnNode && layerName !== null && !isValidLayerName(layerName)) {
      mediaText = csstree.generate(layerFnNode);
      layerName = null;
    }

    // Extract media query list
    csstree.walk(parsed, {
      visit: "MediaQueryList",
      enter(mqNode) {
        const mqText = csstree.generate(mqNode).trim();
        if (mqText) {
          mediaText = mqText;
        }
      }
    });
  } catch {
    // Fallback: use the raw prelude text for href extraction
    const urlMatch = preludeText.match(/url\(\s*["']?([^"')]+)["']?\s*\)|["']([^"']+)["']/);
    if (urlMatch) {
      href = urlMatch[1] || urlMatch[2] || "";
    }
  }

  // Extract supports text from the raw prelude to preserve spacing.
  // css-tree's generate() strips spaces from declaration values, so we
  // extract the balanced content of supports(...) from the original text.
  const supportsIdx = preludeText.search(/\bsupports\(/);
  if (supportsIdx !== -1) {
    const start = supportsIdx + "supports(".length;
    let depth = 1;
    for (let i = start; i < preludeText.length; i++) {
      if (preludeText[i] === "(") {
        depth++;
      } else if (preludeText[i] === ")") {
        depth--;
        if (depth === 0) {
          supportsText = preludeText.slice(start, i);
          break;
        }
      }
    }
  }

  return CSSImportRule.createImpl(globalObject, [], {
    href,
    mediaText,
    layerName,
    supportsText,
    parentStyleSheet: parentSheet,
    parentRule
  });
}

function translateFontFaceRule(node, globalObject, parentSheet, parentRule) {
  const ruleImpl = CSSFontFaceRule.createImpl(globalObject, [], {
    parentStyleSheet: parentSheet,
    parentRule
  });

  if (node.block && node.block.children) {
    populateDeclarations(node.block, ruleImpl._style);
  }

  return ruleImpl;
}

function translateKeyframesRule(node, globalObject, parentSheet, parentRule) {
  const name = node.prelude ? generateFromNode(node.prelude).trim() : "";

  const ruleImpl = CSSKeyframesRule.createImpl(globalObject, [], {
    name,
    parentStyleSheet: parentSheet,
    parentRule
  });

  if (node.block && node.block.children) {
    const ruleWrapper = wrapperForImpl(ruleImpl);
    for (const child of node.block.children.toArray()) {
      if (child.type === "Rule") {
        const keyText = child.prelude ? generateFromNode(child.prelude).trim() : "";
        const keyframeImpl = CSSKeyframeRule.createImpl(globalObject, [], {
          keyText,
          parentStyleSheet: parentSheet,
          parentRule: ruleWrapper
        });

        if (child.block && child.block.children) {
          populateDeclarations(child.block, keyframeImpl._style);
        }

        ruleImpl.cssRules._list.push(keyframeImpl);
      }
    }
  }

  return ruleImpl;
}

function translateSupportsRule(node, globalObject, parentSheet, parentRule) {
  const conditionText = node.prelude ? generateFromNode(node.prelude) : "";

  const ruleImpl = CSSSupportsRule.createImpl(globalObject, [], {
    conditionText,
    parentStyleSheet: parentSheet,
    parentRule
  });

  if (node.block && node.block.children) {
    populateGroupingRuleChildren(node.block, ruleImpl, globalObject, parentSheet, parentRule);
  }

  return ruleImpl;
}

function translateContainerRule(node, globalObject, parentSheet, parentRule) {
  const conditionText = node.prelude ? generateFromNode(node.prelude) : "";

  const ruleImpl = CSSContainerRule.createImpl(globalObject, [], {
    conditionText,
    parentStyleSheet: parentSheet,
    parentRule
  });

  if (node.block && node.block.children) {
    populateGroupingRuleChildren(node.block, ruleImpl, globalObject, parentSheet, parentRule);
  }

  return ruleImpl;
}

function translateScopeRule(node, globalObject, parentSheet, parentRule) {
  const prelude = node.prelude ? generateFromNode(node.prelude).trim() : "";

  // Parse scope prelude using css-tree's structured parser with positions
  // to extract start/end selectors while preserving original spacing.
  let start = null;
  let end = null;

  if (prelude) {
    try {
      const parsed = csstree.parse(prelude, { context: "atrulePrelude", atrule: "scope", positions: true });
      csstree.walk(parsed, scopeNode => {
        if (scopeNode.type === "Scope") {
          if (scopeNode.root) {
            start = prelude.slice(scopeNode.root.loc.start.offset, scopeNode.root.loc.end.offset);
          }
          if (scopeNode.limit) {
            end = prelude.slice(scopeNode.limit.loc.start.offset, scopeNode.limit.loc.end.offset);
          }
        }
      });
    } catch {
      // css-tree can't parse the prelude — drop the rule as invalid
      return null;
    }

    // Validate extracted selectors
    if (!isValidScopeSelector(start) || !isValidScopeSelector(end)) {
      return null;
    }
  }

  const ruleImpl = CSSScopeRule.createImpl(globalObject, [], {
    start,
    end,
    parentStyleSheet: parentSheet,
    parentRule
  });

  if (node.block && node.block.children) {
    populateGroupingRuleChildren(node.block, ruleImpl, globalObject, parentSheet, parentRule);
  }

  return ruleImpl;
}

// Validate a @scope start or end selector. Returns true if valid (or null = not present).
function isValidScopeSelector(selectorText) {
  if (selectorText === null) {
    return true;
  }
  // Empty selector list is invalid
  if (selectorText.trim() === "") {
    return false;
  }
  // Pseudo-elements are not valid scope boundaries
  if (selectorText.includes("::")) {
    return false;
  }
  // Try parsing as a selector list to catch syntactically invalid selectors
  try {
    const ast = csstree.parse(selectorText, { context: "selectorList" });
    // Check that each selector has at least one non-Combinator node
    let valid = true;
    csstree.walk(ast, {
      visit: "Selector",
      enter(sel) {
        let hasNonCombinator = false;
        sel.children.forEach(child => {
          if (child.type !== "Combinator") {
            hasNonCombinator = true;
          }
        });
        if (!hasNonCombinator) {
          valid = false;
        }
      }
    });
    return valid;
  } catch {
    return false;
  }
}

function isValidLayerName(name) {
  // A valid <layer-name> is a dot-separated sequence of CSS idents with no whitespace or commas.
  // e.g. "A", "A.B", "A.B.C" are valid; "A . B", "A, B", "", " " are not.
  return name.length > 0 && !/[\s,]/.test(name);
}

function translateLayerRule(node, globalObject, parentSheet, parentRule) {
  const prelude = node.prelude ? generateFromNode(node.prelude).trim() : "";

  // @layer with a block is CSSLayerBlockRule; without block is CSSLayerStatementRule
  if (node.block) {
    // Block form can have at most one name, no commas
    if (prelude.includes(",")) {
      return null;
    }
    if (prelude && !isValidLayerName(prelude)) {
      return null;
    }

    const ruleImpl = CSSLayerBlockRule.createImpl(globalObject, [], {
      name: prelude,
      parentStyleSheet: parentSheet,
      parentRule
    });

    if (node.block.children) {
      populateGroupingRuleChildren(node.block, ruleImpl, globalObject, parentSheet, parentRule);
    }

    return ruleImpl;
  }

  // Statement form: @layer name1, name2;
  const nameList = prelude ? prelude.split(",").map(n => n.trim()).filter(Boolean) : [];

  // Statement form requires at least one valid name
  if (nameList.length === 0 || !nameList.every(isValidLayerName)) {
    return null;
  }

  return CSSLayerStatementRule.createImpl(globalObject, [], {
    nameList,
    parentStyleSheet: parentSheet,
    parentRule
  });
}

function translateNamespaceRule(node, globalObject, parentSheet, parentRule) {
  const prelude = node.prelude ? generateFromNode(node.prelude).trim() : "";

  // Parse @namespace [prefix] url("...") or @namespace [prefix] "..."
  let prefix = "";
  let namespaceURI = "";
  const urlMatch = prelude.match(/url\(\s*["']?([^"')]+)["']?\s*\)|["']([^"']+)["']/);
  if (urlMatch) {
    namespaceURI = urlMatch[1] || urlMatch[2] || "";
    const beforeURL = prelude.slice(0, prelude.indexOf(urlMatch[0])).trim();
    if (beforeURL) {
      prefix = beforeURL;
    }
  }

  return CSSNamespaceRule.createImpl(globalObject, [], {
    prefix,
    namespaceURI,
    parentStyleSheet: parentSheet,
    parentRule
  });
}

function translatePageRule(node, globalObject, parentSheet, parentRule) {
  const selectorText = node.prelude ? generateFromNode(node.prelude).trim() : "";

  const ruleImpl = CSSPageRule.createImpl(globalObject, [], {
    selectorText,
    parentStyleSheet: parentSheet,
    parentRule
  });

  if (node.block && node.block.children) {
    populateDeclarations(node.block, ruleImpl._style);
  }

  return ruleImpl;
}

function translateCounterStyleRule(node, globalObject, parentSheet, parentRule) {
  const name = node.prelude ? generateFromNode(node.prelude).trim() : "";

  const ruleImpl = CSSCounterStyleRule.createImpl(globalObject, [], {
    name,
    parentStyleSheet: parentSheet,
    parentRule
  });

  // Map CSS descriptor names (kebab-case) to impl property names (camelCase)
  const descriptorMap = new Map([
    ["system", "system"],
    ["symbols", "symbols"],
    ["additive-symbols", "additiveSymbols"],
    ["negative", "negative"],
    ["prefix", "prefix"],
    ["suffix", "suffix"],
    ["range", "range"],
    ["pad", "pad"],
    ["speak-as", "speakAs"],
    ["fallback", "fallback"]
  ]);

  if (node.block && node.block.children) {
    for (const child of node.block.children.toArray()) {
      if (child.type === "Declaration") {
        const propName = descriptorMap.get(child.property);
        if (propName) {
          ruleImpl._descriptors[propName] = generateFromNode(child.value).trim();
        }
      }
    }
  }

  return ruleImpl;
}

/**
 * Populate a CSSStyleDeclaration from a css-tree block's declaration children.
 */
function populateDeclarations(block, style) {
  for (const child of block.children.toArray()) {
    if (child.type === "Declaration") {
      const { property } = child;
      const value = generateFromNode(child.value).trim();
      const priority = child.important ? "important" : "";
      style.setProperty(property, value, priority);
    }
  }
}

/**
 * Populate a CSSStyleRule's declarations and nested rules from a block.
 * Declarations go into the rule's style; nested rules go into cssRules.
 * Consecutive declarations after nested rules become CSSNestedDeclarations.
 */
function populateDeclarationsAndNestedRules(block, ruleImpl, globalObject, parentSheet) {
  const ruleWrapper = wrapperForImpl(ruleImpl);

  let hasSeenNestedRule = false;
  let pendingDeclarations = [];

  for (const child of block.children.toArray()) {
    if (child.type === "Declaration") {
      // CSS nesting disambiguation: if a non-custom-property declaration's raw value
      // contains a top-level {}-block, the parser misinterpreted a nested rule as a
      // declaration (e.g. "color:hover {} --y:2" is really rule "color:hover {}" + decl "--y:2").
      const rawValue = child.value && child.value.type === "Raw" ? child.value.value : "";
      if (!child.property.startsWith("--") && containsTopLevelBrace(rawValue)) {
        const split = splitMisinterpretedRule(child.property, rawValue, globalObject, parentSheet, ruleWrapper);
        if (split) {
          if (pendingDeclarations.length > 0) {
            flushNestedDeclarations(pendingDeclarations, globalObject, parentSheet, ruleWrapper, ruleImpl);
            pendingDeclarations = [];
          }
          hasSeenNestedRule = true;
          if (split.rule) {
            ruleImpl.cssRules._list.push(split.rule);
          }
          for (const decl of split.remainingDeclarations) {
            pendingDeclarations.push(decl);
          }
          continue;
        }
      }

      if (hasSeenNestedRule) {
        pendingDeclarations.push(child);
      } else {
        const { property } = child;
        const value = generateFromNode(child.value).trim();
        const priority = child.important ? "important" : "";
        ruleImpl._style.setProperty(property, value, priority);
      }
    } else if (child.type === "Rule" || child.type === "Atrule") {
      // @font-face is not valid inside a style rule (nested context)
      if (child.type === "Atrule" && child.name.toLowerCase() === "font-face") {
        continue;
      }

      // Flush any pending declarations as CSSNestedDeclarations
      if (pendingDeclarations.length > 0) {
        flushNestedDeclarations(pendingDeclarations, globalObject, parentSheet, ruleWrapper, ruleImpl);
        pendingDeclarations = [];
      }

      hasSeenNestedRule = true;
      const childRule = translateNode(child, globalObject, parentSheet, ruleWrapper);
      if (childRule) {
        ruleImpl.cssRules._list.push(childRule);
      }
    } else if (child.type === "Raw") {
      // css-tree doesn't recognize most nested rules (relative selectors, selectors
      // not starting with &). They end up as Raw nodes. Re-parse to extract them.
      const nestedRules = parseRawAsNestedRules(child.value, globalObject, parentSheet, ruleWrapper);
      if (nestedRules.length > 0) {
        if (pendingDeclarations.length > 0) {
          flushNestedDeclarations(pendingDeclarations, globalObject, parentSheet, ruleWrapper, ruleImpl);
          pendingDeclarations = [];
        }
        hasSeenNestedRule = true;
        for (const nestedRule of nestedRules) {
          ruleImpl.cssRules._list.push(nestedRule);
        }
      }
    }
  }

  // Flush any remaining pending declarations
  if (pendingDeclarations.length > 0) {
    flushNestedDeclarations(pendingDeclarations, globalObject, parentSheet, ruleWrapper, ruleImpl);
  }
}

/**
 * Try to parse a Raw node's text as nested rules and declarations.
 * css-tree doesn't recognize many nested selectors (relative selectors like "> .bar",
 * selectors not starting with "&" like ".foo", "div&", etc.). These end up as Raw nodes
 * containing text like "> .bar { color: green; }". We re-parse this text as a stylesheet
 * and also handle any remaining Raw/Declaration fragments as CSSNestedDeclarations.
 */
function parseRawAsNestedRules(rawText, globalObject, parentSheet, parentRule) {
  const rules = [];
  try {
    const ast = csstree.parse(rawText, {
      context: "stylesheet",
      parseCustomProperty: true,
      parseAtrulePrelude: false,
      parseRulePrelude: false,
      parseValue: false,
      tolerant: true
    });
    for (const child of ast.children.toArray()) {
      if (child.type === "Raw") {
        // Raw at top level may contain declarations like "--z:1;".
        // Try to parse as declarations.
        const declRule = parseRawAsDeclarations(child.value, globalObject, parentSheet, parentRule);
        if (declRule) {
          rules.push(declRule);
        }
      } else {
        const ruleImpl = translateNode(child, globalObject, parentSheet, parentRule);
        if (ruleImpl) {
          rules.push(ruleImpl);
        }
      }
    }
  } catch {
    // If parsing fails, return empty
  }
  return rules;
}

/**
 * Parse raw text as declarations, wrapping them in CSSNestedDeclarations.
 */
function parseRawAsDeclarations(rawText, globalObject, parentSheet, parentRule) {
  try {
    const ast = csstree.parse(rawText, {
      context: "declarationList",
      parseCustomProperty: true,
      parseValue: false,
      tolerant: true
    });
    const children = ast.children ? ast.children.toArray() : [];
    const declarations = children.filter(c => c.type === "Declaration");
    if (declarations.length === 0) {
      return null;
    }
    const nestedDeclImpl = CSSNestedDeclarations.createImpl(globalObject, [], {
      parentStyleSheet: parentSheet,
      parentRule
    });
    for (const decl of declarations) {
      const value = generateFromNode(decl.value).trim();
      const priority = decl.important ? "important" : "";
      nestedDeclImpl._style.setProperty(decl.property, value, priority);
    }
    return nestedDeclImpl;
  } catch {
    return null;
  }
}

function flushNestedDeclarations(declarations, globalObject, parentSheet, parentRule, parentRuleImpl) {
  const nestedDeclImpl = CSSNestedDeclarations.createImpl(globalObject, [], {
    parentStyleSheet: parentSheet,
    parentRule
  });

  for (const decl of declarations) {
    const { property } = decl;
    const value = generateFromNode(decl.value).trim();
    const priority = decl.important ? "important" : "";
    nestedDeclImpl._style.setProperty(property, value, priority);
  }

  parentRuleImpl.cssRules._list.push(nestedDeclImpl);
}

/**
 * Try to parse text as declarations and wrap them in a CSSNestedDeclarations rule.
 * Used by insertRule in nesting context when the text is declaration-only.
 *
 * @param {string} text - Declaration text (e.g. "width: 100px; height: 200px;")
 * @param {object} globalObject - The global object.
 * @returns {object|null} CSSNestedDeclarations impl, or null if no valid declarations.
 */
function parseDeclarationsAsNestedRule(text, globalObject) {
  lazyLoad();

  // Parse the declarations by wrapping in a dummy rule
  const wrapped = `_dummy { ${text} }`;
  let ast;
  try {
    ast = csstree.parse(wrapped, {
      context: "stylesheet",
      parseCustomProperty: true,
      parseRulePrelude: false,
      parseValue: false,
      tolerant: true
    });
  } catch {
    return null;
  }

  const rule = ast.children ? ast.children.toArray()[0] : null;
  if (!rule || rule.type !== "Rule" || !rule.block) {
    return null;
  }

  const nestedDeclImpl = CSSNestedDeclarations.createImpl(globalObject, [], {});
  for (const child of rule.block.children.toArray()) {
    if (child.type === "Declaration") {
      const { property } = child;
      const value = generateFromNode(child.value).trim();
      const priority = child.important ? "important" : "";
      nestedDeclImpl._style.setProperty(property, value, priority);
    }
  }

  // Only return if at least one property was actually accepted
  return nestedDeclImpl._style.length > 0 ? nestedDeclImpl : null;
}

exports.parseStylesheet = parseStylesheet;
exports.parseRule = parseRule;
exports.parseKeyframeRule = parseKeyframeRule;
exports.parseDeclarationsAsNestedRule = parseDeclarationsAsNestedRule;
