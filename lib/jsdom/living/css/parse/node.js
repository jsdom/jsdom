"use strict";

exports.createNode = create;
exports.parseNode = parse;
const actions = require("./actions.js");
const { ParseErrorInfo } = require("./errors.js");
const nodeUtils = require("./tree.js");
const definitionUtils = require("./grammar.js");
const cssValues = require("../values/value.js");
const cssParser = require("./parser.js");
const arbitraryModule = require("./arbitrary.js");
const forgivingModule = require("../values/forgiving.js");
const parseDefinition = require("./definition.js");
const { toLowerCase } = require("../utils/string.js");
const keywordAlternatives = new WeakMap();
const { canStart } = require("./first-set.js");
const compatibility = require("../values/compatibility.js");

class ParsingState {
  status = "waiting";
  #extended;

  get extended() {
    this.#extended ??= new Map();
    return this.#extended;
  }
}

function getNodeName({ definition: { type, name, value } }) {
  switch (type) {
    case "declaration":
    case "function":
      return null;
    case "token":
      return name ?? value;
    default:
      return name;
  }
}

// Actions

function abort(node, error) {
  node.state.status = "aborting";
  const { input, location } = node;
  input.backtrack(location);
  const value = actions.intercept[getNodeName(node)]?.(error, node) ?? error;
  node.state.status = cssValues.isParseErrorInfo(value) ? "aborted" : "accepted";
  return node.state.status === "aborted" ? value : assign(node, value);
}

function assign(node, value) {
  node.value = value;
  return node.value;
}

