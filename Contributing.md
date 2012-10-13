## Mission

jsdom is, as said in our tagline, “A JavaScript implementation of the W3C DOM.” Anything that helps us be better at that is welcome.

## Status

We're pretty happy with our DOM2 implementation, modulo bugs. DOM3 is nowhere near complete, and DOM4 is almost nonexistant.

## Existing Tests

The DOM, thankfully, has lots of tests already out there. Those already included in the repository are of two types:

* Auto-generated or adapted from existing W3C tests.
* Written by contributors to plug gaps in the W3C tests.

Of these, of course, the first is preferable. When we find gaps, we usually add the tests at the bottom of the relevant auto-generated test suite, e.g. in `test/level2/html.js`.

Not all of the existing tests pass. The current test compliance is tracked [in the README](https://github.com/tmpvar/jsdom#test-compliance).

## Contributing

When contributing, the first question you should ask is:

**Can I exhibit how the browsers differ from what jsdom is doing?**

If you can, then you've almost certainly found a bug in or missing feature of jsdom, and we'd love to have your contribution. In that case, move on to:

**What W3C spec covers this potential contribution?**

Some likely ones include:

* [DOM1](http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/cover.html)
* [DOM2 Core](http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/), [DOM2 HTML](http://www.w3.org/TR/2003/REC-DOM-Level-2-HTML-20030109/), [DOM2 Events](http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/), [DOM2 Style](http://www.w3.org/TR/2000/REC-DOM-Level-2-Style-20001113/)
* [DOM3 Core](http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/), [DOM3 Events](http://www.w3.org/TR/DOM-Level-3-Events/)
* [DOM4](http://www.w3.org/TR/2012/WD-dom-20120405/)
* [DOM Living Standard](http://dom.spec.whatwg.org/)
* [Other W3C Dom Specs](http://www.w3.org/standards/techs/dom)
* [HTML5](http://www.w3.org/TR/html5/)

Once you have those nailed down, you'll want to ask:

**Where can I get a W3C test for this functionality?**

We already have all the DOM1 and DOM2 tests. We even have some DOM3 ones, although sadly they are currently disabled, due to DOM3 not being complete. DOM4 has no official test suite yet, but many tests are found [on w3c-test.org](http://w3c-test.org/webapps/DOMCore/tests/). If you really can't find it, you can always ask [public-webapps-testsuite@w3.org](mailto:public-webapps-testsuite@w3.org), [like I did](http://lists.w3.org/Archives/Public/public-webapps-testsuite/2012Aug/0001.html).

If there is no W3C test covering the functionality you're after, then you can write your own, placing it in the appropriate level. But in this case you'll probably want to alert the authors of the relevant test suite that they missed something!

## Issues

Finally, we have [an active and full issue tracker](https://github.com/tmpvar/jsdom/issues) that we'd love you to help with. Go find something broken, and fix it!
