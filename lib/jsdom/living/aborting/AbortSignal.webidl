[Exposed=(Window,Worker)]
interface AbortSignal : EventTarget {
  readonly attribute boolean aborted;

  attribute EventHandler onabort;
};
