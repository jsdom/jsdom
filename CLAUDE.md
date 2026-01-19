# Agent guidelines for working on jsdom

## Running tests

The jsdom project has several relevant test suites. They largely divide into testing the jsdom API, versus the web platform implementation. Most of the test suites are slow, so we need to be deliberate about how and when we run them to avoid wasting time and context window space.

You almost never want to run the full `npm test` command, since it's too slow (takes ~25 minutes).

**CRITICAL: Never pipe test output through `| head`, `| tail`, or `| grep`.** You repeatedly make this mistake, truncating test output and losing critical information. This wastes expensive WPT test runs.

**What you keep doing wrong:** Running a test with `| tail -15`, not seeing the error, then running with `| tail -30`, still not seeing it, then running again without pipes. This wastes 3 test runs when 1 would suffice.

**Correct approach:**
1. **For single WPT tests**: Run without any piping. The output fits in context.
2. **For test suites**: Write to a temp file first, then examine it.

**Example of WRONG approach (do not do this):**
```
npm run test:wpt -- --fgrep "some-test.htm" 2>&1 | tail -15   # Can't see error
npm run test:wpt -- --fgrep "some-test.htm" 2>&1 | tail -30   # Still can't see it
npm run test:wpt -- --fgrep "some-test.htm" 2>&1              # Finally see it - wasted 2 runs!
```

**Correct approach:**
```
npm run test:wpt -- --fgrep "some-test.htm" 2>&1              # Just run it, no pipes
```

* `npm run test:api`: relatively quick to run, mostly tests the jsdom API. Often worth running since it will quickly blow up if things are broken.

* `npm run test:tuwpt`: slower, but still relatively quick. Tests a subset of the web platform implementation that we've specifically crafted tests for. Often `npm run test:api` plus `npm run test:tuwpt` is enough to establish everything is working.

* `npm run test:wpt`: very slow (~15 minutes). Should generally only be run with user signoff, or with targeted `-- --fgrep`.

All these commands can be restricted to specific tests, e.g. `npm run test:tuwpt -- --fgrep css-borders` or `npm run test:wpt -- --fgrep WebSocket/readyState/006.html`. It is often best to run a single test in that latter fashion while iterating.
