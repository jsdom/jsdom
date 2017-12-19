dictionary TouchEventInit : EventModifierInit {
    sequence<Touch> touches = [];
    sequence<Touch> targetTouches = [];
    sequence<Touch> changedTouches = [];
};

[Constructor(DOMString type, optional TouchEventInit eventInitDict),
 Exposed=Window]
interface TouchEvent : UIEvent {
    readonly attribute TouchList touches;
    readonly attribute TouchList targetTouches;
    readonly attribute TouchList changedTouches;
    readonly attribute boolean   altKey;
    readonly attribute boolean   metaKey;
    readonly attribute boolean   ctrlKey;
    readonly attribute boolean   shiftKey;
};
