"use strict";

exports.consumeComponentValues = consumeComponentValues;
exports.consumeWhitespace = consumeWhitespace;
exports.consumeUnparsedSelector = consumeUnparsedSelector;
exports.matchBlock = matchBlock;
exports.matchMediaInParens = matchMediaInParens;
exports.matchPageSelectorList = matchPageSelectorList;
exports.matchBlockContents = matchBlockContents;
exports.matchDeclaration = matchDeclaration;
exports.matchFunction = matchFunction;
exports.getRandomFunctionIndex = getRandomFunctionIndex;
exports.matchRule = matchRule;
exports.matchStyleSheet = matchStyleSheet;
exports.matchToken = matchToken;
exports.getInvalidTokenError = getInvalidTokenError;
exports.parseArbitrarySubstitution = parseArbitrarySubstitution;
exports.parseDeclarationValue = parseDeclarationValue;
exports.parseDeclarations = parseDeclarations;
exports.resolveDeclaration = resolveDeclaration;
exports.resolveDeclarations = getDeclarationsInSpecifiedOrder;
exports.parseDestructuredDeclaration = parseDestructuredDeclaration;
exports.parseGrammar = parseGrammar;
exports.parseNumericFunction = parseNumericFunction;
exports.parsePseudoElementSelectors = parsePseudoElementSelectors;
exports.parseListGrammar = parseListGrammar;
exports.parseRule = parseRule;
exports.parseStyleSheetSyntax = parseStyleSheetSyntax;
exports.parseStyleSheet = parseStyleSheet;
const substitutions = require("../values/substitutions.js");
const { ParseErrorInfo, NestingLimitError } = require("./errors.js");
const blockModule = require("../values/block.js");
const parseNode = require("./node.js");
const rulePostprocess = require("./postprocess.js");
const cssomModule = require("../utils/cssom.js");
const ruleOrder = require("../rules/order.js");
const cssValues = require("../values/value.js");
const mediaSyntax = require("../values/media.js");
const serialize = require("../serialize.js");
const contextUtils = require("./declarations.js");
const nodeUtils = require("./tree.js");
const CSSStream = require("./stream.js");
const parseContext = require("./context.js");
const expandShorthand = require("./shorthand.js");
const stringUtils = require("../utils/string.js");
const valueSources = require("../values/source.js");
const tokenize = require("./tokenize.js");
const compatibility = require("../compatibility.js");
const { LRUCache } = require("lru-cache");
const { syntaxSize, syntaxObjectSize } = require("../utils/syntax-size.js");
const invalidPositionedBlock = new ParseErrorInfo("Unexpected block in declaration value");
const arbitrarySubstitutions = new Map(substitutions.arbitrary.map((fn) => [fn.name, fn]));
const numericFunctions = new Map(substitutions.numeric.map((fn) => [fn.name, fn]));
// Bound both source text and parsed syntax, including expanded declaration blocks.
const declarationValues = new LRUCache({
  max: 4096,
  maxSize: 4 * 1024 * 1024,
  maxEntrySize: 64 * 1024,
  sizeCalculation: (value, key) => key.length * 2 + syntaxSize(value),
});
const styleSheetSyntax = new LRUCache({
  max: 256,
  maxSize: 8 * 1024 * 1024,
  sizeCalculation: (entry) => entry.size,
});
const ruleIds = new WeakMap();
const namespaceSnapshots = new WeakMap();
const tokenizedInputs = new WeakSet();
let nextRuleId = 0;

// Complete declaration values are independent of their owner. The rule grammar,
// strictness, and declared namespace prefixes affect parsing; namespace URIs do
// not. Cache immutable non-important declarations with detached names and value
// spelling. Priority overrides and CSSOM owners stay outside the shared entry.
// Expansion and resolution must not mutate it.
function createDeclarationCacheKey(source, name, rule, strict, prefixes) {
  let ruleId = ruleIds.get(rule);
  if (ruleId === undefined) {
    ruleId = nextRuleId++;
    ruleIds.set(rule, ruleId);
  }
  return `${JSON.stringify([ruleId, name, Boolean(strict), prefixes])}\0${source}`;
}

function getDeclarationCacheKey(source, name, context) {
  if (typeof source !== "string" || context.trees.length > 0) {
    return undefined;
  }
  const rule = nodeUtils.getRule({ context }).definition;
  const prefixes = context.namespaces.size === 0 ? "" : [...context.namespaces.keys()].sort();
  return createDeclarationCacheKey(source, name, rule, context.strict, prefixes);
}

function parseCompleteDeclarationValue(
  source,
  definition,
  context,
  key = getDeclarationCacheKey(source, definition.name, context),
) {
  const cached = key === undefined ? undefined : declarationValues.get(key);
  if (cached) {
    return cached;
  }
  if (key !== undefined) {
    // Cache misses parse detached value text so token slices and preserved
    // spelling cannot keep an entire originating stylesheet alive.
    source = stringUtils.copyString(source);
    key = stringUtils.copyString(key);
    // Custom names also appear in parsed value tags, so detach them before parsing.
    definition = { ...definition, name: stringUtils.copyString(definition.name) };
  }
  const input = normalizeIntoTokens(source);
  const node = parseNode.createNode(definition, input, context);
  const value = parseDeclarationValue(
    input,
    contextUtils.getDeclarationValueDefinition(definition),
    node,
  );
  // Complete values are also immutable declaration records. CSSOM setters
  // can share them; generic grammar matches retain their own tagged wrapper.
  const { name } = definition;
  let result = { name, important: false, value };
  if (!definition.custom && node.state.extended.has("pending")) {
    result.pending = name;
  }
  if (!cssValues.isFailure(value) && (definition.custom || result.pending)) {
    // Preserved spelling escapes through public getters too. Reuse the detached
    // value text instead of returning a slice of the originating stylesheet.
    if (typeof source === "string") {
      result.source = source;
    }
    const recovered =
      typeof source === "string" ? recoverDeclarationSource(source, input) : undefined;
    if (recovered !== undefined) {
      // Preserve author spelling, except where EOF recovery changed the tokens.
      // https://github.com/w3c/csswg-drafts/issues/7329
      // Reparse the repaired spelling so substitution metadata uses those same
      // token positions and cannot reintroduce an unmatched quote or bracket.
      result = parseCompleteDeclarationValue(recovered, definition, context, key);
      if (!definition.custom) {
        result = { ...result, source: recovered };
      }
    } else if (definition.custom) {
      if (typeof source === "string") {
        result.source = trimCustomPropertySource(source, input);
      }
      valueSources.capture(value, input);
    }
  }
  if (key !== undefined && !cssValues.isFailure(value)) {
    declarationValues.set(key, result);
  }
  return result;
}

// Trim only outside CSS whitespace. The final token owns escape terminators,
// and comments stop the source-edge scan even when the lexer coalesces trivia.
function trimCustomPropertySource(source, input) {
  const lastToken = input.data.findLast((token) => !cssValues.isWhitespace(token));
  if (!lastToken) {
    return source;
  }
  let start = 0;
  let end = source.length;
  const protectedEnd = input.sliceSource(0, lastToken.end).length;
  while (start < end && /[\t\n\f\r ]/.test(source[start])) {
    ++start;
  }
  while (protectedEnd < end && /[\t\n\f\r ]/.test(source[end - 1])) {
    --end;
  }
  return start === 0 && end === source.length
    ? source
    : stringUtils.copyString(source.slice(start, end));
}

