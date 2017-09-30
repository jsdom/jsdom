"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const load = require("../util.js").load(__dirname);

// Tests for node.contains
// Spec: http://dom.spec.whatwg.org/#dom-node-contains

describe("node-contains", { skipIfBrowser: true }, () => {
  specify("A node should contain its document type", () => {
    const doc = load("test");
    const { doctype } = doc;

    assert.ok(doc.contains(doctype), "Document contains its DocumentType");
    assert.ok(!doctype.contains(doc), "DocumentType does not contain its Document");
  });

  specify("A Document should be an inclusive descendant of itself", () => {
    const doc = load("test");

    assert.ok(doc.contains(doc), "Document contains itself");
  });

  specify(
    "A document should contain its document element but not the reverse",
    () => {
      const doc = load("test");
      const docElement = doc.documentElement;

      assert.ok(doc.contains(docElement), "Document contains its DocumentElement");
      assert.ok(!docElement.contains(doc), "Document Element does not contain its Document");
    }
  );

  specify(
    "A DocumentElement should contain a newly created and appended element",
    () => {
      const doc = load("test");
      const docElement = doc.documentElement;
      const newElement = doc.createElementNS("http://www.w3.org/1999/xhtml", "br");

      docElement.appendChild(newElement);

      assert.ok(docElement.contains(newElement), "DocumentElement contains new appended element");
      assert.ok(!newElement.contains(docElement), "New appended Element does not contain DocumentElement");
    }
  );

  specify("The Document should contain a descendant node", () => {
    const doc = load("test");
    const elem = doc.getElementsByTagName("p").item(0);

    assert.ok(doc.contains(elem), "Document contains a descendant node");
    assert.ok(!elem.contains(doc), "Descentant node does not contain Document");
  });

  specify("An element should contain a new appended element", () => {
    const doc = load("test");
    const elem = doc.getElementsByTagName("p").item(0);
    const newElem = doc.createElementNS("http://www.w3.org/1999/xhtml", "br");

    elem.appendChild(newElem);

    assert.ok(elem.contains(newElem), "Element contains new appended Element");
    assert.ok(!newElem.contains(elem), "New Element does not contain Element");
  });

  specify(
    "The Document should contain a newly attached ProcessingInstruction",
    () => {
      const doc = load("test");
      const pi = doc.createProcessingInstruction("PITarget", "PIDATA");

      doc.appendChild(pi);
      assert.ok(doc.contains(pi), "Document contains new attached processing instruction");
      assert.ok(!pi.contains(doc), "Processing Instruction does not contain doc");
    }
  );

  specify("The document should contain a new attached Comment", () => {
    const doc = load("test");
    const elem = doc.getElementsByTagName("p").item(0);
    const comment = doc.createComment("Another Comment");

    elem.appendChild(comment);

    assert.ok(doc.contains(comment), "Document contains new attached Comment");
    assert.ok(!comment.contains(doc), "Comment does not contain Document");
  });

  specify("A DocumentFragment should contain a child node", () => {
    const doc = load("test");
    const docElement = doc.documentElement;
    const docFragment = doc.createDocumentFragment();

    docFragment.appendChild(docElement);

    const docFragmentChild = docFragment.firstChild;

    assert.ok(docFragment.contains(docFragmentChild), "DocumentFragment contains child");
    assert.ok(!docFragmentChild.contains(docFragment), "DocumentFragment child does not contain DocumentFragment");
  });

  specify(
    "Created and attached sibling ProcessingInstructions should not not contain one another",
    () => {
      const doc = load("test");
      const pi1 = doc.createProcessingInstruction("PI1", "");
      const pi2 = doc.createProcessingInstruction("PI2", "");

      doc.appendChild(pi1);
      doc.appendChild(pi2);

      assert.ok(
        !pi1.contains(pi2),
        "Attached ProcessingInstruction does not contain second attached ProcessingInstruction"
      );
      assert.ok(
        !pi2.contains(pi1),
        "Second attached ProcessingInstruction does not contain first attached ProcessingInstruction"
      );
    }
  );

  specify(
    "Two created sibling ProcessingInstruction nodes should not contain one another",
    () => {
      const doc = load("test");
      const docElement = doc.documentElement;
      const txt1 = doc.createTextNode("T1");
      const txt2 = doc.createTextNode("T2");

      docElement.appendChild(txt1);
      docElement.appendChild(txt2);

      assert.ok(!txt1.contains(txt2), "First attached TextNode does not contain second attached TextNode");
      assert.ok(!txt2.contains(txt1), "Second attached TextNode does not contain first attached TextNode");
    }
  );

  specify(
    "The Text node children of two sibling elements should not contain one another",
    () => {
      const doc = load("test");
      const txt1 = doc.getElementsByTagName("span").item(0).firstChild;
      const txt2 = doc.getElementsByTagName("p").item(0).firstChild;

      assert.ok(
        !txt1.contains(txt2),
        "Text node child of first sibling Element does not contain Text node child of second sibling Element"
      );
      assert.ok(
        !txt2.contains(txt1),
        "Text node child of second sibling Element does not contain Text node child of first sibling Element"
      );
    }
  );

  specify(
    "An element should not contain a following element and vice versa",
    () => {
      const doc = load("test");
      const span = doc.getElementsByTagName("span").item(0);
      const p = doc.getElementsByTagName("p").item(0);

      assert.ok(!span.contains(p), "Element does not contain following element");
      assert.ok(!p.contains(span), "Element does not contain previous element");
    }
  );

  specify("A document should not contain null", () => {
    const doc = load("test");

    assert.ok(!doc.contains(null), "Document does not contain null");
  });

  specify("A DocumentType should not contain null", () => {
    const doc = load("test");

    assert.ok(!doc.doctype.contains(null), "Doctype does not contain null");
  });

  specify("An existing node should not contain null", () => {
    const ele = load("test").querySelectorAll("p").item(0);

    assert.ok(!ele.contains(null), "Element does not contain null");
  });

  specify("A document should not contain an unattached DocumentFragment", () => {
    const doc = load("test");
    const fragment = doc.createDocumentFragment();

    assert.ok(!doc.contains(fragment), "Document does not contain fragment");
    assert.ok(!fragment.contains(doc), "Fragment does not contain document");
  });

  specify(
    "A DocumentType should not contain an unattached DocumentFragment",
    () => {
      const doc = load("test");
      const fragment = doc.createDocumentFragment();

      assert.ok(!doc.doctype.contains(fragment), "DocumentType does not contain DocumentFragment");
      assert.ok(!fragment.contains(doc.doctype), "DocumentFragment does not contain DocumentType");
    }
  );

  specify(
    "An existing element should not contain an unattached DocumentFragment",
    () => {
      const doc = load("test");
      const fragment = doc.createDocumentFragment();
      const span = doc.querySelectorAll("span").item(0);

      assert.ok(!span.contains(fragment), "Element does not contain DocumentFragment");
      assert.ok(!fragment.contains(span), "DocumentFragment does not contain Element");
    }
  );

  specify(
    "An unattached element should not contain another unattached element",
    () => {
      const doc = load("test");
      const e1 = doc.createElement("p");
      const e2 = doc.createElement("p2");

      assert.ok(!e1.contains(e2), "Element does not contain second Element");
      assert.ok(!e2.contains(e1), "Second Element does not contain Element");
    }
  );

  specify("Should return a boolean value", () => {
    const doc = load("test");
    const elem = doc.getElementsByTagName("p").item(0);
    const newElem = doc.createElementNS("http://www.w3.org/1999/xhtml", "br");

    elem.appendChild(newElem);

    assert.strictEqual(true, elem.contains(newElem), "Return value must be 'true' (strictly)");
    assert.strictEqual(false, newElem.contains(elem), "Return value must be 'false' (strictly)");
  });
});
