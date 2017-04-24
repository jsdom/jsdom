# The Sizzle test suite, adapted for jsdom

This is an outdated copy of the test suite for [Sizzle](https://sizzlejs.com/). It is a large integration test for jsdom, as it tests many aspects of DOM traversal and introspection while Sizzle attempts to perform various queries.

It is, unfortunately, based on old infrastructure. Ideally it should be replaced with a new version that just loads [the test source file](https://github.com/jquery/sizzle/blob/master/test/index.html) into jsdom and reads off the results somehow. And probably we should be using Git submodules to keep it updated.
