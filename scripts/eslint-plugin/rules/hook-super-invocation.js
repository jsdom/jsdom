"use strict";

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
      description: "Prevent missing invocation to the super jsdom hook.",
      type: "array",
      items: {
        type: "object",
        properties: {
          ancestor: { type: "string" },
          hook: { type: "string" }
        },
        required: ["ancestor", "hook"],
        additionalProperties: false
      }
    }
  },

  create(context) {
    const { options } = context;

    return {
      MethodDefinition(node) {
        if (
          node.kind !== "method" ||
          node.key.type !== "Identifier"
        ) {
          return;
        }

        const hookName = node.key.name;
        const hookOption = options.find(option => option.hook === hookName);

        // Don't do anything if the method is not a known hook.
        if (hookOption === undefined) {
          return;
        }

        // Check if the class is not the ancestor class defining the hook. In this case it should not call super.
        const isAncestorClass = node.parent.parent.id && node.parent.parent.id.name === hookOption.ancestor;
        if (isAncestorClass) {
          return;
        }

        const isMethodCallingSuper = node.value.body.body.some(statement => {
          return (
            statement.type === "ExpressionStatement" &&
            isSuperHookInvocation(statement.expression, hookName)
          );
        });

        if (!isMethodCallingSuper) {
          context.report({
            node,
            message: `Missing invocation to the "${hookName}" jsdom hook super.`
          });
        }
      }
    };
  }
};