// Recovery only affects the final token and unmatched opening tokens. Normal
// values never need this extra traversal or a second parse.
function recoverDeclarationSource(source, input) {
  const recovery = input.source.eofRecovery;
  if (!recovery && !input.unclosed) {
    return undefined;
  }
  let result = source;
  if (recovery) {
    const { replacement, suffix } = recovery;
    result = (replacement === undefined ? result : result.slice(0, -1) + replacement) + suffix;
  }
  const closing = [];
  for (const token of input.data) {
    if (token.types[0] === "<function-token>") {
      closing.push(")");
    } else if (token.types[0] === "<delimiter-token>") {
      const end = blockModule.associatedTokens[token.value];
      if (end) {
        closing.push(end);
      } else if (token.value === closing.at(-1)) {
        closing.pop();
      }
    }
  }
  result += closing.reverse().join("");
  return result === source ? undefined : result;
}

// https://drafts.csswg.org/cssom-1/#concept-declarations-specified-order
function getDeclarationsInSpecifiedOrder(declarations, shorthands, resolve = resolveDeclaration) {
  declarations = declarations.map(resolve).filter(Boolean);
  if (shorthands) {
    declarations = declarations.flatMap((declaration) => {
      return shorthands.has(declaration.name) ? expandShorthand(declaration) : declaration;
    });
  }
  const ordered = new Map();
  for (const declaration of declarations) {
    const previous = ordered.get(declaration.name);
    if (previous) {
      if (!declaration.important && previous.important) {
        continue;
      }
      ordered.delete(declaration.name);
    }
    ordered.set(declaration.name, declaration);
  }
  return [...ordered.values()];
}

// The saved context contains grammar information only. Deferred declarations
// retain their own value text, without the original stream or source-offset map.
// Rules with the same grammar share a snapshot until the namespaces change.
function getDeclarationSyntaxContext(node) {
  const { namespaces, strict } = node.context;
  let snapshot = namespaceSnapshots.get(namespaces);
  if (!snapshot) {
    snapshot = { namespaces: [...namespaces], contexts: new Map() };
    namespaceSnapshots.set(namespaces, snapshot);
  }
  const { definition } = nodeUtils.getRule(node);
  let saved = snapshot.contexts.get(definition);
  if (!saved || saved.strict !== strict) {
    saved = { definition, namespaces: snapshot.namespaces, strict };
    snapshot.contexts.set(definition, saved);
  }
  return saved;
}

function resolveDeclaration(declaration) {
  if (!declaration.parsing) {
    return declaration;
  }
  const { name, important, source, tokens, parsing } = declaration;
  let key;
  if (tokens === undefined && typeof source === "string") {
    const prefixes =
      parsing.namespaces.length === 0 ? "" : parsing.namespaces.map(([prefix]) => prefix).sort();
    key = createDeclarationCacheKey(source, name, parsing.definition, parsing.strict, prefixes);
  }
  let parsed = key === undefined ? undefined : declarationValues.get(key);
  if (!parsed) {
    const root = parseContext.createContext();
    const context = {
      ...root,
      context: root,
      definition: parsing.definition,
      namespaces: new Map(parsing.namespaces),
      strict: parsing.strict,
    };
    const definition = contextUtils.getDeclarationDefinition(context, name);
    const input = tokens === undefined ? source : new CSSStream(tokens);
    parsed = parseCompleteDeclarationValue(input, definition, context, key);
  }
  let result = null;
  if (!cssValues.isFailure(parsed.value)) {
    result = { name, important, value: parsed.value };
    if (parsed.source !== undefined) {
      result.source = parsed.source;
    }
    if (parsed.pending) {
      result.pending = name;
    }
  }
  return result;
}

// https://drafts.csswg.org/css-syntax-3/#consume-a-function
function consumeFunction(input) {
  const {
    current: { start, value: name },
  } = input;
  const value = consumeComponentValues(input, [")"]);
  if (!input.consumeIf(cssValues.isCloseParen)) {
    input.unclosed = true;
  }
  return {
    end: input.current.end,
    name,
    start,
    types: ["<function>"],
    value,
  };
}

// https://drafts.csswg.org/css-syntax-3/#consume-a-simple-block
function consumeBlock(input) {
  const {
    current: { start, value: associatedToken },
  } = input;
  const closingToken = blockModule.associatedTokens[associatedToken];
  const value = consumeComponentValues(input, [closingToken]);
  if (!input.consumeIf(cssValues.isDelimiter(closingToken))) {
    input.unclosed = true;
  }
  return {
    associatedToken,
    end: input.current.end,
    start,
    types: ["<block>"],
    value,
  };
}

// https://drafts.csswg.org/css-syntax-3/#consume-a-component-value
function consumeComponentValue(input) {
  const token = input.consume();
  if (token.types[0] === "<delimiter-token>" && blockModule.associatedTokens[token.value]) {
    return consumeBlock(input);
  }
  if (token.types[0] === "<function-token>") {
    return consumeFunction(input);
  }
  return token;
}

// https://drafts.csswg.org/css-syntax-3/#consume-a-list-of-component-values
function consumeComponentValues(input, stop, context) {
  const values = [];
  input.consumeIf(cssValues.isWhitespace);
  while (context ? !nodeUtils.isInputAtEnd(context) : !input.atEnd()) {
    if (stop && cssValues.isDelimiter(stop, input.next())) {
      break;
    }
    values.push(consumeComponentValue(input));
  }
  if (cssValues.isWhitespace(values.at(-1))) {
    values.pop();
  }
  return cssValues.list(values, "");
}

// https://drafts.csswg.org/css-syntax-3/#consume-the-remnants-of-a-bad-declaration
function consumeInvalidDeclaration(input, forCustomProperty) {
  while (!input.atEnd()) {
    if (cssValues.isCloseCurlyBrace(input.next())) {
      return;
    }
    const component = consumeComponentValue(input);
    if (cssValues.isSemicolon(component)) {
      return;
    }
    if (!forCustomProperty && cssValues.isBlock(component, "{")) {
      return;
    }
  }
}

function consumeInvalidRule(input, nested, forAtRule) {
  while (!input.atEnd()) {
    if (nested && cssValues.isCloseCurlyBrace(input.next())) {
      return;
    }
    const component = consumeComponentValue(input);
    if ((nested || forAtRule) && cssValues.isSemicolon(component)) {
      return;
    }
    if (cssValues.isBlock(component, "{")) {
      return;
    }
  }
}

function getInvalidTokenError(token) {
  const type = token?.types[0];
  return type === "<bad-url-token>" ||
    type === "<bad-string-component>" ||
    (type === "<delimiter-token>" && blockModule.closingTokens.includes(token.value))
    ? new ParseErrorInfo("Invalid token")
    : null;
}

function matchToken(node) {
  if (nodeUtils.isInputAtEnd(node)) {
    return null;
  }
  const token = node.input.consume();
  if (
    token.types[0] === node.definition.name ||
    (token.types[0] === "<delimiter-token>" && node.definition.value === token.value)
  ) {
    return token;
  }
  return getInvalidTokenError(token);
}

