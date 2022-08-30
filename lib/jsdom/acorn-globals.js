// modifying from https://github.com/ForbesLindesay/acorn-globals/blob/master/index.js
// original license:
// Copyright (c) 2014 Forbes Lindesay
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
"use strict";

const acorn = require("acorn");
const walk = require("acorn-walk");

function isScope(node) {
  return node.type === "FunctionExpression" || node.type === "FunctionDeclaration" ||
    node.type === "ArrowFunctionExpression" || node.type === "Program";
}

function isBlockScope(node) {
  // The body of switch statement is a block.
  return node.type === "BlockStatement" || node.type === "SwitchStatement" || isScope(node);
}

function declaresArguments(node) {
  return node.type === "FunctionExpression" || node.type === "FunctionDeclaration";
}

function declaresThis(node) {
  return node.type === "FunctionExpression" || node.type === "FunctionDeclaration";
}

function reallyParse(source, options) {
  const parseOptions = {
    ...options,
    allowReturnOutsideFunction: true,
    allowImportExportEverywhere: true,
    allowHashBang: true
  };
  return acorn.parse(source, parseOptions);
}
module.exports = findGlobals;
module.exports.parse = reallyParse;
function findGlobals(source, options) {
  options = options || {};
  const globals = [];
  let ast;
  // istanbul ignore else
  if (typeof source === "string") {
    ast = reallyParse(source, options);
  } else {
    ast = source;
  }
  // istanbul ignore if
  if (!(ast && typeof ast === "object" && ast.type === "Program")) {
    throw new TypeError("Source must be either a string of JavaScript or an acorn AST");
  }
  function declareFunction(node) {
    const fn = node;
    fn.locals = fn.locals || Object.create(null);
    node.params.forEach(aNode => {
      declarePattern(aNode, fn);
    });
    if (node.id) {
      fn.locals[node.id.name] = true;
    }
  }
  function declareClass(node) {
    node.locals = node.locals || Object.create(null);
    if (node.id) {
      node.locals[node.id.name] = true;
    }
  }
  function declarePattern(node, parent) {
    switch (node.type) {
      case "Identifier":
        parent.locals[node.name] = true;
        break;
      case "ObjectPattern":
        node.properties.forEach(aNode => {
          declarePattern(aNode.value || aNode.argument, parent);
        });
        break;
      case "ArrayPattern":
        node.elements.forEach(aNode => {
          if (aNode) {
            declarePattern(aNode, parent);
          }
        });
        break;
      case "RestElement":
        declarePattern(node.argument, parent);
        break;
      case "AssignmentPattern":
        declarePattern(node.left, parent);
        break;
      // istanbul ignore next
      default:
        throw new Error("Unrecognized pattern type: " + node.type);
    }
  }
  function declareModuleSpecifier(node) {
    ast.locals = ast.locals || Object.create(null);
    ast.locals[node.local.name] = true;
  }
  walk.ancestor(ast, {
    VariableDeclaration(node, parents) {
      let parent = null;
      for (let i = parents.length - 1; i >= 0 && parent === null; i--) {
        if (node.kind === "var" ? isScope(parents[i]) : isBlockScope(parents[i])) {
          parent = parents[i];
        }
      }
      parent.locals = parent.locals || Object.create(null);
      node.declarations.forEach(declaration => {
        declarePattern(declaration.id, parent);
      });
    },
    FunctionDeclaration(node, parents) {
      let parent = null;
      for (let i = parents.length - 2; i >= 0 && parent === null; i--) {
        if (isScope(parents[i])) {
          parent = parents[i];
        }
      }
      parent.locals = parent.locals || Object.create(null);
      if (node.id) {
        parent.locals[node.id.name] = true;
      }
      declareFunction(node);
    },
    Function: declareFunction,
    ClassDeclaration(node, parents) {
      let parent = null;
      for (let i = parents.length - 2; i >= 0 && parent === null; i--) {
        if (isBlockScope(parents[i])) {
          parent = parents[i];
        }
      }
      parent.locals = parent.locals || Object.create(null);
      if (node.id) {
        parent.locals[node.id.name] = true;
      }
      declareClass(node);
    },
    Class: declareClass,
    TryStatement(node) {
      if (node.handler === null) {
        return;
      }
      node.handler.locals = node.handler.locals || Object.create(null);
      declarePattern(node.handler.param, node.handler);
    },
    ImportDefaultSpecifier: declareModuleSpecifier,
    ImportSpecifier: declareModuleSpecifier,
    ImportNamespaceSpecifier: declareModuleSpecifier
  });
  function identifier(node, parents) {
    const { name } = node;
    if (name === "undefined") {
      return;
    }
    for (let i = 0; i < parents.length; i++) {
      if (name === "arguments" && declaresArguments(parents[i])) {
        return;
      }
      if (parents[i].locals && name in parents[i].locals) {
        return;
      }
    }
    node.parents = parents.slice();
    globals.push(node);
  }
  walk.ancestor(ast, {
    VariablePattern: identifier,
    Identifier: identifier,
    ThisExpression(node, parents) {
      for (let i = 0; i < parents.length; i++) {
        if (declaresThis(parents[i])) {
          return;
        }
      }
      node.parents = parents.slice();
      globals.push(node);
    }
  });
  const groupedGlobals = Object.create(null);
  globals.forEach(node => {
    const name = node.type === "ThisExpression" ? "this" : node.name;
    groupedGlobals[name] = groupedGlobals[name] || [];
    groupedGlobals[name].push(node);
  });
  return Object.keys(groupedGlobals).sort().map(name => {
    return { name, nodes: groupedGlobals[name] };
  });
}
