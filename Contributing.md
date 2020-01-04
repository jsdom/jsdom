## Mission

jsdom is, as said in our tagline, “A JavaScript implementation of the DOM and HTML standards.” Anything that helps us be better at that is welcome.

## Yarn

We use the [Yarn](https://yarnpkg.com/) package manager to manage dependencies and run the scripts defined in `package.json`. It is similar to npm, but contains fewer bugs for our purposes. If you make changes which add or remove dependencies, make sure you commit the `yarn.lock` file which it generates.

You can probably get away with using npm for most contributions, as long as you are not adding or removing dependencies. You'll have to mentally translate the Yarn commands we give into npm ones, however.

## Architecture

jsdom is a blend of old and new code. Some of its older and less-touched corners may look different from newer work. Here we'll describe the modern setup, but you might encounter parts of the codebase that don't fit this model, or that seem unnecessarily baroque (like the directory structure in `lib/`).

In general, a web platform class (like `Window`, or `Node`, or `Location`, or `CSSStyleSheet`) is specified using a language called [Web IDL](https://heycam.github.io/webidl/). Web IDL abstracts away a lot of the boilerplate involved in creating such classes, like type conversions, argument validation, and [attribute/property reflection](https://html.spec.whatwg.org/multipage/infrastructure.html#reflect).

As such, most web platform classes present in jsdom are implemented in two parts:

- An IDL file, such as [`Attr.webidl`](https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/attributes/Attr.webidl), drawn more or less straight from the spec

- An implementation file, such as [`Attr-impl.js`](https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/attributes/Attr-impl.js), containing the relevant implementation logic

Our build step (`yarn prepare`) then generates a public API file (e.g. `Attr.js`) which takes care of all the Web IDL-derived boilerplate, delegating to the implementation file for the important stuff. We then wire it together with a line in `lib/jsdom/living/index.js` that exposes the generated class on all jsdom windows.

## Contribution overview

When contributing, the first question you should ask is:

**Can I exhibit how the browsers differ from what jsdom is doing?**

If you can, then you've almost certainly found a bug in or missing feature of jsdom, and we'd love to have your contribution. In that case, move on to:

**What spec covers this potential contribution?**

Almost all of our relevant functionality is covered in either the [DOM Living Standard](https://dom.spec.whatwg.org/) or the [HTML Living Standard](https://html.spec.whatwg.org/multipage/). There are various obsolete W3C specs ("DOM Level 2" etc.) that were never really implemented in browsers, and there is also the "DOM Level 4" W3C fork of the WHATWG DOM Living Standard. But we try to stick to the two main WHATWG specs for jsdom these days.

Other specs might pop up from time to time, especially in regard to CSS stuff. In general Mozilla's Servo project provides [good guidance on relevant places to look](https://github.com/servo/servo/wiki/Relevant-spec-links). [platform.html5.org](https://platform.html5.org/) is also pretty comprehensive.

## Tests

### Running the tests

First you'll want to run `yarn` to install all dependencies. Then, configure your system to run the web platform tests as described in [their README](https://github.com/web-platform-tests/wpt/blob/master/README.md).

**To run all the tests:** `yarn test`

In the following sections, we'll give commands for running a subset of the tests. If you do that, instead of running the whole suite with `yarn test`, then please run this command first:

**Before running test subsets**: `yarn pretest`

### Web platform feature tests

All tests for web platform features (as opposed to features of jsdom itself, such as the `JSDOM()` constructor) should be in [web-platform-tests](https://github.com/web-platform-tests/wpt) format. We have some infrastructure for running these directly against jsdom documents. So ideally, when contributing a bugfix or new feature, you can browse the web-platform-tests repository and find the test covering your work, and then just enable it in [the `to-run.yaml` file](https://github.com/jsdom/jsdom/blob/master/test/web-platform-tests/to-run.yaml). These tests are HTML files which use a special library called [testharness.js](https://web-platform-tests.org/writing-tests/testharness-api.html) to report their results.

However, the web-platform-tests project is not fully comprehensive. If you need to write your own test for a web platform feature, place it in our [to-upstream](https://github.com/jsdom/jsdom/tree/master/test/web-platform-tests/to-upstream) directory. (It's so named because, over time, we hope to upstream these tests back to the web-platform-tests repository, so all browsers can benefit from them.) Note that you may need to create new directory structure, paralleling that of the main [web-platform-tests](https://github.com/web-platform-tests/wpt) repository.

**To run all web-platform-tests:** `yarn test-wpt`

**To run the to-upstream web-platform-tests:** `yarn test-tuwpt`

**To run specific web-platform-tests already enabled via `to-run.yaml`**: `yarn test-wpt --fgrep dom/events`

**To run specific to-upstream web-platform-tests**: `yarn test-tuwpt --fgrep domparsing`

Also, to update web platform tests to their latest revision from the source repository: `yarn update-wpt`. (This can take a long time, like 10 minutes.)

### jsdom API tests

If you are testing something that can only be accomplished through the jsdom API, and not inside a normal web browser, you'll want to write a different kind of test. Such tests are written using [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/).

To write such a test that, simply add a file in `test/api/`, following the surrounding conventions. Then, add it to the manifest at `test/index.js`.

**To run all API tests:** `yarn test-api`

**To run a specific API test:** `yarn test-mocha test/api/from-file.js`

### Older tests

Although ideally you should not need to worry about this, there are some tests that are for legacy reasons not in the right format; they use Mocha, but really should be web platform tests. We're keeping them around for coverage until we can convert them. If you run `yarn test`, you will get the full test suite, including such old tests.

### Testing against the browser

jsdom has experimental support to run in directly in a browser, in both the main document and in a web worker! So we try run as many tests as possible in browsers too. Currently we only test in Chrome, since it has the same JavaScript features as the Node.js environment we usually develop in. So you'll need Chrome installed on your machine.

The mocha test cases are executed in Chrome using [karma](https://karma-runner.github.io/). Currently, web platform tests are not executed in the browser yet.

**To run all browser tests:** `yarn test-browser`

**To run the karma tests in an iframe:** `yarn test-browser-iframe`

**To run the karma tests in a web worker:** `yarn test-browser-worker`

## Benchmarks

This project cares about performance. There are a number of benchmarks that you can run. If you suspect your contribution has an impact on the performance of existing functionality, make sure you run the benchmarks before and after your change so that you can compare.

You can also run the benchmarks using the native DOM implementation of Chrome. A comparison with jsdom will automatically be made for you. If your new feature is much slower than the alternative DOM implementation, there might be an unexpected bottleneck somewhere in your change.

**To run benchmarks in Node.js:** `yarn benchmark`

**To run benchmarks in the browser:** `yarn benchmark-browser`, then open `benchmark/browser-runner.html` in Chrome (or Chromium) and use the developer console to execute the `run()` function.

## Issues

If you've read this far, you should know everything there is to know about contributing to jsdom. We have [an active and full issue tracker](https://github.com/jsdom/jsdom/issues) that we'd love you to help with. Go find something broken or missing, and fix it!