// Read a recognized numeric function in its actual host context. An unknown head
// returns `undefined` without consumption; a malformed recognized function fails.
function parseNumericFunction(input, context, expectedName) {
  const token = input.next();
  if (token?.types[0] !== "<function-token>") {
    return undefined;
  }
  const fn = numericFunctions.get(stringUtils.toLowerCase(token.value));
  if (!fn) {
    return undefined;
  }
  if (fn.element && !nodeUtils.getRule(context)?.definition.elemental) {
    return new ParseErrorInfo(`Invalid ${expectedName}`);
  }
  const match = parseGrammar(input, fn.definition, context, "lazy");
  return cssValues.isFailure(match) ? new ParseErrorInfo(`Invalid ${expectedName}`) : match;
}

// Register recognized functions before their arguments. A retry uses the
// same stream position; substituted copies can share tokens and source offsets
// while still occupying distinct positions in this declaration's token stream.
function getRandomFunctionIndex(node) {
  const evaluation = node.context.randomEvaluation;
  const declaration = nodeUtils.getDeclaration(node);
  if (!declaration) {
    return undefined;
  }
  let streams = declaration.state.extended.get("random");
  if (streams === undefined) {
    streams = new WeakMap();
    declaration.state.extended.set("random", streams);
  }
  let indexes = streams.get(node.input);
  if (indexes === undefined) {
    indexes = new Map();
    streams.set(node.input, indexes);
  }
  let index = indexes.get(node.location);
  if (index === undefined) {
    index = evaluation ? ++evaluation.next : indexes.size + 1;
    indexes.set(node.location, index);
    if (evaluation) {
      evaluation.undo.push([indexes, node.location]);
    }
  }
  return index;
}

function matchFunction(node) {
  if (nodeUtils.isInputAtEnd(node)) {
    return null;
  }
  const { definition, input } = node;
  let name, value;
  const token = input.next();
  if (
    token.types[0] === "<function-token>" &&
    definition.name &&
    !definition.name.startsWith("<")
  ) {
    const lowercase = stringUtils.toLowerCase(token.value);
    const expected = stringUtils.toLowerCase(definition.name);
    const { aliases, mappings } = compatibility.values.functions;
    if (lowercase === expected || aliases.get(lowercase) === expected) {
      name = { ...input.consume(), value: definition.name };
    } else if (mappings.get(lowercase) === expected) {
      name = { ...input.consume(), value: lowercase };
    } else {
      return null;
    }
  } else {
    name = parseGrammar(
      input,
      {
        name: "<function-token>",
        range: definition.name,
        type: "token",
      },
      node,
      "lazy",
    );
  }
  if (cssValues.isFailure(name)) {
    return name;
  }
  if (definition.name === "random") {
    getRandomFunctionIndex(node);
  }
  if (definition.value) {
    value = parseGrammar(input, definition.value, node);
    if (cssValues.isFailure(value)) {
      return value;
    }
  } else {
    value = cssValues.list();
  }
  input.consumeIf(cssValues.isWhitespace);
  if (!input.consumeIf(cssValues.isCloseParen)) {
    input.unclosed = true;
  }
  return {
    end: input.current.end,
    name: name.value,
    start: name.start,
    types: ["<function>"],
    value,
  };
}

function matchBlock(node) {
  if (nodeUtils.isInputAtEnd(node)) {
    return null;
  }
  const { definition, input } = node;
  if (!input.consumeIf(cssValues.isDelimiter(definition.associatedToken))) {
    return null;
  }
  const associatedToken = input.current;
  const value = parseGrammar(input, definition.value, node);
  if (cssValues.isFailure(value)) {
    return value;
  }
  return completeBlock(input, associatedToken, value);
}

function consumeBlockEnd(input, associatedToken) {
  consumeWhitespace(input);
  if (
    !input.consumeIf(cssValues.isDelimiter(blockModule.associatedTokens[associatedToken.value]))
  ) {
    input.unclosed = true;
  }
}

function completeBlock(input, associatedToken, value) {
  consumeBlockEnd(input, associatedToken);
  return {
    associatedToken: associatedToken.value,
    end: input.current.end,
    start: associatedToken.start,
    types: ["<block>"],
    value,
  };
}

// Complete values have their own parsing boundary. Retain token slices only
// when the input has no source text or trimming it would change bad lexer tokens.
function consumeDeclarationTokens(node, certifyLiteral = false) {
  const { input } = node;
  const start = input.index + 1;
  const closingTokens = [];
  let validLiteral = certifyLiteral;
  let keyword;
  let hasValue = false;
  let hasCurlyBlock = false;
  let hasBadToken = false;
  let positionedBlock = false;
  while (!input.atEnd()) {
    const token = input.next();
    hasBadToken ||= token.types[0] === "<bad-string-token>" || token.types[0] === "<bad-url-token>";
    const delimiter = token.types[0] === "<delimiter-token>";
    if (closingTokens.length === 0) {
      if (delimiter && nodeUtils.isInputAtEnd(node)) {
        break;
      }
      if (!cssValues.isWhitespace(token)) {
        positionedBlock ||= hasCurlyBlock || (delimiter && token.value === "{" && hasValue);
        hasValue = true;
        hasCurlyBlock = delimiter && token.value === "{";
      }
    }
    if (validLiteral) {
      if (
        hasBadToken ||
        (delimiter &&
          blockModule.closingTokens.includes(token.value) &&
          token.value !== closingTokens.at(-1))
      ) {
        validLiteral = false;
      } else if (token.types[0] === "<function-token>") {
        const name = stringUtils.toLowerCase(token.value);
        validLiteral = !name.startsWith("--") && !arbitrarySubstitutions.has(name);
      }
      if (!cssValues.isWhitespace(token)) {
        keyword =
          keyword === undefined &&
          token.types[0] === "<ident-token>" &&
          substitutions.keywords.includes(stringUtils.toLowerCase(token.value))
            ? token.value
            : null;
      }
    }
    input.consume();
    if (token.types[0] === "<function-token>") {
      closingTokens.push(")");
    } else if (delimiter && blockModule.associatedTokens[token.value]) {
      closingTokens.push(blockModule.associatedTokens[token.value]);
    } else if (delimiter && token.value === closingTokens.at(-1)) {
      closingTokens.pop();
    }
  }
  const end = input.index + 1;
  const source =
    start === end ? "" : input.sliceSource(input.data[start].start, input.data[end - 1].end);
  const tokens =
    typeof source === "string" && !hasBadToken ? undefined : input.data.slice(start, end);
  const validated =
    validLiteral && keyword === null && closingTokens.length === 0 && !input.source.eofRecovery;
  return { source, tokens, positionedBlock, validated };
}

