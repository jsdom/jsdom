"use strict";

const parserNodes = require("./node.js");
const selectorContext = require("./selector-context.js");
const nodeUtils = require("./tree.js");
const { toLowerCase } = require("../utils/string.js");
const values = require("../values/value.js");
const { ParseErrorInfo } = require("./errors.js");
const syntax = require("../utils/selector-syntax.js");

const selectorLists = new Map([
  ["<selector-list>", "<complex-selector>"],
  ["<complex-selector-list>", "<complex-selector>"],
  ["<complex-real-selector-list>", "<complex-real-selector>"],
  ["<compound-selector-list>", "<compound-selector>"],
  ["<relative-selector-list>", "<relative-selector>"],
  ["<relative-real-selector-list>", "<relative-real-selector>"]
]);
const legacyPseudoElements = new Set(["before", "after", "first-line", "first-letter"]);

function isDelimiter(token, character) {
  return token?.types[0] === "<delimiter-token>" && token.value === character;
}

function invalid() {
  return new ParseErrorInfo("Invalid selector");
}

// Attribute values and pseudo arguments retain their individual grammars. Their
// semantic context is explicit, independent of the structural parser's nodes.
function parseLeaf(node, name, context) {
  const leaf = parserNodes.createNode(name, node.input, {
    ...node.context,
    separator: "",
    selectorContext: context
  }, node);
  return parserNodes.parseNode(leaf);
}

function getPseudoType(selector) {
  return selector.name ? `${selector.name}()` : selector.value;
}

function startsPseudoElement(input) {
  if (!isDelimiter(input.next(), ":")) {
    return false;
  }
  const next = input.next(1, 1);
  return isDelimiter(next, ":") ||
    (next?.types[0] === "<ident-token>" && legacyPseudoElements.has(toLowerCase(next.value)));
}

function parseType(node, context) {
  const { input } = node;
  if (isDelimiter(input.next(), "&")) {
    input.consume();
    return syntax.nesting;
  }

  // `undefined` uses the default namespace, `null` is the wildcard, and strings
  // name a prefix (including a literal "*") or the explicit empty namespace.
  let prefix;
  // The second bar belongs to a column combinator: `a||b` is not a namespace
  // prefix. Preserve explicit universal selectors for namespace/host matching.
  if (isDelimiter(input.next(), "|") ||
      (isDelimiter(input.next(1, 1), "|") && !isDelimiter(input.next(1, 2), "|"))) {
    const name = isDelimiter(input.next(), "|") ? null : input.consume();
    input.consume();
    if (name !== null && !isDelimiter(name, "*") && !context.namespaces.has(name.value)) {
      return invalid();
    }
    if (name === null) {
      prefix = "";
    } else {
      prefix = isDelimiter(name, "*") ? null : name.value;
    }
  }

  const token = input.next();
  if (token?.types[0] === "<ident-token>") {
    return { kind: "type", prefix, value: input.consume().value, universal: false };
  }
  if (isDelimiter(token, "*")) {
    input.consume();
    return { kind: "type", prefix, value: "*", universal: true };
  }
  return invalid();
}

function parseCompound(node, context) {
  const { input } = node;
  if (context.pseudoElement !== null && !isDelimiter(input.next(), ":")) {
    // Return an error, including for an empty branch, so forgiving lists retain
    // each invalid branch's source through the ordinary interception machinery.
    return invalid();
  }

  let type = null;
  let token = input.next();
  if (token?.types[0] === "<ident-token>" || isDelimiter(token, "*") ||
      isDelimiter(token, "|") || isDelimiter(token, "&")) {
    type = parseType(node, context);
    if (values.isParseErrorInfo(type)) {
      return type;
    }
  }

  const subclasses = [];
  while ((token = input.next())) {
    if (context.pseudoElement !== null && (token.types[0] === "<hash-token>" ||
        isDelimiter(token, ".") || isDelimiter(token, "[") || isDelimiter(token, "&"))) {
      return invalid();
    }
    let value;
    if (token.types[0] === "<hash-token>") {
      if (token.type !== "id") {
        return invalid();
      }
      input.consume();
      value = { kind: "id", value: token.value };
    } else if (isDelimiter(token, ".")) {
      input.consume();
      const identifier = input.next();
      if (identifier?.types[0] !== "<ident-token>") {
        return invalid();
      }
      value = { kind: "class", value: input.consume().value };
    } else if (isDelimiter(token, "&")) {
      input.consume();
      value = syntax.nesting;
    } else {
      let name;
      if (isDelimiter(token, "[")) {
        name = "<attribute-selector>";
      } else if (isDelimiter(token, ":") && !startsPseudoElement(input)) {
        name = "<pseudo-class-selector>";
      } else {
        break;
      }
      value = parseLeaf(node, name, context);
      if (values.isFailure(value)) {
        return value ?? invalid();
      }
      if (name === "<attribute-selector>") {
        value = { kind: "attribute", value: value.value };
      }
    }
    subclasses.push(value);
  }

  if (type === null && subclasses.length === 0) {
    return undefined;
  }
  return syntax.compound(type, subclasses);
}

