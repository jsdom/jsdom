// https://streams.spec.whatwg.org/#rs-class

[Exposed=(Window,Worker,Worklet), Transferable]
interface ReadableStream {
  constructor(optional object underlyingSource, optional QueuingStrategy strategy = {});

  readonly attribute boolean locked;

  Promise<undefined> cancel(optional any reason);
  ReadableStreamReader getReader(optional ReadableStreamGetReaderOptions options = {});
  // ReadableStream pipeThrough(ReadableWritablePair transform, optional StreamPipeOptions options = {});
  // Promise<undefined> pipeTo(WritableStream destination, optional StreamPipeOptions options = {});
  sequence<ReadableStream> tee();

  async iterable<any>(optional ReadableStreamIteratorOptions options = {});
};

typedef (ReadableStreamDefaultReader or ReadableStreamBYOBReader) ReadableStreamReader;

enum ReadableStreamReaderMode { "byob" };

dictionary ReadableStreamGetReaderOptions {
  ReadableStreamReaderMode mode;
};

dictionary ReadableStreamIteratorOptions {
  boolean preventCancel = false;
};

dictionary ReadableWritablePair {
  required ReadableStream readable;
  required WritableStream writable;
};

dictionary StreamPipeOptions {
  boolean preventClose = false;
  boolean preventAbort = false;
  boolean preventCancel = false;
  AbortSignal signal;
};

dictionary QueuingStrategy {
  unrestricted double highWaterMark;
  QueuingStrategySize size;
};

callback QueuingStrategySize = unrestricted double (optional any chunk
);
