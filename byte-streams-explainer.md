# Byte Streams Explainer


## Introduction

The streams APIs provide ubiquitous, interoperable primitives for creating, composing, and consuming streams of data.
For streams representing bytes, readable byte streams are an extended version of readable streams which are provided to
handle bytes efficiently.

Byte streams allow for BYOB (bring-your-own-buffer) readers to be acquired. The default stream type can give a range of
different outputs, for example strings or array buffers in the case of WebSockets, whereas byte streams guarantee byte
output. Furthermore, being able to have BYOB readers has benefits in terms of stability. This is because if a buffer
detaches, it can guarantee that one does not write into the same buffer twice, hence avoiding race conditions. BYOB
readers can reduce the number of times we run garbage collection, because we can reuse buffers.

## API Proposed

*   Constructing a Readable Byte Stream
    *   <code>new [ReadableStream](https://streams.spec.whatwg.org/#rs-constructor)({ type: "bytes" })</code>
*   Getting a BYOB reader
    *   <code>[getReader](https://streams.spec.whatwg.org/#rs-get-reader)({ mode: "byob" })</code>
*   As part of the implementation, there are 3 main classes that will be added to the Streams API:
    *   The [ReadableStreamBYOBReader](https://streams.spec.whatwg.org/#byob-reader-class) class
        *   This class represents a BYOB reader designed to be vended by a `ReadableStream` instance.
    *   The [ReadableByteStreamController](https://streams.spec.whatwg.org/#rbs-controller-class) class
        *   This class has methods that allow control of a `ReadableStream`’s state and internal queue. When
        constructing a `ReadableStream` that is a readable byte stream, the underlying source is given a corresponding
        `ReadableByteStreamController` instance to manipulate.
    *   The [ReadableStreamBYOBRequest](https://streams.spec.whatwg.org/#rs-byob-request-class) class
        *   This class represents a pull-into request in a `ReadableByteStreamController`.


## Examples

These are a few examples of Javascript which can be used for byte streams once this is implemented:


### Reading bytes from the stream into a single memory buffer

The code reads the first 1024 bytes from the stream into a single memory buffer. This is due to the fact that if a
stream is a readable byte stream, you can also acquire a BYOB reader for it, which allows more precise control over
buffer allocation in order to avoid copies.


```javascript
const reader = readableStream.getReader({ mode: "byob" });

let startingAB = new ArrayBuffer(1024);
const buffer = await readInto(startingAB);
console.log("The first 1024 bytes: ", buffer);

async function readInto(buffer) {
  let offset = 0;

  while (offset < buffer.byteLength) {
    const {value: view, done} =
     await reader.read(new Uint8Array(buffer, offset, buffer.byteLength - offset));
    buffer = view.buffer;
    if (done) {
      break;
    }
    offset += view.byteLength;
  }

  return buffer;
}
```


Note that after this code has run, `startingAB` is detached and can no longer be used to access the data, but `buffer`
points to the same region of memory.


### A readable byte stream with an underlying pull source

The following function returns readable byte streams that allow efficient zero-copy reading of a randomly generated
array. Instead of using a predetermined chunk size of 1024, it attempts to fill the developer-supplied buffer,
allowing full control.


```javascript
const DEFAULT_CHUNK_SIZE = 1024;

function makeReadableByteStream() {
  return new ReadableStream({
    type: "bytes",

    async pull(controller) {
      // Even when the consumer is using the default reader, the auto-allocation
      // feature allocates a buffer and passes it to us via byobRequest.
      const v = controller.byobRequest.view;
      v = crypto.getRandomValues(v);
      controller.byobRequest.respond(v.byteLength);
    },

    autoAllocateChunkSize: DEFAULT_CHUNK_SIZE
  });
}
```


With this in hand, we can create and use BYOB readers for the returned `ReadableStream`. The adaptation between the
low-level byte tracking of the underlying byte source shown here, and the higher-level chunk-based consumption of
a default reader, is all taken care of automatically by the streams implementation.


## Goals

*   Provide a way to represent a [ReadableStream](https://streams.spec.whatwg.org/#rs-class) for bytes efficiently.
*   Avoid races caused by multiple access for the same buffer.
*   Permit buffer re-use to reduce GC churn.

## Non-Goals

*   Non-binary chunk types will not be supported. They can still use the default type of readable stream.
*   Shared array buffers will not be supported. Currently, we always detach buffers, but shared array buffers
cannot be detached.

## User Benefits

*   By enabling developers to use the Readable Byte Streams API, this will increase speed and lower memory usage
for sites that take advantage of it. Specifically, sites that handle streaming binary data will see improved
performance.

## Alternatives

*   Some of the early versions of the standard had a specific ReadableByteStream constructor which would keep the two
types of streams completely separate. However, this was unnecessary and we decided to just use separate controllers
to support byte streams and non-byte streams with the same ReadableStream API to make it simpler.
