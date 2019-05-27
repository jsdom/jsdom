// https://dom.spec.whatwg.org/#slotable
interface mixin Slotable {
  readonly attribute HTMLSlotElement? assignedSlot;
};
Element includes Slotable;
Text includes Slotable;
