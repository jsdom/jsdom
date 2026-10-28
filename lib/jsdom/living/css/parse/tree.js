"use strict";

exports.findChild = findChild;
exports.findContext = findContext;
exports.findFunction = findFunction;
exports.findParent = findParent;
exports.findRule = findRule;
exports.findSibling = findSibling;
exports.getBlock = getBlock;
exports.getDeclaration = getDeclaration;
exports.getDeclarationName = getDeclarationName;
exports.getFunction = getFunction;
exports.getFunctionName = getFunctionName;
exports.getProduction = getProduction;
exports.getRoot = getRoot;
exports.getRule = getRule;
exports.getRuleName = getRuleName;
exports.isBranch = isBranch;
exports.isDeclaredBy = isDeclaredBy;
exports.isInputAtEnd = isInputAtEnd;
exports.isInputAtStart = isInputAtStart;
exports.isLeaf = isLeaf;
exports.isNode = isNode;
exports.isProducedBy = isProducedBy;
const definitions = require("./grammar.js");
const values = require("../values/value.js");
const blocks = require("../values/block.js");
const nodeType = (exports.type = Symbol("node"));

function isBranch({ definition }) {
  return (
    definition.type === "non-terminal" ||
    definitions.isCombination(definition) ||
    definitions.isMultiplied(definition)
  );
}

function isDeclaredBy(node, name) {
  return getDeclarationName(node) === name;
}

function isInputAtPreludeEnd(token, context) {
  if (context.definition.name === "@sheet") {
    return false;
  }
  if (values.isOpenCurlyBrace(token)) {
    return context.definition.value;
  }
  const nested = getRule(context)?.definition.name !== "@sheet";
  if (values.isSemicolon(token)) {
    return nested || !context.definition.qualified;
  }
  return nested && values.isCloseCurlyBrace(token);
}

function isInputAtContextEnd(node, token) {
  if (token.types[0] !== "<delimiter-token>") {
    return false;
  }
  const { trees } = node.context;
  for (let index = trees.length - 1; index >= 0; index--) {
    const tree = trees[index];
    if (tree.structuralBoundary === "block") {
      return values.isCloseCurlyBrace(token);
    }
    switch (tree.definition.type) {
      case "block":
        return values.isDelimiter(blocks.associatedTokens[node.definition.associatedToken], token);
      case "declaration":
        if (values.isDelimiter("!", token)) {
          return (
            node.definition.type !== "forgiving" &&
            !findContext(node, (candidate) => candidate.definition.type === "forgiving")
          );
        }
        if (values.isSemicolon(token)) {
          return true;
        }
        continue;
      case "rule":
        return isInputAtPreludeEnd(token, tree);
      case "|":
        if (tree.definition.value[0].type === "rule") {
          return isInputAtPreludeEnd(token, tree);
        }
      // falls through
      default:
        if (values.isComma(token)) {
          return node.context.definition.type === "forgiving";
        }
        if (tree.context.definition.type === "block") {
          return values.isDelimiter(
            blocks.associatedTokens[tree.context.definition.associatedToken],
            token,
          );
        }
        if (tree.context.definition.type === "function") {
          return values.isCloseParen(token);
        }
        continue;
    }
  }
  return false;
}

function isInputAtEnd(node) {
  const { input } = node;
  if (input.atEnd()) {
    return true;
  }
  let token = input.next();
  if (values.isWhitespace(token) && !(token = input.next(1, 1))) {
    return true;
  }
  return isInputAtContextEnd(node, token);
}

function isInputAtPreludeStart(token) {
  return (
    token.types[0] === "<at-keyword-token>" ||
    values.isSemicolon(token) ||
    values.isCloseCurlyBrace(token)
  );
}

