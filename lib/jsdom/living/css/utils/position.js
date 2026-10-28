"use strict";

const { isList, isOmitted, keyword, list, omitted } = require("../values/value.js");

function axis(value) {
  if (!isList(value)) {
    value = {
      ...value,
      types: value.types.filter(
        (type) => !type.startsWith("<position") && type !== "<bg-position>",
      ),
    };
  }
  if (isList(value) || value.value === "center") {
    return value;
  }
  return value.types.includes("<keyword>") ? list([value, omitted]) : list([omitted, value]);
}

exports.splitPosition = (position) => {
  if (isList(position)) {
    return position.map(axis);
  }
  const center = keyword("center");
  if (position.value === "top" || position.value === "bottom") {
    return [center, axis(position)];
  }
  return [axis(position), center];
};

exports.combinePosition = (x, y) => {
  const xOffset = isList(x) && !isOmitted(x[0]) && !isOmitted(x[1]);
  const yOffset = isList(y) && !isOmitted(y[0]) && !isOmitted(y[1]);
  if (xOffset && isList(y) && isOmitted(y[0])) {
    y = list([keyword("top"), y[1]]);
  }
  if (yOffset && isList(x) && isOmitted(x[0])) {
    x = list([keyword("left"), x[1]]);
  }
  return list([x, y]);
};
