// https://streams.spec.whatwg.org/#default-reader-class-definition

[Exposed=(Window,Worker,Worklet)]
interface ReadableStreamDefaultReader {
  constructor(ReadableStream stream);

  Promise<ReadableStreamDefaultReadResult> read();
  undefined releaseLock();
};
ReadableStreamDefaultReader includes ReadableStreamGenericReader;

dictionary ReadableStreamDefaultReadResult {
 any value;
 boolean done;
};
