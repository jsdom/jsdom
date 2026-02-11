# Contributing to jsdom

## Mission

jsdom is, as said in our tagline, “A JavaScript implementation of many web standards.” Anything that helps us be better at that is welcome.

## Architecture

jsdom is a blend of old and new code. Some of its older and less-touched corners may look different from newer work. Here we'll describe the modern setup, but you might encounter parts of the codebase that don't fit this model, or that seem unnecessarily baroque (like the directory structure in `lib/`).

In general, a web platform class (like `Window`, or `Node`, or `Location`, or `CSSStyleSheet`) is specified using a language called [Web IDL](https://webidl.spec.whatwg.org/). Web IDL abstracts away a lot of the boilerplate involved in creating such classes, like type conversions, argument validation, and [attribute/property reflection](https://html.spec.whatwg.org/multipage/infrastructure.html#reflect).

As such, most web platform classes present in jsdom are implemented in two parts:

- An IDL file, such as [`Attr.webidl`](lib/jsdom/living/attributes/Attr.webidl), drawn more or less straight from the spec

- An implementation file, such as [`Attr-impl.js`](lib/jsdom/living/attributes/Attr-impl.js), containing the relevant implementation logic

Our build step (`npm run prepare`) then generates a public API file (e.g. `Attr.js`) which takes care of all the Web IDL-derived boilerplate, delegating to the implementation file for the important stuff. We then wire it together with a line in [`lib/jsdom/living/interfaces.js`](lib/jsdom/living/interfaces.js) that exposes the generated class on all jsdom windows.

## Contribution overview

When contributing, the first question you should ask is:

**Can I exhibit how the browsers differ from what jsdom is doing?**

If you can, then you've almost certainly found a bug in or missing feature of jsdom, and we'd love to have your contribution. In that case, move on to:

**What spec covers this potential contribution?**

In jsdom, we implement features from their web specifications. Some core ones are the [DOM Living Standard](https://dom.spec.whatwg.org/) or the [HTML Living Standard](https://html.spec.whatwg.org/multipage/). But there are many other specifications too.

You can often find the relevant specification listed at the bottom of the feature's MDN article. [https://html-now.github.io](https://html-now.github.io/) is also a pretty comprehensive list of all possible specs.

## Tests

### Running the tests

First you'll want to run `npm install` to install all dependencies. Then, configure your system to run the web platform tests as described in [their documentation](https://web-platform-tests.org/running-tests/from-local-system.html#system-setup).

**To run all the tests:** `npm test`

In the following sections, we'll give commands for running a subset of the tests. If you do that, instead of running the whole suite with `npm test`, then please run this command first:

**Before running test subsets**: `npm run pretest`

### Web platform feature tests

All tests for web platform features (as opposed to features of jsdom itself, such as the `JSDOM()` constructor) should be in [web-platform-tests](https://github.com/web-platform-tests/wpt) format. These tests are HTML files which use a special library called [testharness.js](https://web-platform-tests.org/writing-tests/testharness-api.html) to report their results.

We have some infrastructure for running these directly against jsdom documents. So ideally, when contributing a bugfix or new feature, you can browse the web-platform-tests repository and find the test covering your work, and then ensure it is being run against jsdom.

To control what tests we run against jsdom, we use [the `to-run.yaml` file](https://github.com/jsdom/jsdom/blob/main/test/web-platform-tests/to-run.yaml). It contains a variety of lines like `DIR: FileAPI` or `DIR: css/css-scoping`, which enable a directory's worth of tests. And then, underneath those lines, there are usually other lines which expect failure for or skip some tests within that directory, since we're usually not passing 100% of the tests for a directory. (You can see the full list of possible expectations for tests in the [`expectation-utils.js` file](https://github.com/jsdom/jsdom/blob/main/test/web-platform-tests/expectation-utils.js).)

So if you've found a tests in the [`web-platform-tests/wpt`](https://github.com/web-platform-tests/wpt) repository which covers the feature you're implementing, the usual procedure is to find the section of `to-run.yaml` that covers it, and remove the lines disabling those tests. Or, if there's no section in `to-run.yaml` for the directory you're working on, then add that section.

**To run all web-platform-tests:** `npm run test:wpt`

**To run specific web-platform-tests already enabled via `to-run.yaml`**: `npm run test:wpt -- --fgrep dom/events`

Also, to update web platform tests to their latest revision from the source repository: `npm run wpt:update`. (This can take a long time, like 10 minutes.)

### To-upstream web platform feature tests

Sometimes, especially when working on bug fixes, there are no web platform tests covering the specific thing you need to test. In that case, we still write our tests in the web platform tests format, but we place them in the [`to-upstream`](https://github.com/jsdom/jsdom/tree/main/test/web-platform-tests/to-upstream) directory. (It's so named because, over time, we hope to upstream these tests back to the web-platform-tests repository, so all browsers can benefit from them.) Note that you may need to create new subdirectory, paralleling the directory structure of the main [`web-platform-tests/wpt`](https://github.com/web-platform-tests/wpt) repository.

**To run the to-upstream web-platform-tests:** `npm run test:tuwpt`

**To run specific to-upstream web-platform-tests**: `npm run test:tuwpt -- --fgrep domparsing`

If you end up writing a test which passes in browsers, but you cannot get it to pass in jsdom, then it might be worthwhile submitting the test anyway, for future jsdom contributors. To do this, place the test in the appropriate part of the `to-upstream` directory as normal, and then add a line to [the `to-upstream-expectations.yaml` file](https://github.com/jsdom/jsdom/blob/main/test/web-platform-tests/to-upstream-expectations.yaml) saying that the test fails, and pointing to the issue which reports on your progress.

### jsdom API tests

If you are testing something that can only be accomplished through the jsdom API, and not inside a normal web browser, you'll want to write a different kind of test. Such tests are written using [Mocha](https://mochajs.org/).

To write such a test, simply add a file in `test/api/`, following the surrounding conventions. Then, add it to the manifest at `test/index.js`.

**To run all API tests:** `npm run test:api`

**To run a specific API test:** `npx mocha test/api/from-file.js`

### Older tests

Although ideally you should not need to worry about this, there are some tests that are for legacy reasons not in the right format; they use Mocha, but really should be web platform tests. We're keeping them around for coverage until we can convert them. If you run `npm test`, you will get the full test suite, including such old tests.

## Benchmarks

This project cares about performance. There are a number of benchmarks that you can run. If you suspect your contribution has an impact on the performance of existing functionality, make sure you run the benchmarks before and after your change so that you can compare.

**To run benchmarks:** `npm run benchmark`

**To run specific suites:** `npm run benchmark -- --suite dom/construction`

## Issues

If you've read this far, you should know everything there is to know about contributing to jsdom. We have [an active and full issue tracker](https://github.com/jsdom/jsdom/issues) that we'd love you to help with. Go find something broken or missing, and fix it!
