dictionary TextDecoderOptions {
  boolean fatal = false;
  boolean ignoreBOM = false;
};

dictionary TextDecodeOptions {
  boolean stream = false;
};

// [Exposed=*]
[Exposed=(Window)]
interface TextDecoder {
  constructor(optional DOMString label = "utf-8", optional TextDecoderOptions options = {});

  USVString decode(optional AllowSharedBufferSource input, optional TextDecodeOptions options = {});
};
TextDecoder includes TextDecoderCommon;
