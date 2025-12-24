dictionary TextEncoderEncodeIntoResult {
  unsigned long long read;
  unsigned long long written;
};

// [Exposed=*]
[Exposed=(Window)]
interface TextEncoder {
  constructor();

  [NewObject] Uint8Array encode(optional USVString input = "");
  TextEncoderEncodeIntoResult encodeInto(USVString source, [AllowShared] Uint8Array destination);
};
TextEncoder includes TextEncoderCommon;
