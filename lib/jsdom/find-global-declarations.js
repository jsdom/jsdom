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

const walk = require("acorn-walk");

function isFunctionScope(node) {
  return node.type === "FunctionExpression" || node.type === "FunctionDeclaration" ||
    node.type === "ArrowFunctionExpression";
}

function findGlobalDeclarations(ast) {
  const globalDeclarations = [];
  const globalVariableDeclarations = [];
  const globalFunctionDeclarations = [];
  function declarePattern(node, varNode, declaratorNode) {
    switch (node.type) {
      case "Identifier":
        varNode.globals[node.name] = true;
        declaratorNode.globals[node.name] = true;
        break;
      case "ObjectPattern":
        node.properties.forEach(property => {
          declarePattern(property.value || property.argument, varNode, declaratorNode);
        });
        break;
      case "ArrayPattern":
        node.elements.forEach(element => {
          if (element) {
            declarePattern(element, varNode, declaratorNode);
          }
        });
        break;
      case "RestElement":
        declarePattern(node.argument, varNode, declaratorNode);
        break;
      case "AssignmentPattern":
        declarePattern(node.left, varNode, declaratorNode);
        break;
    }
  }
  const globalScope = ast.type === "Program" ? ast : null;
  walk.ancestor(ast, {
    VariableDeclaration(node, parents) {
      if (node.kind !== "var") {
        return;
      }
      for (let i = parents.length - 2; i >= 0; i--) {
        if (isFunctionScope(parents[i])) {
          return;
        }
      }
      node.globals = node.globals || Object.create(null);
      node.declarations.forEach(declarator => {
        declarator.globals = declarator.globals || Object.create(null);
        declarePattern(declarator.id, node, declarator);
      });
      globalDeclarations.push(node);
      globalVariableDeclarations.push(node);
      if (globalScope) {
        globalScope.globals = globalScope.globals || Object.create(null);
        Object.assign(globalScope.globals, node.globals);
      }
    },
    FunctionDeclaration(node, parents) {
      for (let i = parents.length - 2; i >= 0; i--) {
        if (isFunctionScope(parents[i])) {
          return;
        }
      }
      node.parent = parents[parents.length - 2];
      // const index = parents.slice(0, -1).findLastIndex(statement => statement.type !== "LabeledStatement");
      let index = parents.length - 2;
      while (index >= 0) {
        if (parents[index].type !== "LabeledStatement") {
          break;
        }
        --index;
      }
      node.scope = index !== -1 ? parents[index] : null;
      node.outermostLabeledStatement = index < parents.length - 2 ? parents[index + 1] : null;
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
      if (globalScope) {
        globalScope.globals = globalScope.globals || Object.create(null);
        Object.assign(globalScope.globals, node.globals);
      }
    }
  });
  globalDeclarations.globalVariableDeclarations = globalVariableDeclarations;
  globalDeclarations.globalFunctionDeclarations = globalFunctionDeclarations;
  if (globalScope) {
    globalDeclarations.globalScope = globalScope;
  }
  return globalDeclarations;
}

exports.findGlobalDeclarations = findGlobalDeclarations;