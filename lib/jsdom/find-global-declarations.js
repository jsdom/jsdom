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
  function declarePattern(node, varNode) {
    switch (node.type) {
      case "Identifier":
        varNode.globals[node.name] = true;
        break;
      case "ObjectPattern":
        node.properties.forEach(property => {
          declarePattern(property.value || property.argument, varNode);
        });
        break;
      case "ArrayPattern":
        node.elements.forEach(element => {
          if (element) {
            declarePattern(element, varNode);
          }
        });
        break;
      case "RestElement":
        declarePattern(node.argument, varNode);
        break;
      case "AssignmentPattern":
        declarePattern(node.left, varNode);
        break;
    }
  }
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
      node.declarations.forEach(declaration => {
        declarePattern(declaration.id, node);
      });
      globalDeclarations.push(node);
    },
    FunctionDeclaration(node, parents) {
      for (let i = parents.length - 2; i >= 0; i--) {
        if (isFunctionScope(parents[i])) {
          return;
        }
      }
      node.globals = node.globals || Object.create(null);
      if (node.id) {
        node.globals[node.id.name] = true;
      }
      node.parent = parents[parents.length - 2];
      globalDeclarations.push(node);
    }
  });
  return globalDeclarations;
}

exports.findGlobalDeclarations = findGlobalDeclarations;