// Preserve shorter n prefixes before their offsets. Whitespace consumption follows
// the grammar's leaf, sequence, and successful completion phases: failed leaves
// must not pull a later token, and supplied streams can contain adjacent whitespace.
function* matchAnB(node) {
  const { input, context, location } = node;
  function finish(a, b) {
    return { types: [], value: { a, b } };
  }
  function consumeWhitespace() {
    if (context.separator !== "") {
      cssParser.consumeWhitespace(input);
    }
  }
  if (nodeUtils.isInputAtEnd(node)) {
    return;
  }
  let token = input.consume();
  const error = cssParser.getInvalidTokenError(token);
  if (error) {
    yield error;
    return;
  }
  if (token.types[0] === "<number-token>") {
    consumeWhitespace();
    const integer = actions.postprocess["<integer>"](token, node);
    if (integer) {
      consumeWhitespace();
      consumeWhitespace();
      yield finish(0, integer.value === 0 ? 0 : integer.value);
    }
    input.backtrack(location);
    return;
  }
  const plus = cssValues.isDelimiter("+", token);
  const plusIndex = input.index;
  if (plus) {
    consumeWhitespace();
    consumeWhitespace();
    if (nodeUtils.isInputAtEnd(node)) {
      return;
    }
    token = input.consume();
    const nextError = cssParser.getInvalidTokenError(token);
    if (nextError) {
      yield nextError;
      return;
    }
  }
  let coefficient, offset;
  let constant = 0;
  let prefix = false;
  let sequence = false;
  if (token.types[0] === "<ident-token>") {
    consumeWhitespace();
    const identifier = toLowerCase(token.value);
    if (!plus && (identifier === "odd" || identifier === "even")) {
      consumeWhitespace();
      consumeWhitespace();
      consumeWhitespace();
      yield finish(2, identifier === "odd" ? 1 : 0);
      input.backtrack(location);
      return;
    }
    if (identifier === "n" || (!plus && identifier === "-n")) {
      consumeWhitespace();
      coefficient = identifier === "n" ? 1 : -1;
      prefix = true;
      sequence = identifier === "n";
    } else if (identifier === "n-" || (!plus && identifier === "-n-")) {
      consumeWhitespace();
      coefficient = identifier === "n-" ? 1 : -1;
      offset = "<signless-integer>";
    } else if (/^n-\d+$/.test(identifier) || (!plus && /^-n-\d+$/.test(identifier))) {
      sequence = identifier.startsWith("n");
      coefficient = sequence ? 1 : -1;
      constant = Number(identifier.slice(sequence ? 1 : 2));
    }
  } else if (!plus && token.types[0] === "<dimension-token>") {
    consumeWhitespace();
    if (token.integer !== false && Number.isInteger(token.value)) {
      if (token.unit === "n") {
        coefficient = token.value === 0 ? 0 : token.value;
        prefix = true;
      } else if (token.unit === "n-") {
        coefficient = token.value === 0 ? 0 : token.value;
        offset = "<signless-integer>";
      } else if (/^n-\d+$/.test(token.unit)) {
        coefficient = token.value === 0 ? 0 : token.value;
        constant = Number(token.unit.slice(1));
      }
    }
  }
  if (coefficient === undefined) {
    input.backtrack(location);
    return;
  }
  function result(b) {
    // Successful alternatives pass through the enclosing choice and type.
    consumeWhitespace();
    consumeWhitespace();
    if (plus && cssValues.isWhitespace(input.data[plusIndex + 1])) {
      return new ParseErrorInfo("Invalid <a-n-plus-b>");
    }
    return finish(coefficient, b);
  }
  const leafEnd = input.index;
  if (!offset) {
    if (sequence) {
      consumeWhitespace();
    }
    const value = result(constant);
    yield value;
    if (cssValues.isParseErrorInfo(value) || !prefix) {
      input.backtrack(location);
      return;
    }
  }
  function readInteger(name) {
    if (nodeUtils.isInputAtEnd(node)) {
      return null;
    }
    const start = input.index;
    const next = input.consume();
    const nextError = cssParser.getInvalidTokenError(next);
    if (nextError) {
      return nextError;
    }
    if (next.types[0] !== "<number-token>") {
      input.backtrack(start);
      return null;
    }
    consumeWhitespace();
    return actions.postprocess[name](next);
  }
  // Offset forms add a sequence wrapper around the initial operand.
  input.backtrack(leafEnd);
  consumeWhitespace();
  const suffix = input.index;
  const integer = readInteger(offset ?? "<signed-integer>");
  if (integer) {
    if (cssValues.isParseErrorInfo(integer)) {
      yield integer;
      return;
    }
    consumeWhitespace();
    let constantValue;
    if (offset) {
      constantValue = Number("-" + integer.value);
    } else {
      constantValue = integer.value === 0 ? 0 : integer.value;
    }
    const value = result(constantValue);
    yield value;
    if (cssValues.isParseErrorInfo(value)) {
      return;
    }
  }
  input.backtrack(suffix);
  if (!offset && !nodeUtils.isInputAtEnd(node)) {
    const sign = input.next();
    if (cssValues.isDelimiter(["+", "-"], sign)) {
      input.consume();
      consumeWhitespace();
      consumeWhitespace();
      const value = readInteger("<signless-integer>");
      if (value) {
        if (cssValues.isParseErrorInfo(value)) {
          yield value;
        } else {
          consumeWhitespace();
          yield result(Number(sign.value + value.value));
        }
      }
    }
  }
  input.backtrack(location);
}

function* matchMediaComparison(node) {
  const {
    context,
    definition: { name },
    input,
    location,
  } = node;
  const compound = name === "<mf-comparison>";
  let operator = "<";
  if (name === "<mf-gt>") {
    operator = ">";
  } else if (name === "<mf-eq>") {
    operator = "=";
  }
  if (compound) {
    const value = input.next()?.value;
    if (value === ">" || value === "=") {
      operator = value;
    }
  }
  const token = { input, context, definition: { type: "token", value: operator } };
  const head = cssParser.matchToken(token);
  if (cssValues.isParseErrorInfo(head)) {
    yield head;
    return;
  }
  if (!head) {
    input.backtrack(location);
    return;
  }
  let type = "<mf-lt>";
  if (operator === ">") {
    type = "<mf-gt>";
  } else if (operator === "=") {
    type = "<mf-eq>";
  }
  if (type === "<mf-eq>") {
    if (context.separator !== "") {
      cssParser.consumeWhitespace(input);
    }
    yield compound ? { ...head, types: [...head.types, type] } : head;
    input.backtrack(location);
    return;
  }
  const afterHead = input.index;
  token.definition.value = "=";
  const equal = cssParser.matchToken(token);
  if (cssValues.isParseErrorInfo(equal)) {
    yield equal;
    return;
  }
  if (equal) {
    yield cssValues.list([head, equal], "", compound ? [type] : []);
  }
  input.backtrack(afterHead);
  yield cssValues.list([head, cssValues.omitted], "", compound ? [type] : []);
  input.backtrack(location);
}

