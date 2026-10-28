"use strict";
const selectorSyntax = require("./utils/selector-syntax.js");

const windowEnvironment = require("../window/environment.js");

exports.getComputedValue = getComputedValue;
exports.getInitialValue = getInitialValue;
exports.getResolvedValue = getResolvedValue;
exports.getSpecifiedValue = getSpecifiedValue;
exports.getUsedValue = getUsedValue;
const CSSContainerRule = require("../../../generated/idl/CSSContainerRule.js");
const CSSImportRule = require("../../../generated/idl/CSSImportRule.js");
const CSSLayerBlockRule = require("../../../generated/idl/CSSLayerBlockRule.js");
const CSSMediaRule = require("../../../generated/idl/CSSMediaRule.js");
const CSSNestedDeclarations = require("../../../generated/idl/CSSNestedDeclarations.js");
const CSSPseudoElement = require("../../../generated/idl/CSSPseudoElement.js");
const CSSScopeRule = require("../../../generated/idl/CSSScopeRule.js");
const CSSStyleRule = require("../../../generated/idl/CSSStyleRule.js");
const CSSSupportsRule = require("../../../generated/idl/CSSSupportsRule.js");
const values = require("./values/value.js");
const mediaSyntax = require("./values/media.js");
const valueSources = require("./values/source.js");
const dom = require("./utils/dom.js");
const fonts = require("./utils/font.js");
const { getFlowSides } = require("./utils/writing-mode.js");
const ruleIndexes = require("./utils/rule-index.js");
const { getStyleScope } = require("./utils/style-scope.js");
const { getDocumentStyleState, getStyleSheets } = require("./utils/style.js");
const cssState = require("./state.js");
const {
  compareSpecificities,
  getHighestSpecificity,
  getSelectorSpecificity,
} = require("./utils/selector-specificity.js");
const selectorMatcher = require("./match/selector.js");
const dimensions = require("./values/dimension.js");
const math = require("./utils/math.js");
const colorSchemes = require("./utils/color-scheme.js");
const urls = require("./utils/url.js");
const { HTML_NS, MATHML_NS } = require("../helpers/namespaces.js");
const { copyString, toLowerCase } = require("./utils/string.js");
const { resolveColor } = require("./utils/resolve-color.js");
const { getRegisteredProperties } = require("./utils/registered-properties.js");
const importRules = require("./CSSImportRule-impl.js");
const containers = require("./match/container.js");
const supports = require("./match/support.js");
const media = require("./match/media.js");
const shorthands = require("./properties/shorthands.js");
const expandShorthand = require("./parse/shorthand.js");
const parser = require("./parse/parser.js");
const parseContext = require("./parse/context.js");
const propertyDefinitions = require("../../../generated/css-property-definitions.js");
const logicalProperties = require("./utils/logical-properties.js");
const serialize = require("./serialize.js");
const simplify = require("./simplify.js");
const USER_AGENT_ORIGIN = 1;
const AUTHOR_ORIGIN = 3;
const zeroSpecificity = [0, 0, 0];
const cssWideKeywords = new Set(require("./values/substitutions.js").keywords);
const scopeRootCompound = selectorSyntax.compound(
  selectorSyntax.nesting,
  selectorSyntax.empty,
  null,
);
const scopeRootSelector = selectorSyntax.selector([scopeRootCompound]);
let initialValues, userAgentRuleIndex, transparentImage;

function isContainer(element, type) {
  if (type === "style") {
    return true;
  }
  const specified = getSpecifiedValue("container-type", element);
  if (specified.value === "normal") {
    return false;
  }
  if (type === "inline-size") {
    return specified[0].value.endsWith("size");
  }
  return specified.some((value) => value.value === type);
}

// Filtering

function getAbsoluteSelectors(selectors, context) {
  if ((!context.nesting && !context.scopes) || !selectors[0]?.relative) {
    return selectors;
  }
  return selectorSyntax.list(
    selectors.map((selector) => {
      const { units } = selector;
      const head = units[0];
      if (
        head.combinator === null &&
        selectorSyntax.containsNestingSelector(selector, Boolean(context.scopes))
      ) {
        return selectorSyntax.selector(units);
      }
      const anchor = selectorSyntax.compound(
        selectorSyntax.nesting,
        selectorSyntax.empty,
        head.pseudos === undefined ? undefined : null,
      );
      return selectorSyntax.selector([anchor, ...units]);
    }),
  );
}

function findScopingLimits(end, context) {
  if (values.isOmitted(end)) {
    return [];
  }
  const selectors = getAbsoluteSelectors(end[1].value, context);
  return selectorMatcher.matchTreesAgainstSelectors([context.root], selectors, context);
}

function findScopingRoots(start, context, parentStyleSheet) {
  if (values.isOmitted(start)) {
    return [parentStyleSheet.ownerNode?.parentElement ?? context.root._host ?? context.root];
  }
  const selectors = getAbsoluteSelectors(start.value, context);
  return selectorMatcher.matchTreesAgainstSelectors([context.root], selectors, context);
}

function computeStyleEligibility(element) {
  if (element === null) {
    return false;
  }
  if (CSSPseudoElement.isImpl(element)) {
    return hasResolvedStyle(element.element);
  }
  if (!element.isConnected || element._ownerDocument._isDestroyed) {
    return false;
  }
  for (let current = element; current;) {
    if (current._assignedSlot) {
      current = current._assignedSlot;
      continue;
    }
    const parent = current.parentElement;
    if (parent) {
      if (
        parent._shadowRoot ||
        (dom.isHTMLElement(parent, "slot") && parent._assignedNodes.length > 0)
      ) {
        return false;
      }
      current = parent;
    } else {
      current = current.parentNode?._host;
    }
  }
  const window = element.getRootNode({ composed: true }).defaultView;
  if (!window) {
    return false;
  }
  for (
    let document = element._ownerDocument;
    document._parentDocument;
    document = document._parentDocument
  ) {
    const frame = document._defaultView._frameElement;
    if (!hasResolvedStyle(frame)) {
      return false;
    }
    for (let ancestor = frame; ancestor; ancestor = getInheritanceParent(ancestor)) {
      if (getResolvedPropertyValue("display", ancestor) === "none") {
        return false;
      }
    }
  }
  return true;
}

function hasResolvedStyle(element) {
  if (element === null) {
    return false;
  }
  const state = getStyleState(element);
  state.eligibility ??= computeStyleEligibility(element);
  return state.eligibility;
}
exports.hasResolvedStyle = hasResolvedStyle;

// CSS syntax and declarations survive mutations; only the DOM-dependent cascade and values
// are replaced when the document's style generation changes.
function getStyleState(element) {
  const isElement = element.nodeType === 1;
  const cache = isElement
    ? (getDocumentStyleState(element._ownerDocument).elements ??= new WeakMap())
    : (getStyleState(element.parent).pseudos ??= new Map());
  const key = isElement ? element : element.selectorText;
  let state = cache.get(key);
  if (!state) {
    state = createStyleState();
    cache.set(key, state);
  }
  return state;
}

function createStyleState() {
  return {
    pseudos: null,
    candidates: null,
    eligibility: null,
    declared: new Map(),
    specified: new Map(),
    baseURLs: new Map(),
    computed: new Map(),
    computing: [],
    cyclic: new Set(),
    resolved: new Map(),
    serialized: new Map(),
    names: null,
    substitutions: new Map(),
  };
}

function createContext(root, origin) {
  let encapsulation = 0;
  for (let tree = root; tree._host; tree = tree._host.getRootNode()) {
    encapsulation++;
  }
  return {
    root,
    origin,
    encapsulation,
    layer: null,
    namespaces: new Map(),
    nesting: null,
    nestingSpecificity: [0, 0, 0],
  };
}

function collectRuleCandidates(element, rules, context, candidates) {
  const index = ruleIndexes.getRuleListIndex(context.sheetPlan, rules);
  for (const rule of ruleIndexes.selectRules(index, element)) {
    if (CSSStyleRule.isImpl(rule)) {
      const selectors = getAbsoluteSelectors(rule._selectors, context);
      candidates.push({
        style: rule.style,
        selectors,
        context,
        matched: null,
        specificity: null,
      });
      if (rule._rules.length > 0) {
        collectRuleCandidates(
          element,
          rule._rules,
          {
            ...context,
            nesting: { selectors, context },
            nestingSpecificity: getHighestSpecificity(
              selectors.map((selector) =>
                getSelectorSpecificity(selector, context.nestingSpecificity),
              ),
            ),
          },
          candidates,
        );
      }
    } else if (CSSNestedDeclarations.isImpl(rule)) {
      const { selectors, context: parentContext } = context.nesting ?? {
        selectors: [scopeRootSelector],
        context,
      };
      candidates.push({
        style: rule.style,
        selectors,
        context: parentContext,
        matched: null,
        specificity: null,
      });
    } else if (CSSImportRule.isImpl(rule)) {
      if (
        rule.styleSheet &&
        importRules.isMatchingImportConditions(rule, element.ownerDocument.defaultView)
      ) {
        let importedContext = context;
        if (rule.layerName !== null) {
          importedContext = { ...context, layer: context.styleScope.ruleLayers.get(rule) };
        }
        if (rule._scope) {
          const boundary = rule._scope.value;
          let start = values.omitted;
          let end = values.omitted;
          if (values.isFunction(rule._scope) && !values.isOmitted(boundary)) {
            if (boundary.kind === "selector-list") {
              start = { value: boundary };
            } else {
              [start, end] = boundary;
            }
          }
          for (const scopedContext of getScopeContexts(
            element,
            start,
            end,
            importedContext,
            rule.parentStyleSheet,
          )) {
            collectStyleSheetCandidates(element, rule.styleSheet, scopedContext, candidates);
          }
        } else {
          collectStyleSheetCandidates(element, rule.styleSheet, importedContext, candidates);
        }
      }
    } else if (CSSLayerBlockRule.isImpl(rule)) {
      collectRuleCandidates(
        element,
        rule._rules,
        {
          ...context,
          layer: context.styleScope.ruleLayers.get(rule),
        },
        candidates,
      );
    } else if (CSSMediaRule.isImpl(rule)) {
      if (media(rule.media._list, element.ownerDocument.defaultView)) {
        collectRuleCandidates(element, rule._rules, context, candidates);
      }
    } else if (CSSSupportsRule.isImpl(rule)) {
      if (rule.matches) {
        collectRuleCandidates(element, rule._rules, context, candidates);
      }
    } else if (CSSContainerRule.isImpl(rule)) {
      if (dom.findAncestorElement(element, (ancestor) => containers(rule._condition, ancestor))) {
        collectRuleCandidates(element, rule._rules, context, candidates);
      }
    } else if (CSSScopeRule.isImpl(rule)) {
      for (const scopedContext of getScopeContexts(
        element,
        rule._start,
        rule._end,
        context,
        rule.parentStyleSheet,
      )) {
        collectRuleCandidates(element, rule._rules, scopedContext, candidates);
      }
    }
  }
}

