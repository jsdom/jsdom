# jsdom tests

The jsdom project uses three different test frameworks:

* [**web-platform-tests**](http://www.web-platform-tests.org/). They come in the form of `.html` files which are run inside the jsdom. This is part of a large cross-browser testing effort that jsdom is participating in.
* **[Mocha](https://mochajs.org/) tests**
* **Legacy [nodeunit](https://github.com/caolan/nodeunit) tests**

Ideally we would only have two test frameworks, and they would each be used for a specific purpose: web-platform-tests, for testing web platform features implemented by jsdom; and Mocha tests, for testing the JSDOM API itself from the outside.

Unfortunately, the situation is not so clean-cut. A lot of tests are leftover in the nodeunit framework that we used to use a long time ago. And a lot of web platform features are still tested using either Mocha or nodeunit tests, instead of web-platform-tests. And we have two APIs, the old (pre-v10) jsdom API, and the current one, so we have another type of legacy test.

## For new tests

For working on new tests:

- Tests for web platform features go in the [`web-platform-tests/to-upstream`](./web-platform-tests/to-upstream/) subdirectory. This should be the majority of new work.
- Tests for the jsdom API itself go on the [`api`](./api/) subdirectory.

Ignore all the rest.

## Understanding old tests

All Mocha tests are run via the file [`index.js`](./index.js). All files related to running Mocha tests (for e.g. running them in browsers, or on CI) are marked with a comment `// For: Mocha` at the top of the file.

Nodeunit tests are run via the files [`runner`](./runner) and [`./worker-runner.js`]. All files related to running nodeunit tests are marked with a comment `// For: nodeunit` at the top of the file.

All files related to running web-platform-tests are inside the [`web-platform-tests`](./web-platform-tests/) subdirectory.
