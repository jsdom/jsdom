"use strict";

const parameterCounts = new Map([
  ["M", 2], ["L", 2], ["H", 1], ["V", 1], ["C", 6],
  ["S", 4], ["Q", 4], ["T", 2], ["A", 7], ["Z", 0]
]);
const commandLetters = "MmLlHhVvCcSsQqTtAaZz";

// CSS `path()` requires the entire path to be valid and nonempty. SVG's
// recovery rule, which draws the valid prefix of malformed data, does not apply.
// https://drafts.csswg.org/css-shapes-1/#funcdef-basic-shape-path
// https://svgwg.org/svg2-draft/paths.html#PathDataBNF
module.exports = function parsePath(input) {
  const number = /[+-]?(?:\d*\.\d+|\d+)(?:[eE][+-]?\d+)?/y;
  const whitespace = /[\t\n\f\r ]*/y;
  const commands = [];
  let index = 0;
  let command = null;

  function skipWhitespace() {
    whitespace.lastIndex = index;
    whitespace.exec(input);
    index = whitespace.lastIndex;
  }

  skipWhitespace();
  if (input[index] !== "M" && input[index] !== "m") {
    return null;
  }
  while (index < input.length) {
    if (commandLetters.includes(input[index])) {
      command = input[index++];
      skipWhitespace();
    } else if (command === null) {
      return null;
    }
    const uppercase = command.toUpperCase();
    const count = parameterCounts.get(uppercase);
    if (count === 0) {
      commands.push("Z");
      command = null;
      continue;
    }
    commands.push(command);
    for (let parameter = 0; parameter < count; parameter++) {
      if (uppercase === "A" && (parameter === 3 || parameter === 4)) {
        const flag = input[index++];
        if (flag !== "0" && flag !== "1") {
          return null;
        }
        commands.push(Number(flag));
      } else {
        number.lastIndex = index;
        const match = number.exec(input);
        if (!match || !Number.isFinite(Number(match[0]))) {
          return null;
        }
        commands.push(Number(match[0]));
        index = number.lastIndex;
      }
      const end = index;
      skipWhitespace();
      if (input[index] === ",") {
        index++;
        skipWhitespace();
        if (index === input.length || commandLetters.includes(input[index])) {
          return null;
        }
      }
      // The arc rotation and its first flag require a separator. Other numeric
      // arguments can abut when their token boundaries remain unambiguous.
      if (uppercase === "A" && parameter === 2 && index === end) {
        return null;
      }
    }
    if (command === "M") {
      command = "L";
    } else if (command === "m") {
      command = "l";
    }
  }
  return commands;
};
