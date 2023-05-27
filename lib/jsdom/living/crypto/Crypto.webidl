[Exposed=(Window,Worker)]
interface Crypto {
  ArrayBufferView getRandomValues(ArrayBufferView array);
  [SecureContext] DOMString randomUUID();
};
