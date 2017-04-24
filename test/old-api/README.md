# Old jsdom API tests

These jsdom tests are based on the old (pre-v10) API. There are a variety of types:

* Tests specific to the old API shape, which generally don't make sense for the new API. An example is most of `env.js`.
* Tests that need to be ported to test the equivalent functionality in the new API. An example is `cookie.js`.
* Tests that test something that currently isn't in the new API, but hopefully will be. An example is `cancel-requests.js`.

In any case, no new tests should be added here, and the tests here should gradually go away as the old API disappears.
