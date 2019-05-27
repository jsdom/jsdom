[Exposed=(Window,Worker), Serializable]
interface FileList {
  [WebIDL2JSValueAsUnsupported=_null] getter File? item(unsigned long index);
  readonly attribute unsigned long length;
};