function matchDeclaration(node, lazy = false) {
  const { context, definition, input } = node;

  // Assert: the next token is valid according to node.definition.name
  input.consume();
  input.consumeIf(cssValues.isWhitespace);
  if (!input.consumeIf(cssValues.isColon)) {
    return null;
  }
  input.consumeIf(cssValues.isWhitespace);
  const valueStart = input.index + 1;
  const {
    source,
    tokens: valueTokens,
    positionedBlock,
    validated,
  } = consumeDeclarationTokens(node, lazy && definition.custom && tokenizedInputs.has(input));
  const sourceToken = lazy && input.index === valueStart ? input.current : undefined;
  let parsed, value;
  if (lazy) {
    if (!definition.custom && positionedBlock) {
      return null;
    }
  } else {
    const valueInput =
      valueTokens === undefined ? source : new CSSStream(valueTokens, input.source);
    const valueContext = { ...context, trees: [] };
    const key = getDeclarationCacheKey(valueInput, definition.name, valueContext);
    parsed = parseCompleteDeclarationValue(valueInput, definition, valueContext, key);
    ({ value } = parsed);
    if (cssValues.isFailure(value)) {
      if (value === invalidPositionedBlock) {
        return null;
      }
      return new ParseErrorInfo("Cannot parse invalid declaration value");
    }
  }
  input.consumeIf(cssValues.isWhitespace);

  // Validate the priority (if any)
  let important = false;
  if (input.consumeIf(cssValues.isDelimiter("!"))) {
    input.consumeIf(cssValues.isWhitespace);
    if (
      !input.consumeIf(({ types, value: priority }) => {
        return types[0] === "<ident-token>" && stringUtils.toLowerCase(priority) === "important";
      })
    ) {
      return new ParseErrorInfo("Cannot parse invalid declaration value");
    }
    if (!nodeUtils.isInputAtEnd(node)) {
      return new ParseErrorInfo("Cannot parse invalid declaration value");
    }
    important = true;
  }
  if (important && !nodeUtils.getRule({ context }).definition.cascading) {
    return new ParseErrorInfo("Cannot parse invalid declaration value");
  }
  const { name } = definition;
  if (lazy) {
    let ownedSource = source;
    if (typeof source === "string") {
      // A complete identifier from our lexer already owns its decoded spelling.
      // Other deferred slices must be detached before a CSSOM read can expose them.
      ownedSource =
        sourceToken?.types[0] === "<ident-token>" &&
        tokenizedInputs.has(input) &&
        source === sourceToken.value
          ? sourceToken.value
          : stringUtils.copyString(source);
    }
    if (validated) {
      // Certified literal declarations can be serialized before token parsing.
      return {
        name,
        important,
        source: ownedSource,
        parsing: getDeclarationSyntaxContext(node),
        validated: true,
      };
    }
    return {
      name,
      important,
      source: ownedSource,
      tokens: valueTokens,
      parsing: getDeclarationSyntaxContext(node),
    };
  }
  const result = { important, name, types: [], value };
  if (parsed.source !== undefined) {
    result.source = parsed.source;
  }
  if (parsed.pending) {
    result.pending = name;
  }
  return result;
}

function matchQualifiedRule(node) {
  const { definition, input } = node;
  const prelude = parseGrammar(input, definition.prelude, node);
  if (cssValues.isFailure(prelude)) {
    return new ParseErrorInfo("Cannot parse invalid rule");
  }
  input.consumeIf(cssValues.isWhitespace);
  if (input.peek(cssValues.isOpenCurlyBrace)) {
    return createRuleSyntax(node, undefined, prelude);
  }
  return new ParseErrorInfo("Cannot parse invalid rule");
}

function matchAtRule(node) {
  const { definition, input } = node;
  // Assert: the next token matches the definition name
  const name = stringUtils.toLowerCase(input.consume().value);
  input.consumeIf(cssValues.isWhitespace);
  if (definition.prelude) {
    const prelude = parseGrammar(input, definition.prelude, node);
    if (cssValues.isFailure(prelude)) {
      return null;
    }
    input.consumeIf(cssValues.isWhitespace);
    if (definition.value) {
      if (input.peek(cssValues.isOpenCurlyBrace)) {
        return createRuleSyntax(node, name, prelude);
      }
      return null;
    }
    if (input.consumeIf(cssValues.isSemicolon) || nodeUtils.isInputAtEnd(node)) {
      return createRuleSyntax(node, name, prelude);
    }
    return null;
  }

  // Assert: all at-rules with no prelude are defined with a block value
  if (input.peek(cssValues.isOpenCurlyBrace)) {
    return createRuleSyntax(node, name);
  }
  return null;
}

function matchRule(node) {
  return node.definition.qualified ? matchQualifiedRule(node) : matchAtRule(node);
}

// Rule and body frames provide typed grammar boundaries without generic parse
// states, alternative iterators, children arrays, or temporary block values.
// Read `structuralBoundary` only on active `trees` entries: derived contexts can
// inherit the marker without themselves representing a rule body.
function createStructuralContext(context, definition, input) {
  return {
    ...context,
    context,
    definition,
    input,
    location: input.index,
    parent: null,
    children: undefined,
    state: undefined,
    value: undefined,
    structuralBoundary: undefined,
    separator: " ",
  };
}

function parseStructuralRule(input, definition, context) {
  input.consumeIf(cssValues.isWhitespace);
  if (definition.type === "|") {
    // Each rule alternative owns its actual prelude boundary. A statement
    // cannot borrow the block alternative's opening-brace termination.
    for (const alternative of definition.value) {
      const rule = parseStructuralRule(input, alternative, context);
      if (rule !== null) {
        return rule;
      }
    }
    return null;
  }
  const frame = createStructuralContext(context, definition, input);
  context.trees.push(frame);
  try {
    let rule = matchRule(frame);
    if (!cssValues.isFailure(rule)) {
      const postprocess = rulePostprocess[definition.name];
      if (postprocess) {
        rule = postprocess(rule, frame);
      }
    }
    if (cssValues.isFailure(rule)) {
      input.backtrack(frame.location);
    }
    return rule;
  } finally {
    context.trees.pop();
  }
}

function createRuleSyntax(node, name, prelude) {
  const { definition, input } = node;
  let block;
  if (definition.value) {
    // The rule recognizer has already established the opening brace. Keep the
    // same body loop and recovery, and retain only its actual syntax list.
    input.consume();
    const context = parseContext.createContext(node);
    const body = createStructuralContext(context, definition.value, input);
    body.structuralBoundary = "block";
    body.deferDeclarations = definition.deferDeclarations === true;
    context.trees.push(body);
    try {
      block = consumeRuleContents(body, true);
      input.consumeIf(cssValues.isWhitespace);
      if (!input.consumeIf(cssValues.isCloseCurlyBrace)) {
        input.unclosed = true;
      }
    } finally {
      context.trees.pop();
    }
  }
  return { definition, name, prelude, block };
}

function getRuleSyntaxType(rule) {
  return rule.definition.cssom;
}

function parseBlockDeclaration(input, definition, context) {
  const node = parseNode.createNode(definition, input, context);
  context.trees.push(node);
  try {
    // Only declarations in a rule's block can defer value validation. Declarations
    // matched by other grammars, such as nested supports conditions, remain eager.
    const declaration = matchDeclaration(node, context.deferDeclarations === true);
    if (cssValues.isFailure(declaration)) {
      input.backtrack(node.location);
    }
    return declaration;
  } finally {
    context.trees.pop();
  }
}

function matchBlockContents(node) {
  const context = { ...parseContext.createContext(node), separator: " " };
  return cssValues.list(consumeRuleContents(context, node.context.definition.type === "block"));
}

