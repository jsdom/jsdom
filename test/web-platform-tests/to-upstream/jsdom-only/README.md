# jsdom-only tests

This directory contains WPT-style tests that are jsdom-specific, and thus should not be run in browsers nor upstreamed (despite living under `to-upstream`). Since jsdom follows the platform wherever possible, these should be extremely rare.

The intended use case is for verifying jsdom behavior that can't (or needn't) be tested in browsers (e.g. validating `HTMLFormElement.prototyope.submit()`'s behavior without actually navigating). If the test will also pass in browsers, then it should be in a different directory.
