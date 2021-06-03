// https://streams.spec.whatwg.org/#cqs-class-definition

[Exposed=(Window,Worker,Worklet)]
interface CountQueuingStrategy {
  constructor(QueuingStrategyInit init);

  readonly attribute unrestricted double highWaterMark;
  readonly attribute Function size;
};
