// https://streams.spec.whatwg.org/#rbs-controller-class

[Exposed=(Window,Worker,Worklet)]
interface ReadableByteStreamController {
  readonly attribute ReadableStreamBYOBRequest? byobRequest;
  readonly attribute unrestricted double? desiredSize;

  undefined close();
  undefined enqueue(ArrayBufferView chunk);
  undefined error(optional any e
);
};
