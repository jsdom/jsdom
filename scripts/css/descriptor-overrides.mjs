import syntaxData from "css-tree/definition-syntax-data";

export const descriptorContexts = [
  "@container",
  "@counter-style",
  "@font-face",
  "@font-feature-values",
  "@font-palette-values",
  "@function",
  "@media",
  "@page",
  "@property",
  "@view-transition"
];

// Descriptor syntax and initial values that need parser-specific treatment.
export const descriptorOverrides = {
  "@font-face": {
    "unicode-range": {
      value: syntaxData.atrules["font-face"].descriptors["unicode-range"]
    }
  },
  "@function": {
    "--*": {
      initial: null,
      value: "<declaration-value>?"
    }
  },
  "@page": {
    "page-margin-safety": {
      value: "none | auto | clamp | add"
    }
  },
  "@property": {
    syntax: {
      value: "<syntax>"
    }
  }
};
