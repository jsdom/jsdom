"use strict";

const cssPropertyDefinitions = require("../../../generated/css-property-definitions.js");
const { asciiLowercase } = require("../helpers/strings.js");
const csstree = require("./helpers/patched-csstree.js");

class CSSImpl {
  // https://drafts.csswg.org/cssom/#the-css.escape()-method
  static escape(ident) {
    const l = ident.length;
    const firstCodeUnit = l > 0 ? ident.charCodeAt(0) : 0;
    let escaped = "";
    for (let i = 0; i < l; i++) {
      const codeUnit = ident.charCodeAt(i);

      // NULL character (U+0000) becomes the replacement character (U+FFFD)
      if (codeUnit === 0x0000) {
        escaped += "\uFFFD";
        continue;
      }

      // Control characters, a leading digit, or the digit in a "hyphen + digit" sequence
      if (
        (codeUnit >= 0x0001 && codeUnit <= 0x001F) ||
        codeUnit === 0x007F ||
        (i === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
        (i === 1 && codeUnit >= 0x0030 && codeUnit <= 0x0039 && firstCodeUnit === 0x002D)
      ) {
        escaped += `\\${codeUnit.toString(16)} `;
        continue;
      }

      // If the string consists of a single hyphen
      if (i === 0 && l === 1 && codeUnit === 0x002D) {
        escaped += `\\${ident.charAt(i)}`;
        continue;
      }

      // ASCII characters that do not require escaping (alphanumeric, hyphen, underscore)
      // and non-ASCII characters
      if (
        codeUnit >= 0x0080 ||
        codeUnit === 0x002D ||
        codeUnit === 0x005F ||
        (codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
        (codeUnit >= 0x0041 && codeUnit <= 0x005A) ||
        (codeUnit >= 0x0061 && codeUnit <= 0x007A)
      ) {
        escaped += ident.charAt(i);
        continue;
      }

      // Escape all other symbols with a backslash
      escaped += `\\${ident.charAt(i)}`;
    }

    return escaped;
  }

  // https://drafts.csswg.org/css-conditional-3/#the-css-namespace
  static supports(...args) {
    if (args.length === 1) {
      return this._supportsConditionText(args[0]);
    }

    return this._supportsDeclaration(args[0], args[1]);
  }

  static _getPropertyInfo(property) {
    const isCustom = property.startsWith("--");
    const lowerProp = asciiLowercase(property);
    return {
      isCustom,
      lowerProp,
      isKnown: isCustom || cssPropertyDefinitions.has(lowerProp)
    };
  }

  static _supportsDeclaration(property, value) {
    const { isCustom, isKnown, lowerProp } = this._getPropertyInfo(property);
    if (!isKnown) {
      return false;
    }

    try {
      const ast = csstree.parse(`${lowerProp}:${value}`, { context: "declaration" });
      if (isCustom) {
        return true;
      }

      const match = csstree.lexer.matchProperty(lowerProp, ast.value);
      return match.error === null;
    } catch {
      return false;
    }
  }

  static _validateDeclarationAST(property, ast) {
    const { isCustom, isKnown, lowerProp } = this._getPropertyInfo(property);
    if (!isKnown) {
      return false;
    }
    if (isCustom) {
      return true;
    }

    return csstree.lexer.matchProperty(lowerProp, ast).error === null;
  }

  static _supportsConditionText(conditionText) {
    const trimmed = conditionText.trim();

    // 1. Fast path for single declarations (e.g., "color: red")
    if (/^[^():]+\s*:/.test(trimmed)) {
      try {
        const ast = csstree.parse(trimmed, { context: "declaration" });
        if (ast) {
          return this._validateDeclarationAST(ast.property, ast.value);
        }
      } catch {
        // Fall through to @supports parsing
      }
    }

    try {
      // 2. Parse as @supports rule
      const ast = csstree.parse(`@supports ${conditionText} {}`, { context: "stylesheet" });
      const supportsRule = ast.children.first;
      if (
        supportsRule?.type === "Atrule" &&
        supportsRule?.name === "supports" &&
        supportsRule?.prelude?.type === "AtrulePrelude"
      ) {
        return this._evaluateList(supportsRule.prelude.children);
      }
    } catch {
      // Fall through
    }

    return false;
  }

  static _evaluateList(list) {
    if (!list || !list.head) {
      return false;
    }

    let current = list.head;
    let result = null;
    let currentOperator = null;
    let isNot = false;
    let expectingCondition = true;

    // Traverse the linked list
    while (current !== null) {
      const node = current.data;

      if (node.type === "WhiteSpace" || node.type === "Comment") {
        current = current.next;
        continue;
      }

      // Handle logical operators
      if (node.type === "Identifier") {
        const ident = node.name;
        if (ident === "not") {
          if (result !== null || isNot) {
            return false;
          }
          isNot = true;
        } else if (ident === "and" || ident === "or") {
          if (isNot || expectingCondition) {
            return false;
          } else if (currentOperator !== null && currentOperator !== ident) {
            return false;
          }

          currentOperator = ident;
          expectingCondition = true;
        } else {
          // Any other unexpected identifier makes the condition invalid
          return false;
        }

        current = current.next;
        continue;
      }

      if (!expectingCondition) {
        return false;
      }

      let childResult;
      if (node.type === "Parentheses" || node.type === "Condition") {
        childResult = this._evaluateList(node.children);
      } else if (node.type === "Declaration") {
        childResult = this._validateDeclarationAST(node.property, node.value);
      } else if (node.type === "SupportsDeclaration") {
        childResult = this._validateDeclarationAST(node.declaration.property, node.declaration.value);
      } else {
        // TODO: Support Function types (e.g., selector())
        return false;
      }

      if (isNot) {
        childResult = !childResult;
        isNot = false;
      }

      if (result === null) {
        result = childResult;
      } else if (currentOperator === "and") {
        result &&= childResult;
      } else if (currentOperator === "or") {
        result ||= childResult;
      }

      expectingCondition = false;
      current = current.next;
    }

    if (isNot || (expectingCondition && result !== null)) {
      return false;
    }

    return result === null ? false : result;
  }
}

exports.implementation = CSSImpl;
