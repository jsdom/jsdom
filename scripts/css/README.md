# CSS data generation

Run `npm run prepare` after changing the data dependencies or generators. Outputs live in `lib/generated/` and should not be edited directly.

[`generate-css-data.mjs`](../generate-css-data.mjs) combines three build dependencies:

- `@webref/css` supplies the property catalog and metadata, including initial values, inheritance, and logical property groups.
- `css-tree/definition-syntax-data` supplies grammars, updated by `@csstools/css-syntax-patches-for-csstree`.
- Webref supplies missing grammars and a few newer definitions selected in the generator.

Parsing and validation at runtime use jsdom's own implementation. These packages supply data only.

The override files in this directory contain parser-specific productions, compatibility choices, missing metadata, and feature exclusions. Prefer updating the upstream data dependencies to adding an override, and remove overrides when upstream data makes them unnecessary. Rule contexts and shorthand algorithms live in `lib/jsdom/living/css/`.

Excluded properties are omitted from both parsing and generated CSSOM accessors. Excluded value types receive a `false` grammar so they can appear as unsupported alternatives inside otherwise supported productions. An absent definition is an implementation error. New grammar data alone does not implement features that need additional algorithms.

The build first generates grammar tables and CSS declaration IDL, then the Web IDL wrappers. It next uses the CSS parser to canonicalize and parse initial values (`null` represents the guaranteed-invalid value), and finally compiles the default stylesheet. This order lets the generated data use the same parser as authored CSS.

The default stylesheet's source is `lib/jsdom/browser/default-stylesheet.css`. Keep HTML rules in specification order and preserve their source formatting; rules from other specifications go at the end.

[`generate-dom-data.mjs`](../generate-dom-data.mjs) separately generates bidirectional character ranges from `@unicode/unicode-17.0.0` and language mappings from `language-subtag-registry`. Update those packages instead of maintaining local character or language tables. Notices for redistributed source and generated data are in the root [LICENSE.txt](../../LICENSE.txt).
