[Constructor(sequence<BlobPart> fileBits,
             USVString fileName,
             optional FilePropertyBag options),
 Exposed=(Window,Worker), Serializable]
interface File : Blob {
  readonly attribute DOMString name;
  readonly attribute long long lastModified;
};

dictionary FilePropertyBag : BlobPropertyBag {
  long long lastModified;
};
