"use strict";

var acorn = require("acorn");
var findGlobals = require("acorn-globals");
var escodegen = require("escodegen");

module.exports = function (o) {
  o.getGlobal = function () {
    return o;
  };

  o.run = function (code, filename) {
    var comments = [], tokens = [];
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

    code = escodegen.generate(ast, { comment: true });
    new Function("window", code + "\n//# sourceURL=" + filename).bind(o)(o); // jshint ignore:line
  };
};
