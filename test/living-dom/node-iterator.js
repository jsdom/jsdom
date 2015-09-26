"use strict";
const jsdom = require("../..");
const load = require("../util").load(__dirname);

function descendants(root) {
  let ret = [];

  for (let i = 0; i < root.childNodes.length; ++i) {
    const child = root.childNodes[i];
    ret.push(child);
    ret = ret.concat(descendants(child));
  }

  return ret;
}

function forwardIterator(it, nodeOrName) {
  for (let c = 0; c < 1000; ++c) {
    const node = it.nextNode();

    if (typeof nodeOrName === "string" &&
        node.nodeName === nodeOrName) {
      return node;
    }

    if (nodeOrName === node) {
      return node;
    }

    if (node === null) {
      throw Error("Unable to find node in forwardIterator() because nextNode() returned null");
    }
  }

  throw Error("Unable to find node in forwardIterator() after a lot of tries");
}

function removeAndReinsert(node) {
  const parent = node.parentNode;
  const nextSibling = node.nextSibling;

  // Remove it and re insert in the same location
  // the DOM tree will be identical, however it should have
  // affected the state of the node iterator because of the "removing steps"
  parent.removeChild(node);
  parent.insertBefore(node, nextSibling);
}

exports["createNodeIterator(): should throw if the first argument is missing"] = t => {
  const doc = load("test");
  t.throws(() => doc.createNodeIterator(), /not enough arguments/i);
  t.done();
};

exports["createNodeIterator(): should throw if the filter argument is not a function or NodeFilter"] = t => {
  const doc = load("test");

  t.throws(() => doc.createNodeIterator(doc, -1, {}), /Argument.*NodeFilter/i);
  t.done();
};

exports["createNodeIterator(): should set defaults for missing arguments"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body);

  t.ok(it.root, "root should be set");
  t.strictEqual(it.root.nodeName, "BODY", "root was set to the <body>");
  t.ok(it.referenceNode === it.root, "referenceNode should be set to root right after creation");
  t.strictEqual(it.pointerBeforeReferenceNode, true, "pointerBeforeReferenceNode should be true right after creation");
  t.strictEqual(it.whatToShow, 0xFFFFFFFF, "whatToShow is NodeFilter.SHOW_ALL by default");
  t.strictEqual(it.filter, null, "filter is null by default");
  t.done();
};

exports["createNodeIterator(): whatToShow should unset high bits"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body, 0xFFFFFFFFFF); // (two extra F's)
  t.strictEqual(it.whatToShow, 0xFFFFFFFF, "whatToShow should unset high bits");
  t.done();
};

exports["new NodeIterator() is not allowed"] = t => {
  const doc = load("test");

  t.throws(() => new doc.defaultView.NodeIterator(), /Illegal constructor/i);

  t.done();
};

exports["createNodeIterator(): should create an instanceof NodeIterator"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc);
  t.strictEqual(Object.getPrototypeOf(it).constructor.name, "NodeIterator");
  t.done();
};

exports["too many concurrent iterators should throw when accessing the iterator"] = t => {
  /* eslint-disable no-unused-expressions */
  const doc = jsdom.jsdom("<html/>", { concurrentNodeIterators: 3 });

  const iterators = [
    doc.createNodeIterator(doc),
    doc.createNodeIterator(doc),
    doc.createNodeIterator(doc),
    doc.createNodeIterator(doc)
  ];

  t.throws(() => iterators[0].referenceNode, /no longer active/i);

  t.throws(() => iterators[0].pointerBeforeReferenceNode, /no longer active/i);

  t.throws(() => iterators[0].nextNode(), /no longer active/i);

  t.throws(() => iterators[0].previousNode(), /no longer active/i);

  // Other getters / method should not fail because they
  // are not affected by removing steps

  iterators[0].root;
  iterators[0].whatToShow;
  iterators[0].filter;
  iterators[0].detach(); // (noop)

  // The 3 newer iterators should not fail
  for (let i = 1; i < iterators.length; ++i) {
    iterators[i].referenceNode;
    iterators[i].pointerBeforeReferenceNode;
    iterators[i].nextNode();
    iterators[i].previousNode();
    iterators[i].root;
    iterators[i].whatToShow;
    iterators[i].filter;
    iterators[i].detach(); // (noop)
  }

  t.done();
  /* eslint-enable no-unused-expressions */
};