function match(node) {
  const name = getNodeName(node);
  if (name === "<a-n-plus-b>") {
    let iterator = node.state.extended.get("anb");
    if (iterator === undefined) {
      iterator = matchAnB(node);
      node.state.extended.set("anb", iterator);
    }
    return iterator.next().value;
  }
  if (
    name === "<mf-comparison>" ||
    name === "<mf-lt>" ||
    name === "<mf-gt>" ||
    name === "<mf-eq>"
  ) {
    let iterator = node.state.extended.get("media-comparison");
    if (iterator === undefined) {
      iterator = matchMediaComparison(node);
      node.state.extended.set("media-comparison", iterator);
    }
    return iterator.next().value;
  }
  if (nodeUtils.isBranch(node)) {
    if (node.children.length === 0 && !canStart(node.definition, node.input.next())) {
      return undefined;
    }
    return traverse(node);
  }
  const { input, definition } = node;
  switch (definition.type) {
    case "arbitrary":
      return arbitraryModule[definition.name](node);
    case "block":
      return cssParser.matchBlock(node);
    case "declaration":
      return cssParser.matchDeclaration(node);
    case "forgiving":
      return cssParser.parseListGrammar(input, forgivingModule[definition.name], node);
    case "function":
      return cssParser.matchFunction(node);
    case "omitted":
      return cssValues.omitted;
    case "rule":
      return cssParser.matchRule(node);
    case "token":
      return cssParser.matchToken(node);
    case "unsupported":
      return undefined;
    default:
      throw new RangeError("Unexpected node definition type");
  }
}

function postprocess(node, value) {
  const action = actions.postprocess[getNodeName(node)];
  return action ? action(value, node) : value;
}

function preprocess(node) {
  return actions.preprocess[getNodeName(node)]?.(node);
}

function reject({ input, location, state }) {
  state.status = "rejected";
  input.backtrack(location);
  return null;
}

function replace(node) {
  return actions.replace[getNodeName(node)]?.(node);
}

function tag({ definition }, value) {
  if (value.kind !== undefined) {
    return value;
  }
  const { name } = definition;
  if (
    name !== undefined &&
    value !== cssValues.omitted &&
    definitionUtils.isCSSType(definition) &&
    definition.type !== "rule"
  ) {
    if (!cssValues.isList(value)) {
      value = {
        ...value,
        types: [...value.types],
      };
    }
    value.types.push(name);
  }
  return value;
}

// Resume a sequence or repetition from its last matched child.
function matchOrderedChildren(parent) {
  const { context, children: matched, definition, input } = parent;
  const { separator, type } = definition;
  const repeated = type === "repetition";
  let max;
  if (repeated) {
    max = separator ? definition.max * 2 - 1 : definition.max;
  } else {
    max = definition.value.length;
  }
  let index = Math.max(0, matched.length - 1);
  while (index < max) {
    let node;
    if (matched[index]) {
      node = matched.pop();
    } else if (separator && index % 2) {
      node = create({ type: "token", value: separator }, input, context, parent);
    } else {
      node = create(repeated ? definition.value : definition.value[index], input, context, parent);
    }
    const location = input.index;
    const value = parse(node);
    if (!value) {
      break;
    }
    if (cssValues.isParseErrorInfo(value)) {
      return value;
    }
    if (context.separator !== "") {
      cssParser.consumeWhitespace(input);
    }
    matched.push(node);
    if (
      repeated &&
      input.index === location &&
      (!separator || !input.peek(cssValues.isDelimiter(separator)))
    ) {
      break;
    }
    index++;
  }
  return undefined;
}

