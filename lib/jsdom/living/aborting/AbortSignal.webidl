[Exposed=(Window,Worker)]
interface AbortSignal : EventTarget {
  [WebIDL2JSCallWithGlobal, NewObject] static AbortSignal abort();

  readonly attribute boolean aborted;

  attribute EventHandler onabort;
};
