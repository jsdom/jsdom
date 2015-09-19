# Tests that need to be ported to web-platform-tests format

All of the tests in here are testing aspects of the "web platform" as implemented by jsdom. However, they are doing so "from the outside", using the jsdom APIs.

Instead, they should be converted to the web platform tests format, and moved to the appropriate location in the `../web-platform-tests/to-upstream` directory. The tests might be in the old nodeunit format, or in the new Mocha format, but in both cases, they are in the wrong format, and should be converted.

This is not a trivial transformation, and cannot be performed in an automated fashion. It will probably take us, the project maintainers, a long time.

In the meantime, let's not add anything else to this directory!
