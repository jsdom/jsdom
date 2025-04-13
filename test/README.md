# jsdom tests

The jsdom project uses two different test frameworks:

* [**web-platform-tests**](https://web-platform-tests.org/). They come in the form of `.html` files which are run inside the jsdom. This is part of a large cross-browser testing effort that jsdom is participating in.
* **[Mocha](https://mochajs.org/) tests**

For working on new tests:

* Tests for web platform features go in the [`web-platform-tests/to-upstream`](./web-platform-tests/to-upstream/) subdirectory. This should be the majority of new work.
* Tests for the jsdom API itself go in the [`api`](./api/) subdirectory.

Ignore all the rest.

See [Contributing.md](../Contributing.md) for more details on writing tests.
