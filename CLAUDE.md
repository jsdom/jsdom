# Agent guidelines for working on jsdom

## Running tests

The jsdom project has several relevant test suites. They largely divide into testing the jsdom API, versus the web platform implementation. Most of the test suites are slow, so we need to be deliberate about how and when we run them to avoid wasting time and context window space.

You almost never want to run the full `npm test` command, since it's too slow (takes ~25 minutes).

You often make the mistake of running the tests once, using `| grep` or `| head`, and then realizing this did not give you enough information, so then running it again with different `| grep` or `| head` patterns. Avoid this temptation to false economy. Consider just looking at the full output instead, without `| grep` or `| head`; this will usually use less tokens, in the end. Or writing the full output to a file, and then using such commands to inspect it.

* `npm run test:api`: relatively quick to run, mostly tests the jsdom API. Often worth running since it will quickly blow up if things are broken.

* `npm run test:tuwpt`: slower, but still relatively quick. Tests a subset of the web platform implementation that we've specifically crafted tests for. Often `npm run test:api` plus `npm run test:tuwpt` is enough to establish everything is working.

* `npm run test:wpt`: very slow (~15 minutes). Should generally only be run with user signoff, or with targeted `-- --fgrep`.

All these commands can be restricted to specific tests, e.g. `npm run test:tuwpt -- --fgrep css-borders` or `npm run test:wpt -- --fgrep WebSocket/readyState/006.html`. It is often best to run a single test in that latter fashion while iterating.