function consumeRuleContents(node, nested) {
  const {
    definition: { shorthands },
    input,
  } = node;
  const declarationContext = node;
  const rules = [];
  let declarations = [];
  while (!nodeUtils.isInputAtEnd(node)) {
    if (input.consumeIf(cssValues.isWhitespace) || input.consumeIf(cssValues.isSemicolon)) {
      continue;
    }
    if (!nested && input.consumeIf(cssValues.isCloseCurlyBrace)) {
      continue;
    }
    const token = input.next();
    if (token.types[0] === "<at-keyword-token>") {
      const definition = contextUtils.getRuleDefinition(node, token.value);
      const rule = definition ? parseStructuralRule(input, definition, node) : null;
      if (cssValues.isFailure(rule)) {
        consumeInvalidRule(input, nested, true);
        continue;
      }
      if (declarations.length > 0) {
        rules.push(
          node.deferDeclarations === true
            ? declarations
            : getDeclarationsInSpecifiedOrder(declarations, shorthands),
        );
        declarations = [];
      }
      rules.push(rule);
      continue;
    }
    if (token.types[0] === "<ident-token>") {
      const definition = contextUtils.getDeclarationDefinition(node, token.value);
      const declaration = definition
        ? parseBlockDeclaration(input, definition, declarationContext)
        : null;
      if (cssValues.isParseErrorInfo(declaration)) {
        consumeInvalidDeclaration(input, definition.custom);
        continue;
      }
      if (declaration) {
        declarations.push(declaration);
        continue;
      }
    }
    const definition = contextUtils.getRuleDefinition(node);
    const rule = definition ? parseStructuralRule(input, definition, node) : null;
    if (cssValues.isFailure(rule)) {
      consumeInvalidRule(input, nested);
      continue;
    }
    if (declarations.length > 0) {
      rules.push(
        node.deferDeclarations === true
          ? declarations
          : getDeclarationsInSpecifiedOrder(declarations, shorthands),
      );
      declarations = [];
    }
    rules.push(rule);
  }
  if (declarations.length > 0) {
    rules.push(
      node.deferDeclarations === true
        ? declarations
        : getDeclarationsInSpecifiedOrder(declarations, shorthands),
    );
  }
  return rules;
}

function releaseCommittedStyleSheetTokens(input, from) {
  if (!input.releaseCommittedTokens) {
    return from;
  }
  // Keep the current and previous token for the existing start/whitespace
  // checks. Absolute stream indexes and all unconsumed lookahead stay intact.
  const to = Math.max(from, input.index - 1);
  input.data.fill(undefined, from, to);
  return to;
}

function matchStyleSheet(node) {
  const { context, input } = node;
  const ruleContext = parseContext.createContext(node);
  const rules = [];
  let released = 0;
  while (!nodeUtils.isInputAtEnd(node)) {
    released = releaseCommittedStyleSheetTokens(input, released);
    if (input.consumeIf((token) => cssValues.isDelimiter([" ", "<!--", "-->"], token))) {
      continue;
    }
    const [token, middle, tail] = input.next(3);
    const {
      types: [type],
      value,
    } = token;

    // --custom: ... { ... }
    if (
      type === "<ident-token>" &&
      value.startsWith("--") &&
      ((middle && cssValues.isColon(middle)) ||
        (tail && cssValues.isWhitespace(middle) && cssValues.isColon(tail)))
    ) {
      consumeInvalidRule(input);
      continue;
    }
    const definition = contextUtils.getRuleDefinition(
      node,
      type === "<at-keyword-token>" ? value : null,
    );
    const rule = definition ? parseStructuralRule(input, definition, ruleContext) : null;
    if (cssValues.isFailure(rule)) {
      consumeInvalidRule(input, false, type === "<at-keyword-token>");
      continue;
    }
    if (
      ruleOrder.isInvalidIndexForRule(rules, rule, rules.length, getRuleSyntaxType) ||
      ruleOrder.isInvalidNamespaceRule(rules, rule, getRuleSyntaxType)
    ) {
      continue;
    }
    if (rule.definition.cssom === "CSSNamespaceRule") {
      const [prefix, location] = rule.prelude;
      context.namespaces.set(
        cssValues.isOmitted(prefix) ? "" : prefix.value,
        cssValues.isFunction(location) ? location.value[0].value : location.value,
      );
      namespaceSnapshots.delete(context.namespaces);
    }
    rules.push(rule);
  }
  releaseCommittedStyleSheetTokens(input, released);
  return cssValues.list(rules);
}

// https://drafts.csswg.org/css-syntax-3/#input-preprocessing
function preprocess(input) {
  return input.replace(/\r\n?|\f|[\u0000\uD800-\uDFFF]/gu, (character) => {
    return character === "\r\n" || character === "\r" || character === "\f" ? "\n" : "�";
  });
}

// https://drafts.csswg.org/css-syntax-3/#normalize-into-a-token-stream
function normalizeIntoTokens(input, diagnostics) {
  if (input instanceof CSSStream) {
    return input;
  }
  if (typeof input === "string") {
    const source = { text: input };
    return new CSSStream(
      {
        empty: [],
        iterator: tokenize(preprocess(input), source, diagnostics),
      },
      source,
    );
  }
  return new CSSStream(input);
}

function parseArbitrarySubstitution(input, context) {
  const token = input.next();
  if (token?.types[0] !== "<function-token>") {
    return null;
  }
  const name = stringUtils.toLowerCase(token.value);
  const substitution = arbitrarySubstitutions.get(name.startsWith("--") ? "<dashed-ident>" : name);
  if (!substitution) {
    return null;
  }
  context = parseContext.createContext(context);
  const {
    definition: { cascading, elemental },
  } = nodeUtils.getRule(context) ?? { definition: {} };
  const { cascade, definition, element } = substitution;
  if (!elemental && (element || (cascade && !cascading))) {
    return null;
  }
  const node = parseNode.createNode(definition, input, context);
  return (
    parseGrammar(input, definition, node, "lazy") ?? new ParseErrorInfo("Invalid substitution")
  );
}

function parseUnparsedValue(input, context) {
  const node = parseNode.createNode(
    {
      type: "arbitrary",
    },
    input,
    context,
  );
  const { index } = input;
  const {
    definition: { name, custom, wildcard },
  } = context;
  const allowPositionedBlock =
    custom || (!wildcard && (name === "initial-value" || name === "result"));
  let hasArbitrarySubstitution = false;
  let hasBadToken = false;
  const tokens = [];
  function parseLevel(closingToken) {
    const start = tokens.length;
    input.consumeIf(cssValues.isWhitespace);
    while (
      closingToken
        ? !input.atEnd() && !input.peek(cssValues.isDelimiter(closingToken))
        : !nodeUtils.isInputAtEnd(node)
    ) {
      const token = input.next();
      const type = token.types[0];

      // Bad token preserved to parse a value against a forgiving grammar
      if (
        (!closingToken && cssValues.isDelimiter(["!", ";"], token)) ||
        cssValues.isDelimiter(blockModule.closingTokens, token) ||
        type === "<bad-string-token>" ||
        type === "<bad-url-token>"
      ) {
        hasBadToken = true;
        tokens.push(input.consume());
        continue;
      }
      if (cssValues.isDelimiter(blockModule.openingTokens, token)) {
        // Top-level positioned {} block
        if (!closingToken && token.value === "{" && !allowPositionedBlock && tokens.length > 0) {
          return invalidPositionedBlock;
        }
        input.consume();
        const associatedToken = blockModule.associatedTokens[token.value];
        tokens.push(token);
        const error = parseLevel(associatedToken);
        if (error !== undefined) {
          return error;
        }
        let end = input.consumeIf(cssValues.isDelimiter(associatedToken));
        if (!end) {
          input.unclosed = true;
          end = cssValues.delimiter(associatedToken);
        }
        tokens.push(end);

        // Top-level positioned {} block
        if (
          !closingToken &&
          token.value === "{" &&
          !allowPositionedBlock &&
          !nodeUtils.isInputAtEnd(node)
        ) {
          return invalidPositionedBlock;
        }
        continue;
      }
      if (type === "<function-token>") {
        const substitution = parseArbitrarySubstitution(input, context);
        if (cssValues.isParseErrorInfo(substitution)) {
          return substitution;
        }
        if (substitution) {
          hasArbitrarySubstitution = true;
          tokens.push(substitution);
          if (cssValues.isWhitespace(input.current)) {
            tokens.push(input.current);
          }
          continue;
        }
        input.consume();
        tokens.push(token);
        const error = parseLevel(")");
        if (error !== undefined) {
          return error;
        }
        let end = input.consumeIf(cssValues.isCloseParen);
        if (!end) {
          input.unclosed = true;
          end = cssValues.delimiter(")");
        }
        tokens.push(end);
        continue;
      }
      tokens.push(input.consume());
    }
    if (tokens.length > start && cssValues.isWhitespace(tokens.at(-1))) {
      tokens.pop();
    }
    return undefined;
  }
  const error = parseLevel();
  if (error !== undefined) {
    return error;
  }
  if (hasArbitrarySubstitution && !hasBadToken) {
    context.state.extended.set("pending", true);
    return cssValues.list(tokens, "");
  }
  if (custom && !hasBadToken && tokens.length > 0) {
    return cssValues.list(tokens, "", ["<declaration-value>", name]);
  }
  input.backtrack(index);
  return null;
}