exports["detach() should be a no-op"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc);
  it.detach();
  it.detach();
  t.done();
};

exports["filter exceptions should be propagated"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc, 0xFFFFFFFF, () => {
    throw Error("Foo Bar!");
  });

  t.throws(() => it.nextNode(), /^Foo Bar!$/);

  t.done();
};

exports["NodeIterator instances should not expose any extra properties"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc);

  for (const key in it) {
    switch (key) {
      case "nextNode":
      case "previousNode":
      case "detach":
      case "root":
      case "referenceNode":
      case "pointerBeforeReferenceNode":
      case "whatToShow":
      case "filter":
      case "toString":
        t.ok(!it.hasOwnProperty(key), key + " should not be an 'own' property");
        break;
      default:
        t.ok(false, key + " is not a valid NodeIterator property");
    }
  }

  t.done();
};

exports["The first nextNode() call should return the root"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body);

  const node = it.nextNode();
  t.ok(node === it.root);
  t.ok(it.referenceNode === it.root);
  t.strictEqual(it.pointerBeforeReferenceNode, false, "pointerBeforeReferenceNode should be false after nextNode()");

  t.done();
};

exports["nextNode() should iterate over each descendant of root (in tree order)"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body);

  it.nextNode(); // skip the root node

  const nodes = descendants(it.root);
  for (const node of nodes) {
    const itNode = it.nextNode();
    t.ok(node === itNode);
    t.ok(it.referenceNode === itNode);
    t.strictEqual(it.pointerBeforeReferenceNode, false, "pointerBeforeReferenceNode should be false after nextNode()");
  }

  const node = it.nextNode();
  t.ok(node === null, "nextNode should return null after having iterated through all the nodes");
  t.ok(it.referenceNode === nodes[nodes.length - 1],
       "referenceNode should reference the last node even though nextNode() returns null");
  t.strictEqual(it.pointerBeforeReferenceNode, false, "pointerBeforeReferenceNode should be false after nextNode()");
  t.done();
};

exports["iterating over nodes of a foreign document should be allowed"] = t => {
  const doc = jsdom.jsdom("<html/>");
  const foreignDoc = load("test");
  const it = doc.createNodeIterator(foreignDoc.body);

  it.nextNode(); // skip the root node

  const nodes = descendants(it.root);
  for (const node of nodes) {
    const itNode = it.nextNode();
    t.ok(node === itNode);
    t.ok(it.referenceNode === itNode);
    t.strictEqual(it.pointerBeforeReferenceNode, false, "pointerBeforeReferenceNode should be false after nextNode()");
  }

  const node = it.nextNode();
  t.ok(node === null, "nextNode should return null after having iterated through all the nodes");
  t.ok(it.referenceNode === nodes[nodes.length - 1],
       "referenceNode should reference the last node even though nextNode() returns null");
  t.strictEqual(it.pointerBeforeReferenceNode, false, "pointerBeforeReferenceNode should be false after nextNode()");
  t.done();
};

exports["previousNode() should have no effect on a newly created iterator"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body);

  const node = it.previousNode();
  t.ok(node === null);
  t.ok(it.referenceNode === it.root);
  t.strictEqual(it.pointerBeforeReferenceNode, true);

  t.done();
};

exports["The root should be the last node that previousNode() will return"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body);

  it.nextNode();
  const node = it.previousNode();
  t.ok(node === it.root);
  t.ok(it.referenceNode === it.root);
  t.strictEqual(it.pointerBeforeReferenceNode, true, "pointerBeforeReferenceNode should be true after previousNode()");

  t.done();
};

exports["previousNode() should return the same node that nextNode() just returned"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body);

  it.nextNode(); // skip the root, this is tested in a different case
  const wasNext = it.nextNode();
  const node = it.previousNode();

  t.ok(node === wasNext);
  t.done();
};