function parseUnit(node, context, real) {
  const compound = parseCompound(node, context);
  if (values.isParseErrorInfo(compound)) {
    return compound;
  }
  if (real) {
    return compound && { value: compound, context };
  }

  const pseudoCompounds = [];
  while (startsPseudoElement(node.input)) {
    const pseudo = parseLeaf(node, "<pseudo-element-selector>", context);
    if (values.isFailure(pseudo)) {
      return pseudo ?? invalid();
    }
    context = { ...context, pseudoElement: getPseudoType(pseudo) };
    const classes = [];
    while (isDelimiter(node.input.next(), ":") && !startsPseudoElement(node.input)) {
      const value = parseLeaf(node, "<pseudo-class-selector>", context);
      if (values.isFailure(value)) {
        return value ?? invalid();
      }
      classes.push(value);
    }
    pseudo.classes = classes.length === 0 ? null : classes;
    pseudoCompounds.push(pseudo);
  }

  if (!compound && pseudoCompounds.length === 0) {
    return undefined;
  }
  const unit = compound ?? syntax.compound();
  unit.pseudos = pseudoCompounds.length === 0 ? null : pseudoCompounds;
  return { value: unit, context };
}

function parseCombinator(node, context) {
  const { input } = node;
  const token = input.next();
  if (isDelimiter(token, "/")) {
    const value = parseLeaf(node, "<combinator>", context);
    return values.isFailure(value) ? value : { kind: "reference-combinator", value };
  }
  if (isDelimiter(token, "|") && isDelimiter(input.next(1, 1), "|")) {
    input.consume();
    input.consume();
    return "||";
  }
  if (isDelimiter(token, ">") || isDelimiter(token, "+") || isDelimiter(token, "~")) {
    input.consume();
    return token.value;
  }
  return values.omitted;
}

function matchComplex(node, context, real) {
  const { input } = node;
  const first = parseUnit(node, context, real);
  if (!first || values.isParseErrorInfo(first)) {
    return first;
  }

  let previous = first;
  const units = [first.value];
  while (true) {
    const whitespace = Boolean(input.consumeIf(values.isWhitespace));
    const token = input.next();
    if (!token || values.isComma(token) || nodeUtils.isInputAtEnd(node)) {
      break;
    }
    const combinator = parseCombinator(node, previous.context);
    if (values.isFailure(combinator)) {
      return combinator ?? invalid();
    }
    if (combinator === values.omitted) {
      if (!whitespace) {
        break;
      }
    } else {
      input.consumeIf(values.isWhitespace);
    }
    if (!selectorContext.combinatorAllowed(previous.context)) {
      return invalid();
    }
    const next = parseUnit(node, context, real);
    if (!next || values.isParseErrorInfo(next)) {
      return next ?? invalid();
    }
    next.value.combinator = combinator === values.omitted ? null : combinator;
    units.push(next.value);
    previous = next;
  }
  return syntax.selector(units);
}

function match(node) {
  const context = selectorContext.getContext(node);
  const { input, definition: { name } } = node;
  const item = selectorLists.get(name);
  if (item !== undefined) {
    const selectors = [];
    while (true) {
      const selector = item === "<complex-selector>" ?
        matchComplex(node, context, false) ?? null :
        parseLeaf(node, item, context);
      if (values.isFailure(selector)) {
        return selector;
      }
      selectors.push(selector);
      input.consumeIf(values.isWhitespace);
      if (!input.consumeIf(values.isComma)) {
        break;
      }
      // Strict selector lists have no arbitrary-valued item that could make
      // the comma optional. Preserve the ordinary comma hook's fatal EOF case.
      if (nodeUtils.isInputAtEnd(node)) {
        return new ParseErrorInfo("Invalid ,");
      }
      input.consumeIf(values.isWhitespace);
    }
    return syntax.list(selectors);
  }
  if (name === "<relative-selector>" || name === "<relative-real-selector>") {
    if (nodeUtils.isInputAtEnd(node)) {
      return undefined;
    }
    if (!selectorContext.combinatorAllowed(context) && !values.isComma(input.next())) {
      return new ParseErrorInfo("Invalid <combinator>");
    }
    const combinator = parseCombinator(node, context);
    if (values.isFailure(combinator)) {
      return combinator;
    }
    input.consumeIf(values.isWhitespace);
    const complex = name === "<relative-selector>" ?
      matchComplex(node, context, false) ?? null :
      parseLeaf(node, "<complex-real-selector>", context);
    if (values.isFailure(complex)) {
      return complex;
    }
    complex.relative = true;
    complex.units[0].combinator = combinator === values.omitted ? null : combinator;
    return complex;
  }
  if (name === "<compound-selector>") {
    return parseCompound(node, { ...context, compoundOnly: true });
  }
  return matchComplex(node, context, name === "<complex-real-selector>");
}

module.exports = match;
