// https://streams.spec.whatwg.org/#byob-reader-class

[Exposed=(Window,Worker,Worklet)]
interface ReadableStreamBYOBReader {
  constructor(ReadableStream stream);

  Promise<ReadableStreamBYOBReadResult> read(ArrayBufferView view);
  undefined releaseLock();
};
ReadableStreamBYOBReader includes ReadableStreamGenericReader;

dictionary ReadableStreamBYOBReadResult {
 ArrayBufferView value;
 boolean done;
};