exports["previousNode() should iterate over each descendant of root (in reverse tree order)"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body);

  forwardIterator(it, null); // skip to the end

  const nodes = descendants(it.root).reverse();
  for (const node of nodes) {
    const itNode = it.previousNode();
    t.ok(node === itNode);
    t.ok(it.referenceNode === itNode);
    t.strictEqual(it.pointerBeforeReferenceNode, true,
                  "pointerBeforeReferenceNode should be true after previousNode()");
  }

  const node = it.previousNode();
  t.ok(node === it.root);
  t.ok(it.referenceNode === it.root);
  t.strictEqual(it.pointerBeforeReferenceNode, true, "pointerBeforeReferenceNode should be true after previousNode()");

  const node2 = it.previousNode();
  t.ok(node2 === null, "nextNode should return null after having iterated through all the nodes");
  t.ok(it.referenceNode === it.root,
       "referenceNode should reference root node even though previousNode() returns null");
  t.strictEqual(it.pointerBeforeReferenceNode, true, "pointerBeforeReferenceNode should be true after previousNode()");
  t.done();
};

exports["whatToShow should skip nodes of types not present in the bitset"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body, 0x00000001 | 0x00000080); // SHOW_ELEMENT | SHOW_COMMENT

  it.nextNode(); // skip the root node

  let hasElement = false;
  let hasComment = false;
  let hasOther = false;

  const nodes = descendants(it.root).filter(node => {
    if (node.nodeType === 1) {
      hasElement = true;
      return true;
    }

    if (node.nodeType === 8) {
      hasComment = true;
      return true;
    }

    hasOther = true;
    return false;
  });

  // If these node types are not encountered,
  // the test case is not very useful:
  t.ok(hasElement);
  t.ok(hasComment);
  t.ok(hasOther);


  for (const node of nodes) {
    const itNode = it.nextNode();
    t.ok(node === itNode);
  }

  const node = it.nextNode();
  t.ok(node === null, "nextNode should return null after having iterated through all the nodes");
  t.done();
};

exports["should skip nodes using a filter function"] = t => {
  const doc = load("test");

  function acceptNode(node) {
    t.strictEqual(node.nodeType, 1, "whatToShow should have filtered non element nodes before acceptNode() is called");

    if (node.nodeName === "STRONG") {
      return 1; // FILTER_ACCEPT
    }

    return 3; // FILTER_REJECT
  }

  const it = doc.createNodeIterator(doc.body, 0x00000001, acceptNode); // SHOW_ELEMENT

  const nodes = descendants(it.root).filter(node => node.nodeName === "STRONG");

  t.ok(nodes.length, "Test case prerequisite");

  for (const node of nodes) {
    const itNode = it.nextNode();
    t.ok(node === itNode);
  }

  const node = it.nextNode();
  t.ok(node === null, "nextNode should return null after having iterated through all the nodes");
  t.done();
};

exports["should skip nodes using a NodeFilter as a filter"] = t => {
  const doc = load("test");

  function acceptNode(node) {
    t.strictEqual(node.nodeType, 1, "whatToShow should have filtered non element nodes before acceptNode() is called");

    if (node.nodeName === "STRONG") {
      return 1; // FILTER_ACCEPT
    }

    return 3; // FILTER_REJECT
  }

  const it = doc.createNodeIterator(doc.body, 0x00000001, { acceptNode }); // SHOW_ELEMENT

  const nodes = descendants(it.root).filter(node => node.nodeName === "STRONG");

  t.ok(nodes.length, "Test case prerequisite");

  for (const node of nodes) {
    const itNode = it.nextNode();
    t.ok(node === itNode);
  }

  const node = it.nextNode();
  t.ok(node === null, "nextNode should return null after having iterated through all the nodes");
  t.done();
};

exports["filter function should also accept booleans as a return value"] = t => {
  const doc = load("test");

  function acceptNode(node) {
    return node.nodeName === "STRONG";
  }

  const it = doc.createNodeIterator(doc.body, 0x00000001, acceptNode); // SHOW_ELEMENT

  const nodes = descendants(it.root).filter(node => node.nodeName === "STRONG");

  t.ok(nodes.length, "Test case prerequisite");

  for (const node of nodes) {
    const itNode = it.nextNode();
    t.ok(node === itNode);
  }

  const node = it.nextNode();
  t.ok(node === null, "nextNode should return null after having iterated through all the nodes");
  t.done();
};

