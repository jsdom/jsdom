## Mission

jsdom is, as said in our tagline, “A JavaScript implementation of the DOM and HTML standards.” Anything that helps us be better at that is welcome.

## Status

We're transitioning from an older model based on separate and obsolete "DOM1," "DOM2," and "DOM3" specs, into one based on the modern DOM and HTML living standards. Nobody has really set aside the time to do the proper sort of architectural overhaul this transition necessitates, so things might seem a bit strange, but in the meantime we're doing OK with the current structure.

## Existing Tests

The DOM, thankfully, has lots of tests already out there. Those already included in the repository are of three types:

* Auto-generated or adapted from older W3C tests.
* Written by contributors to plug gaps in those tests.
* Imported from the newer [w3c/web-platform-tests](https://github.com/w3c/web-platform-tests) project.

## Contributing

When contributing, the first question you should ask is:

**Can I exhibit how the browsers differ from what jsdom is doing?**

If you can, then you've almost certainly found a bug in or missing feature of jsdom, and we'd love to have your contribution. In that case, move on to:

**What WHATWG spec covers this potential contribution?**

Almost all of our relevant functionality is covered in either the [DOM Living Standard](http://dom.spec.whatwg.org/) or the [HTML Living Standard](http://www.whatwg.org/specs/web-apps/current-work/). There are various obsolete W3C specs ("DOM Level 2" etc.) that were never really implemented in browsers, and there is also the "DOM Level 4" W3C fork of the WHATWG DOM Living Standard. But we try to stick to the two main WHATWG specs for jsdom these days.

Once you have that nailed down, you'll want to ask:

**Can I get an official test for this functionality?**

We ported in some of the tests for the old DOM1 and DOM2 specs, as well as some DOM3 ones that are currently disabled. These are sometimes wrong however (given that browsers never really implemented those specs), and we have had to change, add to, or remove them in the past.

These days the [w3c/web-platform-tests](https://github.com/w3c/web-platform-tests) project has an ever-growing set of tests for the DOM and HTML standards, and is the best place to try to find good tests to adapt. We have reasonable support for running these tests directly, although I imagine some of them (e.g. those dependent on the web-platform-tests Python server) won't work. See below for details on how to add such tests to the suite.

If there is no official test covering the functionality you're after, then you can write your own. If you're not sure, you can always ask [public-webapps-testsuite@w3.org](mailto:public-webapps-testsuite@w3.org), [like I did](http://lists.w3.org/Archives/Public/public-webapps-testsuite/2012Aug/0001.html), or stop into the #whatwg IRC channel. You might want to submit a pull request to the web-platform-tests repo too!

## Running the tests

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

To import a test from w3c/web-platform-tests, add the appropriate line to `test/w3c/index.js`. This framework is still in its early days, so feel free to open an issue if it's not working quite like you expect.

If you're just adding a simple fix to existing functionality, you can add an appropriate test to the bottom of the relevant test file, e.g. in `test/level2/html.js`.

If you're writing a bunch of new tests for a feature, and those tests don't exist in w3c/web-platform-tests, you can do one of two things. The most noble course of action is to submit a pull request to web-platform-tests, get it accepted and merged, then update jsdom to run those tests. That way, all existing browsers will run the test too, improving interoperability for everyone!

Alternately, you can write some tests just for jsdom. The older tests, being a mix of auto-generated and organically-grown, have gotten pretty hairy over time. But for new tests we try to follow a clean and uniform style, which you can see in files like [test/living-dom/attributes.js](https://github.com/tmpvar/jsdom/blob/master/test/living-dom/attributes.js) or [test/window/history.js](https://github.com/tmpvar/jsdom/blob/master/test/window/history.js). Do your best to follow that.

Note for future reference: to update the submodules used for the web-platform-tests use the command `git submodule update --recursive --remote`.

### Browser tests

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

## Issues

Finally, we have [an active and full issue tracker](https://github.com/tmpvar/jsdom/issues) that we'd love you to help with. Go find something broken, and fix it!
