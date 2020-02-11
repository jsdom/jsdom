// https://html.spec.whatwg.org/multipage/webappapis.html#windoworworkerglobalscope-mixin
typedef (DOMString or Function) TimerHandler;

interface mixin WindowOrWorkerGlobalScope {
  [Replaceable] readonly attribute USVString origin;

  // base64 utility methods
  DOMString btoa(DOMString data);
  ByteString atob(DOMString data);

  // timers
  long setTimeout(TimerHandler handler, optional long timeout = 0, any... arguments);
  void clearTimeout(optional long handle = 0);
  long setInterval(TimerHandler handler, optional long timeout = 0, any... arguments);
  void clearInterval(optional long handle = 0);

  // microtask queuing
  //void queueMicrotask(VoidFunction callback);

  // ImageBitmap
  //Promise<ImageBitmap> createImageBitmap(ImageBitmapSource image, optional ImageBitmapOptions options = {});
  //Promise<ImageBitmap> createImageBitmap(ImageBitmapSource image, long sx, long sy, long sw, long sh, optional ImageBitmapOptions options = {});
};
Window includes WindowOrWorkerGlobalScope;
// WorkerGlobalScope includes WindowOrWorkerGlobalScope;

// https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames
// callback FrameRequestCallback = void (DOMHighResTimeStamp time);

interface mixin AnimationFrameProvider {
  // unsigned long requestAnimationFrame(FrameRequestCallback callback);
  // void cancelAnimationFrame(unsigned long handle);
};
Window includes AnimationFrameProvider;
// DedicatedWorkerGlobalScope includes AnimationFrameProvider;
