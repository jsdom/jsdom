// Slotable is a mixin rather than an interface
// Waiting for https://github.com/jsdom/webidl2js/commit/92598ce3ec39342e27a3ad090a373b20f3b99626
interface Slotable {
  readonly attribute HTMLSlotElement? assignedSlot;
};