exports["Removing the root node should not affect the iterator state"] = t => {
  // This behaviour is not noted explicitly in the spec, however this how all the browsers behave
  // (and it makes sense)

  const doc = load("test");

  const node = doc.body.childNodes[1];
  const it = doc.createNodeIterator(node);
  doc.body.removeChild(node);

  t.ok(it.root === node);
  t.ok(it.referenceNode === node, "referenceNode should be set to root right after creation");
  t.strictEqual(it.pointerBeforeReferenceNode, true, "pointerBeforeReferenceNode should be true right after creation");
  t.ok(it.referenceNode.parentNode === null);
  t.done();
};

exports["Removing a node that is not an inclusive ancestor of the referenceNode should not affect the state"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body);
  t.ok(it.root.childNodes.length >= 2, "Test case prerequisite");

  it.nextNode(); // skip the root
  it.nextNode();
  it.nextNode(); // referenceNode is now the second child of the root
  removeAndReinsert(it.root.firstChild);

  t.ok(it.root === doc.body);
  t.ok(it.referenceNode === it.root.childNodes[1]);
  t.strictEqual(it.pointerBeforeReferenceNode, false);
  t.done();
};

exports["Removing the referenceNode after nextNode() should update the state properly (null oldPreviousSibling)"] =
t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body);

  it.nextNode(); // skip the root

  const removed = it.nextNode(); // referenceNode is now the first child of <body>
  removeAndReinsert(removed);

  t.ok(it.referenceNode === it.root, "referenceNode should be root again");
  t.ok(it.pointerBeforeReferenceNode === false, "should be false so that nextNode() will return the firstChild again");

  const next = it.nextNode();
  t.ok(next === it.root.firstChild,
                "nextNode() should return the first child again after the previous one was removed");

  t.done();
};

exports["Removing the referenceNode after nextNode() should update the state properly (non-null oldPreviousSibling)"] =
t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body.children[0]);
  t.ok(it.root.childNodes.length >= 3, "Test case prerequisite");

  it.nextNode(); // skip the root

  const removed = it.root.childNodes[1];
  forwardIterator(it, removed); // referenceNode is now the second child of root
  removeAndReinsert(removed);

  t.ok(it.referenceNode === it.root.firstChild,
       "referenceNode should be set the the oldPreviousSibling of the removed node");
  t.strictEqual(it.pointerBeforeReferenceNode, false);

  const next = it.nextNode();
  t.ok(next === it.root.childNodes[1], "nextNode() should return the second child again");

  t.done();
};

exports["Removing and reinserting the referenceNode after nextNode() should iterate it again"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body);

  it.nextNode(); // skip the root

  const removed = it.nextNode();
  removeAndReinsert(removed);

  t.ok(it.referenceNode === it.root, "referenceNode should be root again");
  t.strictEqual(it.pointerBeforeReferenceNode, false,
                "should be false so that nextNode() will return the firstChild again");

  const next = it.nextNode();
  t.ok(next === removed);

  t.done();
};

exports["Removing and reinserting the referenceNode after previousNode() should iterate it again"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body);

  it.nextNode(); // skip the root
  it.nextNode();

  const removed = it.previousNode();
  const nextSibling = removed.nextSibling;
  removeAndReinsert(removed);

  t.ok(it.referenceNode === nextSibling, "referenceNode should be the nextSibling of the removed node");
  t.strictEqual(it.pointerBeforeReferenceNode, true,
                "should be true so that previousNode() will return the same node again");

  const previous = it.previousNode();
  t.ok(previous === removed);

  t.done();
};

exports["Removing a parent of the referenceNode should update the state properly"] = t => {
  const doc = load("test");

  const parent = doc.body.children[1];
  const previousSibling = parent.previousSibling;
  t.ok(previousSibling, "Test case prerequisite");
  parent.innerHTML = "<a></a><b></b><i></i>";

  const it = doc.createNodeIterator(doc.body);
  forwardIterator(it, parent);
  it.nextNode();
  t.strictEqual(it.nextNode().nodeName, "B");

  removeAndReinsert(parent);

  t.ok(it.referenceNode === previousSibling);
  t.strictEqual(it.pointerBeforeReferenceNode, false);
  t.done();
};

