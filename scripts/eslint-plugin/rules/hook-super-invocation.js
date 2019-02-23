"use strict";

const JSDOM_HOOK = new Set([
  "_attach",
  "_detach",
  "_attrModified",
  "_descendantAdded",
  "_descendantRemoved",
  "_childTextContentChangeSteps"
]);

function isSuperHookInvocation(expression, hook) {
  if (expression.type !== "CallExpression") {
    return false;
  }

  const { callee } = expression;

  // super._hook()
  if (
    callee.type === "MemberExpression" &&
    callee.object.type === "Super" &&
    callee.property.type === "Identifier" &&
    callee.property.name === hook
  ) {
    return true;
  }

  // super._hook.apply() or super._hook.call()
  if (
    callee.type === "MemberExpression" &&
    callee.object.type === "MemberExpression" &&
    callee.object.object.type === "Super" &&
    callee.object.property.type === "Identifier" &&
    callee.object.property.name === hook &&
    callee.property.type === "Identifier" &&
    (callee.property.name === "call" || callee.property.name === "apply")
  ) {
    return true;
  }

  return false;
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Prevent missing invocation to the super jsdom hook."
    }
  },

  create(context) {
    return {
      MethodDefinition(node) {
        if (
          node.kind !== "method" ||
          node.key.type !== "Identifier" ||
          !JSDOM_HOOK.has(node.key.name)
        ) {
          return;
        }

        const hook = node.key.name;
        const isMethodCallingSuper = node.value.body.body.some(statement => {
          return (
            statement.type === "ExpressionStatement" &&
            isSuperHookInvocation(statement.expression, hook)
          );
        });

        if (!isMethodCallingSuper) {
          context.report({
            node,
            message: `Missing invocation to the "${hook}" jsdom hook super.`
          });
        }
      }
    };
  }
};
