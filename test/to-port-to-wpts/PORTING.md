# Porting scratchpad for test/to-port-to-wpts/

Working document for AI agents (or humans) porting legacy jsdom tests to web
platform test format. Delete this file once all porting is complete.

Each file here should be resolved by converting to WPT (placing the result in
`test/web-platform-tests/to-upstream/`), moving to `test/api/`, or deleting
as redundant with passing upstream WPTs.

## Conventions

When porting, prefer enabling upstream WPT coverage over writing new tests:

1. If the upstream test fully passes, enable it (or its DIR) in `to-run.yaml`
   and delete the legacy test.
1. If the upstream test partially passes, use per-subtest failure expectations
   in `to-run.yaml`:

   ```yaml
   some-test.html:
     "Subtest name that fails": [fail, Reason]
     "Another failing subtest": [fail, Reason]
   ```

   Subtests not listed are expected to pass.
1. If the upstream test fails entirely (e.g., a shared JS file fetches a
   missing resource), create a `*-dont-upstream.html` file in `to-upstream/`
   that tests the passing subset. Include an HTML comment identifying which
   upstream test it duplicates. Delete it once the upstream test passes.
1. Only create a regular to-upstream test when the behavior is genuinely not
   covered upstream.

## Completed

Each original file below has been deleted. The per-behavior analyses show
the verification methodology to follow for remaining files: for each
behavior in the original test, find the specific passing upstream test that
covers it, then decide whether to delete, create dont-upstream, partially
enable, or write a new to-upstream test.

### level3/textContent.js (29 lines, 1 test)

Upstream `dom/nodes/Node-textContent.html` (60+ subtests, passing) covers
setting textContent on a Text node and reading it back. Deleted.

### class-list.js (259 lines, 21 tests)

Upstream `dom/nodes/Element-classlist.html` (passing, no to-run.yaml
override) covers add/remove/toggle/contains/replace/item/toString, error
cases (empty string, whitespace), duplicate handling, across HTML/XHTML/
MathML/XML/custom namespace elements. 3 WebIDL-level properties
(constructor identity, same-object return, readonly length) are covered by
upstream `dom/idlharness.window.html?exclude=Node`, which fails because it
depends on fetch.

- Created `dom/lists/DOMTokenList-idl-dont-upstream.html` (3 subtests).

### current-script.js (27 lines, 1 test)

Upstream `Document.currentScript.html` is fail-slow (complex async subtests
involving iframes, XHR, cross-origin scripts). Original tested external
script loading with instanceof, .src, and null-after-load checks.

- Created `Document-currentScript-inline-dont-upstream.html` (2 subtests):
  currentScript is HTMLScriptElement during inline script, null after.
- Created `Document-currentScript-external-dont-upstream.html` (2 subtests):
  currentScript is HTMLScriptElement during external script, .src correct.

### dom-implementation.js (74 lines, 7 tests)

Created `DOMImplementation-createDocument-no-browsing-context.html`
(5 subtests) for behaviors not in upstream: illegal constructor, defaultView
null, proxied event handlers null without a window, iframe not loading.
3 tests dropped, verified covered by passing upstream tests:

- "create an empty document" (childNodes.length === 0): upstream
  `DOMImplementation-createDocument.html` asserts childNodes.length for
  null qualifiedName + null doctype cases.
- "doctype child of ownerDocument": upstream
  `DOMImplementation-createDocument.html` asserts doc.doctype ===
  doctype and doc.doctype.ownerDocument === doc.
- "createHTMLDocument().location === null": upstream
  `DOMImplementation-createHTMLDocument.html` explicitly tests
  doc.location === null.

### location.js (109 lines, 8 tests)

DIR `html/browsers/history/the-location-interface` enabled in to-run.yaml
(~36 tests passing, ~33 fail/fail-slow/timeout). Per-behavior coverage:

- `document.location === window.location`: `document_location.html`
  (passing).
- `location.href` default / `location.port` for about:blank: not directly
  testable in WPTs (they run over http). `location_href.html` and
  `location_port.html` test http URL parsing.
- Hash manipulation (href += "#hash", hash = "#baz"): `location_hash.html`
  now has per-subtest expectations — only the srcdoc subtest fails, 5 pass.
  Also `location-hash-setter-empty-string.html` (passing to-upstream).
- About:blank hash (GH-1289): created `location-hash-about-blank.html`.
- Hashchange events (firing, oldURL/newURL): upstream
  `hashchange_event.html` (passing) covers hash setter firing hashchange
  with correct oldURL/newURL, bubbles, cancelable, instanceof.
- All URL component getters: `location_href.html`, `location_origin.html`,
  `location_protocol.html`, `location_host.html`, `location_hostname.html`,
  `location_port.html`, `location_pathname.html`, `location_search.html`
  (all passing).

### history.js (202 lines, 5 tests)

