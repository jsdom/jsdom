"use strict";

const DOMException = require("../../../../generated/idl/DOMException.js");
const csstree = require("./patched-csstree.js");
const CSSStyleSheet = require("../../../../generated/idl/CSSStyleSheet.js");
const CSSStyleRule = require("../../../../generated/idl/CSSStyleRule.js");
const CSSMediaRule = require("../../../../generated/idl/CSSMediaRule.js");
const CSSImportRule = require("../../../../generated/idl/CSSImportRule.js");
const CSSFontFaceRule = require("../../../../generated/idl/CSSFontFaceRule.js");
const CSSKeyframesRule = require("../../../../generated/idl/CSSKeyframesRule.js");
const CSSKeyframeRule = require("../../../../generated/idl/CSSKeyframeRule.js");
const CSSSupportsRule = require("../../../../generated/idl/CSSSupportsRule.js");
const CSSContainerRule = require("../../../../generated/idl/CSSContainerRule.js");
const CSSScopeRule = require("../../../../generated/idl/CSSScopeRule.js");
const CSSLayerBlockRule = require("../../../../generated/idl/CSSLayerBlockRule.js");
const CSSLayerStatementRule = require("../../../../generated/idl/CSSLayerStatementRule.js");
const CSSNamespaceRule = require("../../../../generated/idl/CSSNamespaceRule.js");
const CSSPageRule = require("../../../../generated/idl/CSSPageRule.js");
const CSSNestedDeclarations = require("../../../../generated/idl/CSSNestedDeclarations.js");
const CSSCounterStyleRule = require("../../../../generated/idl/CSSCounterStyleRule.js");

const CSS_IDENT_RE = /^(?:--|-?[a-zA-Z_\u0080-\uFFFF])[a-zA-Z0-9_\u0080-\uFFFF-]*$/;

