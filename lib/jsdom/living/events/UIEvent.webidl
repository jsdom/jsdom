[Constructor(DOMString type, optional UIEventInit eventInitDict)]
interface UIEvent : Event {
    readonly    attribute Window? view;
    readonly    attribute long    detail;
};

dictionary UIEventInit : EventInit {
             Window? view = null;
             long    detail = 0;
};

dictionary EventModifierInit : UIEventInit {
             boolean ctrlKey = false;
             boolean shiftKey = false;
             boolean altKey = false;
             boolean metaKey = false;
             boolean modifierAltGraph = false;
             boolean modifierCapsLock = false;
             boolean modifierFn = false;
             boolean modifierFnLock = false;
             boolean modifierHyper = false;
             boolean modifierNumLock = false;
             boolean modifierOS = false;
             boolean modifierScrollLock = false;
             boolean modifierSuper = false;
             boolean modifierSymbol = false;
             boolean modifierSymbolLock = false;
};

partial interface UIEvent {
    // Deprecated in this specification
    void initUIEvent (DOMString typeArg, boolean bubblesArg, boolean cancelableArg, Window? viewArg, long detailArg);
};
