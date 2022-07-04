"use strict";
/* eslint-disable no-new-func */
const acorn = require("acorn");
const findGlobals = require("acorn-globals");
const escodegen = require("escodegen");
const jsGlobals = require("./browser/js-globals.json");
const walk = require("acorn-walk");

// We can't use the default browserify vm shim because it doesn't work in a web worker.

// "eval" is skipped because it's set to a function that calls `runInContext`:
const jsGlobalEntriesToInstall = Object.entries(jsGlobals).filter(([name]) => name !== "eval" && name in global);

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
      default:
        throw new Error("Unrecognized pattern type: " + node.type);
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

function getPatchNode(name) {
  return {
    type: "AssignmentExpression",
    left: {
      type: "MemberExpression",
      object: { type: "Identifier", name: "window" },
      property: { type: "Identifier", name },
      computed: false,
      optional: false
    },
    operator: "=",
    right: { type: "Identifier", name }
  };
}

function getPatchExpressionStatement(functionDeclaration) {
  return { type: "ExpressionStatement", expression: getPatchNode(functionDeclaration.id.name) };
}

function getPatchBlockStatement(functionDeclaration) {
  return { type: "BlockStatement", body: [functionDeclaration, getPatchExpressionStatement(functionDeclaration)] };
}

exports.createContext = function (sandbox) {
  // TODO: This should probably use a symbol
  Object.defineProperty(sandbox, "__isVMShimContext", {
    value: true,
    writable: true,
    configurable: true,
    enumerable: false
  });

  for (const [globalName, globalPropDesc] of jsGlobalEntriesToInstall) {
    const propDesc = { ...globalPropDesc, value: global[globalName] };
    Object.defineProperty(sandbox, globalName, propDesc);
  }

  Object.defineProperty(sandbox, "eval", {
    value(code) {
      return exports.runInContext(code, sandbox);
    },
    writable: true,
    configurable: true,
    enumerable: false
  });
};

exports.isContext = function (sandbox) {
  return sandbox.__isVMShimContext;
};

exports.runInContext = function (code, contextifiedSandbox, options) {
  if (code === "this") {
    // Special case for during window creation.
    return contextifiedSandbox;
  }

  if (options === undefined) {
    options = {};
  }

  const comments = [];
  const tokens = [];
  const ast = acorn.parse(code, {
    allowReturnOutsideFunction: true,
    ranges: true,
    // collect comments in Esprima's format
    onComment: comments,
    // collect token ranges
    onToken: tokens
  });

  // make sure we keep comments
  escodegen.attachComments(ast, comments, tokens);

  // TODO: these global propertise cann't be delete. (configurable: false)
  // TODO: these global propertise are defined at start of program.
  // TODO: hoist of function declaration
  const globalDeclarations = findGlobalDeclarations(ast);
  for (const globalDeclaration of globalDeclarations) {
    if (globalDeclaration.type === "VariableDeclaration") {
      const globals = Object.keys(globalDeclaration.globals);
      const expressions = globals.map(getPatchNode).concat({ type: "Identifier", name: globals[0] });
      globalDeclaration.declarations.push({
        type: "VariableDeclarator",
        id: { type: "Identifier", name: globals[0] },
        init: { type: "SequenceExpression", expressions }
      });
    } else if (globalDeclaration.type === "FunctionDeclaration") {
      const { parent } = globalDeclaration;
      switch (parent.type) {
        case "Program":
        case "BlockStatement":
          parent.body.splice(
            parent.body.indexOf(globalDeclaration) + 1,
            0,
            getPatchExpressionStatement(globalDeclaration)
          );
          break;
        case "IfStatement":
          parent[parent.consequent === globalDeclaration ? "consequent" : "alternate"] =
            getPatchBlockStatement(globalDeclaration);
          break;
        case "SwitchStatement":
          for (const { consequent } of parent.cases) {
            const index = consequent.indexOf(globalDeclaration);
            if (index >= 0) {
              consequent.splice(index + 1, 0, getPatchExpressionStatement(globalDeclaration));
              break;
            }
          }
          break;
        case "LabeledStatement":
          parent.body = getPatchBlockStatement(globalDeclaration);
          break;
        default:
          throw new Error("don't know this parent type: " + parent.type);
      }
    }
  }

  const globals = findGlobals(ast);
  for (let i = 0; i < globals.length; ++i) {
    if (globals[i].name === "window" || globals[i].name === "this") {
      continue;
    }

    const { nodes } = globals[i];
    for (let j = 0; j < nodes.length; ++j) {
      const { type, name } = nodes[j];
      nodes[j].type = "MemberExpression";
      nodes[j].property = { name, type };
      nodes[j].computed = false;
      nodes[j].object = {
        name: "window",
        type: "Identifier"
      };
    }
  }

  const lastNode = ast.body[ast.body.length - 1];
  if (lastNode.type === "ExpressionStatement") {
    lastNode.type = "ReturnStatement";
    lastNode.argument = lastNode.expression;
    delete lastNode.expression;
  }

  const rewrittenCode = escodegen.generate(ast, { comment: true });
  const suffix = options.filename !== undefined ? "\n//# sourceURL=" + options.filename : "";

  return Function("window", rewrittenCode + suffix).bind(contextifiedSandbox)(contextifiedSandbox);
};

exports.Script = class VMShimScript {
  constructor(code, options) {
    this._code = code;
    this._options = options;
  }

  runInContext(sandbox, options) {
    return exports.runInContext(this._code, sandbox, { ...this._options, ...options });
  }
};
