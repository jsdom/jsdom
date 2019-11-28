[Constructor,
 Exposed=(Window,Worker)]
interface AbortController {
  [SameObject] readonly attribute AbortSignal signal;

  void abort();
};