function* getScopeContexts(element, start, end, context, parentStyleSheet) {
  for (const root of findScopingRoots(start, context, parentStyleSheet)) {
    const proximity = getScopeProximity(element, root);
    if (proximity === Infinity) {
      continue;
    }
    const scopedContext = {
      ...context,
      nesting: null,
      nestingSpecificity: zeroSpecificity,
      scopeProximity: proximity,
      scopes: { inclusive: true, roots: [root] },
    };
    // The root can itself be a limit, making the scope empty.
    // https://github.com/w3c/csswg-drafts/issues/13545#issuecomment-6265841247
    const limits = findScopingLimits(end, scopedContext).filter(
      (limit) => getScopeProximity(limit, root) !== Infinity,
    );
    if (!limits.some((limit) => getScopeProximity(element, limit) !== Infinity)) {
      yield scopedContext;
    }
  }
}

function getScopeProximity(element, root) {
  let distance = 0;
  const subject = element.nodeType === 1 ? element : element.element;
  for (
    let ancestor = subject;
    ancestor;
    ancestor = ancestor.parentElement ?? ancestor.parentNode?._host
  ) {
    if (ancestor === root || ancestor === root.documentElement) {
      return distance;
    }
    distance++;
  }
  return Infinity;
}

function collectStyleSheetCandidates(element, sheet, context, candidates) {
  if (sheet.disabled || !media(sheet.media._list, element.ownerDocument.defaultView)) {
    return;
  }
  const sheetPlan = ruleIndexes.getStyleSheetPlan(sheet);
  collectRuleCandidates(
    element,
    sheet._rules,
    { ...context, sheetPlan, namespaces: sheetPlan.namespaces },
    candidates,
  );
}

function collectCandidates(element) {
  const root = element.getRootNode();
  const candidates = [];
  const userAgent = require("../../../generated/default-stylesheet.js");
  const userAgentContext = {
    ...createContext(root, USER_AGENT_ORIGIN),
    namespaces: userAgent.namespaces,
  };
  userAgentRuleIndex ??= ruleIndexes.createRuleIndex(userAgent.rules, (rule) => rule.selectors);
  for (const rule of ruleIndexes.selectRules(userAgentRuleIndex, element)) {
    if (rule.conditions.every((condition) => media(condition, element.ownerDocument.defaultView))) {
      candidates.push({
        declarations: rule.declarations,
        selectors: rule.selectors,
        context: userAgentContext,
        matched: null,
        specificity: null,
      });
    }
  }
  const origin = CSSPseudoElement.isImpl(element) ? element.element : element;
  const roots = new Map([[root, []]]);
  if (origin._shadowRoot) {
    roots.set(origin._shadowRoot, []);
  }
  for (let slot = origin._assignedSlot; slot; slot = slot._assignedSlot) {
    const tree = slot.getRootNode();
    if (!roots.has(tree)) {
      roots.set(tree, []);
    }
  }
  for (const part of selectorMatcher.getPartExposures(origin)) {
    // A host exposes its parts both to its own tree and to `:host::part()` in
    // its shadow tree. Gather each tree once so selector-list specificity and
    // whole-rule rollback remain independent of the route used to match it.
    for (const tree of [part.root, part.host._shadowRoot]) {
      if (!roots.has(tree)) {
        roots.set(tree, []);
      }
      roots.get(tree).push(part);
    }
  }
  for (const [tree, parts] of roots) {
    const styleScope = getStyleScope(tree);
    const authorContext = {
      ...createContext(tree, AUTHOR_ORIGIN),
      parts,
      styleScope,
      layer: styleScope.layer,
    };
    for (const sheet of getStyleSheets(tree)) {
      collectStyleSheetCandidates(element, sheet, authorContext, candidates);
    }
  }
  // Reading computed style must not create an otherwise unused inline declaration block.
  const style =
    element._style ??
    (element.nodeType === 1 && element.hasAttributeNS(null, "style") ? element.style : null);
  if (style && style._declarations.length > 0) {
    candidates.push({
      declarations: style._declarationsByName,
      style,
      context: { ...createContext(root, AUTHOR_ORIGIN), attached: true },
      matched: true,
      specificity: [0, 0, 0],
    });
  }
  return candidates;
}

function matchCandidate(candidate, element) {
  if (candidate.matched === null) {
    const { selectors, context } = candidate;
    const isPseudo = CSSPseudoElement.isImpl(element);
    const origin = isPseudo ? element.element : element;
    const isLocal =
      context.origin === USER_AGENT_ORIGIN ||
      context.root === origin.getRootNode() ||
      context.root._host === origin;
    let matched;
    if (isLocal && isPseudo) {
      matched = selectorMatcher.matchPseudoElementAgainstSelectors(element, selectors, context, {
        all: true,
      });
    } else {
      const matcher = isLocal
        ? selectorMatcher.matchElementAgainstSelectors
        : selectorMatcher.matchSlottedElementAgainstSelectors;
      matched = matcher(element, selectors, context, { all: true });
    }
    if (context.parts?.length > 0) {
      const parts = selectorMatcher.matchPartElementAgainstSelectors(element, selectors, context, {
        all: true,
      });
      matched = matched.concat(parts);
    }
    candidate.matched = matched.length > 0;
    candidate.specificity = getHighestSpecificity(
      matched.map((selector) => getSelectorSpecificity(selector, context.nestingSpecificity)),
    );
  }
  return candidate.matched;
}

function getCandidates(element) {
  const state = getStyleState(element);
  state.candidates ??= collectCandidates(element);
  return state.candidates;
}

function getLogicalPairs(element) {
  const writingMode = getComputedValue("writing-mode", element).value;
  const direction = getUsedValue("direction", element).value;
  return logicalProperties.getPairs(writingMode, direction);
}

function getPhysicalProperty(property, element) {
  return logicalProperties.isLogical(property) ? getLogicalPairs(element).get(property) : property;
}

function getDeclaredValues(property, element) {
  const state = getStyleState(element);
  if (state.declared.has(property)) {
    return state.declared.get(property);
  }
  const paired = propertyDefinitions[property]?.group && getLogicalPairs(element).get(property);
  const declarations = [];
  for (const candidate of getCandidates(element)) {
    // Filter already-parsed blocks before matching. Deferred CSSOM declarations
    // still wait for a matching selector before their values are parsed.
    if (
      candidate.matched === null &&
      !candidate.style &&
      !candidate.declarations.has(property) &&
      (!paired || !candidate.declarations.has(paired))
    ) {
      continue;
    }
    if (!matchCandidate(candidate, element)) {
      continue;
    }
    const declaration = candidate.style
      ? candidate.style._getParsedDeclaration(property)
      : candidate.declarations.get(property);
    const pairedDeclaration =
      paired &&
      (candidate.style
        ? candidate.style._getParsedDeclaration(paired)
        : candidate.declarations.get(paired));
    if (!declaration && !pairedDeclaration) {
      continue;
    }
    let selected;
    if (declaration && pairedDeclaration) {
      // Only competing mappings need declaration-block order. A single matching
      // property retains selective validation of otherwise untouched declarations.
      const ordered = candidate.style
        ? candidate.style._declarations
        : candidate.declarations.values();
      selected = [...ordered].filter((item) => item.name === property || item.name === paired);
    } else {
      selected = [declaration ?? pairedDeclaration];
    }
    for (const item of selected) {
      declarations.push({
        ...item,
        candidate,
        context: candidate.context,
        specificity: candidate.specificity,
        baseURL: candidate.style?._getBaseURL(item.name),
      });
    }
  }
  if (declarations.length > 0 || !property.startsWith("--")) {
    state.declared.set(property, declarations);
  }
  return declarations;
}

// Cascading

function getDeclarationSpecificity(declaration) {
  return declaration.specificity;
}

function getDeclarationLayerIndex({ context }) {
  return context.layer?.order ?? Infinity;
}

// https://drafts.csswg.org/css-cascade-5/#cascaded-value
function getCascadedValue(property, element, declarations = getDeclaredValues(property, element)) {
  declarations.sort((a, b) => {
    if (a.important && !b.important) {
      return 1;
    }
    if (!a.important && b.important) {
      return -1;
    }
    if (a.context.origin < b.context.origin) {
      return a.important ? 1 : -1;
    }
    if (b.context.origin < a.context.origin) {
      return a.important ? -1 : 1;
    }
    if (a.context.encapsulation !== b.context.encapsulation) {
      const order = a.context.encapsulation - b.context.encapsulation;
      return a.important ? order : -order;
    }
    if (Boolean(a.context.attached) !== Boolean(b.context.attached)) {
      return a.context.attached ? 1 : -1;
    }
    const layerA = getDeclarationLayerIndex(a);
    const layerB = getDeclarationLayerIndex(b);
    if (layerA < layerB) {
      return a.important ? 1 : -1;
    }
    if (layerB < layerA) {
      return a.important ? -1 : 1;
    }
    const specificityA = getDeclarationSpecificity(a, element);
    const specificityB = getDeclarationSpecificity(b, element);
    const specificity = compareSpecificities(specificityA, specificityB);
    if (specificity !== 0) {
      return specificity;
    }
    const proximityA = a.context.scopeProximity ?? Infinity;
    const proximityB = b.context.scopeProximity ?? Infinity;
    return proximityA === proximityB ? 0 : proximityB - proximityA;
  });
  const cascaded = declarations.at(-1);
  if (cascaded && ["revert", "revert-layer", "revert-rule"].includes(cascaded.value.value)) {
    return getCascadedValue(
      property,
      element,
      getRollbackDeclarations(declarations, cascaded, cascaded.value.value),
    );
  }
  return cascaded;
}

function getRollbackDeclarations(declarations, declaration, keyword) {
  const { context } = declaration;
  if (keyword === "revert") {
    return declarations.filter((candidate) => candidate.context.origin < context.origin);
  }
  if (keyword === "revert-rule") {
    return declarations.filter((candidate) => candidate.candidate !== declaration.candidate);
  }
  const layer = getDeclarationLayerIndex(declaration);
  return declarations.filter((candidate) => {
    if (candidate.context.origin !== context.origin || candidate.context.root !== context.root) {
      return true;
    }
    if (context.attached) {
      // Inline declarations have their own rollback boundary.
      // https://github.com/w3c/csswg-drafts/issues/14091
      return !candidate.context.attached;
    }
    return !candidate.context.attached && getDeclarationLayerIndex(candidate) < layer;
  });
}

// Defaulting

function getDefaultValue(property, element) {
  const registration = property.startsWith("--") && getRegistration(property, element);
  const inherited = registration
    ? registration.inherits
    : propertyDefinitions[property.startsWith("--") ? "--*" : property].inherited;
  if (inherited) {
    return getInheritedValue(property, element);
  }
  return getInitialValue(property, element);
}

// https://drafts.csswg.org/css-cascade-5/#inherited-value
function getInheritanceParent(element) {
  if (CSSPseudoElement.isImpl(element)) {
    return element.parent;
  }
  return element._assignedSlot ?? dom.getParentElement(element);
}

