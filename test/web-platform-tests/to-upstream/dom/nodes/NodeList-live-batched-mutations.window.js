test(() => {
  const parent = document.createElement("div");
  const { childNodes } = parent;
  const iterator = childNodes[Symbol.iterator]();
  const first = document.createElement("span");
  const text = document.createTextNode("text");
  const second = document.createElement("span");

  parent.append(first, text, second);

  assert_equals(parent.childNodes, childNodes);
  assert_equals(iterator.next().value, first);
  assert_equals(childNodes.length, 3);
  assert_equals(childNodes[2], second);
  assert_equals(childNodes.item(2), second);
  assert_array_equals(Object.getOwnPropertyNames(childNodes), ["0", "1", "2"]);

  first.remove();

  assert_array_equals([...childNodes], [text, second]);
  assert_array_equals(Object.keys(childNodes), ["0", "1"]);
}, "childNodes remains live across batched mutations and supported access methods");
