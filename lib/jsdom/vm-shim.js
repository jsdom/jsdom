"use strict";
/* eslint-disable no-new-func */
const acorn = require("acorn");
const findGlobals = require("./acorn-globals.js");
const escodegen = require("escodegen");
const jsGlobals = require("./browser/js-globals.json");
const { findGlobalDeclarations } = require("./find-global-declarations.js");

// We can't use the default browserify vm shim because it doesn't work in a web worker.

// "eval" is skipped because it's set to a function that calls `runInContext`:
const jsGlobalEntriesToInstall = Object.entries(jsGlobals).filter(([name]) => name !== "eval" && name in global);

// findGlobals finds all accessing of non-declared identifiers as accessing global variables,
// but "var" decarations and function declarations out of all function scopes install new properties into global object.
// The implemention of this vm-shim.js is to enclose the code into function scope,
// so all global declarations become local declarations, and then these new installation are dismissed.
// The patch is assignment being used to install these variables into global object.

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

function getPatchSequenceExpression(globals) {
  return { type: "SequenceExpression", expressions: globals.map(getPatchNode) };
}

function getPatchSequenceExpressionStatement(globals) {
  return { type: "ExpressionStatement", expression: getPatchSequenceExpression(globals) };
}

function patchGlobalScope(scope) {
  if (scope && scope.globals) {
    // Directive must be before any statments.
    const { body } = scope;
    const index = body.findIndex(
      statement => statement.type !== "ExpressionStatement" || !statement.directive
    );
    body.splice(index === -1 ? body.length : index, 0, getPatchSequenceExpressionStatement(Object.keys(scope.globals)));
    if (index !== -1 && body[index + 1].leadingComments) {
      body[index].leadingComments = body[index + 1].leadingComments;
      delete body[index + 1].leadingComments;
    }
  }
}

function patchGlobalVariableDeclaration(globalDeclaration) {
  const { declarations } = globalDeclaration;
  for (let i = declarations.length - 1; i >= 0; --i) {
    const globals = Object.keys(declarations[i].globals);
    declarations.splice(i + 1, 0, {
      type: "VariableDeclarator",
      id: { type: "Identifier", name: globals[globals.length - 1] },
      init: getPatchSequenceExpression(globals)
    });
  }
}

function getPatchExpressionStatement(functionDeclaration) {
  return { type: "ExpressionStatement", expression: getPatchNode(functionDeclaration.id.name) };
}

function getPatchBlockStatement(functionDeclaration) {
  return { type: "BlockStatement", body: [functionDeclaration, getPatchExpressionStatement(functionDeclaration)] };
}

function patchGlobalFunctionDeclaration(globalDeclaration) {
  const { parent, scope } = globalDeclaration;

  // In non-strict mode code, functions can only be declared at top level, inside a block,
  // as the body of an if statement, or inside a labelled statement inside block, at top level,
  // or inside another labelled statement inside them.
  // The body of switch statement is a block.
  // Other situations, javascript engine throws SyntaxError.
  switch (parent.type) {
    case "Program": // globalScope
      break;
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
      if (
        !scope || (scope.type !== "Program" && scope.type !== "BlockStatement" && scope.type !== "SwitchStatement")
      ) {
        break;
      }
      patchGlobalFunctionDeclaration(globalDeclaration.outermostLabeledStatement);
      break;
    case "WhileStatement":
    case "DoWhileStatement":
    case "ForStatement":
    case "ForInStatement":
    case "ForOfStatement":
    case "WithStatement":
      break;
    default:
      throw new Error("don't know this parent type: " + parent.type);
  }
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

  const { globalVariableDeclarations, globalFunctionDeclarations, globalScope } = findGlobalDeclarations(ast);

  // Global "var" declarations and global function declarations defined variables as properties of global object
  // at start of program.
  // The initial values of these properties by "var" declarations are undefined value.
  // The initial values of these properties by function declarations at block level are undefined value.
  // The initial values of these properties by function declarations at top level are these functions.
  // Labels between function declaration and inner block level or global level are skipped.
  // TODO: these global propertise cann't be delete. (configurable: false)
  patchGlobalScope(globalScope);

  // And at the locations of "var" declaration,
  // these variables are assigned to variables of function scope or properties of global object.
  // "var .....a, .....b;" becomes "var .....a, a = (....., window.a = a), .....b = (....., window.b = b);"
  globalVariableDeclarations.forEach(patchGlobalVariableDeclaration);

  // Function declarations inside block scope define block level scope variables at start of the blocks.
  // The initial values of these variables by function declarations are these functions.
  // And at the locations of function delclaration inside block scope,
  // these variables are assigned to variables of function scope or properties of global object.
  // Labels between function declaration and inner block scope, function scope or global scope are skipped.
  globalFunctionDeclarations.forEach(patchGlobalFunctionDeclaration);

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
