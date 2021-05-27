# Streams API Requirements

Drawing upon the JavaScript community's extensive experience with streaming primitives, we list these scenarios that must be solved within the scope of a complete stream abstraction.

## Background Reading

The most clear and insightful commentary on a streams API has so far been produced by Isaac Schlueter, lead Node.js maintainer. In a series of posts on the public-webapps list, he outlined his thoughts, first [on the general concepts and requirements of a streams API](https://lists.w3.org/Archives/Public/public-webapps/2013JulSep/0275.html), and second [on potential specific API details and considerations](https://lists.w3.org/Archives/Public/public-webapps/2013JulSep/0355.html). This document leans heavily on his conceptual analysis.

To understand the importance of backpressure, watch [Thorsten Lorenz's LXJS 2013 talk](https://www.youtube.com/watch?v=9llfAByho98) and perhaps play with his [stream-viz](https://thlorenz.github.io/stream-viz/) demo.

## Creating Readable Streams

### You must be able to efficiently adapt existing _push_-based data sources into a uniform streaming interface.

A _push-based_ data source is one which, while the flow is turned on, pushes data at you (e.g. via events). It may also provide a mechanism for pausing and resuming the flow of data. However, this mechanism could be advisory, i.e. you may still receive data after requesting a pause. It is important not to lose such data (it must be queued for further consumption).

An example of a push-based data source is a UDP socket. The remote server pushes data to you, and while the OS will try to buffer it up to some limit, if you do not vacate that kernel-level buffer in time, data will be lost.

### You must be able to efficiently adapt existing _pull_-based data sources into a uniform streaming interface.

A _pull-based_ data source is one which you must request data from. The data may be available synchronously, or asynchronously. It is important not to let this [zalgo-esque](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony) implementation detail leak into the semantics of the uniform stream API, but at the same time, it is preferable not to impose a delay on consumers if the data is available synchronously.

An example of a pull-based data source is a file descriptor. The POSIX `read(2)` API will directly "pull" the given bytes from the file on disk into a given memory location.

### You must not lose data.

A common problem with push-based data sources is that they make it very easy to lose data if you do not immediately process it.

For example, Node.js's "streams1" (version 0.6 and below) presented a push-based API that mapped directly to the underlying data source. So a stream for incoming HTTP POST request data would fire `"data"` events continually. A common problem was the desire to perform some asynchronous action, such as authentication, before consuming the stream. But while this asynchronous authentication was taking place, data events would be fired and lost. Worse, calling `pause()` on the request stream did not work, because the pause mapped directly to the underlying TCP primitive, which is only advisory. This forced authors to manually queue incoming requests, which was easy to do incorrectly or inefficiently.

The solution is to move the queuing logic into the stream primitive itself, removing the error-prone and easy-to-forget process it forces upon consumers. If you stop there, you end up with a push stream with  `pause()` and `resume()` methods that are not advisory, but instead reliably stop the flow of `"data"`, `"end"`, and `"close"` events. However, you can take this further, and use your internal queue to unify both push- and pull-based data sources into a single pull-based streaming API.

## Creating Writable Streams

### You must shield the user from the complexity of queuing sequential writes.

Most underlying data sinks are designed to work well with only one concurrent write. For example, while asynchronously writing to an open file descriptor, you should not perform another write until the first finishes. Moreover, you generally need to make sure that the previous writes finish *successfully* before writing the next piece of data.

On the other hand, incoming data, either produced manually or piped from a readable stream, has no respect for the limits of the underlying sink. If you are piping from a fast filesystem to a slow network connection, it is quite likely new data will be available from the filesystem before the network responds that it has successfully delivered the first chunk you wrote to it. Forcing users of your writable stream API to juggle this state is an undue and error-prone burden. Worse, users can sometimes get away with ignoring this concern, e.g. if they usually pipe a slow source to a fast one, there will be no problems, until one day they pipe to a network filesystem instead of a local one, and writes are suddenly delivered concurrently or out of order.

Thus it is the duty of a writable stream API to provide an easy interface for writing data to it at any speed, but queuing incoming data and only forwarding it to the underlying sink one chunk at a time, and only after the previous write completed successfully.

This leads to a natural quantification of how "slow" a writable stream is in terms of how full its write queue is. This measure of slowness can be used to propagate backpressure signals to anyone writing data to the writable stream; see below for more details.

### You should not force an asynchronous writing API upon users.

It is often possible to perform a synchronous write, e.g. to an in-memory data source or to a synchronous transformation. Thus, the user should not be forced to wait for a previous write to complete before continuing to write.

This issue is actually solved by properly considering the previous one; they are two facets of the same thing. If you queue sequential writes for the user, they can synchronously write chunks with impunity.

Note that it is not important to *notify* the user synchronously of success or failure when writing (even if the write happened synchronously). It is simply important to not require them to *wait* for an asynchronous notification before continuing to write.

### For certain sinks, you must provide a means of performing batch writes without introducing lag in the normal case.

It is common to perform multiple write operations quickly and in sequence, for example writing HTTP request headers and then writing the body. Cases like these are often handled on the OS level by a certain syscall, `writev`, which allows writing a vector of data instead of a single chunk of data. A performant writable stream API must make it possible for writable streams that map to these underlying sinks to use this syscall. The trick here is meshing such a batch-write API with the normal single-write API that other sinks use, without hurting performance on either side.

For example, the naive way of introducing batch write functionality is to wait until the end of a tick, and aggregate all writes within that tick into a `writev` call. But this introduces unacceptable lag for a low-level stream API, as it means that upon performing a normal write, you cannot immediately forward that write to the underlying sink, but instead must wait until the end of the tick.

Instead, it is best to give writable streams that support batch writes a specific API that hints that the user intends to perform multiple write operation in succession. An approach familiar to network programmers is the "cork-uncork" paradigm, where you "cork" the stream, perform some writes, then uncork it, flushing all the writes with a single `writev` call upon uncorking. There are various other possibilities, with varying degrees of usability; a relevant discussion can be found [in the context of Node.js's introduction of these primitives](https://groups.google.com/d/msg/nodejs/UNWhF64KeQI/zN2VCWYkMhcJ).

### You must provide a way to signal a close of the underlying resource.

When all data has been successfully written to the stream, users of the writable stream API will want to signal that the underlying sink should be closed. For example, the underlying socket connection should be freed back to the connection pool, or the file descriptor should be closed.


## Composing Streams

### You must be able to pipe streams to each other.

The primary way of consuming streams is to pipe them to each other. This is the essence of streaming APIs: getting data from a readable stream to a writable one, while queuing as little data as possible in memory.

```js
fs.createReadStream("source.txt")
    .pipeTo(fs.createWriteStream("dest.txt"));

https.get("https://example.com")
    .pipeTo(fs.createWriteStream("dest.txt"));
```

### You must be able to transform streams via the pipe chain.

A naturally-arising concept is a *transform stream*, i.e. a stream that is both readable and writable, such that when data is written to it, transformed data is written out the other side. Note that the transform is rarely one-to-one; for example a compression algorithm can be represented as a transform stream that reads much more than it writes.

```js
fs.createReadStream("source.zip")
    .pipeThrough(zlib.createGzipDecompressor(options))
    .pipeTo(fs.createWriteStream("dest/"));

fs.createReadStream("index.html")
    .pipeThrough(zlib.createGzipCompressor(options))
    .pipeTo(httpServerResponse);

https.get("https://example.com/video.mp4")
    .pipeThrough(videoProcessingWebWorker)
    .pipeTo(document.query("video"));

fs.createReadStream("source.txt")
    .pipeThrough(new StringDecoder("utf-8"))
    .pipeThrough(database1.queryExecutor)
    .pipeTo(database2.tableWriter("table"));
```

Here we illustrate the difference between piping *through* a transform stream, versus piping *to* a writable stream, by splitting that functionality into two separate methods.

_NOTE: a transform stream is not always the most efficient or straightforward abstraction, although it may fit nicely into a pipe chain. For example, the `StringDecoder` transform above is a synchronous transformation, and the transform stream machinery is possibly overkill. A simpler approach might be a simple function that takes a readable stream of `ArrayBuffer`s and returns a readable stream of strings, by wrapping the appropriate methods to synchronous transformation._

### You must be able to communicate backpressure.

_Backpressure_ is roughly the act of letting the slowest writable stream in the chain govern the rate at which data is consumed from the ultimate data source. This is necessary to make sure a program has a reasonable upper bound on memory usage as it queues to prevent losing data. Without backpressure, slow writable streams in the chain will either cause memory usage to balloon as queued data grows without limit, or will cause data loss if the queue is capped at a hard limit.

If this data source is pull-based, this means not pulling data any faster than required; if the data source is push-based, this means issuing a pause signal when too much data has already been pushed but not yet flushed through the stream chain.

The exact strategy for applying backpressure can be a quite subtle matter, and will depend on whether you want your stream API to present a pull- or push-based interface. Assuming a pull-based stream interface, the most naïve backpressure strategy is:

- _When the stream is based on a pull source:_
  - When a consumer signals it is ready to read data from the stream object, pull data from the source into the stream's internal queue so that it can be read.
  - Never load data into the stream from the source before the user signals interest.
- _When the stream is based on a push source:_
  - When a consumer signals it is ready to read data from the stream object, send a start signal to the source.
  - Once the data arrives, store it in the stream's internal queue so it can be read, and send a stop signal to the source.

These strategies are enough for a generic case, but performance wins can be had by allowing some in-memory queuing, limited by a specified *high water mark*. This more advanced strategy consists of:

- _When the stream is based on a pull source:_
  - Proactively pull data from the source into the stream's internal queue, even before the consumer signals that it wants to read from the stream object.
  - Do so until the pulled data accumulates up to the stream's high water mark. This makes the data available immediately when requested by consumers of the stream.
  - After the consumer reads all of the data from the internal queue, we say that the queue is drained; in this event, go back to proactively pulling data into the queue from the source.
- _When the stream is based on a push source:_
  - Send a start signal to the source immediately, even before the consumer signals that it wants to read from the stream object.
  - As data is pushed from the source, accumulate it in the stream's internal queue, up to the high water mark. Once the high  water mark is reached, send a stop signal to the source.
  - After the stream's queue is drained, send a start signal to the source.

You can introduce an even more advanced strategy by adding a *low water mark*, which modifies the above by resuming data collection once the queue reaches the low water mark instead of once the queue is entirely drained.

### You must be able to pipe a stream to more than one writable stream.

Many use cases requiring piping a stream to more than one destination, e.g. a HTTP response both to a user and to a disk cache, or a stream of video data both to the local user and across an HTTP connection.

The simplest way to implement this is by introducing a "tee" duplex stream, such that writing to it writes to two separate destination streams. Then, piping to two writable streams is done by piping to a tee stream wrapping those two. However, requiring users to remember this can be a footgun, and it may be advisable to automatically create a tee stream for them.

The tee stream can use a number of strategies to govern how the speed of its outputs affect the backpressure signals it gives off, but the simplest strategy is to pass aggregate backpressure signals directly up the chain, thus letting the speed of the slowest output determine the speed of the tee.

### You must be able to communicate cancel signals up a pipe chain.

It's common for a destination to become unable to consume any more data, either because of an error or because of a loss of interest. For example, a user may click on a link to the next video while the previous video is still streaming into the browser, or a connection to a HTTP server may be closed unexpectedly in the middle of streaming down the response data. (In general, any error writing to a writable stream should trigger a cancel in any readable stream piped to it.) More benignly, there are cases when you want only a subset of a stream, e.g. when you are doing a streaming parse of a file looking for a certain signal; once you find it, you no longer care about the rest of the stream.

All of these cases call for some uniform way to signal to the readable stream that the consumer is no longer interested in its data. If the underlying data source is push-based, this means sending a pause signal and throwing away any data that continues to come in; if it is pull-based, this means reading no more data. In both cases, underlying resources like sockets or file descriptors can be cleaned up.

It's important to allow this cancel signal to come from anywhere along the chain, since the closer you get to the ultimate consumer, the more knowledge is available to know when or whether it is appropriate to stop consuming and cancel. As such, this cancel must propagate backward in the chain until it reaches the ultimate producer, stopping any intermediate processing along the way.

Also note that the handling of cancel signals alongside multi-stream piping must be done with care. In the tee-stream strategy discussed above, the correct thing to do would be for the tee stream to accumulate failure or cancel signals from both of its outputs, and only send that upstream once both outputs have signaled they desire an upstream cancel.

### You must be able to communicate abort signals down a pipe chain.

As a dual to readable stream cancellation, it's possible for a source to be unable to produce any more data, usually because of an error. In this case, any writable streams it is being piped to should not leave their underlying sinks open indefinitely; instead, they themselves should be given a abort signal.

This signal is similar to, but different than, the "close" signal described above. It implies that the data written so far is not meaningful or valid; that any queued writes should be discarded; and that a cleanup operation should be performed. For example, when a file stream represents a newly-created file, a close signal waits for all queued writes to complete, then closes the file descriptor; a new, complete file now exists on the disk. But a abort signal would throw away any queued writes and delete the file.

## Other

### The stream API should be agnostic to what type of data is being streamed.

Although underlying sources and sinks will often produce or accept only binary data, this should not prevent writing streams that contain other types of data, for example strings, objects, or frames of video. Such streams are extremely useful for programmers, both for direct consumption (consuming a string stream or stream of parsed objects is more useful than consuming `ArrayBuffer`s directly), and for producing composable transform streams. We should also provide some byte-specific features for performance but it should be a superset of the normal generic stream API (see the "Byte Streams" section).

By ensuring the generic stream API is agnostic to the type of data that the stream contains, it is possible to create streams for such disparate objects as HTML elements, database records, RPC messages, semantic events from remote systems, synchronization deltas for CRDTs, and user input events. By allowing all such streams to be composed together with a single uniform interface, you allow complex systems to be built while still benefiting from all of the features that streams manage for you, such as automatic backpressure, queuing, and abort signals.

This poses challenges, mainly regarding the queuing strategy for applying backpressure when it is unclear how much memory a piece of streaming data might take up. This is largely stream-specific, and the best you can do is make it easy for user-created streams to inform the implementation of relevant data, and provide a few useful defaults like a byte counter for `ArrayBuffer`s, a character counter for strings, or a generic object counter for most others. But compared to an implementation that restricts itself to a few binary or string data types, it provides a much more useful, extensible, and forward-thinking abstraction.

### You must be able to create representions of "duplex" data sources.

A common I/O abstraction is a data source that is both readable and writable, but the input and output are not related. For example, communication along a TCP socket connection can be bidirectional, but in general the data you read form the socket is not governed by the data you write to it.

One way enable this concept is to allow readable and writable stream interfaces to both be implemented, by ensuring they do not overlap (e.g. don't both have a `"state"` property or `"error"` event). Thus these duplex interfaces are simple streams that are both readable and writable, so e.g. you would be able to do both `socket.read()` and `socket.write(data)`.

Another way is to demand that such duplex interfaces represent their readable and writable streams separately, e.g. via `readable` and `writable` properties. In this case you would do `socket.readable.read()` and `socket.writable.write(data)`. This may feel more awkward for certain cases (like a TCP socket), but more natural in others (like a terminal, which traditionally has both stdout and stdin). It also has the advantage of allowing you to hand out the readable interface without granting write access, or vice-versa.

### You must have a simple way to determine when a stream is "over".

For a readable stream, this means that all data has been read from the underlying source, or that an error was encountered reading and the stream is now in an error state. For a writable stream, this means that all data has been written to the underlying sink, or that an error was encountered writing and the stream is now in an error state. This provides a convenient hook for observers to perform any relevant notifications, actions, or cleanups.

Note that this type of occurrence, which happens exactly once, either succeeds or fails, and is convenient to be able to subscribe to at any time (even if it has already occurred), fits perfectly with promises, as opposed to e.g. events.

### You must have a way of passively watching data pass through a stream.

This is commonly used for analytics or progress reporting. You wish to observe data flowing, either from a readable stream or to a writable stream, but not interfere with the flow, backpressure, or queuing strategy in any way.

A convenient interface for this is an evented one. However, marrying an evented API to a stream API presents many problems, and was widely considered a huge mistake by the Node.js core team. (For example, there are now two sources of truth about what data stream holds, and since traditional event emitters allow anyone to emit events on them, the second one is unreliable.) A better strategy may be using AOP-style "wrapping" of `read` or `write` calls to notify a separately-managed event emitter.

## Byte Streams

### Byte streams must be naively substitutable wherever a non-byte stream is expected.

A good stream ecosystem will consist of a lot of code that operates on any readable, writable, or transform stream. This code should work on the byte-specialized versions of those constructs as well. This generally means that, for example, a readable byte stream should have an API that is a superset of a simple readable stream.

### You should have a way of "bringing your own buffer" to a readable byte stream.

When reading from a normal readable stream, the stream is responsible for allocating and giving you new objects each time you read. In the context where a readable byte stream is treated just like a readable stream, this will necessarily continue to be the case: each read will allocate a new `ArrayBuffer`, which the consumer will use until it is eventually garbage-collected.

For predictable performance and memory usage, however, it is ideal to allow "bring your own buffer" code, where instead of allocating a new buffer, the byte stream reads directly into a supplied buffer. This would allow e.g. reuse of a single pre-allocated memory region.

Given the substitutability constraint, this API must exist alongside the normal auto-allocating one, so that consumers which know they are dealing with a readable byte stream can use the "bring your own buffer" version, but agnostic consumers do not need to.

### You must not allow observable data races.

While reading into a buffer, possibly from another thread, the consumer must not be able to observe the buffer filling up. (That is, `typedArray[0] !== typedArray[0]` should never occur, even if another thread is mutating the beginning of the backing buffer.) The general solution here is detaching the array buffer.

Given the requirements of "bring your own buffer" and detaching, we need to define clearly how to return the buffer to the consumer which is again available for reuse.

### You must have a way of specifying an upper limit on the number of bytes read from a readable byte stream.

Several use cases demand precise control over the maximum number of bytes read from a byte stream. For example, reading a file header before deciding how to process the rest of the file. For general readable streams this is not really feasible, but for byte streams it is perfectly possible.

### You must allow in-another-thread BYOB underlying source APIs to be wrapped in a readable byte stream.

I discuss this scenario in more detail [in a blog post](https://blog.domenic.me/reading-from-files/). The essential result is that the buffer for BYOB reads must be supplied up front, before any async waiting occurs. This argues in favor of an async read API, as we came to conclude in the (very long) [#253](https://github.com/whatwg/streams/issues/253), culminating in [#296](https://github.com/whatwg/streams/pull/296).
