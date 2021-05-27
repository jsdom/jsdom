# Streams API FAQ

This is a work in progress, documenting some design decisions that were made and that were non-obvious enough that we feel the need to explain them. We'll probably be adding to it as we go. If there's something you feel belongs here, please file an issue or pull request and we'll add it!

## Are readable streams appropriate for my use case?

Readable streams fit best in situations where:

- You are trying to represent some underlying I/O source of data, especially one for which backpressure is meaningful.
- Consumers care about the logical concatenation of all chunks of the stream, such that every value produced is important.
- Your usual use case is a single consumer, with allowances for multi-consumer via teeing.
- Errors are either final and non-recoverable (socket prematurely closed), or just a specialized type of data (404).

Notably, readable streams are _not_ a good fit for:

- Continuous "snapshots" of some varying quantity, where consumers tune in and out as appropriate.
- Broadcasts to a large number of independent consumers.

In these types of scenarios, the buffering and backpressure built in to readable streams is unnecessary and problematic, and the reader design becomes awkward to work with.

## Are writable streams appropriate for my use case?

Writable streams shine in situations where:

- You are trying to represent some underlying I/O sink for data, especially one which cannot accept that data instantly.
- Your sink must receive the sequence of chunks written in the order provided.
- Your sink has a way of acknowledging successful writes, or at least receipt of the data.
- Your sink requires a "close" signal to release resources or similar.

## Are streams only for byte data?

No! Although streams are designed around I/O use cases, the APIs in the Streams Standard accomodate other types of chunks flowing through the streams just as well. Although usually the original source of or ultimate sink for I/O deals in bytes, there are many steps in between where streaming APIs are important, and they are meant to play well there too.

For example, your program could easily have readable stream of JavaScript objects representing users. This stream was probably originally derived from a readable stream of bytes coming from a HTTP request; maybe there was even an intermediate stream of decoded text. But the same APIs work for all of these streams: it is only the chunk type that differs.

A key part of allowing this flexibility in the API is the concept of a _queuing strategy_. A stream's queuing strategy is responsible for knowing what type of chunks it can process, and crucially, for measuring their size. This is what allows backpressure to work, without us coding knowledge of every possible chunk type into the Streams Standard.

## What's the deal with byte streams then?

That is: given that the stream APIs work great for any type of data, why are there special APIs, like BYOB readers, for dealing specifically with byte streams?

The answer is that there are certain operations, mostly around memory management, that only make sense when dealing directly with bytes. So the reader returned by `getReader({ mode: "byob" })`, or the controller interface provided when you give the constructor the `type: "bytes"` option, provide _extra_ APIs on top of the normal ones, which can be used by consumers and producers that are specifically interested in working at that level. But generally, your code can ignore the difference—a readable byte stream will act exactly like a normal readable stream, if you simply use `.getReader()` with no `mode` option.

## How do readable streams relate to [observables](https://github.com/zenparsing/es-observable) or EventTarget?

Readable streams and observables/EventTarget are not terribly related. Observables/EventTarget are specifically designed for multi-consumer scenarios, and have no support for backpressure. They are generally a bad fit for anything related to I/O, whereas streams excel there.

Observables and readable streams both share the semantic of "zero or more chunks, followed by either an error or done signal". But beyond that, they are not very comparable.

## How do readable streams relate to [async iterables](https://github.com/zenparsing/async-iteration/)?

Readable streams are conceptually a special case of async iterables, with a focus on I/O. The best analogy is something like "readable streams is to async iterable as array is to sync iterable." That is, just like arrays are a specialized type of iterable optimized for memory locality and random access, readable streams are a specialized type of async iterable optimized for things like off-main-thread data transfer and precise backpressure signaling.

As the async iterable proposal progresses, we anticipate making readable streams into async iterables proper, so that you could use the proposed `for async (const chunk of rs)` syntax.

## What are the main differences between these streams and Node.js streams?

The Streams Standard specifically started with the Node.js streams model as the basis, vowing to learn the lessons from Node's iterative streams1/2/3 process and incorporate them. Over time it's diverged in a few more ways, often via urging from the Node.js team. At this point, the main differences are:

- Readable streams:
  - An asynchronous `.read()` method, instead of async `.on("readable", ...)` plus synchronous `.read()`
  - Addition of the exclusive reader and locking concepts, to better support off-main-thread piping
  - Addition of cancelation semantics
  - Addition of more precise flow control via the `desiredSize` signal
  - Built-in teeing support
  - Removal of the `"data"` event, which competes conceptually with other ways of reading
  - Removal of pause/resume for managing backpressure
  - Removal of the `unshift` method for putting chunks back into the queue after reading them
  - No "binary/string mode" vs. "object mode" switch; instead, queueing strategies allow custom chunk types
  - No optional and only sometimes-working size parameter while reading; instead use BYOB readers
- Writable streams:
  - No cork/uncork support, yet (this is [#27](https://github.com/whatwg/streams/issues/27))
- Transform streams:
  - No longer a mash of the readable and writable stream APIs, but instead simple `{ readable, writable }` objects where the component streams are connected behind the scenes
- General:
  - Modernized API to use promises instead of callbacks and one-time events
  - No built-in text encoding/decoding
  - Split the `pipe` method into `pipeTo(writable)` and `pipeThrough(transform)`

## Why don't errors that occur while cancelling put the readable stream in an error state?

The idea of cancelling a readable stream is that it should behave as a "loss of interest": the consumer cancelling the stream expects nobody will read from it further, and that the stream should be treated in the same way as if it had closed naturally. Thus, cancellation _immediately_ moves the stream into a `"closed"` state, which has the same properties as if the stream had closed itself. This gives the most consistent view of the stream to the outside world.

On the other hand, it may be important for the consumer _performing_ the cancellation to be notified whether the cancellation succeeds or fails. To handle this, you can simply use the promise returned from `.cancel()`:

```js
readableStream.cancel().then(
    () => console.log("Cancellation successful!"),
    err => console.error("Cancellation failed!", err)
);
```

## What's with `pipeTo` vs `pipeThrough`?

There are only two types of streams: readable and writable streams. `pipeTo` is for piping between them.

For the concept of something with a writable end and a readable end, we have "duplex streams." Duplex streams are really just containers for a pair of streams, one writable and one readable, stored in the properties `writable` and `readable` respectively.

Some duplex streams will be transform streams, wherein the two streams are entangled, so that writing to the writable side affects what can be read from the readable side. This could be a very direct entanglement, of the sort produced by the `TransformStream` class, or something more indirect, such as the relationship between `stdin` and `stdout`.

`pipeThrough` is for piping into the writable half of the entangled streams and out the readable side. That is,

```js
src.pipeThrough(through).pipeTo(dest);
```

is really just sugar for:

```js
src.pipeTo(through.writable);
through.readable.pipeTo(dest);
```
