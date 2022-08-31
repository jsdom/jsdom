"use strict";
/* eslint-disable no-new-func */
const acorn = require("acorn");
const findGlobals = require("acorn-globals");
const escodegen = require("escodegen");
const jsGlobals = require("./browser/js-globals.json");

// We can't use the default browserify vm shim because it doesn't work in a web worker.

// "eval" is skipped because it's set to a function that calls `runInContext`:
const jsGlobalEntriesToInstall = Object.entries(jsGlobals).filter(([name]) => name !== "eval" && name in global);

function id(name) {
  return { type: "Identifier", name };
}

function patchWithStatement(withStatement) {
  withStatement.body = {
    type: withStatement.type,
    object: withStatement.object,
    body: withStatement.body
  };
  // new Proxy(window, {has: (target, key) => [ /* global ids */ ].indexOf(key) !== -1})
  withStatement.object = {
    type: "NewExpression",
    callee: id("Proxy"),
    arguments: [
      id("window"),
      {
        type: "ObjectExpression",
        properties: [
          {
            type: "Property",
            kind: "init",
            key: id("has"),
            value: {
              type: "ArrowFunctionExpression",
              id: null,
              params: [id("target"), id("key")],
              body: {
                type: "BinaryExpression",
                operator: "!==",
                left: {
                  type: "CallExpression",
                  callee: {
                    type: "MemberExpression",
                    object: { type: "ArrayExpression", elements: withStatement.globalIds },
                    property: id("indexOf"),
                    computed: false,
                    optional: false
                  },
                  arguments: [id("key")],
                  optional: false
                },
                right: {
                  type: "UnaryExpression",
                  operator: "-",
                  argument: { type: "Literal", raw: "1", value: 1 },
                  prefix: true
                }
              },
              async: false,
              expression: true,
              generator: false
            },
            method: false,
            computed: false,
            shorthand: false
          }
        ]
      }
    ]
  };
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

  const globals = findGlobals(ast);

  for (let i = 0; i < globals.length; ++i) {
    if (globals[i].name === "window" || globals[i].name === "this") {
      continue;
    }

    const { nodes } = globals[i];
    for (let j = 0; j < nodes.length; ++j) {
      const withStatement = nodes[j].parents.find(parent => parent.type === "WithStatement");
      if (withStatement) {
        withStatement.globalIds = withStatement.globalIds || [];
        withStatement.globalIds.push(
          { type: "Literal", raw: `"${nodes[j].name.replace(/"/g, "\\\"")}"`, value: nodes[j].name }
        );
        if (withStatement.patched) {
          continue;
        }
        patchWithStatement(withStatement);
        withStatement.patched = true;
        continue;
      }
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
