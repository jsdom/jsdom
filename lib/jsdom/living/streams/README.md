# Streams Standard

This repository hosts the [Streams Standard](https://streams.spec.whatwg.org/).

## Contribution opportunities

Folks notice minor and larger issues with the Streams Standard all the time and we'd love your
help fixing those. Pull requests for typographical and grammar errors are also most welcome.

We'd be happy to mentor you through this process. If you're interested and need help getting
started, leave a comment on the issue or ask around [on IRC](https://whatwg.org/irc).

## Pull requests

In short, change `index.bs` and submit your patch, with a
[good commit message](https://github.com/whatwg/meta/blob/main/COMMITTING.md). Consider
reading through the [WHATWG FAQ](https://whatwg.org/faq) if you are new here.

Please add your name to the Acknowledgments section in your first pull request, even for trivial
fixes. The names are sorted lexicographically.

For formatting specific to this standard, see [CONTRIBUTING.md](CONTRIBUTING.md). Additionally, for
any normative changes, we'll also want to change the tests and reference implementation:

## Tests

Tests can be found in the `streams/` directory of
[`web-platform-tests/wpt`](https://github.com/web-platform-tests/wpt).

## Reference implementation

This repository also includes a reference implementation, written in JavaScript, under
`reference-implementation/`. See the README under that directory for more details.

We strive for every commit that changes the spec to also add tests, and to change the reference
implementation in order to pass those tests.

## Building "locally"

For quick local iteration, run `make`. To verify your changes locally, run `make deploy`. See more
in the
[WHATWG Contributor Guidelines](https://github.com/whatwg/meta/blob/main/CONTRIBUTING.md#building).

## Merge policy

If you can commit to this repository, see the
[WHATWG Maintainer Guidelines](https://github.com/whatwg/meta/blob/main/MAINTAINERS.md).

## Code of conduct

We are committed to providing a friendly, safe, and welcoming environment for all. Please read and
respect the [WHATWG Code of Conduct](https://whatwg.org/code-of-conduct).
