"use strict";

module.exports = parseDefinition;
const { LRUCache } = require("lru-cache");
const { syntaxSize } = require("../utils/syntax-size.js");
const blockModule = require("../values/block.js");
const definitionUtils = require("./grammar.js");
const stringUtils = require("../utils/string.js");
const CSSStream = require("./stream.js");
const arbitraryModule = require("./arbitrary.js");
const dimensionValues = require("../values/dimension.js");
const forgivingModule = require("../values/forgiving.js");
const propertyDefinitions = require("../../../../generated/css-property-definitions.js");
const valueDefinitions = require("../../../../generated/css-value-definitions.js");
// https://drafts.csswg.org/css-values-4/#calc-syntax
const MAX_CALCULATION_TERMS = 32;

// https://drafts.csswg.org/css-values-4/#component-multipliers
const MAX_REPETITIONS = Infinity;

// Grammar definitions are immutable. Bound their syntax and source strings
// without retaining parsing contexts.
const definitions = new LRUCache({
  max: 4096,
  maxSize: 4 * 1024 * 1024,
  maxEntrySize: 64 * 1024,
  sizeCalculation: (value, key) => Math.max(1, key.length * 2 + syntaxSize(value))
});
const childDefinitions = new WeakMap();

function getMaxRepetitions(production) {
  if (["<calc-product>", "<calc-sum>"].includes(production?.name)) {
    return MAX_CALCULATION_TERMS - 1;
  }
  if (["<hypot()>", "<min()>", "<max()>"].includes(production?.name)) {
    return MAX_CALCULATION_TERMS;
  }
  return MAX_REPETITIONS;
}

function consumeRangeBoundary(input, infinity) {
  let value = input.consumeExpected("-", "") + input.consumeRunOf(stringUtils.isDigit);
  if (value === "-") {
    input.consumeExpected("∞", Error);
    return 0 - infinity;
  }
  if (input.consumeExpected("∞") || value === "") {
    return infinity;
  }
  value = Number(value);
  if (input.consumeExpected("%")) {
    return value;
  }
  const unit = input.consumeRunOf(stringUtils.isIdentifierCharacter);
  if (value === 0 || unit === "" || unit === "fr") {
    return value;
  }
  return dimensionValues.canonicalize({
    unit,
    value
  }).value;
}

function consumeRange(input, infinity = Infinity) {
  const closingToken = blockModule.associatedTokens[input.current];
  const bounds = [];
  for (const character of input) {
    switch (character) {
      case closingToken: {
        const [min, max = min] = bounds;
        return {
          max,
          min
        };
      }
      case ",":
        input.consumeExpected(" ");
        bounds.push(consumeRangeBoundary(input, infinity));
        break;
      default:
        input.reconsume();
        bounds.push(consumeRangeBoundary(input, infinity));
        break;
    }
  }
  throw new SyntaxError(`Missing "${closingToken}"`);
}

function consumeMultiplier(input, value, production) {
  inputLoop: for (const character of input) {
    switch (character) {
      case "!":
        if (definitionUtils.isMultipliableWith(value, "!") || input.prev() === "]") {
          value = {
            type: "required",
            value
          };
          continue;
        }
        throw new SyntaxError("Unexpected !");
      case "?":
        if (definitionUtils.isMultipliableWith(value, "?") || input.prev() === "]") {
          value = {
            type: "optional",
            value
          };
          continue;
        }
        throw new SyntaxError("Unexpected ?");
      case "{":
        if (definitionUtils.isMultipliableWith(value, "{") || input.prev() === "]") {
          value = {
            ...consumeRange(input, MAX_REPETITIONS),
            multiplier: "{",
            type: "repetition",
            value
          };
          continue;
        }
        throw new SyntaxError("Unexpected {");
      case "*":
        if (definitionUtils.isMultipliableWith(value, "*") || input.prev() === "]") {
          value = {
            max: getMaxRepetitions(production),
            min: 0,
            multiplier: "*",
            type: "repetition",
            value
          };
          continue;
        }
        throw new SyntaxError("Unexpected *");
      case "+":
        if (definitionUtils.isMultipliableWith(value, "+") || input.prev() === "]") {
          value = {
            max: getMaxRepetitions(production),
            min: 1,
            multiplier: "+",
            type: "repetition",
            value
          };
          continue;
        }
        throw new SyntaxError("Unexpected +");
      case "#": {
        if (definitionUtils.isMultipliableWith(value, "#") || input.prev() === "]") {
          const range = input.consumeExpected("{") ?
            consumeRange(input, MAX_REPETITIONS) :
            {
              max: getMaxRepetitions(production),
              min: 1
            };
          value = {
            ...range,
            multiplier: "#",
            separator: ",",
            type: "repetition",
            value
          };
          continue;
        }
        throw new SyntaxError("Unexpected #");
      }
      default:
        input.reconsume();
        break inputLoop;
    }
  }
  return value;
}

