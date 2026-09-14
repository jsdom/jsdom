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

Repeat the probe in separate processes for every revision and compare medians. Small or negative deltas can reflect garbage-collection noise. This measures incremental retained heap, not total DOM memory, peak allocation, RSS, or whether removed nodes can be collected.