DIR `html/browsers/history/the-history-interface` enabled (~70 passing,
~35 fail/fail-slow/timeout). Note: `001.html` and `002.html` are fail-slow
(SKIPPED), `004.html` is fail. Per-behavior coverage:

- Default state/length: `008.html` (passing).
- pushState with URL/state/length: `history_pushstate.html`,
  `history_pushstate_url.html` (passing).
- replaceState: `history_replacestate.html` (passing).
- Relative URL in pushState: `pushstate-base.html` (passing).
- back/forward/go + popstate: `history_back.html`,
  `history_forward.html`, `history_go_minus.html`,
  `history_go_plus.html`, `005.html`, `007.html` (all passing).
- **Minor gaps**: pushState when index < length truncates forward entries
  (not explicitly verified by a passing upstream test); 2-macrotask async
  timing for back() (jsdom-specific implementation detail).

### level2/events.js (455 lines, 27 tests)

DIR `dom/events` enabled. Per-behavior coverage (all citing passing
upstream tests):

- createEvent + initEvent: `Event-initEvent.html`.
- addEventListener/removeEventListener with capture:
  `EventListenerOptions-capture.html`.
- Duplicate listener registration: `handler-count.html`.
- Registered twice, removed once = fully gone: `handler-count.html`.
- Remove with wrong capture flag = not removed: `handler-count.html`.
- Two listeners removing each other during dispatch:
  `remove-all-listeners.html`, `Event-dispatch-handlers-changed.html`.
- Event phases (capture/at-target/bubble): `Event-dispatch-order.html`.
- Non-bubbling event: `Event-propagation.html`.
- stopPropagation: `Event-stopPropagation-cancel-bubbling.html`,
  `Event-propagation.html`.
- preventDefault/defaultPrevented:
  `Event-defaultPrevented.html`,
  `EventTarget-dispatchEvent-returnvalue.html`.
- dispatchEvent return value: `EventTarget-dispatchEvent-returnvalue.html`.
- Dispatch uninitialized event throws: `Event-dispatch-redispatch.html`.
- Remove listener in handler: `Event-dispatch-handlers-changed.html`.
- dispatchEvent(null) throws / createEvent classes:
  `EventTarget-dispatchEvent.html`, now partially enabled (only
  DragEvent/TextEvent subtests fail).

All 27 original behaviors fully covered.

### selectors.js (202 lines, 7 tests)

Partially covered by existing
`ParentNode-querySelector-All-dont-upstream.html` (runs upstream
`selectors.js` valid/invalid selector suites) and by `css/selectors/`.
Created 6 to-upstream tests for patterns not covered elsewhere:

- `ParentNode-querySelector-last-child-combinator.html` — GH-972:
  `div:last-child > span[title]`.
- `ParentNode-querySelector-empty-attribute-value.html` — GH-1163:
  `[title='']` and compound `[title][title='']`.
- `ParentNode-querySelector-invalid-comment-like.html` — GH-1214:
  garbage selector containing `//` throws SyntaxError.
- `ParentNode-querySelector-matches.html` — Element.matches() with
  ancestor ID selectors, `:not()`, non-matching selectors.
- `ParentNode-querySelector-orphan-scope.html` — querySelectorAll
  scoping on orphaned elements.
- `ParentNode-querySelector-argument-stringification.html` —
  querySelector with Array and custom toString() arguments.

### non-document-type-child-node.js (114 lines, 6 tests)

Upstream only covers previousElementSibling/nextElementSibling on Element
nodes. Created `NonDocumentTypeChildNode-sibling-element.html`
(6 subtests) covering Text, Comment, and Element nodes. Exact 1:1 match.

### message-event.js (33 lines, 2 tests)

Upstream `messageevent-constructor.https.html` partially enabled
(5 passing, 4 fail on MessageChannel/ServiceWorker). Created
`MessageEvent-constructor-dont-upstream.html` (2 subtests) for read-only
type and data properties.

### node-clone-node.js (135 lines, ~8 tests)

Upstream `Node-cloneNode.html` (passing) covers cloning text, comment,
doctype, and fragment nodes, plus deep vs shallow semantics. Created
`Node-cloneNode-parser-created-names.html` (2 subtests) for cloning
elements with colon/angle-bracket names from malformed HTML. One minor
gap: deep document cloning isn't explicitly tested upstream (shallow
document clones are), but the clone algorithm is node-type-agnostic.

### parent-node.js (131 lines, 12 tests)

Upstream `ParentNode-children.html` only covers .children, not
firstElementChild/lastElementChild/childElementCount. Created
`ParentNode-properties.html` (12 subtests) on Document, Element, and
DocumentFragment. Added namedItem assertions (upstream doesn't test
namedItem on Document.children).

### query-selector.js + query-selector-all.js (88 lines, 6 tests)

Covered by existing `ParentNode-querySelector-All-dont-upstream.html`
plus `ParentNode-querySelector-argument-stringification.html` (created
as part of selectors.js).

