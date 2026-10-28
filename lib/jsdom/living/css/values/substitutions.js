"use strict";

const definitions = require("../../../../generated/css-property-definitions.js");

// https://drafts.csswg.org/css-env-1/#funcdef-env
// https://drafts.csswg.org/css-values-5/#funcdef-attr
// https://drafts.csswg.org/css-values-5/#funcdef-ident
// https://drafts.csswg.org/css-values-5/#funcdef-if
// https://drafts.csswg.org/css-values-5/#funcdef-inherit
// https://drafts.csswg.org/css-values-5/#funcdef-random-item
// https://drafts.csswg.org/css-variables-2/#funcdef-var
exports.arbitrary = [
  {
    definition: "<dashed-function>",
    name: "<dashed-ident>",
    element: true,
  },
  {
    definition: "<attr-args>",
    name: "attr",
    element: true,
  },
  {
    definition: "<env-args>",
    name: "env",
  },
  {
    definition: "<ident-args>",
    name: "ident",
  },
  {
    definition: "<if-args>",
    name: "if",
  },
  {
    definition: "<inherit-args>",
    name: "inherit",
    cascade: true,
  },
  {
    definition: "<random-item-args>",
    name: "random-item",
    element: true,
  },
  {
    definition: "<var-args>",
    name: "var",
    cascade: true,
  },
];
// https://drafts.csswg.org/css-cascade-5/#cascade-dependent-keyword
// https://drafts.csswg.org/css-values-4/#css-wide-keywords
exports.keywords = definitions.all.value.split(" | ");
// https://drafts.csswg.org/css-values-4/#calc-syntax
// https://drafts.csswg.org/css-values-5/#funcdef-calc-mix
// https://drafts.csswg.org/css-values-5/#funcdef-progress
// https://drafts.csswg.org/css-values-5/#funcdef-random
// https://drafts.csswg.org/css-values-5/#funcdef-sibling-count
// https://drafts.csswg.org/css-values-5/#funcdef-sibling-index
exports.numeric = [
  {
    definition: "<abs()>",
    name: "abs",
  },
  {
    definition: "<acos()>",
    name: "acos",
  },
  {
    definition: "<anchor()>",
    name: "anchor",
    element: true,
  },
  {
    definition: "<anchor-size()>",
    name: "anchor-size",
    element: true,
  },
  {
    definition: "<asin()>",
    name: "asin",
  },
  {
    definition: "<atan()>",
    name: "atan",
  },
  {
    definition: "<atan2()>",
    name: "atan2",
  },
  {
    definition: "<calc-mix()>",
    name: "calc-mix",
  },
  {
    definition: "<calc()>",
    name: "calc",
  },
  {
    definition: "<clamp()>",
    name: "clamp",
  },
  {
    definition: "<cos()>",
    name: "cos",
  },
  {
    definition: "<exp()>",
    name: "exp",
  },
  {
    definition: "<hypot()>",
    name: "hypot",
  },
  {
    definition: "<log()>",
    name: "log",
  },
  {
    definition: "<max()>",
    name: "max",
  },
  {
    definition: "<min()>",
    name: "min",
  },
  {
    definition: "<mod()>",
    name: "mod",
  },
  {
    definition: "<pow()>",
    name: "pow",
  },
  {
    definition: "<progress()>",
    name: "progress",
  },
  {
    definition: "<random()>",
    name: "random",
  },
  {
    definition: "<rem()>",
    name: "rem",
  },
  {
    definition: "<round()>",
    name: "round",
  },
  {
    definition: "<sibling-count()>",
    name: "sibling-count",
    element: true,
  },
  {
    definition: "<sibling-index()>",
    name: "sibling-index",
    element: true,
  },
  {
    definition: "<sign()>",
    name: "sign",
  },
  {
    definition: "<sin()>",
    name: "sin",
  },
  {
    definition: "<sqrt()>",
    name: "sqrt",
  },
  {
    definition: "<tan()>",
    name: "tan",
  },
];