function getInheritedValue(property, element) {
  const parent = getInheritanceParent(element);
  if (parent) {
    return getComputedValue(property, parent);
  }
  return getInitialValue(property, element);
}

// https://drafts.csswg.org/css-cascade-5/#initial-value
function getRegistration(property, element) {
  return getRegisteredProperties(element.ownerDocument).get(property);
}

function customPropertyTokens(value, element) {
  const text = serialize.serializeComponentValue(value);
  const tokens = parser.parseDestructuredDeclaration("--value", text, false, element).value;
  return isAttrTainted(value) ? taintAttributeValue(tokens) : tokens;
}

function getInitialValue(property, element) {
  if (element && property.startsWith("--")) {
    const registration = getRegistration(property, element);
    if (registration?.initialValue !== undefined && registration.initialValue !== null) {
      return registration.syntax === "*"
        ? registration.initialValue
        : customPropertyTokens(registration.initialValue, element);
    }
  }
  initialValues ??= require("../../../generated/css-initial-values.js");
  return initialValues[property.startsWith("--") ? "--*" : property];
}

// https://drafts.csswg.org/css-cascade-5/#valdef-all-unset
function getUnsetValue(property, element) {
  return getDefaultValue(property, element);
}

// https://drafts.csswg.org/css-cascade-5/#specified-value
function computeSpecifiedValue(property, element, declared) {
  const cascaded = getCascadedValue(property, element, declared);
  if (!cascaded) {
    return getDefaultValue(property, element);
  }
  const value = cascaded.pending
    ? getSubstitutedValue(cascaded.name, cascaded, element)
    : cascaded.value;
  if (value === null) {
    return value;
  }
  getStyleState(element).baseURLs.set(property, cascaded.baseURL);
  return getSpecifiedKeywordValue(property, element, value, declared, cascaded);
}

function getSpecifiedKeywordValue(property, element, value, declared, cascaded) {
  switch (value.value) {
    case "initial":
      return getInitialValue(property, element);
    case "inherit":
      return getInheritedValue(property, element);
    case "unset":
      return getUnsetValue(property, element);
    case "revert":
    case "revert-layer":
    case "revert-rule":
      return computeSpecifiedValue(
        property,
        element,
        getRollbackDeclarations(declared, cascaded, value.value),
      );
    default:
      return value;
  }
}

// Bound the expanded token stream, including tokens inside functions and blocks.
// https://drafts.csswg.org/css-values-5/#long-substitution
const substitutionTokenLimit = 65536;
const tokenCounts = new WeakMap();
const invalidSubstitution = { types: ["<guaranteed-invalid>"] };

function countSubstitutionTokens(value) {
  if (values.isOmitted(value)) {
    return 0;
  }
  const cached = tokenCounts.get(value);
  if (cached !== undefined) {
    return cached;
  }
  let count;
  if (Array.isArray(value)) {
    count = 0;
    for (const component of value) {
      count += countSubstitutionTokens(component);
      if (count > substitutionTokenLimit) {
        break;
      }
    }
  } else if (typeof value.value === "object" && value.value !== null) {
    count = 2 + countSubstitutionTokens(value.value);
  } else {
    count = 1;
  }
  tokenCounts.set(value, count);
  return count;
}

function getSubstitutionTokens(value) {
  return Array.isArray(value) ? value : values.list(value === values.omitted ? [] : [value], "");
}

// Substitution arguments remain raw token sequences until their branch is used.
// Parsing them here preserves token boundaries and leaves unused fallbacks alone.
function createSubstitutionContext(property) {
  return { property, parsing: undefined };
}

function getEarlyParsingContext(resolution, element) {
  if (resolution.parsing === undefined) {
    resolution.parsing = parseContext.createDeclarationContext(element, resolution.property);
    resolution.parsing.randomEvaluation = {
      property: resolution.property,
      next: 0,
      undo: [],
      depth: 0,
    };
  }
  return resolution.parsing;
}

function substituteArgument(argument, element, budget, context, preserveInvalid = false) {
  if (values.isOmitted(argument)) {
    return getSubstitutionTokens(argument);
  }
  const parsed = parser.parseDestructuredDeclaration("--argument", argument, false, element);
  if (values.isFailure(parsed)) {
    return null;
  }
  const tokens = getSubstitutionTokens(parsed.value);
  return substituteValues(tokens, element, budget, context, preserveInvalid);
}

function countInvalidSubstitutions(value, styleComparisonsOnly = false) {
  if (styleComparisonsOnly && value.types.includes("<style-feature-plain>")) {
    return countInvalidSubstitutions(value.value);
  }
  if (Array.isArray(value)) {
    return value.reduce(
      (count, component) => count + countInvalidSubstitutions(component, styleComparisonsOnly),
      0,
    );
  }
  if (styleComparisonsOnly && value.name !== "style" && !values.isBlock(value)) {
    return 0;
  }
  if (value.types.includes("<guaranteed-invalid>")) {
    return 1;
  }
  return value.value !== null && typeof value.value === "object"
    ? countInvalidSubstitutions(value.value, styleComparisonsOnly)
    : 0;
}

function isAttrTainted(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  return (
    value.attrTainted === true ||
    (Array.isArray(value) ? value.some(isAttrTainted) : isAttrTainted(value.value))
  );
}

function taintAttributeValue(value) {
  if (value === values.omitted) {
    const result = values.list([], "");
    result.attrTainted = true;
    return result;
  }
  if (Array.isArray(value)) {
    const result = values.map(value, taintAttributeValue);
    result.attrTainted = true;
    return valueSources.copy(value, result);
  }
  const result = { ...value, attrTainted: true };
  if (value.value !== null && typeof value.value === "object") {
    result.value = taintAttributeValue(value.value);
  }
  return valueSources.copy(value, result);
}

function hasTaintedURL(value) {
  if (value.types.includes("<url>") && isAttrTainted(value)) {
    return true;
  }
  if (Array.isArray(value)) {
    if (
      value.types.includes("<image-set-option>") &&
      value[0].types.includes("<string>") &&
      isAttrTainted(value[0])
    ) {
      return true;
    }
    return value.some(hasTaintedURL);
  }
  if (
    value.types.includes("<image-src>") &&
    value.types.includes("<string>") &&
    isAttrTainted(value)
  ) {
    return true;
  }
  return value.value !== null && typeof value.value === "object" && hasTaintedURL(value.value);
}

function guardSubstitution(context, element, compute) {
  const state = getStyleState(element);
  const cycle = state.computing.indexOf(context);
  if (cycle !== -1) {
    for (let index = cycle; index < state.computing.length; ++index) {
      state.cyclic.add(state.computing[index]);
    }
    return null;
  }
  state.computing.push(context);
  try {
    const result = compute();
    return state.cyclic.has(context) ? null : result;
  } finally {
    state.computing.pop();
    if (typeof context !== "string") {
      state.cyclic.delete(context);
    }
  }
}

function substituteAttribute(value, element, budget, context) {
  const [argument, comma, fallback] = value.value;
  const substituted = substituteArgument(argument, element, undefined, context);
  const parsed =
    substituted === null
      ? null
      : parser.parseGrammar(substituted, "<attr-name> <attr-type>?", element);
  let result = null;
  let omittedType = false;
  if (!values.isFailure(parsed)) {
    const [[prefix, name], type] = parsed;
    omittedType = values.isOmitted(type);
    const origin = element.nodeType === 1 ? element : element.element;
    let namespace = null;
    if (!values.isOmitted(prefix) && !values.isOmitted(prefix[0])) {
      const property = getStyleState(element).computing.findLast(
        (entry) => typeof entry === "string",
      );
      const declaration = getCascadedValue(property, element, getDeclaredValues(property, element));
      namespace = declaration?.context.namespaces.get(prefix[0].value);
    }
    const localName =
      origin._namespaceURI === HTML_NS && origin._ownerDocument._parsingMode === "html"
        ? toLowerCase(name.value)
        : name.value;
    const attribute =
      namespace === undefined ? null : origin.getAttributeNodeNS(namespace, localName);
    if (attribute) {
      const text = attribute.value;
      if (omittedType || type.value === "raw-string") {
        result = values.list([values.string(text)], "");
      } else if (type.name === "type") {
        result = guardSubstitution(attribute, element, () => {
          const grammar = serialize.serializeComponentValue(type.value);
          const input = parser.parseDestructuredDeclaration("--attribute", text, false, element);
          if (values.isFailure(input)) {
            return null;
          }
          const tokens = getSubstitutionTokens(input.value);
          const replacement = substituteValues(tokens, element, budget, context);
          if (replacement === null || grammar === "*") {
            return replacement;
          }
          const typed = parser.parseGrammar(replacement, grammar, element);
          return values.isFailure(typed) ? null : customPropertyTokens(typed, element);
        });
      } else {
        const number = parser.parseGrammar(text.trim(), "<number-token>", element);
        if (!values.isFailure(number)) {
          const unit = toLowerCase(type.value);
          if (unit === "number") {
            result = values.list([number], "");
          } else if (unit === "%" || dimensions.getTypeFromUnit(unit)) {
            const numeric =
              unit === "%" ? values.percentage(number.value) : values.dimension(number.value, unit);
            result = customPropertyTokens(numeric, element);
          }
        }
      }
    }
  }
  if (result === null) {
    if (!values.isOmitted(comma)) {
      result = substituteArgument(fallback, element, budget, context);
    } else if (omittedType) {
      result = values.list([values.string("")], "");
    }
  }
  return result === null ? null : taintAttributeValue(result);
}

function getStyleQueryValue(property, value, element, context) {
  if (countInvalidSubstitutions(value) > 0) {
    return undefined;
  }
  if (cssWideKeywords.has(value.value)) {
    switch (value.value) {
      case "initial":
        return getComputedInitialValue(property, element);
      case "inherit":
        return getComputedInheritedValue(property, element);
      case "unset":
        return computeComputedValue(property, element, getUnsetValue(property, element));
      default:
        return undefined;
    }
  }
  const substituted = substituteValues(value, element, undefined, context);
  if (substituted === null) {
    return undefined;
  }
  const registration = getRegistration(property, element);
  if (!registration || registration.syntax === "*") {
    return substituted;
  }
  const parsed = parser.parseGrammar(
    substituted,
    registration.grammar ?? registration.syntax,
    getEarlyParsingContext(context, element),
  );
  if (values.isFailure(parsed)) {
    return undefined;
  }
  const computed = customPropertyTokens(
    getComputedComponentValue(parsed, property, element),
    element,
  );
  return isAttrTainted(substituted) ? taintAttributeValue(computed) : computed;
}