function consumeDelimiter(input, production) {
  const quote = input.current;
  const value = input.consume();
  input.consumeExpected(quote);
  // A [] block must be defined with quotes around `[` and `]`
  if (value === "[") {
    const entryValue = consumeDefinition(input, production);
    input.consumeExpected(quote, Error);
    input.consumeExpected("]", Error);
    input.consumeExpected(quote, Error);
    return {
      associatedToken: "[",
      type: "block",
      value: entryValue
    };
  }
  return {
    type: "token",
    value
  };
}

function consumeIdentifier(input, production) {
  let identifier = input.current;
  if (!stringUtils.startsWithIdentifier(input.current, input.next(), input.next(1, 1))) {
    throw new SyntaxError(`Unexpected ${identifier}`);
  }
  for (const character of input) {
    if (!stringUtils.isIdentifierCharacter(character)) {
      if (character === "(") {
        if (input.consumeExpected(")")) {
          return {
            name: identifier,
            type: "function"
          };
        }
        const value = consumeDefinition(input, production);
        input.consumeExpected(")", Error);
        return {
          name: identifier,
          type: "function",
          value
        };
      }
      input.reconsume();
      break;
    }
    identifier += character;
  }
  return {
    name: "<keyword>",
    range: identifier,
    type: "non-terminal",
    value: "<ident>"
  };
}

function consumeType(input, production) {
  let name = "<";
  let min, max, test;
  if (production) {
    ({ max, min } = production);
  }
  for (const character of input) {
    if (character === ">") {
      name += character;
      break;
    }
    if (character === "[") {
      input.consumeExpected(" ");
      if (input.next() === "<") {
        test = input.consumeUntil("]");
        input.consumeExpected("]", Error);
      } else {
        ({ max, min } = consumeRange(input));
      }
    } else if (character !== " ") {
      name += character;
    }
  }
  const entries = new Map([["name", name]]);
  if (typeof min === "number") {
    entries.set("min", min);
    entries.set("max", max);
  }
  if (test) {
    entries.set("test", test);
  }
  if (name.startsWith("<'")) {
    entries.set("type", "non-terminal");
    entries.set("value", propertyDefinitions[name.slice(2, -2)]?.value);
  } else if (name === "<function-token>") {
    entries.delete("name");
    entries.set("type", "function");
    entries.set("value", consumeDefinition(input, production));
    input.consumeExpected(")", Error);
  } else if (name.endsWith("-token>")) {
    entries.set("type", "token");
  } else if (arbitraryModule[name]) {
    entries.set("type", "arbitrary");
  } else if (forgivingModule[name]) {
    entries.set("type", "forgiving");
  } else if (valueDefinitions[name] === false) {
    entries.set("type", "unsupported");
  } else if (valueDefinitions[name]) {
    const { [name]: value } = valueDefinitions;
    entries.set("type", "non-terminal");
    switch (typeof value) {
      case "function":
        entries.set("value", value);
        break;
      case "object":
        entries.set("value", value.value);
        break;
      case "string":
        entries.set("value", value);
        break;
      default:
        throw new RangeError("Unexpected value definition type");
    }
  } else {
    entries.set("type", "unknown");
  }
  return Object.fromEntries(entries);
}

