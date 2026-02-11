[Exposed=(Window,Worker), Serializable]
interface Blob {
  constructor(optional sequence<BlobPart> blobParts,
              optional BlobPropertyBag options = {});


  readonly attribute unsigned long long size;
  readonly attribute DOMString type;

  // slice Blob into byte-ranged chunks
  Blob slice([Clamp] optional long long start,
            [Clamp] optional long long end,
            optional DOMString contentType);

  // read from the Blob.
  [NewObject] Promise<USVString> text();
  [NewObject] Promise<ArrayBuffer> arrayBuffer();
  [NewObject] Promise<Uint8Array> bytes();
};

enum EndingType { "transparent", "native" };

dictionary BlobPropertyBag {
  DOMString type = "";
  EndingType endings = "transparent";
};

typedef (BufferSource or Blob or USVString) BlobPart;