exports["Removing referenceNode after previousNode(): oldPreviousSibling == null && " +
"oldParent.firstChild != null"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body);

  it.nextNode(); // skip the root
  it.nextNode();

  const removed = it.previousNode();
  t.ok(!removed.previousSibling, "Test case prerequisite");
  t.ok(removed.nextSibling, "Test case prerequisite");
  const nextSibling = removed.nextSibling;
  removeAndReinsert(removed);

  // (nextSibling is the new firstChild)
  t.ok(it.referenceNode === nextSibling, "referenceNode should be the nextSibling of the removed node");
  t.strictEqual(it.pointerBeforeReferenceNode, true);

  const next = it.nextNode();
  t.ok(next !== removed);
  t.ok(next === nextSibling);

  t.done();
};

exports["Removing referenceNode after previousNode(): oldPreviousSibling != null && " +
"oldPreviousSibling.nextSibling != null"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body.children[0]);

  it.nextNode(); // skip root
  it.nextNode();
  it.nextNode(); // second child
  const removed = it.previousNode(); // second child, pointerBeforeReferenceNode is now true

  t.ok(removed.previousSibling, "Test case prerequisite");
  t.ok(removed.nextSibling, "Test case prerequisite");
  const nextSibling = removed.nextSibling;

  removeAndReinsert(removed);

  t.ok(it.referenceNode === nextSibling, "referenceNode should be the nextSibling of the removed node");
  t.strictEqual(it.pointerBeforeReferenceNode, true);

  t.done();
};

exports["Removing referenceNode after previousNode(): oldPreviousSibling == null && " +
"oldParent.firstChild == null"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body);

  forwardIterator(it, "STRONG");

  const parent = it.referenceNode;
  t.ok(parent.childNodes.length === 1, "Test case prerequisite");
  t.ok(parent.nextSibling, "Test case prerequisite");

  it.nextNode();
  const removed = it.previousNode();

  removeAndReinsert(removed);

  t.ok(it.referenceNode === parent.nextSibling, "referenceNode should be the following node of the oldParent");
  t.strictEqual(it.pointerBeforeReferenceNode, true);

  t.done();
};

exports["Removing referenceNode after previousNode(): oldPreviousSibling != null && " +
"oldPreviousSibling.nextSibling == null"] = t => {
  const doc = load("test");
  const it = doc.createNodeIterator(doc.body);

  forwardIterator(it, it.root.children[0].lastChild);
  const removed = it.previousNode();

  t.ok(removed.previousSibling, "Test case prerequisite");
  t.ok(!removed.nextSibling, "Test case prerequisite");
  const parent = removed.parentNode;
  t.ok(parent.nextSibling, "Test case prerequisite");

  removeAndReinsert(removed);

  t.ok(it.referenceNode === parent.nextSibling, "referenceNode should be the following node of the oldParent");
  t.strictEqual(it.pointerBeforeReferenceNode, true);

  t.done();
};

exports["Removing referenceNode after previousNode(): node following oldParent is outside of root"] = t => {
  const doc = load("test");
  doc.body.innerHTML = "<p><a><em></em></a></p><div></div>";
  const it = doc.createNodeIterator(doc.body.firstChild);

  forwardIterator(it, "EM");
  const removed = it.previousNode();

  removeAndReinsert(removed);

  t.ok(it.referenceNode === it.root.firstChild, "referenceNode should be the oldParent");
  t.strictEqual(it.pointerBeforeReferenceNode, false);

  t.done();
};

exports["Removing referenceNode after nextNode(): oldPreviousSibling != null"] = t => {
  const doc = load("test");
  doc.body.innerHTML = "<p>Efghijkl</p><p>Mnopqrst</p>";

  const it = doc.createNodeIterator(doc);

  forwardIterator(it, null);

  const removed = doc.body.children[1];
  removed.parentNode.removeChild(removed);

  t.ok(it.referenceNode === doc.body.children[0].lastChild);
  t.strictEqual(it.pointerBeforeReferenceNode, false);
  t.done();
};
