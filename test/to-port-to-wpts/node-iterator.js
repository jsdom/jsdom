"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
const load = require("../util.js").load(__dirname);

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
  const { nextSibling } = node;

  // Remove it and re insert in the same location
  // the DOM tree will be identical, however it should have
  // affected the state of the node iterator because of the "removing steps"
  parent.removeChild(node);
  parent.insertBefore(node, nextSibling);
}

describe("node-contains", { skipIfBrowser: true }, () => {
  specify(
    "createNodeIterator(): should throw if the first argument is missing",
    () => {
      const doc = load("test");
      assert.throws(() => doc.createNodeIterator(), TypeError);
    }
  );

  specify(
    "createNodeIterator(): should not throw yet if the filter argument is not a function or NodeFilter",
    () => {
      const doc = load("test");

      doc.createNodeIterator(doc, -1, {});
    }
  );

  specify("createNodeIterator(): should set defaults for missing arguments", () => {
    const doc = load("test");
    const it = doc.createNodeIterator(doc.body);

    assert.ok(it.root, "root should be set");
    assert.strictEqual(it.root.nodeName, "BODY", "root was set to the <body>");
    assert.ok(it.referenceNode === it.root, "referenceNode should be set to root right after creation");
    assert.strictEqual(
      it.pointerBeforeReferenceNode, true,
      "pointerBeforeReferenceNode should be true right after creation"
    );
    assert.strictEqual(it.whatToShow, 0xFFFFFFFF, "whatToShow is NodeFilter.SHOW_ALL by default");
    assert.strictEqual(it.filter, null, "filter is null by default");
  });

  specify("createNodeIterator(): whatToShow should unset high bits", () => {
    const doc = load("test");
    const it = doc.createNodeIterator(doc.body, 0xFFFFFFFFFF); // (two extra F's)
    assert.strictEqual(it.whatToShow, 0xFFFFFFFF, "whatToShow should unset high bits");
  });

  specify("new NodeIterator() is not allowed", () => {
    const doc = load("test");

    assert.throws(() => new doc.defaultView.NodeIterator(), /Illegal constructor/i);
  });

  specify("createNodeIterator(): should create an instanceof NodeIterator", () => {
    const doc = load("test");
    const it = doc.createNodeIterator(doc);
    assert.strictEqual(Object.getPrototypeOf(it).constructor.name, "NodeIterator");
  });

  specify("detach() should be a no-op", () => {
    const doc = load("test");
    const it = doc.createNodeIterator(doc);
    it.detach();
    it.detach();
  });

  specify("filter exceptions should be propagated", () => {
    const doc = load("test");
    const it = doc.createNodeIterator(doc, 0xFFFFFFFF, () => {
      throw Error("Foo Bar!");
    });

    assert.throws(() => it.nextNode(), /^Foo Bar!$/);
  });

  specify("NodeIterator instances should not expose any extra properties", () => {
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
          assert.ok(!Object.prototype.hasOwnProperty.call(it, key), key + " should not be an 'own' property");
          break;
        default:
          assert.ok(false, key + " is not a valid NodeIterator property");
      }
    }
  });

  specify("The first nextNode() call should return the root", () => {
    const doc = load("test");
    const it = doc.createNodeIterator(doc.body);

    const node = it.nextNode();
    assert.ok(node === it.root);
    assert.ok(it.referenceNode === it.root);
    assert.strictEqual(
      it.pointerBeforeReferenceNode, false,
      "pointerBeforeReferenceNode should be false after nextNode()"
    );
  });

  specify(
    "nextNode() should iterate over each descendant of root (in tree order)",
    () => {
      const doc = load("test");
      const it = doc.createNodeIterator(doc.body);

      it.nextNode(); // skip the root node

      const nodes = descendants(it.root);
      for (const node of nodes) {
        const itNode = it.nextNode();
        assert.ok(node === itNode);
        assert.ok(it.referenceNode === itNode);
        assert.strictEqual(
          it.pointerBeforeReferenceNode, false,
          "pointerBeforeReferenceNode should be false after nextNode()"
        );
      }

      const node = it.nextNode();
      assert.ok(node === null, "nextNode should return null after having iterated through all the nodes");
      assert.ok(
        it.referenceNode === nodes[nodes.length - 1],
        "referenceNode should reference the last node even though nextNode() returns null"
      );
      assert.strictEqual(
        it.pointerBeforeReferenceNode, false,
        "pointerBeforeReferenceNode should be false after nextNode()"
      );
    }
  );

  specify("iterating over nodes of a foreign document should be allowed", () => {
    const doc = (new JSDOM("<html/>")).window.document;
    const foreignDoc = load("test");
    const it = doc.createNodeIterator(foreignDoc.body);

    it.nextNode(); // skip the root node

    const nodes = descendants(it.root);
    for (const node of nodes) {
      const itNode = it.nextNode();
      assert.ok(node === itNode);
      assert.ok(it.referenceNode === itNode);
      assert.strictEqual(
        it.pointerBeforeReferenceNode, false,
        "pointerBeforeReferenceNode should be false after nextNode()"
      );
    }

    const node = it.nextNode();
    assert.ok(node === null, "nextNode should return null after having iterated through all the nodes");
    assert.ok(
      it.referenceNode === nodes[nodes.length - 1],
      "referenceNode should reference the last node even though nextNode() returns null"
    );
    assert.strictEqual(
      it.pointerBeforeReferenceNode, false,
      "pointerBeforeReferenceNode should be false after nextNode()"
    );
  });

  specify(
    "previousNode() should have no effect on a newly created iterator",
    () => {
      const doc = load("test");
      const it = doc.createNodeIterator(doc.body);

      const node = it.previousNode();
      assert.ok(node === null);
      assert.ok(it.referenceNode === it.root);
      assert.strictEqual(it.pointerBeforeReferenceNode, true);
    }
  );

  specify(
    "The root should be the last node that previousNode() will return",
    () => {
      const doc = load("test");
      const it = doc.createNodeIterator(doc.body);

      it.nextNode();
      const node = it.previousNode();
      assert.ok(node === it.root);
      assert.ok(it.referenceNode === it.root);
      assert.strictEqual(
        it.pointerBeforeReferenceNode, true,
        "pointerBeforeReferenceNode should be true after previousNode()"
      );
    }
  );

  specify(
    "previousNode() should return the same node that nextNode() just returned",
    () => {
      const doc = load("test");
      const it = doc.createNodeIterator(doc.body);

      it.nextNode(); // skip the root, this is tested in a different case
      const wasNext = it.nextNode();
      const node = it.previousNode();

      assert.ok(node === wasNext);
    }
  );

  specify(
    "previousNode() should iterate over each descendant of root (in reverse tree order)",
    () => {
      const doc = load("test");
      const it = doc.createNodeIterator(doc.body);

      forwardIterator(it, null); // skip to the end

      const nodes = descendants(it.root).reverse();
      for (const node of nodes) {
        const itNode = it.previousNode();
        assert.ok(node === itNode);
        assert.ok(it.referenceNode === itNode);
        assert.strictEqual(
          it.pointerBeforeReferenceNode, true,
          "pointerBeforeReferenceNode should be true after previousNode()"
        );
      }

      const node = it.previousNode();
      assert.ok(node === it.root);
      assert.ok(it.referenceNode === it.root);
      assert.strictEqual(
        it.pointerBeforeReferenceNode, true,
        "pointerBeforeReferenceNode should be true after previousNode()"
      );

      const node2 = it.previousNode();
      assert.ok(node2 === null, "nextNode should return null after having iterated through all the nodes");
      assert.ok(
        it.referenceNode === it.root,
        "referenceNode should reference root node even though previousNode() returns null"
      );
      assert.strictEqual(
        it.pointerBeforeReferenceNode, true,
        "pointerBeforeReferenceNode should be true after previousNode()"
      );
    }
  );

  specify("whatToShow should skip nodes of types not present in the bitset", () => {
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
    assert.ok(hasElement);
    assert.ok(hasComment);
    assert.ok(hasOther);


    for (const node of nodes) {
      const itNode = it.nextNode();
      assert.ok(node === itNode);
    }

    const node = it.nextNode();
    assert.ok(node === null, "nextNode should return null after having iterated through all the nodes");
  });

  specify("should skip nodes using a filter function", () => {
    const doc = load("test");

    function acceptNode(node) {
      assert.strictEqual(
        node.nodeType, 1,
        "whatToShow should have filtered non element nodes before acceptNode() is called"
      );

      if (node.nodeName === "STRONG") {
        return 1; // FILTER_ACCEPT
      }

      return 3; // FILTER_REJECT
    }

    const it = doc.createNodeIterator(doc.body, 0x00000001, acceptNode); // SHOW_ELEMENT

    const nodes = descendants(it.root).filter(node => node.nodeName === "STRONG");

    assert.ok(nodes.length, "Test case prerequisite");

    for (const node of nodes) {
      const itNode = it.nextNode();
      assert.ok(node === itNode);
    }

    const node = it.nextNode();
    assert.ok(node === null, "nextNode should return null after having iterated through all the nodes");
  });

  specify("should skip nodes using a NodeFilter as a filter", () => {
    const doc = load("test");

    function acceptNode(node) {
      assert.strictEqual(
        node.nodeType, 1,
        "whatToShow should have filtered non element nodes before acceptNode() is called"
      );

      if (node.nodeName === "STRONG") {
        return 1; // FILTER_ACCEPT
      }

      return 3; // FILTER_REJECT
    }

    const it = doc.createNodeIterator(doc.body, 0x00000001, { acceptNode }); // SHOW_ELEMENT

    const nodes = descendants(it.root).filter(node => node.nodeName === "STRONG");

    assert.ok(nodes.length, "Test case prerequisite");

    for (const node of nodes) {
      const itNode = it.nextNode();
      assert.ok(node === itNode);
    }

    const node = it.nextNode();
    assert.ok(node === null, "nextNode should return null after having iterated through all the nodes");
  });

  specify("filter function should also accept booleans as a return value", () => {
    const doc = load("test");

    function acceptNode(node) {
      return node.nodeName === "STRONG";
    }

    const it = doc.createNodeIterator(doc.body, 0x00000001, acceptNode); // SHOW_ELEMENT

    const nodes = descendants(it.root).filter(node => node.nodeName === "STRONG");

    assert.ok(nodes.length, "Test case prerequisite");

    for (const node of nodes) {
      const itNode = it.nextNode();
      assert.ok(node === itNode);
    }

    const node = it.nextNode();
    assert.ok(node === null, "nextNode should return null after having iterated through all the nodes");
  });

  specify("Removing the root node should not affect the iterator state", () => {
    // This behaviour is not noted explicitly in the spec, however this how all the browsers behave
    // (and it makes sense)

    const doc = load("test");

    const node = doc.body.childNodes[1];
    const it = doc.createNodeIterator(node);
    doc.body.removeChild(node);

    assert.ok(it.root === node);
    assert.ok(it.referenceNode === node, "referenceNode should be set to root right after creation");
    assert.strictEqual(
      it.pointerBeforeReferenceNode, true,
      "pointerBeforeReferenceNode should be true right after creation"
    );
    assert.ok(it.referenceNode.parentNode === null);
  });

  specify(
    "Removing a node that is not an inclusive ancestor of the referenceNode should not affect the state",
    () => {
      const doc = load("test");
      const it = doc.createNodeIterator(doc.body);
      assert.ok(it.root.childNodes.length >= 2, "Test case prerequisite");

      it.nextNode(); // skip the root
      it.nextNode();
      it.nextNode(); // referenceNode is now the second child of the root
      removeAndReinsert(it.root.firstChild);

      assert.ok(it.root === doc.body);
      assert.ok(it.referenceNode === it.root.childNodes[1]);
      assert.strictEqual(it.pointerBeforeReferenceNode, false);
    }
  );

  specify(
    "Removing the referenceNode after nextNode() should update the state properly (null oldPreviousSibling)",
    () => {
      const doc = load("test");
      const it = doc.createNodeIterator(doc.body);

      it.nextNode(); // skip the root

      const removed = it.nextNode(); // referenceNode is now the first child of <body>
      removeAndReinsert(removed);

      assert.ok(it.referenceNode === it.root, "referenceNode should be root again");
      assert.ok(
        it.pointerBeforeReferenceNode === false,
        "should be false so that nextNode() will return the firstChild again"
      );

      const next = it.nextNode();
      assert.ok(
        next === it.root.firstChild,
        "nextNode() should return the first child again after the previous one was removed"
      );
    }
  );

  specify(
    "Removing the referenceNode after nextNode() should update the state properly (non-null oldPreviousSibling)",
    () => {
      const doc = load("test");
      const it = doc.createNodeIterator(doc.body.children[0]);
      assert.ok(it.root.childNodes.length >= 3, "Test case prerequisite");

      it.nextNode(); // skip the root

      const removed = it.root.childNodes[1];
      forwardIterator(it, removed); // referenceNode is now the second child of root
      removeAndReinsert(removed);

      assert.ok(
        it.referenceNode === it.root.firstChild,
        "referenceNode should be set the the oldPreviousSibling of the removed node"
      );
      assert.strictEqual(it.pointerBeforeReferenceNode, false);

      const next = it.nextNode();
      assert.ok(next === it.root.childNodes[1], "nextNode() should return the second child again");
    }
  );

  specify(
    "Removing and reinserting the referenceNode after nextNode() should iterate it again",
    () => {
      const doc = load("test");
      const it = doc.createNodeIterator(doc.body);

      it.nextNode(); // skip the root

      const removed = it.nextNode();
      removeAndReinsert(removed);

      assert.ok(it.referenceNode === it.root, "referenceNode should be root again");
      assert.strictEqual(
        it.pointerBeforeReferenceNode, false,
        "should be false so that nextNode() will return the firstChild again"
      );

      const next = it.nextNode();
      assert.ok(next === removed);
    }
  );

  specify(
    "Removing and reinserting the referenceNode after previousNode() should iterate it again",
    () => {
      const doc = load("test");
      const it = doc.createNodeIterator(doc.body);

      it.nextNode(); // skip the root
      it.nextNode();

      const removed = it.previousNode();
      const { nextSibling } = removed;
      removeAndReinsert(removed);

      assert.ok(it.referenceNode === nextSibling, "referenceNode should be the nextSibling of the removed node");
      assert.strictEqual(
        it.pointerBeforeReferenceNode, true,
        "should be true so that previousNode() will return the same node again"
      );

      const previous = it.previousNode();
      assert.ok(previous === removed);
    }
  );

  specify(
    "Removing a parent of the referenceNode should update the state properly",
    () => {
      const doc = load("test");

      const parent = doc.body.children[1];
      const { previousSibling } = parent;
      assert.ok(previousSibling, "Test case prerequisite");
      parent.innerHTML = "<a></a><b></b><i></i>";

      const it = doc.createNodeIterator(doc.body);
      forwardIterator(it, parent);
      it.nextNode();
      assert.strictEqual(it.nextNode().nodeName, "B");

      removeAndReinsert(parent);

      assert.ok(it.referenceNode === previousSibling);
      assert.strictEqual(it.pointerBeforeReferenceNode, false);
    }
  );

  specify(
    "Removing referenceNode after previousNode(): oldPreviousSibling == null && oldParent.firstChild != null",
    () => {
      const doc = load("test");
      const it = doc.createNodeIterator(doc.body);

      it.nextNode(); // skip the root
      it.nextNode();

      const removed = it.previousNode();
      assert.ok(!removed.previousSibling, "Test case prerequisite");
      assert.ok(removed.nextSibling, "Test case prerequisite");
      const { nextSibling } = removed;
      removeAndReinsert(removed);

      // (nextSibling is the new firstChild)
      assert.ok(it.referenceNode === nextSibling, "referenceNode should be the nextSibling of the removed node");
      assert.strictEqual(it.pointerBeforeReferenceNode, true);

      const next = it.nextNode();
      assert.ok(next !== removed);
      assert.ok(next === nextSibling);
    }
  );

  specify(
    "Removing referenceNode after previousNode(): oldPreviousSibling != null && oldPreviousSibling.nextSibling != null",
    () => {
      const doc = load("test");
      const it = doc.createNodeIterator(doc.body.children[0]);

      it.nextNode(); // skip root
      it.nextNode();
      it.nextNode(); // second child
      const removed = it.previousNode(); // second child, pointerBeforeReferenceNode is now true

      assert.ok(removed.previousSibling, "Test case prerequisite");
      assert.ok(removed.nextSibling, "Test case prerequisite");
      const { nextSibling } = removed;

      removeAndReinsert(removed);

      assert.ok(it.referenceNode === nextSibling, "referenceNode should be the nextSibling of the removed node");
      assert.strictEqual(it.pointerBeforeReferenceNode, true);
    }
  );

  specify(
    "Removing referenceNode after previousNode(): oldPreviousSibling == null && oldParent.firstChild == null",
    () => {
      const doc = load("test");
      const it = doc.createNodeIterator(doc.body);

      forwardIterator(it, "STRONG");

      const parent = it.referenceNode;
      assert.ok(parent.childNodes.length === 1, "Test case prerequisite");
      assert.ok(parent.nextSibling, "Test case prerequisite");

      it.nextNode();
      const removed = it.previousNode();

      removeAndReinsert(removed);

      assert.ok(it.referenceNode === parent.nextSibling, "referenceNode should be the following node of the oldParent");
      assert.strictEqual(it.pointerBeforeReferenceNode, true);
    }
  );

  specify(
    "Removing referenceNode after previousNode(): oldPreviousSibling != null && oldPreviousSibling.nextSibling == null",
    () => {
      const doc = load("test");
      const it = doc.createNodeIterator(doc.body);

      forwardIterator(it, it.root.children[0].lastChild);
      const removed = it.previousNode();

      assert.ok(removed.previousSibling, "Test case prerequisite");
      assert.ok(!removed.nextSibling, "Test case prerequisite");
      const parent = removed.parentNode;
      assert.ok(parent.nextSibling, "Test case prerequisite");

      removeAndReinsert(removed);

      assert.ok(it.referenceNode === parent.nextSibling, "referenceNode should be the following node of the oldParent");
      assert.strictEqual(it.pointerBeforeReferenceNode, true);
    }
  );

  specify(
    "Removing referenceNode after previousNode(): node following oldParent is outside of root",
    () => {
      const doc = load("test");
      doc.body.innerHTML = "<p><a><em></em></a></p><div></div>";
      const it = doc.createNodeIterator(doc.body.firstChild);

      forwardIterator(it, "EM");
      const removed = it.previousNode();

      removeAndReinsert(removed);

      assert.ok(it.referenceNode === it.root.firstChild, "referenceNode should be the oldParent");
      assert.strictEqual(it.pointerBeforeReferenceNode, false);
    }
  );

  specify(
    "Removing referenceNode after nextNode(): oldPreviousSibling != null",
    () => {
      const doc = load("test");
      doc.body.innerHTML = "<p>Efghijkl</p><p>Mnopqrst</p>";

      const it = doc.createNodeIterator(doc);

      forwardIterator(it, null);

      const removed = doc.body.children[1];
      removed.parentNode.removeChild(removed);

      assert.ok(it.referenceNode === doc.body.children[0].lastChild);
      assert.strictEqual(it.pointerBeforeReferenceNode, false);
    }
  );
});
