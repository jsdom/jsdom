"use strict";

const descriptorDefinitions = require("../../../../generated/css-descriptor-definitions.js");
const keyframe = require("../properties/keyframe.js");
const pageMargin = require("../properties/page-margin.js");
const page = require("../properties/page.js");
const positionTry = require("../properties/position-try.js");
const propertyDefinitions = require("../../../../generated/css-property-definitions.js");
const shorthands = require("../properties/shorthands.js");
// https://drafts.csswg.org/css-conditional-3/#conditional-group-rule
const conditionalRuleNames = ["@container", "@media", "@supports"];

// https://drafts.csswg.org/css-nesting-1/#nested-group-rules
const groupRuleNames = [...conditionalRuleNames, "@layer", "@scope", "@starting-style", "@style"];

// https://drafts.csswg.org/css-mixins-1/#at-ruledef-function
const functionRule = {
  cssom: "CSSFunctionRule",
  elemental: true,
  name: "@function",
  prelude: "<custom-function-definition>",
  type: "rule",
  value: {
    descriptors: descriptorDefinitions["@function"],
    name: "<declaration-rule-list>",
    rules: [
      {
        cssom: "CSSFunctionDeclarations",
        elemental: true,
        type: "rule",
        value: {
          descriptors: descriptorDefinitions["@function"],
          name: "<declaration-list>",
          type: "arbitrary",
        },
      },
    ],
    type: "arbitrary",
  },
};

// https://drafts.csswg.org/css-nesting-1/#nested-declarations-rule
const nestedStyleDeclarationsRule = {
  cascading: true,
  cssom: "CSSNestedDeclarations",
  elemental: true,
  type: "rule",
  value: {
    name: "<declaration-list>",
    properties: propertyDefinitions,
    shorthands,
    type: "arbitrary",
  },
};

// https://drafts.csswg.org/css-syntax-3/#style-rule
const styleRule = {
  cascading: true,
  cssom: "CSSStyleRule",
  deferDeclarations: true,
  elemental: true,
  name: "@style",
  prelude: "<selector-list>",
  qualified: true,
  type: "rule",
  value: {
    name: "<block-contents>",
    properties: propertyDefinitions,
    rules: [nestedStyleDeclarationsRule],
    shorthands,
    type: "arbitrary",
  },
};

