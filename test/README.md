# jsdom tests

The jsdom project uses two different test frameworks:

* [**web-platform-tests**](https://web-platform-tests.org/). They come in the form of `.html` files which are run inside the jsdom. This is part of a large cross-browser testing effort that jsdom is participating in.
* **[Mocha](https://mochajs.org/) tests**

## For new tests

For working on new tests:

- Tests for web platform features go in the [`web-platform-tests/to-upstream`](./web-platform-tests/to-upstream/) subdirectory. This should be the majority of new work.
- Tests for the jsdom API itself go in the [`api`](./api/) subdirectory. If you add a new test file, edit [`index.js`](./index.js) to include it.

Ignore all the rest.

## The gory details

All Mocha tests are run via the file [`index.js`](./index.js). This includes running web-platform-tests, which are wrapped as Mocha tests.

All files related to running web-platform-tests are inside the [`web-platform-tests`](./web-platform-tests/) subdirectory.

Ideally we would only use Mocha for testing the JSDOM API itself, from the outside. Unfortunately, a lot of web platform features are still tested using Mocha, instead of web-platform-tests. These are located in the [`to-port-to-wpts`](./to-port-to-wpts/) subdirectory.