function parseCSSWideKeyword(input, context) {
  let offset = 0;
  let token = input.next();
  while (cssValues.isWhitespace(token)) {
    token = input.next(1, ++offset);
  }
  if (
    token?.types[0] !== "<ident-token>" ||
    !substitutions.keywords.includes(stringUtils.toLowerCase(token.value))
  ) {
    return null;
  }
  const {
    definition: { cascading, elemental },
  } = nodeUtils.getRule(context);
  if (cascading || elemental) {
    return parseGrammar(input, substitutions.keywords.join(" | "), context);
  }
  return null;
}

// https://drafts.csswg.org/cssom-1/#parse-a-css-value
function parseDeclarationValue(input, definition, context) {
  context = parseContext.createContext(context);
  if (typeof definition === "string") {
    definition = contextUtils.getDeclarationDefinition(context, definition);
    if (!definition) {
      return null;
    }
    if (typeof input === "string") {
      return parseCompleteDeclarationValue(input, definition, context).value;
    }
    context = parseContext.createDeclarationContext(context, definition);
    definition = contextUtils.getDeclarationValueDefinition(definition);
  }
  input = normalizeIntoTokens(input);
  return (
    parseCSSWideKeyword(input, context) ??
    parseUnparsedValue(input, context) ??
    parseGrammar(input, definition, context)
  );
}

function parseDestructuredDeclaration(name, value, important, context) {
  context = parseContext.createContext(context);
  if (important && !nodeUtils.getRule({ context }).definition.cascading) {
    return null;
  }
  const definition = contextUtils.getDeclarationDefinition(context, name);
  if (!definition) {
    return null;
  }

  const parsed = parseCompleteDeclarationValue(value, definition, context);
  ({ value } = parsed);
  if (cssValues.isFailure(value)) {
    return value;
  }
  const source =
    parsed.pending && parsed.source !== undefined
      ? parsed.source.replace(/^[\t\n\f\r ]+|[\t\n\f\r ]+$/g, "")
      : parsed.source;
  if (source !== parsed.source) {
    return { ...parsed, important, source };
  }
  return important ? { ...parsed, important } : parsed;
}

function parseDeclarations(input, context) {
  context = parseContext.createContext(context);
  let key = typeof input === "string" ? getDeclarationCacheKey(input, null, context) : undefined;
  const cached = key === undefined ? undefined : declarationValues.get(key);
  if (cached) {
    return cached.slice();
  }
  if (key !== undefined) {
    input = stringUtils.copyString(input);
    key = stringUtils.copyString(key);
  }
  input = normalizeIntoTokens(input);
  const declarations = [];
  while (!input.atEnd()) {
    if (input.consumeIf(cssValues.isWhitespace) || input.consumeIf(cssValues.isSemicolon)) {
      continue;
    }
    const token = input.next();
    if (token.types[0] === "<at-keyword-token>") {
      consumeInvalidRule(input, false, true);
      continue;
    }
    if (token.types[0] === "<ident-token>") {
      const definition = contextUtils.getDeclarationDefinition(context, token.value);
      const declaration = definition ? parseBlockDeclaration(input, definition, context) : null;
      if (!cssValues.isFailure(declaration)) {
        declarations.push(declaration);
        continue;
      }
    }
    consumeComponentValues(input, [";"]);
  }
  const ordered = getDeclarationsInSpecifiedOrder(
    declarations,
    context.definition.value.shorthands,
  );
  if (key !== undefined) {
    const result = ordered.slice();
    const groups = new Map();
    for (const declaration of result) {
      const group = expandShorthand.getGroup(declaration);
      if (group) {
        groups.set(group, (groups.get(group) ?? 0) + 1);
      }
    }
    const seen = new Set();
    let size = key.length * 2 + syntaxObjectSize + result.length * 8;
    for (const declaration of result) {
      const group = expandShorthand.getGroup(declaration);
      if (group) {
        const count = groups.get(group);
        if (count === undefined) {
          continue;
        }
        // Ordering already deduplicated names. Equal membership therefore
        // means the original immutable expansion is retained in full.
        if (count === group.length) {
          size += group.size;
          groups.delete(group);
          continue;
        }
      }
      // Partial groups retain only their surviving members. Use the original
      // shared traversal for those members and all ungrouped declarations.
      size += syntaxSize(declaration, seen);
    }
    declarationValues.set(key, result, { size });
  }
  return ordered;
}

// Parse a stylesheet with diagnostics confined to this synchronous operation.
// Cached parse contexts can retain streams, so always release the callback.
function parseStyleSheetSyntax(input, onError) {
  const key = typeof input === "string" ? input : undefined;
  const cached = key === undefined ? undefined : styleSheetSyntax.get(key);
  if (cached) {
    if (onError) {
      for (const diagnostic of cached.diagnostics) {
        const error = new SyntaxError(diagnostic.message);
        error.offset = diagnostic.offset;
        onError(error);
      }
    }
    return cached.rules;
  }
  const reported = [];
  let diagnosticSize = syntaxObjectSize;
  const diagnostics = {
    onError(error) {
      reported.push({ message: error.message, offset: error.offset });
      diagnosticSize += syntaxObjectSize + error.message.length * 2;
      onError?.(error);
    },
  };
  const tokens = normalizeIntoTokens(input, diagnostics);
  if (key !== undefined) {
    // This stream is private to a complete stylesheet parse. Caller-supplied
    // token arrays and streams retain their original data and backtracking API.
    tokenizedInputs.add(tokens);
    tokens.releaseCommittedTokens = true;
  }
  try {
    const rules = parseGrammar(tokens, require("../rules/definitions.js").value);
    const sourceSize = key === undefined ? Infinity : key.length * 2 + diagnosticSize;
    if (sourceSize <= styleSheetSyntax.maxSize) {
      const entry = {
        rules,
        diagnostics: reported,
        size: sourceSize + syntaxSize(rules, new Set(), styleSheetSyntax.maxSize - sourceSize),
      };
      if (entry.size <= styleSheetSyntax.maxSize) {
        styleSheetSyntax.set(stringUtils.copyString(key), entry);
      }
    }
    return rules;
  } catch (error) {
    if (!(error instanceof NestingLimitError)) {
      throw error;
    }
    onError?.(error);
    return [];
  } finally {
    diagnostics.onError = undefined;
  }
}

