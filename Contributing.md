## Mission

jsdom is, as said in our tagline, “A JavaScript implementation of the DOM and HTML standards.” Anything that helps us be better at that is welcome.

## Status

We're transitioning from an older model based on separate and obsolete "DOM1," "DOM2," and "DOM3" specs, into one based on the modern DOM and HTML living standards. Nobody has really set aside the time to do the proper sort of architectural overhaul this transition necessitates, so things might seem a bit strange, but in the meantime we're doing OK with the current structure. You can read more about this in [the lib folder README](https://github.com/tmpvar/jsdom/tree/master/lib).

## Contribution Overview

When contributing, the first question you should ask is:

**Can I exhibit how the browsers differ from what jsdom is doing?**

If you can, then you've almost certainly found a bug in or missing feature of jsdom, and we'd love to have your contribution. In that case, move on to:

**What spec covers this potential contribution?**

Almost all of our relevant functionality is covered in either the [DOM Living Standard](http://dom.spec.whatwg.org/) or the [HTML Living Standard](http://www.whatwg.org/specs/web-apps/current-work/). There are various obsolete W3C specs ("DOM Level 2" etc.) that were never really implemented in browsers, and there is also the "DOM Level 4" W3C fork of the WHATWG DOM Living Standard. But we try to stick to the two main WHATWG specs for jsdom these days.

Other specs might pop up from time to time, especially in regard to CSS stuff. In general Mozilla's Servo project provides [good guidance on relavant places to look](https://github.com/servo/servo/wiki/Relevant-spec-links). [platform.html5.org](https://platform.html5.org/) is also pretty comprehensive.

Once you have that nailed down, you'll want to ask:

**Can I get an official test for this functionality?**

These days the [w3c/web-platform-tests](https://github.com/w3c/web-platform-tests) project has an ever-growing set of tests for the web platform. We have reasonable support for running these tests directly, although I imagine some of them (e.g. those dependent on the web-platform-tests Python server) won't work.

So ideally, you'll be able to find an official test, and enable it, and then write your feature or bugfix against it. In a perfect world where web-platform-tests had 100% coverage, all jsdom testing work would consist of just enabling such tests. But often no such test exists, and you'll need to write your own. We'll discuss how to do both of these in detail below.

Next is performance:

**Does my contribution significantly hinder or improve performance?**

This project cares about performance. There are a number of benchmarks that you can run. If you suspect your contribution has an impact on the performance of existing functionality, make sure you run the benchmarks before and after your change so that you can compare. A related question is:

**How fast is my new feature in comparison with other DOM implementations?**

You can run the benchmarks using the native DOM implementation of Chrome. A comparison with jsdom will automatically be made for you. If your new feature is much slower than the alternative DOM implementation, there might be an unexpected bottleneck somewhere in your change.

## Contribution Details

Now that you've got some idea of how contributions to jsdom generally go, let's get down to the actual work you'll be doing while contributing.

### Running the tests

First you'll want to `npm install`. To run all the tests, use `npm test`.

Using options to `npm test`, you can slice and dice which tests your want to run. Usage is as follows:

```
$ npm test -- --help

Run the jsdom test suite

Options:
  -s, --suites     suites that you want to run. ie: -s level1/core,1/html,html
  -f, --fail-fast  stop on the first failed test
  -h, --help       show the help
  -t, --tests      choose the test cases to run. ie: -t jquery
  -d, --debug      run in node's interactive debugger mode
  -v, --verbose    show all tests that are being run
```

So e.g. use `npm test -- -s console` to run the console-related tests.

### Writing or importing tests

To import a test from w3c/web-platform-tests, add the appropriate line to `test/web-platform-tests/index.js`. This framework is still in its early days, so feel free to open an issue if it's not working quite like you expect.

If you're writing a bunch of new tests for a feature, and those tests don't exist in w3c/web-platform-tests, you'll need to write your own. The best way to do this is to add new web platform tests into the `test/web-platform-tests/to-upstream` directory. Follow the [web platform test contribution guidelines](http://testthewebforward.org/docs/writing-tests.html) for the format, or just try to match what you see nearby.

Alternately, you can write some tests just for jsdom. This should be avoided when possible, but is necessary for cases where e.g. you are testing a jsdom specific API. Try to follow the style from newer files, like [`test/jsdom/node-location.js`](https://github.com/tmpvar/jsdom/blob/master/test/jsdom/node-location.js).

(Note for future reference for the maintainers: to update the submodules used for the web-platform-tests use the command `git submodule update --recursive --remote`.)

### Running tests in the browser

jsdom now has experimental support for web workers! To test this support, we have a special test setup that involves Selenium driving Chrome. To make that work, you need to install Java and have it in your PATH. Then you can use `npm run test-browser` to have Selenium open up Chrome, spawn a web worker, and run some jsdom tests inside it.

The browser runner supports the same options as `npm test`, as well as a few more specific to running browser tests via WebDriver. Many tests fail at present, so by default `npm run test-browser` only runs the suites that pass.

```
$ npm run test-browser -- --help

Run the jsdom test suite in a browser via WebDriver

Options:
  -s, --suites               suites that you want to run. ie: -s level1/core,1/html,html
  -f, --fail-fast            stop on the first failed test
  -h, --help                 show the help
  -t, --tests                choose the test cases to run. ie: -t jquery
  -d, --debug                run in node's interactive debugger mode
  -v, --verbose              show all tests that are being run
  --http-port                port to run test server on
  --web-driver-port          port to run Selenium on
  --verbose-web-driver       print verbose output from wd to stdout
  --verbose-browser-console  print browser console to stdout
```

### Running the benchmarks

First you'll want to `npm install`. To run all the benchmarks, use `npm run benchmark`.

Using options to `npm run benchmark`, you can slice and dice which benchmarks your want to run. Usage is as follows:

```
$ npm run benchmark -- --help

Run the jsdom benchmark suite

Options:
  -s, --suites  suites that you want to run. ie: -s dom/construction/createElement,dom/foo
  --bundle      generate the JavaScript bundle required to run benchmarks in a browser
  -h, --help    show the help
```

In general, `npm run benchmark` is most useful for comparing results between jsdom revisions, e.g. before and after you make a change. To get a sense of how fast a jsdom feature is in general, it's best to run the benchmarks in the browser.

### Running the benchmarks in the browser

You can run the same benchmarks in Chrome; in this case an automatic comparison will be made with the builtin DOM of Chrome. First you will need to run:

```
npm run benchmark-browser
```

This tool will generate the necessary browser compatible JavaScript. After this command completes you can open `benchmark/browser-runner.html` in Chrome (or Chromium). If you change a benchmark or if you change jsdom you will need to run this command again.

You can then use the console in Chrome (press F12) to run the benchmarks by executing the `run()` function. This should give you some idea as to how the jsdom implementation, running in a web worker, compares to the Chrome implementation, running in the main thread.

## Issues

If you've read this far, you should know everything there is to know about contributing to jsdom. We have [an active and full issue tracker](https://github.com/tmpvar/jsdom/issues) that we'd love you to help with. Go find something broken or missing, and fix it!
