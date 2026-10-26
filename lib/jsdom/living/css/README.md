# CSS implementation

This directory implements CSS parsing, selector matching, CSSOM, and computed styles.

- `*-impl.js` and `.webidl` files expose CSSOM through jsdom's generated wrappers.
- `parse/` handles tokenization, grammar matching, and shorthand expansion. `rules/`, `properties/`, `descriptors/`, and `values/` supply definitions and algorithms that complement the [generated grammar data](../../../../scripts/css/README.md).
- `match/` evaluates selectors and conditional rules against DOM state.
- `resolve.js` handles the cascade and computed values; `serialize.js` turns parsed values into CSS text, including shorthand reconstruction.
- `helpers/` connects these pieces to DOM selector APIs, stylesheet loading, and `getComputedStyle()`.

Internal callers needing one computed property should use `getComputedStylePropertyValue(element, property)` from `helpers/computed-style.js`. It shares the resolver's cache without creating a public declaration object. Computed declarations resolve properties lazily and remain live across mutations.

DOM mutations invalidate element styles through the document's `_clearStyleCache()` method. Layer order and property registrations survive when their recorded media conditions still match; those conditions are rechecked once per style generation. Their tree scopes are weakly held so detached shadow roots are not retained.

CSSOM writes use `invalidateStyle()` in `utils/style.js` to invalidate the stylesheet's matching plan and call the document's `_clearStyleSheetCache()` method, which discards both stylesheet metadata and element styles. Adding or removing a stylesheet also uses this broader invalidation path.

Shared parser caches and generated syntax must not retain documents, elements, or realms. Keep ownership and environment-dependent results in CSSOM objects or document style state.

`ParseErrorInfo` records represent rejected grammar alternatives, which occur even while parsing valid CSS. API boundaries create exceptions when required. `NestingLimitError` is a thrown exception for the parser's resource limit.

Source credits and third-party license notices are in the root [LICENSE.txt](../../../../LICENSE.txt).
