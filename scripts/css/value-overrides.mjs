import syntaxData from "css-tree/definition-syntax-data";

// These upstream productions belong to unsupported feature families.
// An explicit false definition rejects
// them without copying the surrounding grammars or hiding missing definitions.
export const excludedValues = new Set([
  "<calc-interpolate()>",
  "<color-interpolate()>",
  "<content()>",
  "<custom-color-space>",
  "<custom-params>",
  "<cycle()>",
  "<device-cmyk()>",
  "<first-valid()>",
  "<interpolate()>",
  "<leader()>",
  "<pointer()>",
  "<running()>",
  "<string()>",
  "<supports-condition-name>",
  "<target>",
  "<transform-interpolate()>",
  "<transform-mix()>"
]);

// Parser-specific productions and deliberate differences from the upstream grammars.
// CSS-wide keywords in multiword font names: https://github.com/w3c/csswg-drafts/issues/13692
export const valueOverrides = {
  // CSSWG requires the alpha argument; the published grammar still makes it optional.
  // https://github.com/w3c/csswg-drafts/issues/14070#issuecomment-5202934726
  "<alpha()>": "alpha(from <color> / [<alpha-value> | alpha | none])",
  // Keep the fallback after both unordered arguments.
  // https://github.com/w3c/csswg-drafts/issues/10317
  "<anchor()>": "anchor([<anchor-name>? && <anchor-side>], <length-percentage>?)",
  "<anchored-feature>": "<media-feature>",
  "<attr-unit>": "<custom-ident> | '%'",
  // Grid Level 2 requires fixed sizes in automatic repetition.
  // https://drafts.csswg.org/css-grid-2/#auto-repeat
  "<auto-repeat>": syntaxData.types["auto-repeat"],
  "<boolean-expr-group>": "<test> | (<boolean-expr[<test>]>) | <general-enclosed>",
  "<conic-gradient-syntax>": "[[[from [<angle> | <zero>]]? [at <position>]?]! || " +
    "<color-interpolation-method>]? , <angular-color-stop-list>",
  "<custom-function-definition>": "<function-token> <function-parameter>#? ) [returns <css-type>]?",
  "<custom-ident>": "<ident>",
  "<custom-property-name>": "<dashed-ident>",
  "<dashed-function>": {
    name: "<dashed-function>",
    type: "non-terminal",
    value: {
      name: "<dashed-ident>",
      type: "function",
      value: "<declaration-value>#?"
    }
  },
  "<dashed-ident>": "<custom-ident>",
  "<font-family-name>": "<string> | <ident-token>+",
  // A union of disjoint ranges would clamp a calculation to the first range.
  // The grid-line validator rejects literal zero after matching the whole value.
  "<grid-line>": "auto | <custom-ident> | <integer> && <custom-ident>? | span && [<integer " +
    "[1,∞]> || <custom-ident>]",
  "<hex-color>": "<hash-token>",
  // Route these functions through the shared RGB/HSL argument recognizer.
  "<hsl()>": "hsl(<hsl-arguments>)",
  "<hsla()>": "hsla(<hsl-arguments>)",
  // Try full conditions before the bare-feature recognizer, which commits to feature validation.
  "<if-test>": "supports(<ident> : <declaration-value> | <supports-condition>) | " +
    "media(<media-condition> | <media-feature>) | style(<style-query>)",
  "<level>": "<number-token>",
  // Preserve the SVG 2 paint grammar until the newer fill/stroke model is implemented.
  // https://svgwg.org/svg2-draft/painting.html#SpecifyingPaint
  "<paint>": syntaxData.types.paint,
  // Browsers reject negative literal polygon rounding radii.
  // https://github.com/w3c/csswg-drafts/issues/14623
  "<polygon()>": "polygon(<'fill-rule'>? [round <length [0,∞]>]? , [<length-percentage> <length-percentage>]#)",
  "<progress()>": "progress(no-clamp? , <calc-sum> , <calc-sum> , <calc-sum>)",
  "<pseudo-class-selector>": ": <ident-token> | : <function-token> <any-value>? )",
  "<query-in-parens>": "(<container-query>) | (<size-feature>) | anchored(<anchored-query>) | " +
    "style(<style-query>) | scroll-state(<scroll-state-query>) | " +
    "<general-enclosed>",
  "<quirky-color>": "<number-token> | <ident-token> | <dimension-token>",
  "<quirky-length>": "<number-token>",
  "<radial-gradient-syntax>": "[[[<radial-shape> || <radial-size>]? [at <position>]?]! || " +
    "<color-interpolation-method>]? , <color-stop-list>",
  "<radial-radius>": "closest-side | farthest-side | <length-percentage [0,∞]>",
  "<radial-size>": "closest-corner | farthest-corner | <radial-radius>{1,2}",
  "<rgb()>": "rgb(<rgb-arguments>)",
  "<rgba()>": "rgba(<rgb-arguments>)",
  "<scope-end>": "<relative-real-selector-list>",
  "<scroll-state-feature>": "<media-feature>",
  "<single-transition>": "<time> || <easing-function> || <time> || <transition-behavior-value> || " +
    "[none | <single-transition-property>]",
  "<size-feature>": "<media-feature>",
  "<style-feature-name>": "<ident>",
  // Preserve commas and braces as declaration-value content.
  // https://github.com/w3c/csswg-drafts/issues/14619
  "<style-feature-plain>": "<declaration>",
  "<style-range-value>": "<custom-property-name> | <number> | <percentage> | <dimension>",
  "<supports-import-condition>": "supports(<supports-condition> | <declaration> | <any-value>)",
  "<timeline-range-name>": "contain | cover | entry | entry-crossing | exit | exit-crossing | fill | fit | scroll",
  "<urange>": "u '+' <ident-token> '?'* | u <dimension-token> '?'* | u <number-token> '?'* " +
    "| u <number-token> <dimension-token> | u <number-token> <number-token> | u " +
    "'+' '?'+",
  "<url-modifier>": "<request-url-modifier> | <param()> | <ident> | <function-token> <any-value>? )",
  "<url-set>": "<image-set()>",
  "<zero>": "<number-token>"
};
