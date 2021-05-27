# Streams Standard contributor guidelines

These are the guidelines for contributing to the Streams Standard. First see the [WHATWG contributor guidelines](https://github.com/whatwg/meta/blob/main/CONTRIBUTING.md).

We label [good first issues](https://github.com/whatwg/streams/labels/good%20first%20issue) that you could help us fix, to get a taste for how to submit pull requests, how the build process works, and so on.

## Spec editorial conventions

Wrap lines to 120 columns. (This is not yet consistently followed.)

Use two-space indents.

Do not introduce explicit `<p>` tags. (Bikeshed does this automatically.)

Use "let" for introducing new local variables. Use "set" for updating existing variables or internal slots.

Mark up definitions [appropriately](https://tabatkins.github.io/bikeshed/#definitions). This is mostly applicable when defining new classes or methods; follow the existing examples in the spec.

Mark up abstract operations with `throws` or `nothrow` attributes in their heading tags, according to whether or not they can ever return an abrupt completion.

Use cross-reference [autolinking](https://tabatkins.github.io/bikeshed/#autolinking) liberally. This generally amounts to writing references to "definitions" as `<a>term</a>`, and writing references to classes or methods as `{{ClassName}}` or `{{ClassName/methodName()}}`.

When writing examples or notes, JavaScript variables and values are enclosed in `<code>` tags, not in `<var>` tags.

Use abstract operations in the following scenarios:

- To factor out shared logic used by multiple public APIs, or by multiple other abstract operations. _Example: ReadableByteStreamControllerEnqueueChunkToQueue_.
- To factor out operations that should be called by other specifications. Other specifications do not require checking of arguments, argument parsing, and other invariants; we assume they use abstract operations appropriately, and so we don't need to enforce correctness by throwing an error if not. Thus we often let the public API enforce invariants before calling to an abstract operation that assumes they hold already. _Example: ReadableStreamDefaultControllerClose_.

## Reference implementation style

Wrap lines to 120 columns.

Use two-space indents.

Alphabetize imports.

Use single quotes.

Pass ESLint.

## Notes on building the standard

The basics of building the standard are explained in the README. Here are some more details that might be interesting.

Building the standard is a two-step process. First, the majority of the conversion work is done via [Bikeshed](https://github.com/tabatkins/bikeshed). Second, we run a custom portion of the [Ecmarkup](https://github.com/bterlson/ecmarkup) pipeline to convert the algorithms from [Ecmarkdown](https://github.com/domenic/ecmarkdown) syntax into HTML, and to automatically add cross-references. This second step requires a recent version of [Node.js](https://nodejs.org/en/) to be installed, and running `npm install` to install the Ecmarkup/Ecmarkdown tools.

If you have Bikeshed [installed locally](https://tabatkins.github.io/bikeshed/#installing), we have a special script to continuously build the standard. Doing

```
npm run local-watch
```

will start a watcher on `index.bs` that will update `index.html` as you edit.
