"use strict";

// We can't use the default browserify vm shim because it doesn't work in a web worker.

var acorn = require("acorn");
var findGlobals = require("acorn-globals");
var escodegen = require("escodegen");

// From ES spec table of contents. Also, don't forget the Annex B additions.
// If someone feels ambitious maybe make this into an npm package.
var builtInConsts = ["Infinity", "NaN", "undefined"];
var otherBuiltIns = ["eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent",
  "encodeURI", "encodeURIComponent", "Array", "ArrayBuffer", "Boolean", "DataView", "Date", "Error", "EvalError",
  "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Number", "Object",
  "Proxy", "Promise", "RangeError", "ReferenceError", "RegExp", "Set", "String", "Symbol", "SyntaxError", "TypeError",
  "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "URIError", "WeakMap", "WeakSet", "JSON", "Math",
  "Reflect", "escape", "unescape"];

exports.createContext = function (sandbox) {
  Object.defineProperty(sandbox, "__isVMShimContext", {
    value: true,
    writable: true,
    configurable: true,
    enumerable: false
  });

  for (const builtIn of builtInConsts) {
    Object.defineProperty(sandbox, builtIn, {
      value: global[builtIn],
      writable: false,
      configurable: false,
      enumerable: false
    });
  }

  for (const builtIn of otherBuiltIns) {
    Object.defineProperty(sandbox, builtIn, {
      value: global[builtIn],
      writable: true,
      configurable: true,
      enumerable: false
    });
  }
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

  var comments = [];
  var tokens = [];
  var ast = acorn.parse(code, {
    ecmaVersion: 6,
    allowReturnOutsideFunction: true,
    ranges: true,
    // collect comments in Esprima's format
    onComment: comments,
    // collect token ranges
    onToken: tokens
  });

  // make sure we keep comments
  escodegen.attachComments(ast, comments, tokens);

  var globals = findGlobals(ast);
  for (var i = 0; i < globals.length; ++i) {
    if (globals[i].name === "window") {
      continue;
    }

    var nodes = globals[i].nodes;
    for (var j = 0; j < nodes.length; ++j) {
      var type = nodes[j].type;
      var name = nodes[j].name;
      nodes[j].type = "MemberExpression";
      nodes[j].property = {
        name: name,
        type: type
      };
      nodes[j].computed = false;
      nodes[j].object = {
        name: "window",
        type: "Identifier"
      };
    }
  }

  var lastNode = ast.body[ast.body.length - 1];
  if (lastNode.type === "ExpressionStatement") {
    lastNode.type = "ReturnStatement";
    lastNode.argument = lastNode.expression;
    delete lastNode.expression;
  }

  var rewrittenCode = escodegen.generate(ast, { comment: true });
  var suffix = options.filename !== undefined ? "\n//# sourceURL=" + options.filename : "";

  /* jshint -W054 */
  return new Function("window", rewrittenCode + suffix).bind(contextifiedSandbox)(contextifiedSandbox);
  /* jshint +W054 */
};
