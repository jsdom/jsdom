// https://www.w3.org/TR/encoding/#interface-textdecoder
[Exposed=(Window,Worker)]
interface TextDecoder {
  constructor(optional DOMString label = "utf-8", optional TextDecoderOptions options);
  readonly attribute DOMString encoding;
  readonly attribute boolean fatal;
  readonly attribute boolean ignoreBOM;
  USVString decode(optional BufferSource input, optional TextDecodeOptions options);
};

dictionary TextDecoderOptions {
  boolean fatal = false;
  boolean ignoreBOM = false;
};

dictionary TextDecodeOptions {
  boolean stream = false;
};
