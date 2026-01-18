# Agent guidelines for working on jsdom

## Running tests

The jsdom project has several relevant test suites. They largely divide into testing the jsdom API, versus the web platform implementation. Most of the test suites are slow, so we need to be deliberate about how and when we run them to avoid wasting time and context window space.

You almost never want to run the full `npm test` command, since it's too slow (takes ~25 minutes).

**IMPORTANT: Never pipe test output through `| head`, `| tail`, or `| grep`.** You repeatedly make this mistake, truncating test output and losing critical information. Instead:

1. **For full test suites**: Write output to a file, then read/inspect it:
   ```
   npm run test:wpt -- --fgrep xhr 2>&1 > /tmp/xhr-tests.txt
   ```
   Then use the Read tool to examine the file, or use `grep`/`head`/`tail` on the saved file.

2. **For single tests**: Just run them directly without any piping - the output is small enough.

3. **Never do this**: `npm run test:wpt -- --fgrep xhr 2>&1 | tail -100` - this loses the summary and/or the error details.

This avoids the false economy of running tests multiple times with different pipe patterns to get the information you needed from the start.

* `npm run test:api`: relatively quick to run, mostly tests the jsdom API. Often worth running since it will quickly blow up if things are broken.

* `npm run test:tuwpt`: slower, but still relatively quick. Tests a subset of the web platform implementation that we've specifically crafted tests for. Often `npm run test:api` plus `npm run test:tuwpt` is enough to establish everything is working.

* `npm run test:wpt`: very slow (~15 minutes). Should generally only be run with user signoff, or with targeted `-- --fgrep`.

All these commands can be restricted to specific tests, e.g. `npm run test:tuwpt -- --fgrep css-borders` or `npm run test:wpt -- --fgrep WebSocket/readyState/006.html`. It is often best to run a single test in that latter fashion while iterating.
