import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

function isMember(node, property) {
  return node.type === "MemberExpression" && !node.computed && node.property.name === property;
}

function findBinding(program, name) {
  for (const statement of program.body) {
    if (statement.type === "ClassDeclaration" && statement.id.name === name) {
      return statement;
    }
    if (statement.type === "VariableDeclaration") {
      for (const declaration of statement.declarations) {
        if (declaration.id.type === "Identifier" && declaration.id.name === name) {
          return declaration.init;
        }
      }
    }
  }
  return null;
}

function findImplementation(program) {
  for (const statement of program.body) {
    if (
      statement.type !== "ExpressionStatement" ||
      statement.expression.type !== "AssignmentExpression"
    ) {
      continue;
    }
    const { left, right } = statement.expression;
    if (isMember(left, "implementation") && left.object.name === "exports") {
      return right;
    }
    if (
      isMember(left, "exports") &&
      left.object.name === "module" &&
      right.type === "ObjectExpression"
    ) {
      return right.properties.find((property) => property.key.name === "implementation")?.value;
    }
  }
  return null;
}

// Follow the top-level CommonJS imports used by implementation classes without executing their modules.
export function createInheritanceChecker(context) {
  const currentModule = { program: context.sourceCode.ast, filename: context.filename };
  const modules = new Map([[context.filename, currentModule]]);

  function resolveModule(expression, module, seen) {
    if (expression === null || seen.has(expression)) {
      return null;
    }
    seen.add(expression);
    if (expression.type === "Identifier") {
      const binding = findBinding(module.program, expression.name);
      return resolveModule(binding, module, seen);
    }
    if (
      expression.type !== "CallExpression" ||
      expression.callee.name !== "require" ||
      expression.arguments.length !== 1 ||
      expression.arguments[0].type !== "Literal" ||
      typeof expression.arguments[0].value !== "string" ||
      !expression.arguments[0].value.startsWith(".")
    ) {
      return null;
    }
    const filename = createRequire(module.filename).resolve(expression.arguments[0].value);
    if (!modules.has(filename)) {
      modules.set(filename, {
        filename,
        program: context.languageOptions.parser.parse(readFileSync(filename, "utf8"), {
          ecmaVersion: "latest",
          sourceType: "commonjs",
          loc: true,
          range: true,
          tokens: true,
          comment: true,
        }),
      });
    }
    return modules.get(filename);
  }

  function resolveClass(expression, module, seen = new Set()) {
    if (!expression || seen.has(expression)) {
      return null;
    }
    seen.add(expression);
    if (expression.type === "ClassDeclaration" || expression.type === "ClassExpression") {
      return { node: expression, module };
    }
    if (expression.type === "Identifier") {
      return resolveClass(findBinding(module.program, expression.name), module, seen);
    }
    if (isMember(expression, "implementation")) {
      const imported = resolveModule(expression.object, module, seen);
      if (imported !== null) {
        return resolveClass(findImplementation(imported.program), imported, seen);
      }
    }
    return null;
  }

  return (node, ancestor) => {
    let parent = resolveClass(node.superClass, currentModule);
    const seen = new Set();
    while (parent !== null && !seen.has(parent.node)) {
      if (parent.node.id?.name === ancestor) {
        return true;
      }
      seen.add(parent.node);
      parent = resolveClass(parent.node.superClass, parent.module);
    }
    return false;
  };
}
