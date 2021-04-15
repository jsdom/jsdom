// https://streams.spec.whatwg.org/#rs-default-controller-class

[Exposed=(Window,Worker,Worklet)]
interface ReadableStreamDefaultController {
  readonly attribute unrestricted double? desiredSize;

  undefined close();
  undefined enqueue(optional any chunk);
  undefined error(optional any e);
};