// Resume the current choice before visiting later alternatives in order.
function matchChoice(node) {
  const { children: matched, definition, input, context } = node;
  const set = definition.value;
  let keywords = keywordAlternatives.get(definition);
  if (keywords === undefined) {
    keywords = set.every((item) => item.name === "<keyword>")
      ? new Map(set.map((item) => [toLowerCase(item.range), [item]]))
      : null;
    keywordAlternatives.set(definition, keywords);
  }
  let choices = set;
  let index = 0;
  if (keywords) {
    const token = input.next();
    if (token?.types[0] !== "<ident-token>") {
      return undefined;
    }
    const lowercase = toLowerCase(token.value);
    choices = keywords.get(lowercase);
    if (choices === undefined) {
      const functionName = nodeUtils.getFunctionName(node);
      const functionAlias = compatibility.functions.aliases.get(lowercase);
      const { aliases, mappings } =
        compatibility.keywords[nodeUtils.getDeclarationName(node)] ?? {};
      const keywordAlias = aliases?.get(lowercase) ?? mappings?.get(lowercase);
      if (functionAlias === undefined && keywordAlias === undefined) {
        return undefined;
      }
      choices = [];
      for (const item of set) {
        if (
          (item.range === functionName && functionAlias === item.range) ||
          (item.range !== functionName && keywordAlias === item.range)
        ) {
          choices.push(item);
        }
      }
    }
  } else if (matched.length > 0) {
    index = set.indexOf(matched[0].definition);
    // Preserve the previous slice(start) behavior for a dynamically resolved
    // child whose final definition is not the source alternative's identity.
    if (index < 0) {
      index = Math.max(0, set.length + index);
    }
  }
  for (; index < choices.length; index++) {
    const child = matched.pop() ?? create(choices[index], input, context, node);
    const value = parse(child);
    if (!value) {
      continue;
    }
    if (cssValues.isParseErrorInfo(value)) {
      return value;
    }
    if (context.separator !== "") {
      cssParser.consumeWhitespace(input);
    }
    matched.push(child);
    return value;
  }
  return undefined;
}

// Unordered groups explore only prefixes that match the input. After a full
// match is yielded, resuming the iterator backtracks through the same nodes.
function* unorderedMatches(node) {
  const { definition, input, context, children: matched } = node;
  const noWhitespace = context.separator === "";
  const definitions = definition.value;
  const used = new Array(definitions.length).fill(false);
  // A frame resumes its child before advancing to the next unused definition.
  const frames = [{ child: undefined, index: 0, nextIndex: 0, omitted: null }];
  let depth = 0;
  while (true) {
    const frame = frames[depth];
    let { child } = frame;
    if (child === undefined) {
      let index = frame.nextIndex;
      while (index < definitions.length && used[index]) {
        ++index;
      }
      if (index === definitions.length) {
        const { omitted } = frame;
        const omittedLength = omitted === null ? 0 : omitted.length;
        if (
          depth + omittedLength === definitions.length ||
          (definition.type === "||" && (depth > 0 || omittedLength > 0))
        ) {
          // An omitted optional can satisfy || even if another unused operand
          // cannot match. Keep this true before non-comma trailing input too.
          if (omittedLength > 0) {
            matched.push(...omitted);
          }
          yield cssValues.list(
            definitions.map((item) => {
              return matched.find((entry) => entry.definition === item)?.value ?? cssValues.omitted;
            }),
            noWhitespace ? "" : " ",
          );
          matched.length -= omittedLength;
        }
        if (depth === 0) {
          return;
        }
        --depth;
        used[frames[depth].index] = false;
        matched.pop();
        continue;
      }
      frame.nextIndex = index + 1;
      frame.index = index;
      child = frame.child = create(definitions[index], input, context, node);
    }
    const value = parse(child);
    if (!value) {
      frame.child = undefined;
      continue;
    }
    if (cssValues.isParseErrorInfo(value)) {
      yield value;
      return;
    }
    // Defer terminal omissions until the consuming operands have matched. An
    // empty result with remaining alternatives must still resume normally.
    if (
      child.definition.type === "optional" &&
      value === cssValues.omitted &&
      child.children[0].definition.type === "omitted" &&
      input.index === child.location &&
      !nodeUtils.isInputAtEnd(child) &&
      !cssValues.isDelimiter(",", input.next())
    ) {
      (frame.omitted ??= []).push(child);
      frame.child = undefined;
      continue;
    }
    matched.push(child);
    used[frame.index] = true;
    if (!noWhitespace) {
      cssParser.consumeWhitespace(input);
    }
    ++depth;
    if (frames[depth] === undefined) {
      frames[depth] = { child: undefined, index: 0, nextIndex: 0, omitted: null };
    } else {
      frames[depth].child = undefined;
      frames[depth].nextIndex = 0;
      if (frames[depth].omitted !== null) {
        frames[depth].omitted.length = 0;
      }
    }
  }
}