function evaluateIfCondition(condition, element, context) {
  if (condition.types.includes("<general-enclosed>")) {
    return { matches: null, tainted: isAttrTainted(condition) };
  }
  if (condition.value === "else") {
    return { matches: true, tainted: false };
  }
  if (condition.types.includes("<style-range>")) {
    const operands = [];
    let tainted = false;
    for (let index = 0; index < condition.length; index += 2) {
      let operand = condition[index];
      if (operand.types.includes("<custom-property-name>")) {
        operand = getComputedValue(operand.value, element);
        tainted ||= isAttrTainted(operand);
      }
      if (operand === null) {
        return { matches: false, tainted };
      }
      const grammar =
        "<number> | <length> | <percentage> | <angle> | <time> | <resolution> | <frequency>";
      const tokens = Array.isArray(operand) ? operand : [operand];
      if (!operand.types.includes("<calc-function>")) {
        operand = parser.parseGrammar(tokens, grammar, getEarlyParsingContext(context, element));
      }
      if (values.isFailure(operand)) {
        return { matches: false, tainted };
      }
      operands.push(getComputedComponentValue(operand, "--if", element));
    }
    for (let index = 1; index < operands.length; ++index) {
      let a = operands[index - 1];
      let b = operands[index];
      if (a.types.includes("<number>") && a.value === 0 && b.types.includes("<length>")) {
        a = values.length(0, "px");
      }
      if (b.types.includes("<number>") && b.value === 0 && a.types.includes("<length>")) {
        b = values.length(0, "px");
      }
      if (
        !values.isNumeric(a, { literal: true }) ||
        !values.isNumeric(b, { literal: true }) ||
        a.types[0] !== b.types[0] ||
        a.unit !== b.unit
      ) {
        return { matches: false, tainted };
      }
      const comparison = condition[index * 2 - 1];
      const operator = Array.isArray(comparison)
        ? comparison.map((token) => token.value ?? "").join("")
        : comparison.value;
      const matches = {
        "<": a.value < b.value,
        "<=": a.value <= b.value,
        "=": a.value === b.value,
        ">=": a.value >= b.value,
        ">": a.value > b.value,
      }[operator];
      if (!matches) {
        return { matches: false, tainted };
      }
    }
    return { matches: true, tainted };
  }
  if (Array.isArray(condition)) {
    const [head, tail] = condition;
    if (head.value === "not") {
      const result = evaluateIfCondition(tail, element, context);
      return { ...result, matches: result.matches === null ? null : !result.matches };
    }
    let result = evaluateIfCondition(head, element, context);
    for (const [operator, next] of tail) {
      if (
        (operator.value === "and" && result.matches === false) ||
        (operator.value === "or" && result.matches === true)
      ) {
        break;
      }
      const following = evaluateIfCondition(next, element, context);
      let { matches } = following;
      if (
        result.matches === null &&
        (operator.value === "and" ? matches !== false : matches !== true)
      ) {
        matches = null;
      }
      result = { matches, tainted: result.tainted || following.tainted };
    }
    return result;
  }
  if (condition.name === "media") {
    return {
      matches:
        media(
          bindConditionRandomBases(condition.value, element),
          element.ownerDocument.defaultView,
        ) === true,
      tainted: false,
    };
  }
  if (condition.name === "supports") {
    let matches;
    if (Array.isArray(condition.value) && values.isColon(condition.value[1])) {
      const [name, , value] = condition.value;
      matches = !values.isFailure(
        parser.parseDestructuredDeclaration(name.value, value, false, element),
      );
    } else {
      matches = supports(condition.value, element.ownerDocument.defaultView);
    }
    return { matches, tainted: false };
  }
  if (condition.name === "style" || values.isBlock(condition)) {
    return evaluateIfCondition(condition.value, element, context);
  }
  if (
    condition.types.includes("<style-feature-boolean>") ||
    condition.types.includes("<style-feature-plain>")
  ) {
    const property = condition.name ?? condition.value;
    if (!property.startsWith("--") && !propertyDefinitions[property]) {
      return { matches: false, tainted: false };
    }
    const computed = getComputedValue(property, element);
    const expected = condition.name
      ? getStyleQueryValue(property, condition.value, element, context)
      : getComputedInitialValue(property, element);
    // Compare canonical token values rather than authored spelling.
    // https://github.com/w3c/csswg-drafts/issues/8533
    const equal =
      expected !== undefined &&
      (computed === null || expected === null
        ? computed === expected
        : serialize.serializeComponentValue(computed) ===
          serialize.serializeComponentValue(expected));
    return {
      matches: condition.name ? equal : !equal,
      tainted: isAttrTainted(computed) || isAttrTainted(expected),
    };
  }
  return { matches: null, tainted: false };
}

function substituteIf(value, element, budget, context) {
  const [earlier, last] = value.value;
  const branches = [...earlier.map(([branch]) => branch), last];
  let tainted = false;
  for (const [condition, , branch] of branches) {
    // Keep failed substitutions local to style comparisons, preserving enclosing boolean operators.
    // https://github.com/w3c/csswg-drafts/issues/11143#issuecomment-6330893037
    const substituted = substituteArgument(condition, element, undefined, context, true);
    const parsed =
      substituted === null
        ? null
        : parser.parseGrammar(
            substituted,
            "<if-condition>",
            getEarlyParsingContext(context, element),
          );
    // Every preserved failure must belong to a parsed style comparison, including in mixed conditions.
    if (
      values.isFailure(parsed) ||
      countInvalidSubstitutions(substituted) !== countInvalidSubstitutions(parsed, true)
    ) {
      continue;
    }
    const result = evaluateIfCondition(parsed, element, context);
    tainted ||= result.tainted || isAttrTainted(substituted);
    if (result.matches === true) {
      const replacement = substituteArgument(branch, element, budget, context);
      return replacement !== null && tainted ? taintAttributeValue(replacement) : replacement;
    }
  }
  return values.list([], "");
}

