// https://dom.spec.whatwg.org/#interface-eventtarget
[Exposed=(Window,Worker,AudioWorklet)]
interface EventTarget {
  constructor();

  // webidl2js cannot handle = {} with unions it seems
  undefined addEventListener(DOMString type, EventListener? callback, optional (AddEventListenerOptions or boolean) options);
  undefined removeEventListener(DOMString type, EventListener? callback, optional (EventListenerOptions or boolean) options);
  boolean dispatchEvent(Event event);
};

callback interface EventListener {
  undefined handleEvent(Event event);
};

dictionary EventListenerOptions {
  boolean capture = false;
};

dictionary AddEventListenerOptions : EventListenerOptions {
  boolean passive;
  boolean once = false;
  AbortSignal signal;
};
