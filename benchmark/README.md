# HTMLCollection benchmarks

Run the original named-access cases and the size/name matrix together:

```sh
npm run benchmark -- --suite dom/html-collection-named-access --format markdown
```

Use `npm run benchmark:json -- --suite dom/html-collection-named-access` for machine-readable per-suite results.

The matrix uses 10, 100, 500, and 2,000 elements with no names, distinct IDs and names (two keys per element), or duplicate IDs and names (two keys for the entire collection). These profiles describe the initial fixture; mutation cases can introduce or replace names on the first element.

Fixtures are prepared once per task's warmup or measurement phase. An initial length read materializes the backing list and any named cache before unchanged-collection measurements. Each mutation and fresh-collection operation includes its invalidation and rebuild costs in the measured time. The borrowed-method case retrieves the method from the interface prototype to avoid the extra named lookup involved in retrieving it from the collection.

The original suite retains its per-sample fixture setup. Its results include the first named-cache construction within each sample, even for tasks that perform repeated reads. Both suites are useful, but their setup differs intentionally.

## Retained memory

Run the memory probe in a fresh process, for example:

```sh
npm run benchmark:collection-memory -- --size 2000 --collections 50 --names distinct
```

The name profiles are `none`, `distinct`, and `duplicate`. The probe measures the retained JavaScript heap change after reading each collection's length once, with its DOM and backing list already materialized. It forces garbage collection before and after the reads, and keeps all collections reachable throughout. Output is JSON, including total bytes and bytes per collection.

Repeat the probe in separate processes for every revision and compare medians. Small differences can reflect garbage-collection noise. Net deltas can also include changes in string representation, so they do not directly give the size of the cache. This measures incremental retained heap, not total DOM memory, peak allocation, RSS, or whether removed nodes can be collected.

Use `--prime-name-keys` as a control: before the first heap measurement, the probe inserts all ID and name values into a temporary Set and then discards it. This primes string-key processing without reading a string property on the collection or constructing its named cache. Compare both modes to distinguish key-processing effects from the retained cost after priming.

## Other collection bindings

Run `npm run benchmark:json -- --suite dom/collection-binding-overheads` to compare `element.children`, `form.elements`, `select.options`, and `element.attributes`. These cases cover empty, one-item, and 1,000-item collections, including inherited interface members and implementations whose named lookups are already inexpensive. Element collections have distinct IDs and names; attribute collections have distinct attribute names. Fixtures and the initial length read are outside the measured operations.

Run `npm run benchmark:json -- --suite api/context-creation` to measure creating and closing windows with `runScripts: "outside-only"` in isolation from the other constructor workloads.
