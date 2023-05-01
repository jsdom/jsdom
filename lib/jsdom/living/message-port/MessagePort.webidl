[Exposed=(Window,Worker,AudioWorklet), Transferable]
interface MessagePort : EventTarget {
  undefined postMessage(any message, sequence<object> transfer);
  undefined postMessage(any message, optional StructuredSerializeOptions options = {});
  undefined start();
  undefined close();

  // event handlers
  attribute EventHandler onmessage;
  attribute EventHandler onmessageerror;
};

dictionary StructuredSerializeOptions {
  sequence<object> transfer = [];
};
