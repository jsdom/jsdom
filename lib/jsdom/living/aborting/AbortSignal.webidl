[Exposed=(Window,Worker)]
interface AbortSignal : EventTarget {
  [WebIDL2JSCallWithGlobal, NewObject] static AbortSignal abort(optional any reason);

  readonly attribute boolean aborted;
  readonly attribute any reason;

  attribute EventHandler onabort;
};
