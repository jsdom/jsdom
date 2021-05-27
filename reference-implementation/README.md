# Reference Implementation and Tests

This folder contains a reference implementation of the streams standard, inside `lib/`. It also contains infrastructure to run the web platform tests against the reference implementation, described below.

## Reference implementation

The reference implementation is meant to be a fairly close transcription of the spec into JavaScript. It is written in modern JavaScript and primarily tested in [Node.js](https://nodejs.org/en/); at least version 6.0.0 is required.

## Tests

Test coverage is not complete, but we do aim for it to be. Adding tests would be a great way to contribute to this project.

You can check the test coverage at any time by running `npm run coverage` in this folder.

To run all tests (and the lint step), run `npm test` in this folder.

### Web platform tests

The test suite for this standard is written in [web platform tests](https://github.com/web-platform-tests/wpt) format.

- To run the web platform tests, type `npm run wpt` in this folder.
- To run specific test files, you can use a glob pattern, rooted at the streams directory: `npm run wpt -- "writable-streams/**"`

The test runner here is a Node.js emulated-DOM environment, with the reference implementation loaded into it.

**To sync your local web-platform-tests checkout with the one tracked by this repository**, type `npm run sync-wpt`. However, note that this will override any local modifications you've made, e.g. in the process of working on a spec change. It's thus good to do this before you start working on such a change.

#### Upstream web platform tests

The web platform tests for streams are found in the [streams directory](https://github.com/web-platform-tests/wpt/tree/master/streams) of the web platform tests repository, and maintained via pull requests to that repository. They are then pulled into this repository via a [Git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

This means that in order to land a test change for these tests, you'll need to make a pull request to the web platform tests repository, and then update the submodule pointer in this repository (probably in the same pull request as your spec change). That can be done via the command

```
git submodule update --remote web-platform-tests
```

and then staging and commiting the submodule update.

If you are working on a spec change and need to modify or add to these tests, what you can do is work directly in the `web-platform-tests` subdirectory. Create a branch there, where you modify the tests. You can then modify the spec and reference implementation to match your branch. Finally, you can use that branch to send a pull request to the web-platform-tests project.

## Diagnostics

Diagnostic output is provided using the [debug](https://www.npmjs.com/package/debug) package. It is useful to understand the behaviour of the reference implementation, particularly in tests that exercise asynchronous behaviour. To enable, set the DEBUG environment variable. For example, in Bash,

```bash
DEBUG=streams:* npm test
```

See [lib/transform-stream.js](lib/transform-stream.js) for examples of how debug statements are used. Diagnostic coverage is sparse at the moment; we expect to add more diagnostics in an ad-hoc manner as they are needed.
