"use strict";

for (const kind of ["document", "element", "fragment", "shadow root"]) {
  for (const selector of ["[data-testid]", '[data-testid="target"]']) {
    test(() => {
      const doc = document.implementation.createHTMLDocument();
      let root;
      if (kind === "document") {
        root = doc;
      } else if (kind === "element") {
        root = doc.createElement("div");
      } else if (kind === "fragment") {
        root = doc.createDocumentFragment();
      } else {
        root = doc.createElement("div").attachShadow({ mode: "open" });
      }

      const parent = kind === "document" ? doc.body : root;
      const empty = root.querySelectorAll(selector);
      assert_not_equals(root.querySelectorAll(selector), empty);
      const first = doc.createElement("span");
      first.setAttribute("data-testid", "target");
      parent.append(first);
      const original = root.querySelectorAll(selector);
      assert_array_equals([...original], [first]);
      assert_not_equals(root.querySelectorAll(selector), original);
      assert_array_equals([...empty], []);

      const second = first.cloneNode();
      parent.append(second);
      assert_array_equals([...root.querySelectorAll(selector)], [first, second]);
      parent.prepend(second);
      assert_array_equals([...root.querySelectorAll(selector)], [second, first]);
      first.removeAttribute("data-testid");
      assert_array_equals([...root.querySelectorAll(selector)], [second]);
      first.setAttribute("data-testid", "target");
      assert_array_equals([...root.querySelectorAll(selector)], [second, first]);
      first.getAttributeNode("data-testid").value = "other";
      const expected = selector === "[data-testid]" ? [second, first] : [second];
      assert_array_equals([...root.querySelectorAll(selector)], expected);
      second.remove();
      first.remove();
      assert_array_equals([...root.querySelectorAll(selector)], []);
      assert_array_equals([...original], [first]);
    }, `Repeated ${selector} queries on a ${kind} return fresh static results after mutations`);
  }
}

test(() => {
  const root = document.createElement("div");
  root.innerHTML = '<div><span data-testid="target"></span></div><div></div>';
  const first = root.firstChild;
  const second = root.lastChild;
  const target = first.firstChild;
  const selector = '[data-testid="target"]';
  assert_array_equals([...first.querySelectorAll(selector)], [target]);
  assert_array_equals([...second.querySelectorAll(selector)], []);
  assert_array_equals([...root.querySelectorAll(selector)], [target]);
  second.append(target);
  assert_array_equals([...first.querySelectorAll(selector)], []);
  assert_array_equals([...second.querySelectorAll(selector)], [target]);
  assert_array_equals([...root.querySelectorAll(selector)], [target]);
  second.replaceChildren();
  assert_array_equals([...root.querySelectorAll(selector)], []);
}, "Moving and removing a matching subtree updates queries on each ancestor");

test(() => {
  const root = document.createElement("div");
  const shadow = root.attachShadow({ mode: "open" });
  shadow.innerHTML = '<span data-testid="shadow"></span>';
  root.innerHTML = '<span data-testid="light"></span>';
  const selector = "[data-testid]";
  assert_array_equals([...root.querySelectorAll(selector)], [root.firstChild]);
  assert_array_equals([...shadow.querySelectorAll(selector)], [shadow.firstChild]);
  shadow.firstChild.remove();
  assert_array_equals([...shadow.querySelectorAll(selector)], []);
  assert_array_equals([...root.querySelectorAll(selector)], [root.firstChild]);
}, "Repeated queries keep light and shadow trees separate");

test(() => {
  const root = document.createElement("div");
  root.innerHTML = '<input type="checkbox"><input>';
  document.body.append(root);
  try {
    const checkbox = root.firstChild;
    const input = root.lastChild;
    assert_equals(root.querySelectorAll(":checked").length, 0);
    checkbox.checked = true;
    assert_array_equals([...root.querySelectorAll(":checked")], [checkbox]);
    checkbox.checked = false;
    assert_equals(root.querySelectorAll(":checked").length, 0);
    assert_equals(root.querySelectorAll(":focus").length, 0);
    input.focus();
    assert_array_equals([...root.querySelectorAll(":focus")], [input]);
    input.blur();
    assert_equals(root.querySelectorAll(":focus").length, 0);
  } finally {
    root.remove();
  }
}, "Repeated queries observe property changes and focus changes");