function parseStyleSheet(input, sheet, onError) {
  return parseStyleSheetSyntax(input, onError).map((rule) => {
    return cssomModule.createRule(sheet._globalObject, rule, null, sheet);
  });
}

// https://drafts.csswg.org/css-syntax-3/#parse-a-rule
function parseRule(input, context) {
  const tokenized = typeof input === "string";
  input = normalizeIntoTokens(input);
  if (tokenized) {
    tokenizedInputs.add(input);
  }
  input.consumeIf(cssValues.isWhitespace);
  if (input.atEnd()) {
    return new ParseErrorInfo("Cannot parse missing rule");
  }
  context = parseContext.createContext(context);
  const token = input.next();
  const definition =
    token.types[0] === "<at-keyword-token>"
      ? contextUtils.getRuleDefinition(context, token.value)
      : contextUtils.getRuleDefinition(context);
  if (!definition) {
    return new ParseErrorInfo("Cannot parse invalid rule");
  }
  const rule = parseStructuralRule(input, definition, context);
  if (cssValues.isFailure(rule)) {
    return rule ?? new ParseErrorInfo("Cannot parse invalid rule");
  }
  input.consumeIf(cssValues.isWhitespace);
  if (input.atEnd()) {
    const parent = nodeUtils.getRule({ context }).value;
    const sheet = nodeUtils.getRoot({ context }).value ?? null;
    return cssomModule.createRule(
      context.globalObject,
      rule,
      parent === sheet ? null : parent,
      sheet,
    );
  }
  return new ParseErrorInfo("Cannot parse more than a single rule");
}

// https://drafts.csswg.org/css-syntax-3/#css-parse-something-according-to-a-css-grammar
function parseGrammar(input, definition, context, strategy = "backtrack") {
  input = normalizeIntoTokens(input);
  consumeWhitespace(input);
  context = parseContext.createContext(context);
  const root = parseNode.createNode(definition, input, {
    ...context,
    separator: " ",
  });
  context.trees.push(root);
  const evaluation = context.randomEvaluation;
  const checkpoint = evaluation && [evaluation.next, evaluation.undo.length];
  if (evaluation) {
    ++evaluation.depth;
  }
  let completed = null;
  try {
    if (
      strategy === "backtrack" &&
      (definition === "<media-query>" ||
        definition === "<media-condition>" ||
        definition === "<media-condition-without-or>")
    ) {
      const value =
        definition === "<media-query>"
          ? parseMediaQueryDirect(root)
          : parseMediaConditionDirect(root, definition === "<media-condition-without-or>");
      completed =
        cssValues.isParseErrorInfo(value) && context.definition.type === "forgiving" ? null : value;
      return completed;
    }
    let match = parseNode.parseNode(root);
    while (!cssValues.isFailure(match) && !nodeUtils.isInputAtEnd(root)) {
      if (strategy === "greedy") {
        match = new ParseErrorInfo("Unexpected remaining tokens");
        break;
      }
      if (strategy === "lazy") {
        break;
      }
      match = parseNode.parseNode(root);
    }
    if (cssValues.isParseErrorInfo(match) && context.definition.type === "forgiving") {
      return null;
    }
    completed = match;
    return completed;
  } finally {
    if (evaluation) {
      if (cssValues.isFailure(completed)) {
        while (evaluation.undo.length > checkpoint[1]) {
          const [indexes, location] = evaluation.undo.pop();
          indexes.delete(location);
        }
        evaluation.next = checkpoint[0];
      }
      if (--evaluation.depth === 0) {
        evaluation.undo.length = 0;
      }
    }
    context.trees.pop();
  }
}
function parsePagePseudo(root, context) {
  const { input } = root;
  input.consume();
  const token = input.next();
  if (token?.types[0] === "<ident-token>") {
    const value = stringUtils.toLowerCase(token.value);
    if (["left", "right", "first", "blank"].includes(value)) {
      input.consume();
      return `:${value}`;
    }
    return null;
  }
  if (token?.types[0] !== "<function-token>" || stringUtils.toLowerCase(token.value) !== "nth") {
    return nodeUtils.isInputAtEnd(root) ? null : getInvalidTokenError(token);
  }
  const fn = parseNode.createNode({ type: "function", name: "nth" }, input, context, root);
  input.consume();
  input.consumeIf(cssValues.isWhitespace);
  const functionContext = { ...parseContext.createContext(fn), separator: " " };
  const notationNode = parseNode.createNode("<a-n-plus-b>", input, functionContext);
  functionContext.trees.push(notationNode);
  try {
    while (true) {
      const notation = parseNode.parseNode(notationNode);
      if (cssValues.isFailure(notation)) {
        return notation;
      }
      input.consumeIf(cssValues.isWhitespace);
      const continuation = input.index;
      let of = null;
      if (!nodeUtils.isInputAtEnd(notationNode)) {
        const next = input.next();
        const error = getInvalidTokenError(next);
        if (error) {
          return error;
        }
        if (next?.types[0] === "<ident-token>" && stringUtils.toLowerCase(next.value) === "of") {
          input.consume();
          const name = parseGrammar(input, "<custom-ident>", fn, "lazy");
          if (cssValues.isParseErrorInfo(name)) {
            return name;
          }
          if (name !== null) {
            of = name.value;
            input.consumeIf(cssValues.isWhitespace);
          } else {
            input.backtrack(continuation);
          }
        }
      }
      if (!nodeUtils.isInputAtEnd(notationNode)) {
        input.backtrack(continuation);
        continue;
      }
      if (!input.consumeIf(cssValues.isCloseParen)) {
        input.unclosed = true;
      }
      return { notation: serialize.serializeComponentValue(notation), of };
    }
  } finally {
    functionContext.trees.pop();
  }
}

// Retain decoded names and compact validated pseudos. Serialize identifiers
// only when a page prelude is read; shared leaves still validate An+B and names.
function matchPageSelectorList(root) {
  const { input } = root;
  const start = input.index;
  function reject(value) {
    input.backtrack(start);
    return value;
  }
  if (nodeUtils.isInputAtEnd(root)) {
    return null;
  }
  const pages = cssValues.list([], ",");
  const context = { ...root.context, separator: "" };
  while (true) {
    const token = input.next();
    let name = null;
    if (token?.types[0] === "<ident-token>") {
      name = input.consume().value;
    } else {
      const error = getInvalidTokenError(token);
      if (error) {
        return reject(error);
      }
    }
    const pseudos = [];
    while (input.peek(cssValues.isColon)) {
      const pseudo = parsePagePseudo(root, context);
      if (cssValues.isFailure(pseudo)) {
        return reject(pseudo);
      }
      pseudos.push(pseudo);
    }
    if (!nodeUtils.isInputAtEnd(root)) {
      const error = getInvalidTokenError(input.next());
      if (error) {
        return reject(error);
      }
    }
    if (name === null && pseudos.length === 0) {
      return reject(null);
    }
    pages.push({ name, pseudos });
    input.consumeIf(cssValues.isWhitespace);
    if (!input.consumeIf(cssValues.isComma)) {
      if (!nodeUtils.isInputAtEnd(root)) {
        return reject(null);
      }
      return pages;
    }
    if (nodeUtils.isInputAtEnd(root)) {
      return reject(new ParseErrorInfo("Invalid ,"));
    }
    input.consumeIf(cssValues.isWhitespace);
  }
}