function substituteValues(value, element, budget, context, preserveInvalid = false) {
  if (budget === undefined) {
    budget = { remaining: substitutionTokenLimit };
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  if (value.name === "attr") {
    return substituteAttribute(value, element, budget, context);
  }
  if (value.name === "if") {
    return substituteIf(value, element, budget, context);
  }
  if (value.name === "var" || value.name === "env") {
    const [argument, comma, fallback] = value.value;
    const substituted = substituteArgument(argument, element, undefined, context);
    let replacement = null;
    if (substituted !== null) {
      const grammar =
        value.name === "var" ? "<custom-property-name>" : "<custom-ident> <integer [0,∞]>*";
      const name = parser.parseGrammar(substituted, grammar, element);
      if (!values.isFailure(name)) {
        if (value.name === "var") {
          replacement = getComputedValue(name.value, element);
        }
      }
    }
    if (replacement !== null) {
      budget.remaining -= countSubstitutionTokens(replacement);
      if (budget.remaining < 0) {
        return null;
      }
      return isAttrTainted(replacement) || isAttrTainted(substituted)
        ? taintAttributeValue(replacement)
        : replacement;
    }
    if (values.isOmitted(comma)) {
      return null;
    }
    return substituteArgument(fallback, element, budget, context);
  }
  if (value.name === "ident") {
    const substituted = substituteArgument(value.value, element, undefined, context);
    const argumentsList =
      substituted === null
        ? null
        : parser.parseGrammar(
            substituted,
            "<ident-arg>+",
            getEarlyParsingContext(context, element),
          );
    if (values.isFailure(argumentsList)) {
      return null;
    }
    let name = "";
    for (const argument of argumentsList) {
      const computed = getComputedComponentValue(argument, "--ident", element);
      name +=
        typeof computed.value === "number"
          ? serialize.serializeComponentValue(computed)
          : computed.value;
    }
    budget.remaining--;
    const replacement = values.list([values.keyword(name)], "");
    if (budget.remaining < 0) {
      return null;
    }
    return isAttrTainted(substituted) ? taintAttributeValue(replacement) : replacement;
  }
  if (Array.isArray(value)) {
    const components = [];
    const replacements = [];
    let invalid = false;
    for (const component of value) {
      const replacement = substituteValues(component, element, budget, context);
      if (replacement === null) {
        invalid = true;
        components.push(invalidSubstitution);
        replacements.push(invalidSubstitution);
        continue;
      }
      replacements.push(replacement);
      if (["var", "env", "ident", "attr", "if"].includes(component.name)) {
        for (const token of replacement) {
          components.push(token);
        }
      } else {
        components.push(replacement);
      }
    }
    if (invalid && !preserveInvalid) {
      return null;
    }
    if (replacements.every((replacement, index) => replacement === value[index])) {
      return value;
    }
    const result = values.list(components, value.separator, value.types);
    // An empty substitution contributes provenance without contributing a token.
    // Keep it on the sequence; a later substitution taints the whole result.
    if (value.attrTainted || replacements.some(isAttrTainted)) {
      result.attrTainted = true;
    }
    return invalid
      ? result
      : valueSources.substitute(value, result, replacements, serialize.serializeComponentValue);
  }
  if (typeof value.value === "object" && value.value !== null) {
    budget.remaining -= 2;
    if (budget.remaining < 0) {
      return null;
    }
    const replacement = substituteValues(value.value, element, budget, context);
    if (replacement === null || replacement === value.value) {
      return replacement === null ? null : value;
    }
    const result = { ...value, value: replacement };
    return valueSources.substitute(value, result, replacement, serialize.serializeComponentValue);
  }
  budget.remaining -= values.isOmitted(value) ? 0 : 1;
  return budget.remaining < 0 ? null : value;
}

function getSubstitutedValue(property, declaration, element) {
  const cache = getStyleState(element).substitutions;
  const { pending, value } = declaration;
  let parsed = cache.get(value);
  if (parsed === undefined) {
    const context = createSubstitutionContext(pending);
    const substituted = substituteValues(value, element, undefined, context);
    const result =
      substituted === null
        ? null
        : parser.parseDestructuredDeclaration(pending, substituted, false, element);
    if (values.isFailure(result) || result.pending || hasTaintedURL(result.value)) {
      parsed = null;
    } else {
      const declarations = shorthands.has(pending) ? expandShorthand(result) : [result];
      parsed = new Map(declarations.map((longhand) => [longhand.name, longhand.value]));
    }
    cache.set(value, parsed);
  }
  return parsed === null ? getDefaultValue(property, element) : parsed.get(property);
}

// Resolving the computed and used value

function getAnimationTimelineInterpolationProgress() {
  return values.number(0);
}

// https://drafts.csswg.org/css-fonts-4/#typedef-absolute-size
function getComputedAbsoluteSize({ value }) {
  const userPreferredFontSize = fonts.defaultSize;
  switch (value) {
    case "large":
      return values.length((userPreferredFontSize * 9) / 8, "px");
    case "medium":
      return values.length(userPreferredFontSize, "px");
    case "small":
      return values.length((userPreferredFontSize * 13) / 16, "px");
    case "x-large":
      return values.length((userPreferredFontSize * 3) / 2, "px");
    case "x-small":
      return values.length((userPreferredFontSize * 5) / 8, "px");
    case "xx-large":
      return values.length(userPreferredFontSize * 2, "px");
    case "xx-small":
      return values.length((userPreferredFontSize * 9) / 16, "px");
    case "xxx-large":
      return values.length(userPreferredFontSize * 3, "px");
    default:
      throw new RangeError("Unexpected absolute size");
  }
}

function getComputedCalculationFunction(fn, element, property) {
  let { range, round, type, value } = fn;
  const resolutionType = type.percentHint ? `<${type.percentHint}>` : null;
  value = getComputedComponentValue(value, property, element);
  if (!values.isNumeric(value, { literal: true })) {
    value = simplify.simplifyCalculation(value, resolutionType, windowEnvironment.devicePixelRatio);
  }
  if (values.isNumeric(value, { literal: true })) {
    let resolved = math.clamp(range.min, Number.isNaN(value.value) ? 0 : value.value, range.max);
    if (round) {
      resolved = Math.round(resolved);
    }
    return {
      ...value,
      value: resolved,
    };
  }
  return {
    ...fn,
    value,
  };
}

// https://drafts.csswg.org/css-color-4/#resolving-color-values
function getComputedColor(color, element, property = "") {
  return (
    resolveColor(color, {
      colorScheme: () => colorSchemes.getElementColorScheme(element),
      resolveDimension: (value) => getComputedLength(value, element, "color"),
      resolveNumeric: (value) => getComputedNumericContext(value, "color", element),
      devicePixelRatio: windowEnvironment.devicePixelRatio,
      get currentColor() {
        // Preserve `currentcolor` dependencies in ordinary computed colors. For `color`, this reapplies
        // the inherited function at each generation; browsers instead inherit the resolved result.
        // https://github.com/w3c/csswg-drafts/issues/10536
        return property.startsWith("--") ? getResolvedValue("color", element) : undefined;
      },
    }) ?? color
  );
}

// https://drafts.csswg.org/css-values-4/#length-value
function getComputedLength(value, element, property) {
  switch (value.unit) {
    case "cap": {
      const { ascent } = fonts.metrics;
      const fontSize = (property === "font-size" ? getComputedInheritedValue : getComputedValue)(
        "font-size",
        element,
      );
      return values.length(value.value * ascent * fontSize.value, "px");
    }
    case "ch": {
      const writingMode = getComputedValue("writing-mode", element);
      const textOrientation = getComputedValue("text-orientation", element);
      const measure =
        writingMode.value.startsWith("vertical") && textOrientation.value === "upright" ? 1 : 0.5;
      const fontSize = (property === "font-size" ? getComputedInheritedValue : getComputedValue)(
        "font-size",
        element,
      );
      return values.length(value.value * measure * fontSize.value, "px");
    }
    case "cqb":
    case "cqi": {
      const writingMode = getComputedValue("writing-mode", element).value;
      const unit = (value.unit === "cqi") === (writingMode === "horizontal-tb") ? "cqw" : "cqh";
      return getComputedLength({ ...value, unit }, element, property);
    }
    case "cqh":
    case "cqw": {
      const dimension = value.unit === "cqw" ? "width" : "height";
      const container = dom.findAncestorElement(element, (ancestor) => {
        if (isContainer(ancestor, "size")) {
          return true;
        }
        if (!isContainer(ancestor, "inline-size")) {
          return false;
        }
        const writingMode = getComputedValue("writing-mode", ancestor).value;
        return dimension === (writingMode === "horizontal-tb" ? "width" : "height");
      });
      if (container) {
        const size = getComputedValue(dimension, container);
        if (
          values.isNumeric(size, {
            literal: true,
          })
        ) {
          return values.length((value.value * size.value) / 100, "px");
        }
        return values.length(0, "px");
      }
      const unit = dimension === "width" ? "svw" : "svh";
      return getComputedLength({ ...value, unit }, element, property);
    }
    case "cqmax":
    case "cqmin":
    case "dvmax":
    case "dvmin":
    case "svmax":
    case "svmin": {
      const prefix = value.unit.slice(0, 2);
      const inlineSize = getComputedLength(
        {
          ...value,
          value: 1,
          unit: `${prefix}i`,
        },
        element,
        property,
      );
      const blockSize = getComputedLength(
        {
          ...value,
          value: 1,
          unit: `${prefix}b`,
        },
        element,
        property,
      );
      const size = value.unit.endsWith("min")
        ? Math.min(inlineSize.value, blockSize.value)
        : Math.max(inlineSize.value, blockSize.value);
      return values.length(value.value * size, "px");
    }
    case "dvb": {
      const writingMode = getComputedValue("writing-mode", element);
      const unit = writingMode.value === "horizontal-tb" ? "dvh" : "dvw";
      return getComputedLength(
        {
          ...value,
          unit,
        },
        element,
        property,
      );
    }
    case "dvh":
      return values.length((value.value * windowEnvironment.innerHeight) / 100, "px");
    case "dvi": {
      const writingMode = getComputedValue("writing-mode", element);
      const unit = writingMode.value === "horizontal-tb" ? "dvw" : "dvh";
      return getComputedLength(
        {
          ...value,
          unit,
        },
        element,
        property,
      );
    }
    case "dvw":
      return values.length((value.value * windowEnvironment.innerWidth) / 100, "px");
    case "em":
    case "ic": {
      const fontSize = (property === "font-size" ? getComputedInheritedValue : getComputedValue)(
        "font-size",
        element,
      );
      return values.length(value.value * fontSize.value, "px");
    }
    case "ex": {
      const fontSize = (property === "font-size" ? getComputedInheritedValue : getComputedValue)(
        "font-size",
        element,
      );
      return values.length(value.value * 0.5 * fontSize.value, "px");
    }
    case "lh": {
      // Registered lengths have an explicit font-size dependency even when the
      // current line-height is absolute. https://drafts.css-houdini.org/css-properties-values-api/#dependency-cycles-via-relative-units
      if (property.startsWith("--")) {
        getComputedValue("font-size", element);
      }
      if (property === "font-size" || property === "line-height") {
        const lineHeight = getInheritedValue("line-height", element);
        if (lineHeight.value === "normal") {
          const fontSize = getComputedInheritedValue("font-size", element);
          const normalHeight = fonts.getNormalLineHeight(fontSize.value);
          return values.length(value.value * normalHeight, "px");
        }
        if (lineHeight.types[0] === "<number-token>") {
          const fontSize = getComputedInheritedValue("font-size", element);
          return values.length(value.value * lineHeight.value * fontSize.value, "px");
        }
        return values.length(value.value * lineHeight.value, "px");
      }
      const lineHeight = getComputedValue("line-height", element);
      if (lineHeight.value === "normal") {
        const fontSize = getComputedValue("font-size", element);
        const normalHeight = fonts.getNormalLineHeight(fontSize.value);
        return values.length(value.value * normalHeight, "px");
      }
      if (lineHeight.types[0] === "<number-token>") {
        const fontSize = getComputedValue("font-size", element);
        return values.length(value.value * lineHeight.value * fontSize.value, "px");
      }
      return values.length(value.value * lineHeight.value, "px");
    }
    case "lvb":
    case "vb": {
      const writingMode = getComputedValue("writing-mode", element);
      const dimension = writingMode.value === "horizontal-tb" ? "innerHeight" : "innerWidth";
      const blockSize = windowEnvironment[dimension];
      return values.length((value.value * blockSize) / 100, "px");
    }
    case "lvh":
    case "vh":
      return values.length((value.value * windowEnvironment.innerHeight) / 100, "px");
    case "lvi":
    case "vi": {
      const writingMode = getComputedValue("writing-mode", element).value;
      const dimension = writingMode === "horizontal-tb" ? "innerWidth" : "innerHeight";
      const inlineSize = windowEnvironment[dimension];
      return values.length((value.value * inlineSize) / 100, "px");
    }
    case "lvmax":
    case "vmax": {
      const { innerHeight, innerWidth } = windowEnvironment;
      return values.length((value.value * Math.max(innerHeight, innerWidth)) / 100, "px");
    }
    case "lvmin":
    case "vmin": {
      const { innerHeight, innerWidth } = windowEnvironment;
      return values.length((value.value * Math.min(innerHeight, innerWidth)) / 100, "px");
    }
    case "lvw":
    case "vw":
      return values.length((value.value * windowEnvironment.innerWidth) / 100, "px");
    case "px":
      return value;
    case "rcap": {
      const {
        ownerDocument: { documentElement },
      } = element;

      const { ascent } = fonts.metrics;
      if (element === documentElement && property === "font-size") {
        const fontSize = fonts.defaultSize;
        return values.length(value.value * ascent * fontSize, "px");
      }
      const fontSize = getComputedValue("font-size", documentElement);
      return values.length(value.value * ascent * fontSize.value, "px");
    }
    case "rch": {
      const {
        ownerDocument: { documentElement },
      } = element;
      const writingMode = getComputedValue("writing-mode", documentElement);
      const textOrientation = getComputedValue("text-orientation", documentElement);
      const measure =
        writingMode.value.startsWith("vertical") && textOrientation.value === "upright" ? 1 : 0.5;
      if (element === documentElement && property === "font-size") {
        const fontSize = fonts.defaultSize;
        return values.length(value.value * measure * fontSize, "px");
      }
      const fontSize = getComputedValue("font-size", documentElement);
      return values.length(value.value * measure * fontSize.value, "px");
    }
    case "rem":
    case "ric": {
      const {
        ownerDocument: { documentElement },
      } = element;
      if (element === documentElement && property === "font-size") {
        const fontSize = fonts.defaultSize;
        return values.length(value.value * fontSize, "px");
      }
      const fontSize = getComputedValue("font-size", documentElement);
      return values.length(value.value * fontSize.value, "px");
    }
    case "rex": {
      const {
        ownerDocument: { documentElement },
      } = element;
      if (element === documentElement && property === "font-size") {
        const fontSize = fonts.defaultSize;
        return values.length(value.value * 0.5 * fontSize, "px");
      }
      const fontSize = getComputedValue("font-size", documentElement);
      return values.length(value.value * 0.5 * fontSize.value, "px");
    }
    case "rlh": {
      const root = element.ownerDocument.documentElement;
      if (property.startsWith("--")) {
        getComputedValue("font-size", root);
      }
      if (element === root && (property === "font-size" || property === "line-height")) {
        const fontSize = getComputedInitialValue("font-size", root);
        const normalHeight = fonts.getNormalLineHeight(fontSize.value);
        return values.length(value.value * normalHeight, "px");
      }
      const lineHeight = getComputedValue("line-height", root);
      if (lineHeight.value === "normal") {
        const fontSize = getComputedValue("font-size", root);
        const normalHeight = fonts.getNormalLineHeight(fontSize.value);
        return values.length(value.value * normalHeight, "px");
      }
      if (lineHeight.types[0] === "<number-token>") {
        const fontSize = getComputedValue("font-size", root);
        return values.length(value.value * lineHeight.value * fontSize.value, "px");
      }
      return values.length(value.value * lineHeight.value, "px");
    }
    case "svb": {
      const writingMode = getComputedValue("writing-mode", element);
      const unit = writingMode.value === "horizontal-tb" ? "svh" : "svw";
      return getComputedLength(
        {
          ...value,
          unit,
        },
        element,
        property,
      );
    }
    case "svh":
      return values.length((value.value * windowEnvironment.innerHeight) / 100, "px");
    case "svi": {
      const writingMode = getComputedValue("writing-mode", element);
      const unit = writingMode.value === "horizontal-tb" ? "svw" : "svh";
      return getComputedLength(
        {
          ...value,
          unit,
        },
        element,
        property,
      );
    }
    case "svw":
      return values.length((value.value * windowEnvironment.innerWidth) / 100, "px");
    default:
      return dimensions.canonicalize(value);
  }
}

// https://drafts.csswg.org/css-values-4/#percentage-value
function getComputedPercentage(percentage, element, property) {
  switch (property) {
    case "font-size":
      return values.length(
        (percentage.value * getComputedInheritedValue("font-size", element).value) / 100,
        "px",
      );
    default:
      return percentage;
  }
}

// https://drafts.csswg.org/css-fonts-4/#typedef-relative-size
function getComputedRelativeSize({ value }, element) {
  const inherited = getComputedInheritedValue("font-size", element).value;
  switch (value) {
    case "larger":
      return values.length(inherited * 1.2, "px");
    case "smaller":
      return values.length(inherited / 1.2, "px");
    default:
      throw new RangeError("Unexpected relative size");
  }
}

function getComputedNumericContext(value, property, element) {
  const { name } = value;
  switch (name) {
    case "sibling-count":
    case "sibling-index": {
      const origin = element.nodeType === 1 ? element : element.element;
      const parent = origin.parentNode;
      let index = 0;
      if (parent) {
        for (const child of parent._children()) {
          if (child.nodeType === 1) {
            ++index;
          }
          if (name === "sibling-index" && child === origin) {
            break;
          }
        }
      }
      return values.number(parent ? index : 1);
    }
  }
  if (name === "random" && Array.isArray(value.value)) {
    return getComputedRandomValue(value, property, element);
  }
  return value;
}

function bindRandomBase(value, element) {
  let { base } = value;
  const [key, ...argumentsList] = value.value;
  if (base === undefined) {
    const [identifier, elementScoped, scope] = key;
    base = cssState.getRandomBaseValue(element.ownerDocument.defaultView, {
      element: values.isOmitted(elementScoped) ? undefined : element,
      identifier: values.isOmitted(identifier)
        ? null
        : serialize.serializeComponentValue(identifier),
      scope: values.isOmitted(scope) ? null : serialize.serializeComponentValue(scope),
    });
  }
  const fixedKey = values.list([values.keyword("fixed"), values.number(base)], " ", [
    "<random-key>",
  ]);
  return {
    ...value,
    base,
    value: values.list([fixedKey, ...argumentsList], value.value.separator, value.value.types),
  };
}

function getComputedRandomValue(value, property, element) {
  const fixed = bindRandomBase(value, element);
  const [key, ...argumentsList] = fixed.value;
  return {
    ...fixed,
    value: values.list(
      [
        key,
        ...argumentsList.map((argument) => getComputedComponentValue(argument, property, element)),
      ],
      fixed.value.separator,
      fixed.value.types,
    ),
  };
}

function bindConditionRandomBases(value, element) {
  if (mediaSyntax.isMedia(value)) {
    return mediaSyntax.mapValues(value, (operand) => bindConditionRandomBases(operand, element));
  }
  if (value.types.includes("<general-enclosed>")) {
    return value;
  }
  if (Array.isArray(value)) {
    return values.map(value, (component) => bindConditionRandomBases(component, element));
  }
  if (value.types.includes("<random()>") && !value.types.includes("<calc-function>")) {
    value = bindRandomBase(value, element);
  }
  return value.value !== null && typeof value.value === "object"
    ? { ...value, value: bindConditionRandomBases(value.value, element) }
    : value;
}

function getComputedURLBase(property, element) {
  return getStyleState(element).baseURLs.get(property) ?? element.ownerDocument.baseURLSerialized();
}

// Filter defaults belong to computed values; specified arguments retain their
// spelling even when they are equivalent to an omitted default.
// https://drafts.csswg.org/filter-effects-1/#computed-values
function getComputedFilterFunction(filter, property, element) {
  let value = getComputedComponentValue(filter.value, property, element);
  if (filter.name === "drop-shadow") {
    let [color, lengths] = value;
    if (values.isOmitted(color)) {
      color = values.keyword("currentcolor", ["<color>"]);
    }
    if (lengths.length === 2) {
      lengths = values.list([...lengths, values.length(0, "px")], lengths.separator, lengths.types);
    } else if (lengths[2].value < 0) {
      lengths = values.list(
        [lengths[0], lengths[1], values.length(0, "px")],
        lengths.separator,
        lengths.types,
      );
    }
    value = values.list([color, lengths], value.separator, value.types);
  } else if (filter.name === "blur") {
    value = values.isOmitted(value)
      ? values.length(0, "px")
      : { ...value, value: Math.max(0, value.value) };
  } else if (filter.name === "hue-rotate") {
    if (values.isOmitted(value) || value.types.includes("<zero>")) {
      value = values.angle(0, "deg");
    }
  } else {
    let amount = 1;
    if (!values.isOmitted(value)) {
      amount = value.types.includes("<percentage>") ? value.value / 100 : value.value;
    }
    const maximum = ["grayscale", "invert", "opacity", "sepia"].includes(filter.name)
      ? 1
      : Infinity;
    value = values.number(math.clamp(0, amount, maximum));
  }
  return { ...filter, value };
}

function getComputedComponentValue(value, property, element) {
  if (value.types.includes("<position>")) {
    return getComputedPosition(value, property, element);
  }
  if (values.isList(value)) {
    return values.map(value, (component, index) => {
      if (
        index === 0 &&
        value.types.includes("<image-set-option>") &&
        component.types.includes("<string>")
      ) {
        return urls.resolveImageString(component, getComputedURLBase(property, element));
      }
      return getComputedComponentValue(component, property, element);
    });
  }
  const { types } = value;
  for (let index = types.length - 1; index >= 0; index--) {
    switch (types[index]) {
      case "<'animation-timeline'>":
        return getAnimationTimelineInterpolationProgress();
      case "<absolute-size>":
        return getComputedAbsoluteSize(value);
      case "<angle>":
      case "<frequency>":
      case "<resolution>":
      case "<time>":
        return dimensions.canonicalize(value);
      case "<calc-function>":
        return getComputedCalculationFunction(value, element, property);
      case "<calc-invert>":
      case "<calc-negate>":
        return {
          ...value,
          value: getComputedComponentValue(value.value, property, element),
        };
      case "<color>":
        return getComputedColor(value, element, property);
      case "<filter-function>":
        return getComputedFilterFunction(value, property, element);
      case "<light-dark-image>": {
        const image = value.value[colorSchemes.getElementColorScheme(element) === "dark" ? 2 : 0];
        if (image.value === "none") {
          transparentImage ??= parser.parseGrammar("image(transparent)", "<image>");
          return getComputedComponentValue(transparentImage, property, element);
        }
        return getComputedComponentValue(image, property, element);
      }
      case "<url>":
        return urls.resolveURL(value, getComputedURLBase(property, element));
      case "<image-src>":
        if (types.includes("<string>")) {
          return urls.resolveImageString(value, getComputedURLBase(property, element));
        }
        break;
      case "<line-width>": {
        const length =
          typeof value.value === "string"
            ? values.length({ thin: 1, medium: 3, thick: 5 }[value.value], "px")
            : getComputedComponentValue(
                {
                  ...value,
                  types: types.filter((type) => type !== "<line-width>"),
                },
                property,
                element,
              );
        const ratio = windowEnvironment.devicePixelRatio;
        const pixels = length.value * ratio;
        return values.length((pixels > 0 && pixels < 1 ? 1 : Math.floor(pixels)) / ratio, "px");
      }
      case "<length>":
        return getComputedLength(value, element, property);
      case "<percentage>":
        return getComputedPercentage(value, element, property);
      case "<random()>":
      case "<sibling-index()>":
      case "<sibling-count()>":
        return getComputedNumericContext(value, property, element);
      case "<relative-size>":
        return getComputedRelativeSize(value, element);
    }
  }
  if (value.value !== null && typeof value.value === "object") {
    return { ...value, value: getComputedComponentValue(value.value, property, element) };
  }
  return value;
}

// https://drafts.csswg.org/css-fonts-4/#propdef-font-size
function getComputedFontSize(size, element) {
  if (size.value === "math") {
    const inheritedDepth = getComputedInheritedValue("math-depth", element).value;
    const depth = getComputedValue("math-depth", element).value;
    const inheritedSize = getComputedInheritedValue("font-size", element).value;
    return values.length(inheritedSize * 0.71 ** (depth - inheritedDepth), "px");
  }
  return getComputedComponentValue(size, "font-size", element);
}

function getComputedInheritedValue(property, element) {
  const parent = getInheritanceParent(element);
  if (parent) {
    return getComputedValue(property, parent);
  }
  return getComputedInitialValue(property, element);
}

function getComputedInitialValue(property, element) {
  return getComputedValue(property, element, getInitialValue(property, element));
}

// https://drafts.csswg.org/css-values-5/#typedef-position
function getComputedPositionOffset(edge, offset, property, element) {
  if (edge === "center") {
    return values.percentage(50);
  }
  const end = edge === "right" || edge === "bottom";
  if (values.isOmitted(offset)) {
    return values.percentage(end ? 100 : 0);
  }
  const computed = getComputedComponentValue(offset, property, element);
  if (!end) {
    return computed;
  }
  if (computed.types.includes("<percentage>")) {
    return values.percentage(100 - computed.value);
  }
  const expression = `calc(100% - ${serialize.serializeComponentValue(computed)})`;
  return getComputedComponentValue(
    parser.parseGrammar(expression, "<length-percentage>", element),
    property,
    element,
  );
}

// A computed area has two axes, but its serialization can omit an implied one.
// Normalize logical keywords here, without changing specified values.
// https://drafts.csswg.org/css-anchor-position-1/#position-area-computed
// https://github.com/w3c/csswg-drafts/issues/12759#issuecomment-3273676002
// https://github.com/w3c/csswg-drafts/issues/14632
function getComputedPositionArea(area) {
  if (!values.isList(area)) {
    return area;
  }
  let [a, b] = area.map((component) => {
    return values.isOmitted(component) ? "" : component.value;
  });
  if (!a) {
    a = /bottom|inline|top|y/.test(b) ? "span-all" : b;
  } else if (!b) {
    b = /block|left|right|x/.test(a) ? "span-all" : a;
  }
  a = a.replace(/(block|inline)-/g, "");
  b = b.replace(/(block|inline)-/g, "");
  // Use an axis-specific keyword when that lets serialization omit `span-all`.
  if (b === "span-all") {
    a = a.replace(/^(span-)?(self-)?(start|end)$/, "$1$2block-$3");
  } else if (a === "span-all") {
    b = b.replace(/^(span-)?(self-)?(start|end)$/, "$1$2inline-$3");
  }
  return values.list([values.keyword(a), values.keyword(b)], area.separator, area.types);
}

function getComputedPosition(value, property, element) {
  const components = values.isList(value) ? value : [value];
  const edges = components.map(
    (component) => (values.isList(component) ? component[0] : component).value,
  );
  const logical = edges.some(
    (edge) =>
      typeof edge === "string" &&
      (edge.startsWith("block-") ||
        edge.startsWith("inline-") ||
        edge === "start" ||
        edge === "end"),
  );
  let flowSides;
  if (
    logical ||
    edges.some(
      (edge) => typeof edge === "string" && (edge.startsWith("x-") || edge.startsWith("y-")),
    )
  ) {
    flowSides = getFlowSides(
      getComputedValue("writing-mode", element).value,
      getUsedValue("direction", element).value,
    );
  }
  const position = [values.percentage(50), values.percentage(50)];
  for (let index = 0; index < components.length; index++) {
    const component = components[index];
    let edge = edges[index];
    let axis = index;
    if (edge === "center") {
      if (logical) {
        const side = index === 0 ? flowSides.blockStart : flowSides.inlineStart;
        axis = side === "top" || side === "bottom" ? 1 : 0;
      }
      position[axis] = values.percentage(50);
      continue;
    }
    if (typeof edge !== "string") {
      // A one-component numeric position carries the outer <position> type.
      const numeric = values.isList(value)
        ? component
        : {
            ...component,
            types: component.types.filter((type) => type !== "<position>"),
          };
      position[index] = getComputedComponentValue(numeric, property, element);
      continue;
    }
    if (flowSides) {
      const end = edge.endsWith("end");
      if (
        edge.startsWith("block-") ||
        edge.startsWith("inline-") ||
        edge === "start" ||
        edge === "end"
      ) {
        const block =
          edge.startsWith("block-") || ((edge === "start" || edge === "end") && index === 0);
        edge = flowSides[`${block ? "block" : "inline"}${end ? "End" : "Start"}`];
      } else if (edge.startsWith("x-") || edge.startsWith("y-")) {
        const blockIsHorizontal =
          flowSides.blockStart === "left" || flowSides.blockStart === "right";
        const block = edge.startsWith("x-") === blockIsHorizontal;
        edge = flowSides[`${block ? "block" : "inline"}${end ? "End" : "Start"}`];
      }
    }
    axis = edge === "top" || edge === "bottom" ? 1 : 0;
    const offset = values.isList(component) ? component[1] : values.omitted;
    position[axis] = getComputedPositionOffset(edge, offset, property, element);
  }
  return values.list(position, " ", ["<position>"]);
}

function getComputedBackgroundPosition(value, property, element) {
  const logical =
    value.types.includes("background-position-inline") ||
    value.types.includes("background-position-block");
  let flowSides;
  return values.list(
    value.map((position) => {
      const [edge, offset] = position.value === "center" ? [position, values.omitted] : position;
      let side = values.isOmitted(edge) && logical ? "start" : edge.value;
      if (
        side === "start" ||
        side === "end" ||
        side === "x-start" ||
        side === "x-end" ||
        side === "y-start" ||
        side === "y-end"
      ) {
        flowSides ??= getFlowSides(
          getComputedValue("writing-mode", element).value,
          getUsedValue("direction", element).value,
        );
        let axis = property.slice("background-position-".length);
        if (axis === "x" || axis === "y") {
          const blockIsHorizontal =
            flowSides.blockStart === "left" || flowSides.blockStart === "right";
          axis = (axis === "x") === blockIsHorizontal ? "block" : "inline";
        }
        side = flowSides[`${axis}${side.endsWith("end") ? "End" : "Start"}`];
      }
      return values.list([
        values.omitted,
        getComputedPositionOffset(side, offset, property, element),
      ]);
    }),
    ",",
  );
}

// https://drafts.csswg.org/css-display/#automatic-box-type-transformations
function getComputedDisplay(specified, element) {
  let outside, inside;
  if (Array.isArray(specified)) {
    outside = specified[0].value;
    inside = specified[1].value;
    if (inside === "math" && element._namespaceURI !== MATHML_NS) {
      inside = "flow";
      outside ||= "inline";
      specified = values.keyword(outside, ["display"]);
    }
    outside ||= inside === "ruby" || inside === "math" ? "inline" : "block";
  } else {
    const keyword = specified.value;
    if (keyword === "none") {
      return specified;
    }
    if (keyword === "contents") {
      return element === element.ownerDocument.documentElement
        ? values.keyword("block", ["display"])
        : specified;
    }
    outside = keyword === "block" ? "block" : "inline";
    inside = keyword.startsWith("inline-") ? keyword.slice(7) : "flow";
  }
  if (outside === "block") {
    return specified;
  }
  let blockify = element === element.ownerDocument.documentElement;
  if (!blockify) {
    const position = getComputedValue("position", element).value;
    blockify =
      position === "absolute" ||
      position === "fixed" ||
      getComputedValue("float", element).value !== "none";
  }
  if (!blockify) {
    let parent = getInheritanceParent(element);
    while (parent) {
      const display = getComputedValue("display", parent);
      if (display.value === "contents") {
        parent = getInheritanceParent(parent);
        continue;
      }
      const layout = Array.isArray(display) ? display[1].value : display.value;
      blockify =
        layout === "flex" ||
        layout === "grid" ||
        layout === "inline-flex" ||
        layout === "inline-grid";
      break;
    }
  }
  if (!blockify) {
    return specified;
  }
  // Inline flow roots lose their flow-root nature when blockified.
  if (inside === "flow-root" || inside === "block") {
    inside = "flow";
  }
  if (Array.isArray(specified)) {
    const components = [...specified];
    components[0] = values.keyword("block", ["<display-outside>"]);
    components[1] = values.keyword(inside || "flow", ["<display-inside>"]);
    return values.list(components, specified.separator, specified.types);
  }
  return values.keyword(inside === "flow" ? "block" : inside, ["display"]);
}

function computeComputedValue(property, element, specified) {
  // jsdom uses its default font metrics for platform-dependent system fonts.
  if (specified?.types.includes("<system-font()>")) {
    specified = getInitialValue(property, element);
  }
  if (property.startsWith("--")) {
    const registration = getRegistration(property, element);
    const context = createSubstitutionContext(property);
    const substituted = substituteValues(specified, element, undefined, context);
    const tokens = substituted === values.omitted ? values.list([], "") : substituted;
    if (tokens !== null) {
      const components = Array.isArray(tokens)
        ? tokens.filter((token) => !values.isWhitespace(token))
        : [tokens];
      if (components.length === 1 && components[0].types[0] === "<ident-token>") {
        const keyword = components[0].value.toLowerCase();
        if (cssWideKeywords.has(keyword)) {
          const declarations = getDeclaredValues(property, element);
          const cascaded = getCascadedValue(property, element, declarations);
          const value = getSpecifiedKeywordValue(
            property,
            element,
            values.keyword(keyword),
            declarations,
            cascaded,
          );
          return computeComputedValue(property, element, value);
        }
      }
    }
    if (!registration || registration.syntax === "*") {
      return tokens;
    }
    const declaration = parseContext.createDeclarationContext(element, property);
    let parsed =
      substituted === null
        ? null
        : parser.parseGrammar(
            substituted,
            registration.grammar ?? registration.syntax,
            declaration,
          );
    let tainted = isAttrTainted(substituted);
    if (values.isFailure(parsed) || hasTaintedURL(parsed)) {
      const fallback = getDefaultValue(property, element);
      if (fallback === null) {
        return null;
      }
      parsed = parser.parseGrammar(
        fallback,
        registration.grammar ?? registration.syntax,
        declaration,
      );
      tainted = isAttrTainted(fallback);
    }
    const computed = customPropertyTokens(
      getComputedComponentValue(parsed, property, element),
      element,
    );
    return tainted || isAttrTainted(parsed) ? taintAttributeValue(computed) : computed;
  }

  switch (property) {
    case "-webkit-box-orient":
      if (specified.value === "inline-axis") {
        return values.keyword("horizontal");
      }
      if (specified.value === "block-axis") {
        return values.keyword("vertical");
      }
      return specified;
    case "content":
      // Preserve `normal` on ordinary elements instead of computing it to `contents`.
      // https://github.com/w3c/csswg-drafts/issues/4632
      if (CSSPseudoElement.isImpl(element)) {
        if (
          specified.value === "normal" &&
          (element.type === "::before" || element.type === "::after")
        ) {
          return values.keyword("none");
        }
        if (
          element.type === "::marker" &&
          !getComputedValue("display", element.parent).types.includes("<display-listitem>")
        ) {
          return values.keyword("none");
        }
      }
      return getComputedComponentValue(specified, property, element);
    case "grid-row-start":
    case "grid-row-end":
    case "grid-column-start":
    case "grid-column-end": {
      const computed = getComputedComponentValue(specified, property, element);
      return Array.isArray(computed) && computed[0].value === 0 ? values.keyword("auto") : computed;
    }
    case "display":
      return getComputedDisplay(specified, element);
    case "outline-color":
      if (
        specified.value === "auto" &&
        getComputedValue("outline-style", element).value !== "auto"
      ) {
        return values.keyword("currentcolor", ["<color>"]);
      }
      return getComputedComponentValue(specified, property, element);
    case "zoom": {
      if (specified.value === "normal") {
        return values.number(1);
      }
      const computed = getComputedComponentValue(specified, property, element);
      const number = computed.types.includes("<percentage>")
        ? computed.value / 100
        : computed.value;
      return values.number(number === 0 ? 1 : number);
    }
    case "opacity": {
      const computed = getComputedComponentValue(specified, property, element);
      const number = computed.types.includes("<percentage>")
        ? computed.value / 100
        : computed.value;
      return values.number(math.clamp(0, number, 1));
    }
    case "background-position-x":
    case "background-position-y":
    case "background-position-inline":
    case "background-position-block":
      // Computed longhand and shorthand requirements disagree about preserving logical origins.
      // https://github.com/w3c/csswg-drafts/issues/12564
      return getComputedBackgroundPosition(specified, property, element);
    case "position-area":
      return getComputedPositionArea(specified);
    case "font-variation-settings": {
      if (specified.value === "normal") {
        return specified;
      }
      // https://drafts.csswg.org/css-fonts-4/#fvs-sorted
      const axes = new Map(specified.map((axis) => [axis[0].value, axis]));
      const sorted = [...axes.keys()].sort().map((tag) => axes.get(tag));
      return getComputedComponentValue(
        values.list(sorted, specified.separator, specified.types),
        property,
        element,
      );
    }
    case "font-size":
      return getComputedFontSize(specified, element);
    case "font-weight": {
      if (specified.value === "normal") {
        return values.number(400);
      }
      if (specified.value === "bold") {
        return values.number(700);
      }
      if (specified.value === "bolder" || specified.value === "lighter") {
        const inherited = getComputedInheritedValue(property, element).value;
        if (
          (specified.value === "bolder" && inherited > 900) ||
          (specified.value === "lighter" && inherited < 100)
        ) {
          return values.number(inherited);
        }
        if (specified.value === "bolder") {
          if (inherited < 350) {
            return values.number(400);
          }
          return values.number(inherited < 550 ? 700 : 900);
        }
        if (inherited < 550) {
          return values.number(100);
        }
        return values.number(inherited < 750 ? 400 : 700);
      }
      return getComputedComponentValue(specified, property, element);
    }
    case "font-width": {
      const width = {
        "ultra-condensed": 50,
        "extra-condensed": 62.5,
        condensed: 75,
        "semi-condensed": 87.5,
        normal: 100,
        "semi-expanded": 112.5,
        expanded: 125,
        "extra-expanded": 150,
        "ultra-expanded": 200,
      }[specified.value];
      return width === undefined
        ? getComputedComponentValue(specified, property, element)
        : values.percentage(width);
    }
    default:
      return getComputedComponentValue(specified, property, element);
  }
}

// https://drafts.csswg.org/cssom-1/#resolved-value
function computeResolvedValue(property, element, computed) {
  if (
    /^border-(?:top|right|bottom|left|block-start|block-end|inline-start|inline-end)-width$/.test(
      property,
    )
  ) {
    const style = getComputedValue(property.replace(/width$/, "style"), element).value;
    if (style === "none" || style === "hidden") {
      return values.length(0, "px");
    }
  }
  switch (property) {
    case "animation-duration": {
      const timeline = getComputedValue("animation-timeline", element);
      if (timeline.length === 1 && timeline[0].value === "auto") {
        return values.list(
          computed.map((duration) => {
            return duration.value === "auto" ? values.time(0, "s") : duration;
          }),
          ",",
        );
      }
      return computed;
    }
    // The prefixed text colors retain `currentcolor` through inheritance until resolved here.
    // https://github.com/whatwg/compat/issues/297
    case "-webkit-text-fill-color":
    case "-webkit-text-stroke-color":
    case "backdrop-filter":
    case "background-color":
    case "border-block-end-color":
    case "border-block-start-color":
    case "border-bottom-color":
    case "border-inline-end-color":
    case "border-inline-start-color":
    case "border-left-color":
    case "border-right-color":
    case "border-top-color":
    case "box-shadow":
    case "caret-color":
    case "color":
    case "column-rule-color":
    case "row-rule-color":
    case "outline-color":
    case "text-decoration-color":
    case "text-emphasis-color":
    case "filter":
    case "flood-color":
    case "lighting-color":
    case "stop-color":
      return getUsedValue(property, element, computed);
    case "line-height":
      if (computed.value === "normal") {
        return computed;
      }
      return getUsedValue("line-height", element, computed);
    default:
      return computed;
  }
}

function getUsedCalculationFunction({ range, round, type, value }, element, property) {
  if (
    !values.isNumeric(value, {
      literal: true,
    })
  ) {
    const resolutionType = type.percentHint ? `<${type.percentHint}>` : null;
    value = values.map(value, (component) => getUsedComponentValue(component, property, element));
    value = simplify.simplifyCalculation(value, resolutionType, windowEnvironment.devicePixelRatio);
  }
  let resolved = math.clamp(range.min, Number.isNaN(value.value) ? 0 : value.value, range.max);
  if (round) {
    resolved = Math.round(resolved);
  }
  return {
    ...value,
    value: resolved,
  };
}

function getUsedComponentValue(value, property, element) {
  if (values.isList(value)) {
    return values.map(value, (component) => getUsedComponentValue(component, property, element));
  }
  const { types } = value;
  for (let index = types.length - 1; index >= 0; index--) {
    switch (types[index]) {
      case "<calc-function>":
        return getUsedCalculationFunction(value, element, property);
      case "<calc-invert>":
      case "<calc-negate>":
        return {
          ...value,
          value: getUsedComponentValue(value.value, property, element),
        };
    }
  }
  return value;
}

function getUsedColor(color, property, element) {
  if (color.types.includes("<color>")) {
    return (
      resolveColor(color, {
        used: true,
        colorScheme: () => colorSchemes.getElementColorScheme(element),
        resolveDimension: (value) => getComputedLength(value, element, property),
        resolveNumeric: (value) => getComputedNumericContext(value, property, element),
        devicePixelRatio: windowEnvironment.devicePixelRatio,
        get currentColor() {
          if (property === "color") {
            const parent = getInheritanceParent(element);
            return parent
              ? getResolvedValue("color", parent)
              : getComputedColor(getInitialValue("color"), element);
          }
          return getResolvedValue("color", element);
        },
      }) ?? color
    );
  }
  return values.isList(color) || values.isFunction(color)
    ? values.map(color, (value) => getUsedColor(value, property, element))
    : color;
}

// https://drafts.csswg.org/css-writing-modes-4/#propdef-direction
function getUsedDirection(direction, element) {
  const writingMode = getComputedValue("writing-mode", element).value;
  if (
    writingMode.startsWith("vertical-") &&
    getComputedValue("text-orientation", element).value === "upright"
  ) {
    return values.keyword("ltr", ["direction"]);
  }
  return direction;
}

// https://drafts.csswg.org/css-inline-3/#propdef-line-height
function getUsedLineHeight(height, element) {
  if (height.value === "normal") {
    const fontSize = getUsedValue("font-size", element);
    const lineHeight = fonts.getNormalLineHeight(fontSize.value);
    return values.length(lineHeight, "px");
  }
  if (height.types[0] === "<number-token>") {
    const fontSize = getUsedValue("font-size", element);
    return values.length(height.value * fontSize.value, "px");
  }
  return height;
}

// https://drafts.csswg.org/css-cascade-5/#used-value
function getUsedValue(property, element, computed = getComputedValue(property, element)) {
  switch (property) {
    case "caret-color":
      return computed.value === "auto"
        ? getResolvedValue("color", element)
        : getUsedColor(computed, property, element);
    case "-webkit-text-fill-color":
    case "-webkit-text-stroke-color":
    case "backdrop-filter":
    case "background-color":
    case "border-block-end-color":
    case "border-block-start-color":
    case "border-bottom-color":
    case "border-inline-end-color":
    case "border-inline-start-color":
    case "border-left-color":
    case "border-right-color":
    case "border-top-color":
    case "box-shadow-color":
    case "color":
    case "column-rule-color":
    case "row-rule-color":
    case "outline-color":
    case "text-decoration-color":
    case "text-emphasis-color":
    case "filter":
    case "flood-color":
    case "lighting-color":
    case "stop-color":
      return getUsedColor(computed, property, element);
    case "direction":
      return getUsedDirection(computed, element);
    case "line-height":
      return getUsedLineHeight(computed, element);
    default:
      return getUsedComponentValue(computed, property, element);
  }
}

// Keep authored or registered failures, but do not retain arbitrary missing names.
function canCachePropertyValue(property, value, element) {
  return (
    value !== null ||
    !property.startsWith("--") ||
    getStyleState(element).declared.has(property) ||
    getRegistration(property, element) !== undefined
  );
}

function getSpecifiedValue(property, element, declared) {
  if (declared !== undefined) {
    return computeSpecifiedValue(property, element, declared);
  }
  const cache = getStyleState(element).specified;
  if (cache.has(property)) {
    return cache.get(property);
  }
  const value = computeSpecifiedValue(property, element, getDeclaredValues(property, element));
  if (canCachePropertyValue(property, value, element)) {
    cache.set(property, value);
  }
  return value;
}

function getComputedValue(property, element, specified) {
  if (specified !== undefined) {
    return computeComputedValue(property, element, specified);
  }
  property = getPhysicalProperty(property, element);
  const state = getStyleState(element);
  const cache = state.computed;
  if (cache.has(property)) {
    return cache.get(property);
  }
  let value = guardSubstitution(property, element, () => {
    return computeComputedValue(property, element, getSpecifiedValue(property, element));
  });
  if (state.cyclic.has(property)) {
    value = getComputedDefaultValue(property, element);
  }
  if (canCachePropertyValue(property, value, element)) {
    cache.set(property, value);
  }
  return value;
}

function getComputedDefaultValue(property, element) {
  if (property.startsWith("--")) {
    const registration = getRegistration(property, element);
    if (!registration || registration.syntax === "*") {
      return null;
    }
  }
  return computeComputedValue(property, element, getDefaultValue(property, element));
}

function getResolvedValue(property, element, computed) {
  if (computed !== undefined) {
    return computeResolvedValue(property, element, computed);
  }
  property = getPhysicalProperty(property, element);
  const cache = getStyleState(element).resolved;
  if (cache.has(property)) {
    return cache.get(property);
  }
  const value = computeResolvedValue(property, element, getComputedValue(property, element));
  if (canCachePropertyValue(property, value, element)) {
    cache.set(property, value);
  }
  return value;
}

function getResolvedPropertyValue(property, element) {
  const cache = getStyleState(element).serialized;
  if (!cache.has(property)) {
    let declaration;
    if (shorthands.has(property)) {
      declaration = {
        name: property,
        computed: true,
        shorthand: true,
        value: shorthands
          .get(property)
          .flat()
          .map((name) => {
            if (property === "text-decoration" && name === "text-decoration-color") {
              // Omit the initial `currentcolor` before resolving it. Older shorthands
              // retain absolute colors for compatibility.
              // https://github.com/w3c/csswg-drafts/issues/12486
              const computed = getComputedValue(name, element);
              if (computed.value === "currentcolor") {
                return { name, value: computed };
              }
            }
            return { name, value: getResolvedValue(name, element) };
          }),
      };
    } else {
      const value = getResolvedValue(property, element);
      if (value === null) {
        if (canCachePropertyValue(property, value, element)) {
          cache.set(property, "");
        }
        return "";
      }
      if (values.isOmitted(value)) {
        cache.set(property, " ");
        return " ";
      }
      declaration = { name: property, value, computed: true };
      if (property.startsWith("--")) {
        declaration.source = copyString(
          valueSources.serialize(value, serialize.serializeComponentValue),
        );
      }
    }
    cache.set(property, serialize.serializeDeclarationValue(declaration));
  }
  return cache.get(property);
}

const standardPropertyNames = Object.keys(propertyDefinitions)
  .filter((name) => name !== "--*" && !shorthands.has(name))
  .sort((a, b) => Number(a.startsWith("-")) - Number(b.startsWith("-")) || (a < b ? -1 : 1));

function getComputedPropertyNames(element) {
  const state = getStyleState(element);
  if (!state.names) {
    const custom = new Set(getRegisteredProperties(element.ownerDocument).keys());
    for (let ancestor = element; ancestor; ancestor = getInheritanceParent(ancestor)) {
      for (const candidate of getCandidates(ancestor)) {
        if (!matchCandidate(candidate, ancestor)) {
          continue;
        }
        const declarations = candidate.style
          ? (candidate.style._rawDeclarations ?? candidate.style._declarations)
          : candidate.declarations.values();
        for (const { name } of declarations) {
          if (name.startsWith("--")) {
            custom.add(name);
          }
        }
      }
    }
    const names = [...custom].filter((name) => getComputedValue(name, element) !== null);
    state.names = [...standardPropertyNames, ...names.sort()];
  }
  return state.names;
}

exports.getResolvedPropertyValue = getResolvedPropertyValue;
exports.getComputedPropertyNames = getComputedPropertyNames;

exports.getInheritanceParent = getInheritanceParent;
