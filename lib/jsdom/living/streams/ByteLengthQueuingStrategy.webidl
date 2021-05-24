// https://streams.spec.whatwg.org/#blqs-class-definition

[Exposed=(Window,Worker,Worklet)]
interface ByteLengthQueuingStrategy {
  constructor(QueuingStrategyInit init);

  readonly attribute unrestricted double highWaterMark;
  readonly attribute Function size;
};