// Tokenization coalesces trivia. Substitution can leave additional buffered whitespace,
// which can be skipped without pulling a later diagnostic token from the lexer.
function consumeWhitespace(input) {
  input.consumeIf(cssValues.isWhitespace);
  while (cssValues.isWhitespace(input.data[input.index + 1])) {
    input.consume();
  }
}

function matchMediaInParens(node) {
  const { input, context } = node;
  const start = input.index;
  let value;
  if (!nodeUtils.isInputAtEnd(node) && input.peek(cssValues.isDelimiter("("))) {
    // A complete body parse owns speculative hooks, including early random indices.
    const block = parseNode.createNode(
      { type: "block", associatedToken: "(" },
      input,
      context,
      node,
    );
    const opening = input.consume();
    const bodyStart = input.index;
    consumeWhitespace(input);
    const first = input.next();
    const condition =
      first?.types[0] === "<function-token>" ||
      cssValues.isDelimiter("(")(first) ||
      (first?.types[0] === "<ident-token>" && stringUtils.toLowerCase(first.value) === "not");
    input.backtrack(bodyStart);
    value = condition ? parseGrammar(input, "<media-condition>", block) : null;
    if (value === null) {
      input.backtrack(bodyStart);
      value = parseGrammar(input, "<media-feature>", block);
    }
    if (cssValues.isParseErrorInfo(value)) {
      return value;
    }
    if (value !== null) {
      consumeBlockEnd(input, opening);
      value = mediaSyntax.group(value);
    }
  }
  if (value === undefined || value === null) {
    input.backtrack(start);
    const enclosed = parseNode.createNode("<general-enclosed>", input, context, node);
    value = parseNode.parseNode(enclosed);
    if (!cssValues.isFailure(value)) {
      value = mediaSyntax.unknown(value);
    }
  }
  if (!cssValues.isFailure(value) && context.separator !== "") {
    consumeWhitespace(input);
  }
  return value;
}

function mediaKeyword(node, expected) {
  if (nodeUtils.isInputAtEnd(node)) {
    return null;
  }
  const { input } = node;
  const token = input.next();
  if (token?.types[0] !== "<ident-token>" || stringUtils.toLowerCase(token.value) !== expected) {
    return getInvalidTokenError(token);
  }
  input.consume();
  consumeWhitespace(input);
  return expected;
}

function parseMediaConditionDirect(root, withoutOr) {
  const { input } = root;
  const start = input.index;
  function reject(value) {
    input.backtrack(start);
    return value;
  }
  const not = mediaKeyword(root, "not");
  if (cssValues.isParseErrorInfo(not)) {
    return reject(not);
  }
  const first = parseGrammar(input, "<media-in-parens>", root, "lazy");
  if (cssValues.isFailure(first)) {
    return reject(first);
  }
  consumeWhitespace(input);
  if (not) {
    return nodeUtils.isInputAtEnd(root) ? mediaSyntax.not(first) : reject(null);
  }
  const values = [first];
  let operator;
  while (true) {
    if (nodeUtils.isInputAtEnd(root)) {
      break;
    }
    const token = input.next();
    const error = getInvalidTokenError(token);
    if (error) {
      return reject(error);
    }
    const next =
      token?.types[0] === "<ident-token>" ? stringUtils.toLowerCase(token.value) : undefined;
    if (next !== "and" && next !== "or") {
      break;
    }
    if ((withoutOr && next === "or") || (operator !== undefined && operator !== next)) {
      return reject(null);
    }
    operator = next;
    mediaKeyword(root, operator);
    const value = parseGrammar(input, "<media-in-parens>", root, "lazy");
    if (cssValues.isFailure(value)) {
      return reject(value);
    }
    values.push(value);
    consumeWhitespace(input);
  }
  return nodeUtils.isInputAtEnd(root) ? mediaSyntax.condition(operator, values) : reject(null);
}

function parseMediaQueryDirect(root) {
  const { input } = root;
  const start = input.index;
  const condition = parseMediaConditionDirect(root, false);
  if (cssValues.isParseErrorInfo(condition)) {
    return condition;
  }
  if (condition !== null) {
    return condition;
  }
  const modifier = mediaKeyword(root, "not") ?? mediaKeyword(root, "only") ?? null;
  if (cssValues.isParseErrorInfo(modifier)) {
    input.backtrack(start);
    return modifier;
  }
  function reject(value) {
    input.backtrack(start);
    if (modifier !== null && !cssValues.isParseErrorInfo(value)) {
      // Resume the optional modifier as omitted, using the existing media-type hook.
      value = parseGrammar(input, "<media-type>", root, "lazy");
      input.backtrack(start);
    }
    return value;
  }
  const type = parseGrammar(input, "<media-type>", root, "lazy");
  if (cssValues.isFailure(type)) {
    return reject(type);
  }
  consumeWhitespace(input);
  let tail = null;
  const and = mediaKeyword(root, "and");
  if (cssValues.isParseErrorInfo(and)) {
    return reject(and);
  }
  if (and) {
    tail = parseMediaConditionDirect(root, true);
    if (cssValues.isFailure(tail)) {
      return reject(tail);
    }
  }
  if (!nodeUtils.isInputAtEnd(root)) {
    return reject(null);
  }
  return mediaSyntax.query(modifier, type.value, tail);
}

function consumeUnparsedSelector(input, context) {
  const start = input.next()?.start ?? input.current.end;
  const value = consumeComponentValues(input, ",", context);
  const representation = stringUtils.copySource(
    input
      .sliceSource(start, input.current?.end ?? start)
      ?.replace(/^[\t\n\f\r ]+|[\t\n\f\r ]+$/g, ""),
  );
  return { kind: "invalid-selector", value, representation };
}

function parsePseudoElementSelectors(input, context) {
  const tokens = normalizeIntoTokens(input);
  const selector = parseGrammar(tokens, "<complex-selector>", context);
  if (cssValues.isFailure(selector)) {
    return selector;
  }
  if (cssValues.isWhitespace(tokens.data[0])) {
    return null;
  }
  const compound = selector.units[0];
  if (
    selector.units.length !== 1 ||
    compound.type !== null ||
    compound.subclasses.length > 0 ||
    compound.pseudos === null ||
    compound.pseudos.some((pseudo) => pseudo.classes !== null)
  ) {
    return null;
  }
  const lastToken = tokens.data.at(-1);
  const lastPseudo = compound.pseudos.at(-1);
  if (cssValues.isWhitespace(lastToken) && lastToken.start >= lastPseudo.end) {
    return null;
  }
  return compound.pseudos;
}

function parseListGrammar(input, definition, context) {
  input = normalizeIntoTokens(input);
  context = parseContext.createContext(context);
  if (nodeUtils.isInputAtEnd(context)) {
    return cssValues.list([], ",");
  }
  const value = [];
  const serialized = [];
  let invalid = false;
  do {
    const start = input.next()?.start ?? input.current.end;
    const match = parseGrammar(input, definition, context);
    value.push(match);
    if (cssValues.isFailure(match)) {
      invalid = true;
      consumeComponentValues(input, ",", context);
      serialized.push(
        stringUtils.copySource(input.sliceSource(start, input.current?.end ?? start)?.trim()) ?? "",
      );
    } else {
      serialized.push(match);
    }
  } while (input.consumeIf(cssValues.isComma));
  const list = cssValues.list(value, ",");
  if (invalid && context.definition.name === "<forgiving-selector-list>") {
    list.serialized = serialized;
  }
  return list;
}
