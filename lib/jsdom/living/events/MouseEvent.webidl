[Constructor(DOMString typeArg, optional MouseEventInit mouseEventInitDict)]
interface MouseEvent : UIEvent {
    readonly    attribute long           screenX;
    readonly    attribute long           screenY;
    readonly    attribute long           clientX;
    readonly    attribute long           clientY;
    readonly    attribute boolean        ctrlKey;
    readonly    attribute boolean        shiftKey;
    readonly    attribute boolean        altKey;
    readonly    attribute boolean        metaKey;
    readonly    attribute short          button;
    readonly    attribute EventTarget?   relatedTarget;
    // Introduced in this specification
    readonly    attribute unsigned short buttons;
    boolean getModifierState (DOMString keyArg);
};

dictionary MouseEventInit : EventModifierInit {
             long           screenX = 0;
             long           screenY = 0;
             long           clientX = 0;
             long           clientY = 0;
             short          button = 0;
             unsigned short buttons = 0;
             EventTarget?   relatedTarget = null;
};

partial interface MouseEvent {
    // Deprecated in this specification
    void initMouseEvent (DOMString typeArg, boolean bubblesArg, boolean cancelableArg, Window? viewArg, long detailArg, long screenXArg, long screenYArg, long clientXArg, long clientYArg, boolean ctrlKeyArg, boolean altKeyArg, boolean shiftKeyArg, boolean metaKeyArg, short buttonArg, EventTarget? relatedTargetArg);
};
