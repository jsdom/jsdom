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

function isFunctionScope(node) {
  return node.type === "FunctionExpression" || node.type === "FunctionDeclaration" ||
    node.type === "ArrowFunctionExpression";
}

function isBlockLevelScope(node) {
  // The body of switch statement is a block.
  return node.type === "BlockStatement" || node.type === "SwitchStatement" || isFunctionScope(node);
}

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
  const globalDeclarations = [];
  const globalVariableDeclarations = [];
  const globalFunctionDeclarations = [];
  let ast;
  const { inBrowser } = options;
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
  const globalScope = ast;
  const inModule = ast.sourceType === "module";
  const index = ast.body.findIndex(
    statement => statement.type !== "ExpressionStatement" || !statement.directive
  );
  const inStrictMode = ast.body.slice(0, index === -1 ? ast.body.length : index).find(
    statement => statement.directive === "use strict"
  ) !== undefined;
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
  function globallyDeclarePattern(node, varNode, declaratorNode) {
    switch (node.type) {
      case "Identifier":
        varNode.globals[node.name] = true;
        declaratorNode.globals[node.name] = true;
        break;
      case "ObjectPattern":
        node.properties.forEach(property => {
          globallyDeclarePattern(property.value || property.argument, varNode, declaratorNode);
        });
        break;
      case "ArrayPattern":
        node.elements.forEach(element => {
          if (element) {
            globallyDeclarePattern(element, varNode, declaratorNode);
          }
        });
        break;
      case "RestElement":
        globallyDeclarePattern(node.argument, varNode, declaratorNode);
        break;
      case "AssignmentPattern":
        globallyDeclarePattern(node.left, varNode, declaratorNode);
        break;
    }
  }
  const isVarDeclarationScope = !inBrowser || inModule ? isScope : isFunctionScope;
  const isFunctionDeclarationScopeNotInModule = inStrictMode ? isBlockLevelScope : isFunctionScope;
  const isFunctionDeclarationScope = !inBrowser || inModule ? isScope : isFunctionDeclarationScopeNotInModule;
  walk.ancestor(ast, {
    VariableDeclaration(node, parents) {
      let parent = null;
      for (let i = parents.length - 1; i >= 0 && parent === null; i--) {
        if ((node.kind === "var" ? isVarDeclarationScope : isBlockScope)(parents[i])) {
          parent = parents[i];
        }
      }
      if (parent) {
        parent.locals = parent.locals || Object.create(null);
        node.declarations.forEach(declaration => {
          declarePattern(declaration.id, parent);
        });
      } else {
        node.globals = node.globals || Object.create(null);
        node.declarations.forEach(declarator => {
          declarator.globals = declarator.globals || Object.create(null);
          globallyDeclarePattern(declarator.id, node, declarator);
        });
        globalDeclarations.push(node);
        globalVariableDeclarations.push(node);
        globalScope.globals = globalScope.globals || Object.create(null);
        Object.assign(globalScope.globals, node.globals);
      }
    },
    FunctionDeclaration(node, parents) {
      let parent = null;
      for (let i = parents.length - 2; i >= 0 && parent === null; i--) {
        if (isFunctionDeclarationScope(parents[i])) {
          parent = parents[i];
        }
      }
      if (parent) {
        parent.locals = parent.locals || Object.create(null);
        if (node.id) {
          parent.locals[node.id.name] = true;
        }
      } else {
        node.parent = parents[parents.length - 2];
        // const index = parents.slice(0, -1).findLastIndex(statement => statement.type !== "LabeledStatement");
        let i = parents.length - 2;
        while (i >= 0) {
          if (parents[i].type !== "LabeledStatement") {
            break;
          }
          --i;
        }
        node.scope = i !== -1 ? parents[i] : null;
        node.outermostLabeledStatement = i < parents.length - 2 ? parents[i + 1] : null;
        if (node.outermostLabeledStatement) {
          node.outermostLabeledStatement.id = node.id;
          node.outermostLabeledStatement.parent = node.scope;
        }
        node.globals = node.globals || Object.create(null);
        if (node.id.name) {
          node.globals[node.id.name] = true;
        }
        globalDeclarations.push(node);
        globalFunctionDeclarations.push(node);
        globalScope.globals = globalScope.globals || Object.create(null);
        Object.assign(globalScope.globals, node.globals);
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
  function variablePattern(node, parents) {
    const { name } = node;
    if (name === "undefined") {
      return;
    }
    for (let i = parents.length - 2; i >= 0; --i) {
      const { type } = parents[i];
      if (
        type !== "ObjectPattern" && type !== "ArrayPattern" && type !== "RestElement" &&
        type !== "AssignmentPattern"
      ) {
        if (type === "VariableDeclarator") {
          return;
        }
        break;
      }
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
    VariablePattern: variablePattern,
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
  const result = Object.keys(groupedGlobals).sort().map(name => {
    return { name, nodes: groupedGlobals[name] };
  });
  result.globalDeclarations = globalDeclarations;
  result.globalVariableDeclarations = globalVariableDeclarations;
  result.globalFunctionDeclarations = globalFunctionDeclarations;
  result.globalScope = globalScope;
  return result;
}
