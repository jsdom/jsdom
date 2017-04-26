## Mission

jsdom is, as said in our tagline, “A JavaScript implementation of the DOM and HTML standards.” Anything that helps us be better at that is welcome.

## Architecture

jsdom is a blend of old and new code. Some of its older and less-touched corners may look different from newer work. Here we'll describe the modern setup, but you might encounter parts of the codebase that don't fit this model, or that seem unnecessarily baroque (like the directory structure in `lib/`).

In general, a web platform class (like `Window`, or `Node`, or `Location`, or `CSSStyleSheet`) is specified using a language called [Web IDL](https://heycam.github.io/webidl/). Web IDL abstracts away a lot of the boilerplate involved in creating such classes, like type conversions, argument validation, and [attribute/property reflection](https://html.spec.whatwg.org/multipage/infrastructure.html#reflect).

As such, most web platform classes present in jsdom are implemented in two parts:

- An IDL file, such as [`Attr.idl`](https://github.com/tmpvar/jsdom/blob/master/lib/jsdom/living/attributes/Attr.idl), drawn more or less straight from the spec
- An implementation file, such as [`Attr-impl.js`](https://github.com/tmpvar/jsdom/blob/master/lib/jsdom/living/attributes/Attr-impl.js), containing the relevant implementation logic

Our build step (`npm run prepublish`) then generates a public API file (e.g. `Attr.js`) which takes care of all the Web IDL-derived boilerplate, delegating to the implementation file for the important stuff. We then wire it together with a line in `lib/jsdom/living/index.js` that exposes the generated class on all jsdom windows.

## Contribution overview

When contributing, the first question you should ask is:

**Can I exhibit how the browsers differ from what jsdom is doing?**

If you can, then you've almost certainly found a bug in or missing feature of jsdom, and we'd love to have your contribution. In that case, move on to:

**What spec covers this potential contribution?**

Almost all of our relevant functionality is covered in either the [DOM Living Standard](https://dom.spec.whatwg.org/) or the [HTML Living Standard](https://html.spec.whatwg.org/multipage/). There are various obsolete W3C specs ("DOM Level 2" etc.) that were never really implemented in browsers, and there is also the "DOM Level 4" W3C fork of the WHATWG DOM Living Standard. But we try to stick to the two main WHATWG specs for jsdom these days.

Other specs might pop up from time to time, especially in regard to CSS stuff. In general Mozilla's Servo project provides [good guidance on relevant places to look](https://github.com/servo/servo/wiki/Relevant-spec-links). [platform.html5.org](https://platform.html5.org/) is also pretty comprehensive.

## Tests

### Running the tests

First you'll want to `npm install`. Then, configure your system to run the web platform tests as described in [their README](https://github.com/w3c/web-platform-tests/blob/master/README.md). If you can't get that set up correctly, the test runner will make a best-faith effort to run the tests hosted on http://w3c-test.org/, but this is pretty slow and fragile.

**To run all the tests:** `npm test`

### Web platform feature tests

All tests for web platform features (as opposed to features of jsdom itself, such as the `JSDOM()` constructor) should be in [web-platform-tests](https://github.com/w3c/web-platform-tests) format. We have some infrastructure for running these directly against jsdom documents. So ideally, when contributing a bugfix or new feature, you can browser the web-platform-tests repository and find the test covering your work, and then just enable it in [the manifest file](https://github.com/tmpvar/jsdom/blob/master/test/web-platform-tests/index.js). These tests are HTML files which use a special library called [testharness.js](http://testthewebforward.org/docs/testharness-library.html) to report their results.

However, the web-platform-tests project is not fully comprehensive. If you need to write your own test for a web platform feature, place it in our [to-upstream](https://github.com/tmpvar/jsdom/tree/master/test/web-platform-tests/to-upstream) directory. (It's so named because, over time, we hope to upstream these tests back to the web-platform-tests repository, so all browsers can benefit from them.) Note that you may need to create new directory structure, paralleling that of the main [web-platform-tests](https://github.com/w3c/web-platform-tests) repository.

**To run all web-platform-tests:** `npm run test-wpt`

**To run the to-upstream web-platform-tests:** `npm run test-tuwpt`

**To run specific web-platform-tests already in the manifest**: `npm run test-wpt -- --fgrep dom/events`

(Note for future reference for the maintainers: to update the submodules used for the web-platform-tests use the command `git submodule update --recursive --remote`.)

### jsdom API tests

If you are testing something that can only be accomplished through the jsdom API, and not inside a normal web browser, you'll want to write a different kind of test. Such tests are written using [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/).

To write such a test that, simply add a file in `test/api/`, following the surrounding conventions. Then, add it to the manifest at `test/index.js`.

**To run all API tests:** `npm run test-api`

**To run a specific API test:** `npm run test-mocha -- test/api/from-file.js`

### Older tests

Although ideally you should not need to worry about this, there are some tests that are for legacy reasons not in the right place, or test old parts of jsdom. New tests should not be contributed following those patterns, but we're keeping them around for coverage until we can convert them to the appropriate format. If you run `npm test`, you will get the full test suite, including such old tests.

### Testing against the browser

jsdom has experimental support to run in directly in a browser, in both the main document and in a web worker! So we try run as many tests as possible in browsers too. Currently we only test in Chrome, since it has the same JavaScript features as the Node.js environment we usually develop in. So you'll need Chrome installed on your machine.

As noted above, our own test suites are currently being transitioned from nodeunit to mocha. The nodeunit test cases are executed in Chrome using Selenium. The mocha test cases are executed in Chrome using [karma](https://karma-runner.github.io/).

**To run all browser tests:** `npm run test-browser`

**To run the karma tests in an iframe:** `npm run test-karma`

**To run the karma tests in a web worker:** `npm run test-karma-worker`

**To run the older tests:** `npm run test-browser-old` (requires Java installed and in your PATH)

## Benchmarks

This project cares about performance. There are a number of benchmarks that you can run. If you suspect your contribution has an impact on the performance of existing functionality, make sure you run the benchmarks before and after your change so that you can compare.

You can also run the benchmarks using the native DOM implementation of Chrome. A comparison with jsdom will automatically be made for you. If your new feature is much slower than the alternative DOM implementation, there might be an unexpected bottleneck somewhere in your change.

**To run benchmarks in Node.js:** `npm run benchmark`

**To run benchmarks in the browser:** `npm run benchmark-browser`, then open `benchmark/browser-runner.html` in Chrome (or Chromium) and use the developer console to execute the `run()` function.

## Issues

If you've read this far, you should know everything there is to know about contributing to jsdom. We have [an active and full issue tracker](https://github.com/tmpvar/jsdom/issues) that we'd love you to help with. Go find something broken or missing, and fix it!