function isInputAtStart(node) {
  const { input } = node;
  if (input.index === -1) {
    return true;
  }
  let { current } = input;
  if (values.isWhitespace(current)) {
    current = input.prev();
  }
  if (current === undefined) {
    return true;
  }
  const { trees } = node.context;
  for (let index = trees.length - 1; index >= 0; index--) {
    const tree = trees[index];
    if (tree.structuralBoundary === "block") {
      return values.isOpenCurlyBrace(current);
    }
    switch (tree.definition.type) {
      case "block":
        return values.isDelimiter(node.definition.associatedToken, current);
      case "declaration":
        if (node.context.definition.type === "declaration") {
          return values.isColon(current);
        }
        return values.isOpenCurlyBrace(current) || values.isCloseCurlyBrace(current);
      case "rule":
        return isInputAtPreludeStart(current);
      case "|":
        if (tree.definition.value[0].type === "rule") {
          return isInputAtPreludeStart(current);
        }
      // falls through
      default:
        if (values.isComma(current)) {
          return node.context.definition.type === "forgiving";
        }
        if (tree.context.definition.type === "block") {
          return values.isDelimiter(tree.context.definition.associatedToken, current);
        }
        if (tree.context.definition.type === "function") {
          return current.types[0] === "<function-token>";
        }
        continue;
    }
  }
  return false;
}

function isLeaf({ definition }) {
  const { type } = definition;
  return (
    type === "arbitrary" ||
    type === "forgiving" ||
    type === "token" ||
    definitions.isCompound(definition)
  );
}

function isNode(node) {
  return node?.type === nodeType;
}

function isProducedBy(node, name) {
  return getProduction(node)?.definition.name === name;
}

function getBlock(node) {
  return findContext(node, (candidate) => candidate.definition.type === "block");
}

function getDeclaration(node) {
  return findContext(node, (candidate) => candidate.definition.type === "declaration");
}

function getDeclarationName(node) {
  return getDeclaration(node)?.definition.name;
}

function getFunction(node) {
  return findContext(node, (candidate) => candidate.definition.type === "function");
}

function getFunctionName(node) {
  return getFunction(node)?.definition.name;
}

function getProduction(node) {
  return findParent(
    node,
    (candidate) => definitions.isCSSType(candidate.definition),
    (candidate) => definitions.isCSSType(candidate.definition),
  );
}

function getRoot({ context }) {
  let root;
  while (context) {
    root = context;
    context = context.context;
  }
  return root;
}

function getRule(node) {
  return findRule(node, () => true);
}

function getRuleName(node) {
  return getRule(node)?.definition.name;
}

function findChild({ children }, accept, abort) {
  for (let index = children.length; index; index--) {
    const node = children[index - 1];
    if (node.children) {
      const match = findChild(node, accept, abort);
      if (match || match === null) {
        return match;
      }
    }
    if (accept(node)) {
      return node;
    }
    if (abort?.(node)) {
      return null;
    }
  }
  return undefined;
}

function findContext({ context }, accept, abort) {
  while (context) {
    if (accept(context)) {
      return context;
    }
    if (abort?.(context)) {
      return null;
    }
    context = context.context;
  }
  return undefined;
}

function findFunction(node, accept, abort) {
  return findContext(
    node,
    (candidate) => candidate.definition.type === "function" && accept(candidate),
    (candidate) => candidate.definition.type === "function" && abort?.(candidate),
  );
}

function findParent({ parent }, accept, abort) {
  while (parent) {
    if (accept(parent)) {
      return parent;
    }
    if (abort?.(parent)) {
      return null;
    }
    parent = parent.parent;
  }
  return undefined;
}

function findRule(node, accept, abort) {
  return findContext(
    node,
    (candidate) => candidate.definition.type === "rule" && accept(candidate),
    (candidate) => candidate.definition.type === "rule" && abort?.(candidate),
  );
}

function findSibling({ context, parent }, accept, abort, climb) {
  while (parent) {
    const match = findChild(parent, accept, abort);
    if (match) {
      return match;
    }
    if (match === null) {
      break;
    }
    if (abort?.(parent)) {
      break;
    }
    parent = parent.parent;
  }
  if (climb && context) {
    return findSibling(context, accept, abort, true);
  }
  return null;
}
