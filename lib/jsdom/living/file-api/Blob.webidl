[Constructor(optional sequence<BlobPart> blobParts,
             optional BlobPropertyBag options),
 Exposed=(Window,Worker), Serializable]
interface Blob {

  readonly attribute unsigned long long size;
  readonly attribute DOMString type;

  // slice Blob into byte-ranged chunks
  Blob slice([Clamp] optional long long start,
            [Clamp] optional long long end,
            optional DOMString contentType);
};

enum EndingType { "transparent", "native" };

dictionary BlobPropertyBag {
  DOMString type = "";
  EndingType endings = "transparent";
};

typedef (BufferSource or Blob or USVString) BlobPart;