function traverse(node) {
  const { context, definition, input } = node;
  const { type, separator } = definition;
  if (type === "&&" || type === "||") {
    let iterator = node.state.extended.get("unordered");
    if (iterator === undefined) {
      iterator = unorderedMatches(node);
      node.state.extended.set("unordered", iterator);
    }
    return iterator.next().value;
  }
  const noWhitespace = context.separator === "";
  if (type === "non-terminal" || type === "required" || type === "optional") {
    let child = node.children.pop() ?? create(definition.value, input, context, node);
    let value = parse(child);
    if (cssValues.isFailure(value)) {
      if (cssValues.isParseErrorInfo(value)) {
        return value;
      }
      if (type !== "optional") {
        return undefined;
      }
      child = create({ type: "omitted" }, input, context, node);
      value = parse(child);
    }
    if (!noWhitespace) {
      cssParser.consumeWhitespace(input);
    }
    node.children.push(child);
    return value;
  }
  if (type === "|") {
    return matchChoice(node);
  }
  if (type === "repetition" && node.children.length === 0 && node.value) {
    return undefined;
  }
  let min;
  if (type === "repetition") {
    min = separator ? definition.min * 2 - 1 : definition.min;
  } else {
    min = definition.value.length;
  }
  while (true) {
    const error = matchOrderedChildren(node);
    if (error) {
      return error;
    }
    const { length } = node.children;
    if (length < min) {
      if (length === 0) {
        return undefined;
      }
      continue;
    }
    if (separator && length > 0 && length % 2 === 0) {
      continue;
    }
    let values;
    if (separator) {
      values = [];
      for (let index = 0; index < node.children.length; index += 2) {
        values.push(node.children[index].value);
      }
    } else {
      values = node.children.map((entryNode) => entryNode.value);
    }
    return cssValues.list(values, separator || (noWhitespace ? "" : " "));
  }
}

// Match a node or resume its next alternative after backtracking. Preprocessing
// and replacement accept a result without further alternatives; grammar matches
// may resume, including after postprocessing rejects a particular alternative.
function parse(node) {
  if (
    node.state.status === "accepted" ||
    (node.state.status === "matched" && !nodeUtils.isBranch(node))
  ) {
    return reject(node);
  }
  let value;
  if (node.state.status === "waiting") {
    node.state.status = "preprocessing";
    value = preprocess(node);
    if (cssValues.isParseErrorInfo(value)) {
      return abort(node, value);
    }
    if (value === null) {
      return reject(node);
    }
    if (value !== undefined) {
      node.state.status = "accepted";
      return assign(node, value);
    }
  }
  while (true) {
    node.state.status = "matching";
    value = match(node);
    if (cssValues.isParseErrorInfo(value)) {
      return abort(node, value);
    }
    if (value === null || (value === undefined && nodeUtils.isInputAtEnd(node))) {
      return reject(node);
    }
    if (node.definition.type === "required" && cssValues.isOmitted(value)) {
      continue;
    }
    if (value === undefined) {
      node.state.status = "replacing";
      value = replace(node);
      if (cssValues.isParseErrorInfo(value)) {
        return abort(node, value);
      }
      if (value === undefined || value === null) {
        return reject(node);
      }
      node.state.status = "accepted";
      return assign(node, value);
    }
    if (node.definition.type === "optional" && node.children[0].definition.type === "omitted") {
      node.state.status = "accepted";
      return assign(node, value);
    }
    node.state.status = "postprocessing";
    value = postprocess(node, tag(node, value));
    if (cssValues.isParseErrorInfo(value)) {
      return abort(node, value);
    }
    if (value === null) {
      return reject(node);
    }
    if (value !== undefined) {
      node.state.status = "matched";
      return assign(node, value);
    }
  }
}

function create(definition, input, context, parent = null) {
  if (typeof definition === "function") {
    definition = definition(parent);
  }
  if (typeof definition === "string") {
    definition = parseDefinition(definition, parent?.definition);
  }
  const node = {
    children: [],
    context,
    definition,
    input,
    location: input.index,
    parent,
    state: new ParsingState(),
    type: nodeUtils.type,
    value: undefined,
  };
  return actions.configure[getNodeName(node)]?.(node) ?? node;
}
