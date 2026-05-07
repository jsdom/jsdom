"use strict";

const cssPropertyDefinitions = require("../../../generated/css-property-definitions.js");
const { asciiLowercase } = require("../helpers/strings.js");
const csstree = require("./helpers/patched-csstree.js");

class CSSImpl {
  constructor(globalObject) {
    this._globalObject = globalObject;
  }

  // https://drafts.csswg.org/cssom/#the-css.escape()-method
  escape(ident) {
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
  supports(...args) {
    if (args.length === 1) {
      return this.#supportsConditionText(args[0].trim());
    }

    return this.#supportsDeclaration(args[0], args[1]);
  }

  #supportsConditionText(conditionText) {
    try {
      // Fast path for single declarations (e.g., "color: red")
      if (/^[^():]+\s*:/.test(conditionText)) {
        const { property, value } = csstree.parse(conditionText, { context: "declaration" });
        return this.#validateDeclarationAST(property, value);
      }

      const ast = csstree.parse(`@supports ${conditionText} {}`, { context: "stylesheet" });
      return this.#evaluateList(ast.children.first.prelude?.children);
    } catch {
      // Fall through
    }

    return false;
  }

  #supportsDeclaration(property, value) {
    const { isCustom, isKnown, lowerProp } = this.#getPropertyInfo(property);
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

  #validateDeclarationAST(property, ast) {
    const { isCustom, isKnown, lowerProp } = this.#getPropertyInfo(property);
    if (!isKnown) {
      return false;
    }
    if (isCustom) {
      return true;
    }

    const match = csstree.lexer.matchProperty(lowerProp, ast);
    return match.error === null;
  }

  #evaluateList(list) {
    if (!list || !list.head) {
      return false;
    }

    let result = null;
    let currentOperator = null;
    let isNot = false;
    let expectingCondition = true;
    let current = list.head;
    while (current !== null) {
      const node = current.data;
      const { children, declaration, name, property, type, value } = node;
      if (type === "WhiteSpace" || type === "Comment") {
        current = current.next;
        continue;
      } else if (type === "Identifier") {
        const ident = asciiLowercase(name);
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
      switch (type) {
        case "Parentheses":
        case "Condition": {
          childResult = this.#evaluateList(children);
          break;
        }
        case "Declaration": {
          childResult = this.#validateDeclarationAST(property, value);
          break;
        }
        case "SupportsDeclaration": {
          childResult = this.#validateDeclarationAST(declaration.property, declaration.value);
          break;
        }
        default: {
          // TODO: Support Function types (e.g., selector())
          return false;
        }
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

    // Catch unexpected end of input (e.g., CSS.supports("not"), CSS.supports("(color: red) and"))
    if (isNot || (expectingCondition && result !== null)) {
      return false;
    }

    return result === null ? false : result;
  }

  #getPropertyInfo(property) {
    const isCustom = property.startsWith("--");
    const lowerProp = asciiLowercase(property);
    return {
      isCustom,
      lowerProp,
      isKnown: isCustom || cssPropertyDefinitions.has(lowerProp)
    };
  }
}

exports.implementation = CSSImpl;