test(() => {
  const root = document.createElement("div");
  root.innerHTML = '<span data-testid="target"></span>';
  const selector = '[data-testid="target"]';
  assert_equals(root.querySelectorAll(selector).length, 1);
  for (let i = 0; i < 40; ++i) {
    assert_equals(root.querySelectorAll(`[data-testid="${i}"]`).length, 0);
  }
  assert_array_equals([...root.querySelectorAll(selector)], [root.firstChild]);
  for (let i = 0; i < 2; ++i) {
    assert_throws_dom("SyntaxError", () => root.querySelectorAll('[data-testid="target"] invalid['));
  }
}, "Many distinct queries preserve results and syntax errors");

test(() => {
  const html = document.implementation.createHTMLDocument();
  const xml = document.implementation.createDocument(null, "root");
  const host = html.createElement("div");
  host.innerHTML = '<div><span data-testid="target"></span></div>';
  const shadow = host.attachShadow({ mode: "closed" });
  shadow.innerHTML = '<span data-testid="shadow"></span>';
  const roots = [host, host.firstChild, shadow];
  const selector = "[DATA-TESTID]";
  for (const root of roots) {
    assert_equals(root.querySelectorAll(selector).length, 1);
  }
  xml.adoptNode(host);
  for (const root of roots) {
    assert_equals(root.querySelectorAll(selector).length, 0);
  }
  html.adoptNode(host);
  for (const root of roots) {
    assert_equals(root.querySelectorAll(selector).length, 1);
  }
}, "Adoption updates attribute name matching in descendant and shadow query roots");

test(() => {
  const root = document.createElement("div");
  root.innerHTML = "<span></span>";
  const child = root.firstChild;
  assert_equals(root.querySelectorAll("[style]").length, 0);
  child.style.color = "red";
  assert_array_equals([...root.querySelectorAll("[style]")], [child]);
  const selector = '[data-testid="target"]';
  assert_equals(root.querySelectorAll(selector).length, 0);
  child.dataset.testid = "target";
  assert_array_equals([...root.querySelectorAll(selector)], [child]);
  child.attributes.removeNamedItem("data-testid");
  assert_equals(root.querySelectorAll(selector).length, 0);
  const attr = document.createAttribute("data-testid");
  attr.value = "target";
  child.setAttributeNode(attr);
  assert_array_equals([...root.querySelectorAll(selector)], [child]);
  root.innerHTML = '<b data-testid="target"></b>';
  assert_array_equals([...root.querySelectorAll(selector)], [root.firstChild]);
}, "Reflected attributes, attribute nodes, and innerHTML update repeated queries");

test(() => {
  const root = document.createElement("div");
  root.innerHTML = '<input data-testid="target" type="checkbox">';
  const input = root.firstChild;
  const selector = '[data-testid="target"]:checked';
  assert_equals(root.querySelectorAll(selector).length, 0);
  input.checked = true;
  assert_array_equals([...root.querySelectorAll(selector)], [input]);
  input.checked = false;
  assert_equals(root.querySelectorAll(selector).length, 0);
}, "An attribute selector followed by a pseudo-class observes state changes");

for (const selector of [
  "[data-testid='target']",
  '[data-testid="TARGET" i]',
  '[data-testid="tar\\67 et"]',
  ' [data-testid="target"] '
]) {
  test(() => {
    const root = document.createElement("div");
    root.innerHTML = '<span data-testid="target"></span>';
    const child = root.firstChild;
    const result = root.querySelectorAll(selector);
    assert_array_equals([...result], [child]);
    child.removeAttribute("data-testid");
    assert_equals(root.querySelectorAll(selector).length, 0);
    assert_array_equals([...result], [child]);
  }, `Repeated ${selector} queries handle attribute changes`);
}

for (const length of [230, 300]) {
  test(() => {
    const root = document.createElement("div");
    const child = root.appendChild(document.createElement("span"));
    const value = "x".repeat(length);
    const selector = `[data-testid="${value}"]`;
    assert_equals(root.querySelectorAll(selector).length, 0);
    child.setAttribute("data-testid", value);
    assert_array_equals([...root.querySelectorAll(selector)], [child]);
    child.remove();
    assert_equals(root.querySelectorAll(selector).length, 0);
  }, `Attribute equality queries with ${length}-character values handle mutations`);
}

test(() => {
  const parent = document.createElement("div");
  parent.innerHTML = '<div><span data-testid="target"></span></div>';
  const root = parent.firstChild;
  const selector = '[data-state="on"] [data-testid]';
  parent.setAttribute("data-state", "on");
  assert_array_equals([...root.querySelectorAll(selector)], [root.firstChild]);
  parent.removeAttribute("data-state");
  assert_equals(root.querySelectorAll(selector).length, 0);
}, "Repeated descendant queries observe changes to attributes outside the query root");
