[Exposed=(Window,Worker)]
interface ReadableStream {
  constructor(optional object underlyingSource, optional QueuingStrategy strategy = {});

  readonly attribute boolean locked;

  Promise<undefined> cancel(optional any reason);
  ReadableStreamReader getReader(optional ReadableStreamGetReaderOptions options = {});
  sequence<ReadableStream> tee();
};

typedef (ReadableStreamDefaultReader or ReadableStreamBYOBReader) ReadableStreamReader;

enum ReadableStreamReaderMode { "byob" };

dictionary ReadableStreamGetReaderOptions {
  ReadableStreamReaderMode mode;
};

dictionary QueuingStrategy {
  unrestricted double highWaterMark;
  QueuingStrategySize size;
};

callback QueuingStrategySize = unrestricted double (any chunk);