// https://drafts.csswg.org/css-nesting-1/#nested-style-rule
const nestedStyle = {
  ...styleRule,
  prelude: "<relative-selector-list>",
};
const topLevelRules = [
  {
    cssom: "CSSContainerRule",
    elemental: true,
    name: "@container",
    prelude: "<container-condition>#",
    type: "rule",
    value: {
      name: "<rule-list>",
      rules: [],
      type: "arbitrary",
    },
  },
  {
    cssom: "CSSCounterStyleRule",
    name: "@counter-style",
    prelude: "<counter-style-name>",
    type: "rule",
    value: {
      descriptors: descriptorDefinitions["@counter-style"],
      name: "<declaration-list>",
      type: "arbitrary",
    },
  },
  {
    cssom: "CSSFontFaceRule",
    name: "@font-face",
    type: "rule",
    value: {
      descriptors: descriptorDefinitions["@font-face"],
      name: "<declaration-list>",
      type: "arbitrary",
    },
  },
  {
    cssom: "CSSFontFeatureValuesRule",
    name: "@font-feature-values",
    prelude: "<font-family-name>#",
    type: "rule",
    value: {
      descriptors: descriptorDefinitions["@font-feature-values"],
      name: "<declaration-rule-list>",
      rules: [
        {
          name: "@annotation",
          type: "rule",
          value: {
            descriptors: {
              "*": "<font-feature-index [0,∞]>",
            },
            name: "<declaration-list>",
            type: "arbitrary",
          },
        },
        {
          name: "@character-variant",
          type: "rule",
          value: {
            descriptors: {
              "*": "<font-feature-index [0,99]> <font-feature-index>",
            },
            name: "<declaration-list>",
            type: "arbitrary",
          },
        },
        {
          name: "@historical-forms",
          type: "rule",
          value: {
            descriptors: {
              "*": "<font-feature-index [0,∞]>",
            },
            name: "<declaration-list>",
            type: "arbitrary",
          },
        },
        {
          name: "@ornaments",
          type: "rule",
          value: {
            descriptors: {
              "*": "<font-feature-index [0,∞]>",
            },
            name: "<declaration-list>",
            type: "arbitrary",
          },
        },
        {
          name: "@styleset",
          type: "rule",
          value: {
            descriptors: {
              "*": "<font-feature-index [0,20]>+",
            },
            name: "<declaration-list>",
            type: "arbitrary",
          },
        },
        {
          name: "@stylistic",
          type: "rule",
          value: {
            descriptors: {
              "*": "<font-feature-index [0,∞]>",
            },
            name: "<declaration-list>",
            type: "arbitrary",
          },
        },
        {
          name: "@swash",
          type: "rule",
          value: {
            descriptors: {
              "*": "<font-feature-index [0,∞]>",
            },
            name: "<declaration-list>",
            type: "arbitrary",
          },
        },
      ],
      type: "arbitrary",
    },
  },
  {
    cssom: "CSSFontPaletteValuesRule",
    name: "@font-palette-values",
    prelude: "<dashed-ident>",
    type: "rule",
    value: {
      descriptors: descriptorDefinitions["@font-palette-values"],
      name: "<declaration-list>",
      type: "arbitrary",
    },
  },
  functionRule,
  {
    cssom: "CSSImportRule",
    name: "@import",
    // https://github.com/w3c/csswg-drafts/issues/14620
    prelude:
      "[<url> | <string>] [[layer | layer(<layer-name>)] || [scope | scope([<scope-start> | <scope-boundaries>]?)] || <supports-import-condition>]? <media-import-condition>",
    type: "rule",
  },
  {
    cssom: "CSSKeyframesRule",
    name: "@keyframes",
    prelude: "<keyframes-name>",
    type: "rule",
    value: {
      name: "<qualified-rule-list>",
      rules: [
        {
          cssom: "CSSKeyframeRule",
          deferDeclarations: true,
          elemental: true,
          name: "@keyframe",
          prelude: "<keyframe-selector>#",
          qualified: true,
          type: "rule",
          value: {
            name: "<declaration-list>",
            properties: keyframe,
            shorthands: new Map([...shorthands].filter(([name]) => keyframe[name])),
            type: "arbitrary",
          },
        },
      ],
      type: "arbitrary",
    },
  },
  {
    cssom: "CSSLayerBlockRule",
    name: "@layer",
    prelude: "<layer-name>?",
    type: "rule",
    value: {
      name: "<rule-list>",
      rules: [],
      type: "arbitrary",
    },
  },
  {
    cssom: "CSSLayerStatementRule",
    name: "@layer",
    prelude: "<layer-name>#",
    type: "rule",
  },
  {
    cssom: "CSSMediaRule",
    name: "@media",
    prelude: "<media-query-list>",
    type: "rule",
    value: {
      name: "<rule-list>",
      rules: [],
      type: "arbitrary",
    },
  },
  {
    cssom: "CSSNamespaceRule",
    name: "@namespace",
    prelude: "<namespace-prefix>? [<string> | <url>]",
    type: "rule",
  },
  {
    cascading: true,
    cssom: "CSSPageRule",
    deferDeclarations: true,
    elemental: true,
    name: "@page",
    prelude: "<page-selector-list>?",
    type: "rule",
    value: {
      descriptors: descriptorDefinitions["@page"],
      name: "<declaration-rule-list>",
      properties: page,
      rules: [
        {
          cascading: true,
          cssom: "CSSMarginRule",
          deferDeclarations: true,
          elemental: true,
          name: "@margin",
          names: [
            "@bottom-center",
            "@bottom-left",
            "@bottom-left-corner",
            "@bottom-right",
            "@bottom-right-corner",
            "@left-bottom",
            "@left-middle",
            "@left-top",
            "@right-bottom",
            "@right-middle",
            "@right-top",
            "@top-center",
            "@top-left",
            "@top-left-corner",
            "@top-right",
            "@top-right-corner",
          ],
          type: "rule",
          value: {
            descriptors: {
              "page-margin-safety": descriptorDefinitions["@page"]["page-margin-safety"],
            },
            name: "<declaration-list>",
            properties: pageMargin,
            shorthands: new Map([...shorthands].filter(([name]) => pageMargin[name])),
            type: "arbitrary",
          },
        },
      ],
      shorthands: new Map([...shorthands].filter(([name]) => page[name])),
      type: "arbitrary",
    },
  },
  {
    cssom: "CSSPositionTryRule",
    deferDeclarations: true,
    elemental: true,
    name: "@position-try",
    prelude: "<dashed-ident>",
    type: "rule",
    value: {
      name: "<declaration-list>",
      properties: positionTry,
      shorthands: new Map([...shorthands].filter(([name]) => positionTry[name])),
      type: "arbitrary",
    },
  },
  {
    cssom: "CSSPropertyRule",
    name: "@property",
    prelude: "<custom-property-name>#",
    type: "rule",
    value: {
      descriptors: descriptorDefinitions["@property"],
      name: "<declaration-list>",
      type: "arbitrary",
    },
  },
  {
    cascading: true,
    cssom: "CSSScopeRule",
    elemental: true,
    name: "@scope",
    prelude: "<scope-boundaries>?",
    type: "rule",
    value: {
      name: "<block-contents>",
      properties: propertyDefinitions,
      rules: [],
      shorthands,
      type: "arbitrary",
    },
  },
  {
    cssom: "CSSStartingStyleRule",
    name: "@starting-style",
    type: "rule",
    value: {
      name: "<rule-list>",
      rules: [],
      type: "arbitrary",
    },
  },
  styleRule,
  {
    cssom: "CSSSupportsRule",
    name: "@supports",
    prelude: "<supports-condition>",
    type: "rule",
    value: {
      name: "<rule-list>",
      rules: [],
      type: "arbitrary",
    },
  },
  {
    cssom: "CSSViewTransitionRule",
    name: "@view-transition",
    type: "rule",
    value: {
      descriptors: descriptorDefinitions["@view-transition"],
      name: "<declaration-list>",
      type: "arbitrary",
    },
  },
];
const styleSheetRules = topLevelRules.filter(
  ({ name }) => name !== "@import" && name !== "@namespace",
);

// Define conditional rules inside @function
conditionalRuleNames.forEach((name) =>
  functionRule.value.rules.push({
    ...styleSheetRules.find((rule) => rule.name === name),
    elemental: true,
    value: functionRule.value,
  }),
);

// Define group rules inside style rules and at the top-level
groupRuleNames.forEach((name) => {
  const rule = styleSheetRules.find((candidate) => candidate.name === name);
  // Skip @layer statement
  if (name === "@layer" && !rule.value) {
    return;
  }
  // Nested in style rules
  if (name === "@style") {
    styleRule.value.rules.push(nestedStyle);
    return;
  }
  styleRule.value.rules.push({
    ...rule,
    cascading: true,
    elemental: true,
    value: styleRule.value,
  });
  // At the top-level
  if (name === "@scope") {
    rule.value.rules.push(
      nestedStyleDeclarationsRule,
      nestedStyle,
      ...styleSheetRules.filter((candidate) => candidate !== styleRule),
    );
  } else {
    rule.value.rules.push(...styleSheetRules);
  }
});
module.exports = {
  name: "@sheet",
  type: "rule",
  value: {
    name: "<rule-list>",
    rules: topLevelRules,
    type: "arbitrary",
  },
};
