// https://www.w3.org/TR/encoding/#interface-textencoder
[Exposed=(Window,Worker)]
interface TextEncoder {
  constructor();
  readonly attribute DOMString encoding;
  [NewObject] Uint8Array encode(optional USVString input = "");
};
