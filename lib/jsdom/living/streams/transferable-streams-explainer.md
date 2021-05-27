# Transferable Streams Explained


## Introduction

The streams APIs provide ubiquitous, interoperable primitives for creating, composing, and consuming streams of data. A
natural thing to want to do with a stream is pass it off to a web worker. This provides a building block that is easy
and natural to use for offloading work onto another thread. Once you can speak the language of streams, you can use that
same language to make use of a Worker.

This work will permit streams to be transferred between workers, frames and anywhere else that `postMessage()` can be
used. Chunks can be anything which is cloneable by `postMessage()`.

Initially chunks enqueued in such a stream will always be cloned, ie. all data will be copied. Future work will extend
the Streams APIs to support transferring objects (ie. zero copy).

This is an example of JavaScript which will work once this is implemented:

In the main page:

```javascript
const rs = new ReadableStream({
  start(controller) {
    controller.enqueue('hello');
  }
});
const w = new Worker('worker.js');
w.postMessage(rs, [rs]);
```

In worker.js:

```javascript
onmessage = async (evt) => {
  const rs = evt.data;
  const reader = rs.getReader();
  const {value, done} = await reader.read();
  console.log(value); // logs 'hello'.
};
```

Note that `w.postMessage(rs)` would not work. Streams can only be _transferred_, not _cloned_. Attempts to clone a
stream will throw a DataCloneError.

Once a stream has been transferred with `postMessage()` the original stream is locked and cannot be read or written.
This is similar to how ArrayBuffers are neutered after they are transferred. However, the code of the underlying source
or sink is still running in the original context. The benefits to user experience can be seen in [this demo of streaming
digits of PI](https://glitch.com/edit/#!/streaming-pi?path=pi.js:1:0) (if you have a browser that supports transferable
streams, you can see it live at https://streaming-pi.glitch.me/).

Transferable streams are also useful in constructing responses for a service worker. See
https://gist.github.com/domenic/ea5ebedffcee27f552e103963cf8585c/ for an example.

## Goals

*   Permit `ReadableStream`, `WritableStream` and `TransformStream` objects to be transferred between workers and other
    contexts where `postMessage()` can be used.
*   Provide a primitive that is amenable to future optimisations, for example automatic thread offload to bypass the
    main thread.

## Non-goals

*   Avoiding cloning the chunks is not a goal at this stage; see "future work".
*   As such, Transfer-only objects (such as `ImageBitmap`) will not be supported yet; only serializable objects and the
    built-in types supported by the structured serialization algorithm.
*   A concise syntax for creating a `TransformStream` and a worker to run it on in one operation is not part of this
    work.

## Use cases

*   Performing expensive transformations off the main thread. Transcoding, for example.
*   Synthesizing responses from a service worker. For example, generating a PDF from data in the DOM and streaming it to
    the service worker where it can then be downloaded as a file.
*   Processing a stream of data from an input device only accessible on the main thread. For example, you could use
    `MediaRecorder` to capture the audio of a user's microphone and/or the video of a user's camera, pipe the captured
    data through a off-thread `TransformStream` to transcode it into a hypothetical new experimental media format and
    then upload the resulting stream to a server.
*   Displaying a stream of data that is expensive to generate on a web page. Inverting the previous example: you
    download a stream of a video file encoded in an experimental media format, you transcode it to a natively supported
    format in a worker, and finally you transfer the resulting stream to the main thread to play back the video using
    `<video>` and `MediaSource`.

## End-user benefit

*   By enabling developers to easily offload work onto other threads, this will increase the availability of responsive,
    stutter-free experiences to end users. For example, a page that transcoded video using a new, CPU-intensive codec
    could still respond snappily to user input by offloading the transcoding to another thread.
*   The power multiplier of streams and threads could unlock whole new applications.

## Alternatives

*   It's possible to emulate this behaviour by using `postMessage()` directly. See for example
    [remote-web-streams](https://github.com/MattiasBuelens/remote-web-streams). Existing techniques for moving work
    off the main thread often resemble a subset of this functionality. However, it is clumsy and hard to work with. When
    in future the API is optimized, transferring a browser created stream (e.g., a fetch response body from the network)
    will be more efficient than manually using `postMessage()` on each chunk due to reduced copies and JavaScript calls.

## Future Work

*   Transferring rather than cloning chunks is an optimisation we will obviously need in future. This is expected to
    require extensions to the Streams APIs.
