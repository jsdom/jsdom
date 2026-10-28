"use strict";

const actions = require("./actions.js");
const parseDefinition = require("./definition.js");
const { toLowerCase } = require("../utils/string.js");
const compatibility = require("../values/compatibility.js");
const firstSets = new WeakMap();
const keywordAliases = new Map();
for (const { aliases, mappings } of [
  compatibility.functions,
  ...Object.values(compatibility.keywords),
]) {
  for (const [alias, name] of [...(aliases ?? []), ...(mappings ?? [])]) {
    if (!keywordAliases.has(name)) {
      keywordAliases.set(name, []);
    }
    keywordAliases.get(name).push(`keyword:${alias}`);
  }
}

// A null entry means that context-sensitive parsing can accept a token outside
// the grammar. Such productions must go through their normal parsing hooks.
function getFirstSet(definition) {
  if (firstSets.has(definition)) {
    return firstSets.get(definition);
  }
  firstSets.set(definition, null);
  const hookName =
    definition.type === "token" ? (definition.name ?? definition.value) : definition.name;
  const preprocessing = actions.preprocess[hookName];
  const replacement = actions.replace[hookName];
  if (
    (preprocessing && !Object.hasOwn(preprocessing, "firstTokens")) ||
    (replacement && !Object.hasOwn(replacement, "firstTokens"))
  ) {
    return null;
  }
  let result;
  const { type, name, value } = definition;
  if (name === "<keyword>") {
    const keyword = toLowerCase(definition.range);
    // Include aliases from every context. Actual parsing still checks whether
    // an alias is allowed for the current declaration or function.
    result = {
      tokens: new Set([`keyword:${keyword}`, ...(keywordAliases.get(keyword) ?? [])]),
      nullable: false,
    };
    firstSets.set(definition, result);
    return result;
  }
  switch (type) {
    case "token":
      result = { tokens: new Set([name ?? "<delimiter-token>"]), nullable: false };
      break;
    case "function":
      result = { tokens: new Set(["<function-token>"]), nullable: false };
      break;
    case "block":
      result = { tokens: new Set(["<delimiter-token>"]), nullable: false };
      break;
    case "omitted":
      result = { tokens: new Set(), nullable: true };
      break;
    case "unsupported":
      result = { tokens: new Set(), nullable: false };
      break;
    case "non-terminal":
    case "optional":
    case "required":
    case "repetition": {
      if (typeof value === "function" || value === undefined) {
        return null;
      }
      const child = getFirstSet(
        typeof value === "string" ? parseDefinition(value, definition) : value,
      );
      if (child === null) {
        return null;
      }
      result = {
        tokens: child.tokens,
        nullable:
          type === "optional" || (type === "repetition" && definition.min === 0) || child.nullable,
      };
      break;
    }
    case " ":
    case "|":
    case "||":
    case "&&": {
      const tokens = new Set();
      let nullable = type === " " || type === "&&";
      for (const item of value) {
        const child = getFirstSet(item);
        if (child === null) {
          return null;
        }
        for (const token of child.tokens) {
          tokens.add(token);
        }
        nullable =
          type === " " || type === "&&" ? nullable && child.nullable : nullable || child.nullable;
        if (type === " " && !child.nullable) {
          break;
        }
      }
      result = { tokens, nullable };
      break;
    }
    default:
      return null;
  }
  if (preprocessing || replacement) {
    result = {
      tokens: new Set([
        ...result.tokens,
        ...(preprocessing?.firstTokens ?? []),
        ...(replacement?.firstTokens ?? []),
      ]),
      nullable: result.nullable,
    };
  }
  firstSets.set(definition, result);
  return result;
}

exports.canStart = (definition, token) => {
  // At EOF, reuse known grammar information without analyzing new branches.
  if (!token) {
    return firstSets.get(definition)?.nullable !== false;
  }
  // Keep error-producing tokens and delimiters on the normal path, including
  // closing delimiters whose meaning depends on the current parsing context.
  if (token.types[0] === "<delimiter-token>" || token.types[0].startsWith("<bad-")) {
    return true;
  }
  const first = getFirstSet(definition);
  return (
    first === null ||
    first.nullable ||
    first.tokens.has(token.types[0]) ||
    (token.types[0] === "<ident-token>" && first.tokens.has(`keyword:${toLowerCase(token.value)}`))
  );
};