### htmlelement.js (83 lines, 3 tests)

Upstream `html/semantics/interfaces.html` tests all elements but is not
enabled (DIR too broad). Created
`html/semantics/element-type-dont-upstream.html` (23 subtests).

### htmlinputelement.js (161 lines, 6 tests)

Created `input-value-dirty-flag.html` (5 subtests) for dirty value flag,
dirty checkedness, and type reflection. Dropped radio button test
(~50 lines) — verified covered by upstream `radio.html` (basic
unchecking, form owner change, name change) and `radio-morphed.html`
(type change unchecking).

### inline-event-handlers.js (188 lines, 10 tests)

Upstream `event-handler-attributes-body-window.html` and
`event-handler-attributes-windowless-body.html` fail entirely because
their shared `event-handler-body.js` fetches `/interfaces/html.idl`.
Created `inline-event-handler-semantics-dont-upstream.html`
(11 subtests) covering inline handler scope, return values, event
argument, onerror five arguments, proxied body/window handlers, and
windowless document handlers.

### htmlanchorelement.js (17 lines, 1 test)

Moved to `test/api/from-outside.js` — tests file: URL resolution, which
cannot be a WPT (WPTs run over http).

## Remaining: ready to port

- **on-error.js** (191 lines, 7+ tests) —
  `window.onerror` catching exceptions from event handlers, inline scripts,
  setTimeout. Upstream `event-handler-processing-algorithm-error/` exists.
  The `todo()` calls and `toFileUrl` usage complicate direct conversion.

- **namespaces.js** (146 lines, 4 tests) —
  Namespace properties (prefix, localName, namespaceURI) on HTML/SVG
  elements. Uses `readTestFixture`. Convert using inline HTML/SVG instead.

- **parsing.js** (338 lines, ~28 tests) —
  HTML parsing regression tests. One test uses `readTestFixture`, one uses
  `dom.serialize()`. The rest use innerHTML/outerHTML.

- **script.js** (105 lines, 5 tests) —
  Script execution: shared globals, `window === this`, timer execution.
  Uses `toFileUrl`; external script test needs a support file.

## Remaining: need human decision

- **post-message.js** (147 lines, 7 tests) —
  postMessage between frames using `injectIFrame`/`injectIFrameWithScript`
  jsdom utilities. May need to stay as test/api/.

- **serialization.js** (36 lines, 3 tests) —
  Tests 1 and 3 use outerHTML (easy WPT). Test 2 uses `dom.serialize()`
  (jsdom API).

- **xml.js** (65 lines, 6 tests) —
  XML parsing/serialization using jsdom's `contentType` option and
  `dom.serialize()`. Most could use DOMParser/XMLSerializer instead.

- **frame.js** (506 lines, ~20 tests) —
  iframe loading, contentDocument, contentWindow, frames[]. Standard
  behavior but complex conversion. Simpler tests are good WPT candidates.

- **jsonp.js** (36 lines, 1 test) —
  JSONP via jQuery from disk. Integration test, not really a web platform
  feature. Probably delete or move to test/api/.

- **htmlcanvaselement.js** (169 lines) —
  Basic element tests are WPT-convertible; rendering tests depend on the
  optional `canvas` npm package.

- **htmlimageelement.js** (124 lines) —
  Basic Image constructor is WPT-convertible; loading tests depend on
  `canvas`.

- **node-iterator.js** (720 lines, ~28 tests) —
  Upstream `NodeIterator.html` passes (basics) but `NodeIterator-removal.html`
  fails. The ~15 removal step tests need a to-upstream WPT. Large effort.

- **misc.js** (439 lines) — needs per-test triage.

- **misc2.js** (603 lines) — needs per-test triage.

## Remaining: not portable to WPT

- **level3/xpath.js** (2,482 lines, 162 tests) —
  Tests jsdom's internal XPath implementation by directly requiring
  `lib/jsdom/level3/xpath`. Move to test/api/.

## Remaining: large legacy DOM conformance suites

Auto-generated from W3C DOM conformance test suites. Many are likely covered
by upstream WPTs in `dom/nodes/`, `dom/collections/`, etc. Leave for last.

- **level1/core.js** (13,979 lines, ~378 tests)
- **level1/html.js** (5,704 lines, ~188 tests)
- **level2/core.js** (6,603 lines, ~186 tests)
- **level2/html.js** (18,358 lines, ~678 tests)
- **level2/style.js** (355 lines, 24 tests)

## Support files

Clean up as associated tests are resolved:

- `files/` — HTML fixtures, JS helpers, images
- `jquery-fixtures/` — jQuery libraries for jsonp.js
- `level1/core/files/`, `level1/html/files/` — fixture generators
- `level2/core/files/` — fixture generators
- `level2/html/files/` — 50+ HTML fixture files
- `level2/style/` — CSS fixture files
