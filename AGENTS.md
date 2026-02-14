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

```sh
npm run test:wpt -- --fgrep "some-test.htm" 2>&1 | tail -15   # Can't see error
npm run test:wpt -- --fgrep "some-test.htm" 2>&1 | tail -30   # Still can't see it
npm run test:wpt -- --fgrep "some-test.htm" 2>&1              # Finally see it - wasted 2 runs!
```

**Correct approach:**

```sh
npm run test:wpt -- --fgrep "some-test.htm" 2>&1              # Just run it, no pipes
```

* `npm run test:api`: relatively quick to run, mostly tests the jsdom API. Often worth running since it will quickly blow up if things are broken.

* `npm run test:wpt`: very slow (~15 minutes). Should generally only be run with user signoff, or with targeted `-- --fgrep`.

* `npm run test:tuwpt`: slower, so run sparingly. Tests a subset of the web platform implementation that we've specifically crafted tests for. Worth running once in its entirety as a final check to establish everything is working before turning over control to the user.

All these commands can be restricted to specific tests, e.g. `npm run test:tuwpt -- --fgrep css-borders` or `npm run test:wpt -- --fgrep WebSocket/readyState/006.html`. It is often best to run a single test in that latter fashion while iterating, before finally running a larger suite like `npm run test:wpt -- --fgrep xhr` or `npm run test:tuwpt`.

**IMPORTANT:** The `--fgrep` value is a plain substring match against test titles, NOT a file path. Do not include trailing slashes (e.g. use `--fgrep xhr`, not `--fgrep "xhr/"`).

## npm scripts

Always use the project's npm scripts rather than running tools directly. Use `npm run lint` instead of `npx eslint`, `npm run test:api` instead of `npx mocha test/api`, etc. The scripts have specific configurations.

## Coding style

Avoid overly-defensive coding:

* Don't blindly insert optional chaining (`?.`). Think about whether the value can actually be null/undefined; if not, access it directly.

* Don't add guards to prevent double promise resolution. Resolving a promise a second time is a no-op by design.

* Don't add error handling for scenarios the framework already handles.

When adding new code, look at how similar things are done elsewhere in the codebase first. This helps match style and avoid lint issues.

## Writing tests

Avoid millisecond delays in tests. Try to make tests deterministic:

* Sequence events using promise chains where you control when promises resolve, rather than using arbitrary `setTimeout` delays.

* If a test naturally fails by timing out (because something never happens), rely on the test harness's generic timeout rather than adding artificial timeouts in the test code.

When investigating issues raised by the user, try to write a failing test first, before changing any code. If you can't get a test to fail, then escalate to the user for discussion before proceeding.