const counterStyleDescriptorMap = new Map([
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

const STYLESHEET_PARSE_OPTIONS = {
  context: "stylesheet",
  parseCustomProperty: true,
  parseAtrulePrelude: false,
  parseRulePrelude: false,
  parseValue: false,
  tolerant: true
};

/**
 * Parse CSS text into an existing CSSStyleSheet impl, appending rules.
 *
 * @param {string} cssText - The CSS text to parse.
 * @param {object} globalObject - The global object.
 * @param {object} sheetImpl - The existing CSSStyleSheet impl to populate.
 * @param {Function} [onError] - Error callback.
 */
function parseIntoStyleSheet(cssText, globalObject, sheetImpl, onError) {
  let ast;
  try {
    ast = csstree.parse(cssText, {
      ...STYLESHEET_PARSE_OPTIONS,
      onParseError: onError
    });
  } catch (e) {
    if (onError) {
      onError(e);
    }
    return;
  }

  for (const node of ast.children) {
    const ruleImpl = translateNode(node, globalObject, sheetImpl, null);
    if (ruleImpl) {
      sheetImpl.cssRules._list.push(ruleImpl);
    }
  }
}

/**
 * Parse a CSS stylesheet string into a new CSSStyleSheet impl.
 *
 * @param {string} cssText - The CSS text to parse.
 * @param {object} globalObject - The global object.
 * @param {object} [options] - Options.
 * @param {string} [options.href] - The stylesheet href.
 * @param {string} [options.title] - The stylesheet title.
 * @param {object} [options.ownerNode] - The owner node.
 * @param {object} [options.ownerRule] - The owner CSSRule (for @import).
 * @param {string} [options.mediaText] - The media text.
 * @param {Function} [options.onError] - Error callback.
 * @returns {object} CSSStyleSheet impl.
 */
function parseStyleSheet(cssText, globalObject, { href, title, ownerNode, ownerRule, mediaText, onError } = {}) {
  const sheetImpl = CSSStyleSheet.createImpl(globalObject, [], {
    href: href ?? null,
    title: title ?? null,
    ownerNode: ownerNode ?? null,
    ownerRule: ownerRule ?? null,
    mediaText: mediaText ?? "",
    constructed: false
  });

  parseIntoStyleSheet(cssText, globalObject, sheetImpl, onError);

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
  // Parse the text as a stylesheet to check for exactly one rule.
  // We check the AST directly because translateNode returns null for
  // unrecognized nodes (e.g. trailing garbage parsed as Raw).
  let ast;
  try {
    ast = csstree.parse(ruleText, STYLESHEET_PARSE_OPTIONS);
  } catch {
    throw DOMException.create(globalObject, [
      "Failed to parse the rule.",
      "SyntaxError"
    ]);
  }

  if (!ast.children || ast.children.size !== 1) {
    throw DOMException.create(globalObject, [
      "Failed to parse the rule.",
      "SyntaxError"
    ]);
  }

  const rule = translateNode(ast.children.first, globalObject, null, null);
  if (!rule) {
    throw DOMException.create(globalObject, [
      "Failed to parse the rule.",
      "SyntaxError"
    ]);
  }

  return rule;
}

/**
 * Parse a keyframe rule string into a CSSKeyframeRule impl.
 *
 * @param {string} ruleText - The keyframe rule text (e.g. "from { opacity: 0 }").
 * @param {object} globalObject - The global object.
 * @returns {object|null} CSSKeyframeRule impl, or null if parsing fails.
 */
function parseKeyframeRule(ruleText, globalObject) {
  // Parse as a keyframes block to get individual keyframe rules.
  // The spec says the input is "expressed in the same syntax as one entry in the @keyframes rule",
  // so we require exactly one keyframe rule. If parsing fails or produces != 1 rule, return null.
  const wrapped = `@keyframes _temp { ${ruleText} }`;
  let ast;
  try {
    ast = csstree.parse(wrapped, STYLESHEET_PARSE_OPTIONS);
  } catch {
    return null;
  }

  const keyframesNode = ast.children.first;
  if (!keyframesNode || keyframesNode.type !== "Atrule" || !keyframesNode.block) {
    return null;
  }

  let keyframeCount = 0;
  let keyframeNode = null;
  for (const child of keyframesNode.block.children) {
    if (child.type === "Rule") {
      keyframeCount++;
      keyframeNode = child;
    }
  }
  if (keyframeCount !== 1) {
    return null;
  }

  const keyText = keyframeNode.prelude ? csstree.generate(keyframeNode.prelude).trim() : "";
  const keyframeImpl = CSSKeyframeRule.createImpl(globalObject, [], {
    keyText,
    parentStyleSheet: null,
    parentRule: null
  });

  if (keyframeNode.block && keyframeNode.block.children) {
    populateDeclarations(keyframeNode.block, keyframeImpl._style);
  }

  return keyframeImpl;
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

function applyDeclaration(style, decl) {
  const value = csstree.generate(decl.value).trim();
  const priority = decl.important ? "important" : "";
  style.setProperty(decl.property, value, priority);
}

function normalizeAndValidateNestedSelector(selectorText, parentRule) {
  if (!parentRule || !isInsideStyleRule(parentRule) || CSSScopeRule.isImpl(parentRule)) {
    return selectorText;
  }
  selectorText = normalizeNestedSelector(selectorText);
  if (/&[a-zA-Z]/.test(selectorText)) {
    return null;
  }
  return selectorText;
}

function translateStyleRule(node, globalObject, parentSheet, parentRule) {
  let selectorText = node.prelude ? csstree.generate(node.prelude) : "";

  selectorText = normalizeAndValidateNestedSelector(selectorText, parentRule);
  if (selectorText === null) {
    return null;
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

// Find the index of `targetChar` at depth 0 (where depth is tracked by parens/brackets).
function findAtDepthZero(text, targetChar, start = 0) {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === "(" || ch === "[") {
      depth++;
    } else if (ch === ")" || ch === "]") {
      depth--;
    } else if (ch === targetChar && depth === 0) {
      return i;
    }
  }
  return -1;
}

// Find the index of the closing char that matches the open char at `start`.
function findMatchingClose(text, openChar, closeChar, start) {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === openChar) {
      depth++;
    } else if (ch === closeChar) {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }
  return -1;
}

// Split a selector list on commas, respecting parentheses and brackets.
function splitSelectorList(text) {
  const result = [];
  let start = 0;
  let idx;
  while ((idx = findAtDepthZero(text, ",", start)) !== -1) {
    result.push(text.slice(start, idx));
    start = idx + 1;
  }
  result.push(text.slice(start));
  return result;
}

// Per the CSS Nesting spec, nested selectors get an implicit & prepended when:
// - The selector starts with a combinator (relative selector): always prepend "& "
// - Otherwise: prepend "& " only if it doesn't already contain "&"
function normalizeNestedSelector(selectorText) {
  const selectors = splitSelectorList(selectorText);
  return selectors.map(sel => {
    const trimmed = sel.trim();
    if (/^[>+~]/.test(trimmed)) {
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
    if (CSSStyleRule.isImpl(rule)) {
      return true;
    }
    rule = rule.parentRule;
  }
  return false;
}

function containsTopLevelBrace(text) {
  return findAtDepthZero(text, "{") !== -1;
}

// When css-tree misinterprets a nested rule as a declaration (e.g. property "color",
// value "hover {} --y: 2"), split it back into a CSSStyleRule and remaining declarations.
function splitMisinterpretedRule(property, rawValue, globalObject, parentSheet, parentRule) {
  const fullText = property + ":" + rawValue;

  const braceStart = findAtDepthZero(fullText, "{");
  if (braceStart === -1) {
    return null;
  }

  const braceEnd = findMatchingClose(fullText, "{", "}", braceStart);
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

  selectorText = normalizeAndValidateNestedSelector(selectorText, parentRule);
  if (selectorText === null) {
    return null;
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
      for (const decl of blockAst.children) {
        if (decl.type === "Declaration") {
          applyDeclaration(ruleImpl._style, decl);
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
      for (const decl of remAst.children) {
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
  const inNestingContext = parentRule && isInsideStyleRule(parentRule);

  if (inNestingContext) {
    let pendingDeclarations = [];
    for (const child of block.children) {
      if (child.type === "Declaration") {
        pendingDeclarations.push(child);
      } else if (child.type === "Rule" || child.type === "Atrule") {
        if (pendingDeclarations.length > 0) {
          flushNestedDeclarations(pendingDeclarations, globalObject, parentSheet, ruleImpl);
          pendingDeclarations = [];
        }
        const childRule = translateNode(child, globalObject, parentSheet, ruleImpl);
        if (childRule) {
          ruleImpl.cssRules._list.push(childRule);
        }
      } else if (child.type === "Raw") {
        const nestedRules = parseRawAsNestedRules(child.value, globalObject, parentSheet, ruleImpl);
        if (nestedRules.length > 0) {
          if (pendingDeclarations.length > 0) {
            flushNestedDeclarations(pendingDeclarations, globalObject, parentSheet, ruleImpl);
            pendingDeclarations = [];
          }
          for (const nestedRule of nestedRules) {
            ruleImpl.cssRules._list.push(nestedRule);
          }
        }
      }
    }
    if (pendingDeclarations.length > 0) {
      flushNestedDeclarations(pendingDeclarations, globalObject, parentSheet, ruleImpl);
    }
  } else {
    for (const child of block.children) {
      if (child.type === "Raw") {
        const nestedRules = parseRawAsNestedRules(child.value, globalObject, parentSheet, ruleImpl);
        for (const nestedRule of nestedRules) {
          ruleImpl.cssRules._list.push(nestedRule);
        }
      } else {
        const childRule = translateNode(child, globalObject, parentSheet, ruleImpl);
        if (childRule) {
          ruleImpl.cssRules._list.push(childRule);
        }
      }
    }
  }
}

function translateMediaRule(node, globalObject, parentSheet, parentRule) {
  const conditionText = node.prelude ? csstree.generate(node.prelude) : "";

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
  // Use the raw prelude text when available so nested declaration/media spacing
  // survives csstree reparsing. Fallback to generate() for non-Raw preludes.
  let preludeText = "";
  if (node.prelude) {
    preludeText = node.prelude.type === "Raw" ? node.prelude.value : csstree.generate(node.prelude);
  }

  let href = "";
  let mediaText = "";
  let layerName = null;
  let supportsText = null;

  // Use css-tree to parse the prelude structurally for href and layer
  try {
    const parsed = csstree.parse(preludeText, { context: "atrulePrelude", atrule: "import", positions: true });

    // Check for layer() function and bare "layer" keyword among direct children only,
    // so nested uses inside supports() or media queries never get mistaken for the
    // top-level @import modifiers.
    let layerFnNode = null;
    for (const child of parsed.children) {
      if (child.type === "Url") {
        href = child.value;
        continue;
      }
      if (child.type === "String") {
        if (!href) {
          href = child.value;
        }
        continue;
      }
      if (child.type === "MediaQueryList") {
        const mqText = preludeText.slice(child.loc.start.offset, child.loc.end.offset).trim();
        if (mqText) {
          mediaText = mqText;
        }
        continue;
      }
      if (child.type === "Function" && child.name === "layer") {
        layerFnNode = child;
        if (child.children) {
          layerName = csstree.generate({ type: "Value", children: child.children });
        } else {
          layerName = "";
        }
        break;
      }
      if (child.type === "Identifier" && child.name === "layer") {
        layerName = "";
        break;
      }
    }

    // Validate layer name: layer() with function syntax must have a valid <layer-name>.
    // Invalid layer() declarations (empty, spaces, commas) should be treated as
    // <general-enclosed> media queries per the CSS spec.
    if (layerFnNode && layerName !== null && !isValidLayerName(layerName)) {
      mediaText = csstree.generate(layerFnNode);
      layerName = null;
    }
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
    const parenOpen = supportsIdx + "supports".length;
    const parenClose = findMatchingClose(preludeText, "(", ")", parenOpen);
    if (parenClose !== -1) {
      supportsText = preludeText.slice(parenOpen + 1, parenClose);
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
  const name = node.prelude ? csstree.generate(node.prelude).trim() : "";

  const ruleImpl = CSSKeyframesRule.createImpl(globalObject, [], {
    name,
    parentStyleSheet: parentSheet,
    parentRule
  });

  if (node.block && node.block.children) {
    for (const child of node.block.children) {
      if (child.type === "Rule") {
        const keyText = child.prelude ? csstree.generate(child.prelude).trim() : "";
        const keyframeImpl = CSSKeyframeRule.createImpl(globalObject, [], {
          keyText,
          parentStyleSheet: parentSheet,
          parentRule: ruleImpl
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
  const conditionText = node.prelude ? csstree.generate(node.prelude) : "";

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
  let containerName = "";
  let containerQuery = "";

  if (node.prelude) {
    const preludeText = csstree.generate(node.prelude);
    let parsed;
    try {
      parsed = csstree.parse(preludeText, { context: "atrulePrelude", atrule: "container" });
    } catch {
      return null;
    }
    const firstChild = parsed.children.first;
    if (firstChild && firstChild.type === "Identifier") {
      containerName = firstChild.name;
      containerQuery = preludeText.slice(containerName.length).trim();
    } else {
      containerQuery = preludeText;
    }
  }

  const ruleImpl = CSSContainerRule.createImpl(globalObject, [], {
    containerName,
    containerQuery,
    parentStyleSheet: parentSheet,
    parentRule
  });

  if (node.block && node.block.children) {
    populateGroupingRuleChildren(node.block, ruleImpl, globalObject, parentSheet, parentRule);
  }

  return ruleImpl;
}

function translateScopeRule(node, globalObject, parentSheet, parentRule) {
  const prelude = node.prelude ? csstree.generate(node.prelude).trim() : "";

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
  // Try parsing as a selector list to catch syntactically invalid selectors
  try {
    const ast = csstree.parse(selectorText, { context: "selectorList" });
    let valid = true;
    csstree.walk(ast, {
      visit: "Selector",
      enter(sel) {
        let hasNonCombinator = false;
        sel.children.forEach(child => {
          if (child.type !== "Combinator") {
            hasNonCombinator = true;
          }
          // Pseudo-elements are not valid scope boundaries
          if (child.type === "PseudoElementSelector") {
            valid = false;
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
  if (name.length === 0 || /[\s,]/.test(name)) {
    return false;
  }
  const segments = name.split(".");
  return segments.every(seg => CSS_IDENT_RE.test(seg));
}

function translateLayerRule(node, globalObject, parentSheet, parentRule) {
  const prelude = node.prelude ? csstree.generate(node.prelude).trim() : "";

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
  const prelude = node.prelude ? csstree.generate(node.prelude).trim() : "";

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
  const selectorText = node.prelude ? csstree.generate(node.prelude).trim() : "";

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
  const name = node.prelude ? csstree.generate(node.prelude).trim() : "";

  const ruleImpl = CSSCounterStyleRule.createImpl(globalObject, [], {
    name,
    parentStyleSheet: parentSheet,
    parentRule
  });

  if (node.block && node.block.children) {
    for (const child of node.block.children) {
      if (child.type === "Declaration") {
        const propName = counterStyleDescriptorMap.get(child.property);
        if (propName) {
          ruleImpl[propName] = csstree.generate(child.value).trim();
        }
      }
    }
  }

  return ruleImpl;
}

function populateDeclarations(block, style) {
  for (const child of block.children) {
    if (child.type === "Declaration") {
      applyDeclaration(style, child);
    }
  }
}

function populateDeclarationsAndNestedRules(block, ruleImpl, globalObject, parentSheet) {
  let hasSeenNestedRule = false;
  let pendingDeclarations = [];

  for (const child of block.children) {
    if (child.type === "Declaration") {
      // CSS nesting disambiguation: if a non-custom-property declaration's raw value
      // contains a top-level {}-block, the parser misinterpreted a nested rule as a
      // declaration (e.g. "color:hover {} --y:2" is really rule "color:hover {}" + decl "--y:2").
      const rawValue = child.value && child.value.type === "Raw" ? child.value.value : "";
      if (!child.property.startsWith("--") && containsTopLevelBrace(rawValue)) {
        const split = splitMisinterpretedRule(child.property, rawValue, globalObject, parentSheet, ruleImpl);
        if (split) {
          if (pendingDeclarations.length > 0) {
            flushNestedDeclarations(pendingDeclarations, globalObject, parentSheet, ruleImpl);
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
        applyDeclaration(ruleImpl._style, child);
      }
    } else if (child.type === "Rule" || child.type === "Atrule") {
      // Flush any pending declarations as CSSNestedDeclarations
      if (pendingDeclarations.length > 0) {
        flushNestedDeclarations(pendingDeclarations, globalObject, parentSheet, ruleImpl);
        pendingDeclarations = [];
      }

      hasSeenNestedRule = true;
      const childRule = translateNode(child, globalObject, parentSheet, ruleImpl);
      if (childRule) {
        ruleImpl.cssRules._list.push(childRule);
      }
    } else if (child.type === "Raw") {
      // css-tree doesn't recognize most nested rules (relative selectors, selectors
      // not starting with &). They end up as Raw nodes. Re-parse to extract them.
      const nestedRules = parseRawAsNestedRules(child.value, globalObject, parentSheet, ruleImpl);
      if (nestedRules.length > 0) {
        if (pendingDeclarations.length > 0) {
          flushNestedDeclarations(pendingDeclarations, globalObject, parentSheet, ruleImpl);
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
    flushNestedDeclarations(pendingDeclarations, globalObject, parentSheet, ruleImpl);
  }
}

function parseRawAsNestedRules(rawText, globalObject, parentSheet, parentRule) {
  const rules = [];
  try {
    const ast = csstree.parse(rawText, STYLESHEET_PARSE_OPTIONS);
    for (const child of ast.children) {
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

function parseRawAsDeclarations(rawText, globalObject, parentSheet, parentRule) {
  try {
    const ast = csstree.parse(rawText, {
      context: "declarationList",
      parseCustomProperty: true,
      parseValue: false,
      tolerant: true
    });
    const nestedDeclImpl = CSSNestedDeclarations.createImpl(globalObject, [], {
      parentStyleSheet: parentSheet,
      parentRule
    });
    let hasDeclarations = false;
    for (const child of ast.children) {
      if (child.type === "Declaration") {
        hasDeclarations = true;
        applyDeclaration(nestedDeclImpl._style, child);
      }
    }
    return hasDeclarations ? nestedDeclImpl : null;
  } catch {
    return null;
  }
}

function flushNestedDeclarations(declarations, globalObject, parentSheet, parentRule) {
  const nestedDeclImpl = CSSNestedDeclarations.createImpl(globalObject, [], {
    parentStyleSheet: parentSheet,
    parentRule
  });

  for (const decl of declarations) {
    applyDeclaration(nestedDeclImpl._style, decl);
  }

  parentRule.cssRules._list.push(nestedDeclImpl);
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

  const rule = ast.children ? ast.children.first : null;
  if (!rule || rule.type !== "Rule" || !rule.block) {
    return null;
  }

  const nestedDeclImpl = CSSNestedDeclarations.createImpl(globalObject, [], {
    parentRule: null,
    parentStyleSheet: null
  });
  // Reject inputs with non-declaration content (e.g. trailing garbage parsed as Raw)
  for (const child of rule.block.children) {
    if (child.type !== "Declaration") {
      return null;
    }
    applyDeclaration(nestedDeclImpl._style, child);
  }

  // Only return if at least one property was actually accepted
  return nestedDeclImpl._style.length > 0 ? nestedDeclImpl : null;
}

exports.parseStyleSheet = parseStyleSheet;
exports.parseIntoStyleSheet = parseIntoStyleSheet;
exports.parseRule = parseRule;
exports.parseKeyframeRule = parseKeyframeRule;
exports.parseDeclarationsAsNestedRule = parseDeclarationsAsNestedRule;
