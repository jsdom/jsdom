# jsdom API tests

These tests specifically test the jsdom API, from the "outside". That is, they do not generally test web platform features implemented by jsdom, but instead the public API presented by the `JSDOM` class and documented in [the top-level README](../../README.md).

In general most jsdom feature work will not involve adding tests here, as most feature work implements part of the web platform and thus is more appropriate as web-platform-tests.
