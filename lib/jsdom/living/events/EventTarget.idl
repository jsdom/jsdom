[Exposed=(Window,Worker)]
interface EventTarget {
  void addEventListener(DOMString type, EventListener? callback, optional (AddEventListenerOptions or boolean) options);
  void removeEventListener(DOMString type, EventListener? callback, optional (EventListenerOptions or boolean) options);
  boolean dispatchEvent(Event event);
};

callback interface EventListener {
  void handleEvent(Event event);
};

dictionary EventListenerOptions{
  boolean capture = false;
};

dictionary AddEventListenerOptions: EventListenerOptions {
// boolean passive = false;
  boolean once = false;
};