function consumeSymbolUnit(input, production) {
  input.consumeExpected(" ");
  const character = input.consume();
  switch (character) {
    case "(":
    case "{": {
      const value = consumeDefinition(input, production);
      input.consumeExpected(blockModule.associatedTokens[character], Error);
      return {
        associatedToken: character,
        type: "block",
        value
      };
    }
    case "[": {
      const group = consumeDefinition(input, production);
      input.consumeExpected("]", Error);
      return group;
    }
    case "<":
      return consumeType(input, production);
    case "'":
    case '"':
      return consumeDelimiter(input, production);
    case ",":
    case "/":
    case ":":
    case ";":
      return {
        type: "token",
        value: character
      };
    default:
      return consumeIdentifier(input, production);
  }
}

function consumeSymbol(input, production) {
  return consumeMultiplier(input, consumeSymbolUnit(input, production), production);
}

function peekCombinator(input, offset = 0) {
  const type = input.next(1, offset);
  if (type === " ") {
    return peekCombinator(input, offset + 1);
  }
  if (type === "|") {
    if (input.next(1, offset + 1) === "|") {
      return {
        end: input.index + offset + 2,
        precedence: 1,
        type: "||"
      };
    }
    return {
      end: input.index + offset + 1,
      precedence: 0,
      type
    };
  }
  if (type === "&") {
    if (input.next(1, offset + 1) === "&") {
      return {
        end: input.index + offset + 2,
        precedence: 2,
        type: "&&"
      };
    }
    throw new SyntaxError("Unexpected &");
  }
  if (
    input.atEnd(offset) ||
    blockModule.closingTokens.includes(type) ||
    (type === "'" && input.next(1, offset + 1) === "]")
  ) {
    input.consumeExpected(" ");
    return null;
  }
  return {
    end: input.index + offset,
    precedence: 3,
    type: " "
  };
}

function consumeDefinition(input, production, left = consumeSymbol(input, production), precedence = 0) {
  let open = !definitionUtils.isCombination(left) || left.type === " " || left.type === "|";
  let combinator = peekCombinator(input);
  while (combinator && precedence <= combinator.precedence) {
    const { end, precedence: entryEntryPrecedence, type } = combinator;
    // `peekCombinator()` has already buffered through this inclusive endpoint.
    input.index = end;
    input.consumeExpected(" ");
    let right = consumeSymbol(input, production);
    combinator = peekCombinator(input);
    while (combinator && entryEntryPrecedence < combinator.precedence) {
      right = consumeDefinition(input, production, right, entryEntryPrecedence + 1);
      combinator = peekCombinator(input);
    }
    if (left.type === type && open) {
      if (type === right.type && (type === " " || type === "|")) {
        left.value.push(...right.value);
      } else {
        left.value.push(right);
      }
    } else if (type === right.type && (type === " " || type === "|")) {
      left = {
        type,
        value: [left, ...right.value]
      };
    } else {
      left = {
        type,
        value: [left, right]
      };
    }
    open = true;
  }
  return left;
}

function parseDefinition(string, production) {
  const isChild = production?.value === string;
  if (isChild && childDefinitions.has(production)) {
    return childDefinitions.get(production);
  }
  const propertyRange = production?.name?.startsWith("<'") ?? false;
  const repetitions = getMaxRepetitions(production);
  const min = production?.min;
  const max = production?.max;
  const key = propertyRange || repetitions !== MAX_REPETITIONS || min !== undefined || max !== undefined ?
    `${propertyRange}\0${repetitions}\0${min}\0${max}\0${string}` :
    string;
  let definition = definitions.get(key);
  if (definition === undefined) {
    definition = consumeDefinition(new CSSStream(string), production);
    // Ignore # at the top-level of a property value range
    if (propertyRange && definition.type === "repetition" && definition.separator === ",") {
      definition = definition.value;
    }
    definitions.set(key, definition);
  }
  if (isChild) {
    childDefinitions.set(production, definition);
  }
  return definition;
}
