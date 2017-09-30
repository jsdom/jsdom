"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const util = require("../util");


// Tests for the Living Standard implementation of compareDocumentPosition
// Spec: http://dom.spec.whatwg.org/#dom-node-comparedocumentposition

describe("compare-document-position", { skipIfBrowser: true }, () => {
  const load = util.load(__dirname);

  specify("A document contains and precedes its document type", () => {
    const doc = load("test");
    const { doctype } = doc;

    assert.ok(
      doc.compareDocumentPosition(doctype) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
      "Doctype contained"
    );
    assert.ok(
      doc.compareDocumentPosition(doctype) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
      "Doctype follows"
    );
  });

  specify(
    "A document contains and precedes its newly attached document type",
    () => {
      const doc = load("test");
      const { doctype } = doc;
      const newDoctype = doc.implementation.createDocumentType(doctype.name, null, null);

      doc.replaceChild(newDoctype, doctype);

      assert.ok(
        doc.compareDocumentPosition(newDoctype) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
        "Doctype contained"
      );
      assert.ok(
        doc.compareDocumentPosition(newDoctype) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
        "Doctype follows"
      );
    }
  );

  specify(
    "Two document nodes obtained from the same document are disconnected and implementation specific",
    () => {
      const docA = load("test");
      const docB = load("test");

      assert.ok(
        docA.compareDocumentPosition(docB) & docA.defaultView.Node.DOCUMENT_POSITION_DISCONNECTED,
        "Disconnected"
      );
      assert.ok(
        docA.compareDocumentPosition(docB) & docA.defaultView.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
        "Implementation Specific"
      );
    }
  );

  specify("A document is disconnected from and precedes a DocumentFragment", () => {
    const doc = load("test");
    const fragment = doc.createDocumentFragment();
    fragment.innerHTML = "<span>I AM SPAN</span>";

    assert.ok(
      doc.compareDocumentPosition(fragment) & doc.defaultView.Node.DOCUMENT_POSITION_DISCONNECTED,
      "Fragment disconnected"
    );
    assert.ok(
      doc.compareDocumentPosition(fragment) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
      "Fragment follows"
    );
    assert.ok(
      doc.compareDocumentPosition(fragment) & doc.defaultView.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
      "Implementation Specific"
    );
  });

  specify("A document node compared to itself returns nothing", () => {
    const doc = load("test");

    assert.equal(doc.compareDocumentPosition(doc), 0, "No Bitmask");
  });

  specify(
    "A document and a newly created document are disconnected and implementation specific",
    () => {
      const doc = load("test");
      const newDoc = doc.implementation.createHTMLDocument();

      assert.ok(
        doc.compareDocumentPosition(newDoc) & doc.defaultView.Node.DOCUMENT_POSITION_DISCONNECTED,
        "Fragment disconnected"
      );
      assert.ok(
        doc.compareDocumentPosition(newDoc) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
        "Fragment follows"
      );
      assert.ok(
        doc.compareDocumentPosition(newDoc) & doc.defaultView.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
        "Implementation Specific"
      );
    }
  );

  specify(
    "A document contains and precedes its document element and vice versa",
    () => {
      const doc = load("test");
      const { documentElement } = doc;

      assert.ok(
        doc.compareDocumentPosition(documentElement) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
        "DocumentElement contained"
      );
      assert.ok(
        doc.compareDocumentPosition(documentElement) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
        "DocumentElement follows"
      );
      assert.ok(
        documentElement.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINS,
        "Document contains"
      );
      assert.ok(
        documentElement.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
        "Document precedes"
      );
    }
  );

  specify(
    "Document contains and precedes a newly attached element and vice versa",
    () => {
      const doc = load("test");
      const newElement = doc.createElement("p");
      doc.documentElement.appendChild(newElement);

      assert.ok(
        doc.compareDocumentPosition(newElement) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
        "Document contains"
      );
      assert.ok(
        doc.compareDocumentPosition(newElement) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
        "Document precedes"
      );
      assert.ok(
        newElement.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINS,
        "Element contained"
      );
      assert.ok(
        newElement.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
        "Element follows"
      );
    }
  );

  specify(
    "Document contains and precedes an existing element and vice versa",
    () => {
      const doc = load("test");
      const element = doc.querySelectorAll("span").item(0);

      assert.ok(
        doc.compareDocumentPosition(element) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
        "Document contains"
      );
      assert.ok(
        doc.compareDocumentPosition(element) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
        "Document precedes"
      );
      assert.ok(
        element.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINS,
        "Element contained"
      );
      assert.ok(
        element.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
        "Element follows"
      );
    }
  );

  specify(
    "Document contains and precedes a newly attached processing instruction and vice versa",
    () => {
      const doc = load("test");
      const pi = doc.createProcessingInstruction("PITARGET", "PIDATA");

      doc.appendChild(pi);

      assert.ok(
        doc.compareDocumentPosition(pi) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
        "Document contains"
      );
      assert.ok(
        doc.compareDocumentPosition(pi) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
        "Document precedes"
      );
      assert.ok(pi.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINS, "Element contained");
      assert.ok(pi.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING, "Element follows");
    }
  );

  specify(
    "Document contains and precedes a newly attached comment and vice versa",
    () => {
      const doc = load("test");
      const comment = doc.createComment("I AM COMMENT");
      const span = doc.querySelectorAll("span").item(0);

      span.appendChild(comment);

      assert.ok(
        doc.compareDocumentPosition(comment) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
        "Document contains"
      );
      assert.ok(
        doc.compareDocumentPosition(comment) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
        "Document precedes"
      );
      assert.ok(
        comment.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINS,
        "Comment contained"
      );
      assert.ok(
        comment.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
        "Comment follows"
      );
    }
  );

  specify(
    "Document fragment contains and precedes a newly attached nide and vice versa",
    () => {
      const doc = load("test");
      const fragment = doc.createDocumentFragment();
      const span = doc.createElement("span");

      fragment.appendChild(span);

      assert.ok(
        fragment.compareDocumentPosition(span) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
        "Fragment contains"
      );
      assert.ok(
        fragment.compareDocumentPosition(span) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
        "Fragment precedes"
      );
      assert.ok(
        span.compareDocumentPosition(fragment) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINS,
        "Span contained"
      );
      assert.ok(
        span.compareDocumentPosition(fragment) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
        "Span follows"
      );
    }
  );

  specify(
    "Newly appended ProcessingInstruction node follows older appended ProcessingInstruction Node",
    () => {
      const doc = load("test");
      const pi1 = doc.createProcessingInstruction("PI1", "Processing Instruction 1");
      const pi2 = doc.createProcessingInstruction("PI2", "Processing Instruction 2");

      doc.documentElement.appendChild(pi1);
      doc.documentElement.appendChild(pi2);

      assert.ok(
        pi1.compareDocumentPosition(pi2) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
        "Second PI Follows"
      );
      assert.ok(
        pi2.compareDocumentPosition(pi1) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
        "First PI Precedes"
      );
    }
  );

  specify("Newly appended Text node follows older appended Text Node", () => {
    const doc = load("test");
    const t1 = doc.createTextNode("Hello,");
    const t2 = doc.createTextNode("World!");

    doc.documentElement.appendChild(t1);
    doc.documentElement.appendChild(t2);

    assert.ok(
      t1.compareDocumentPosition(t2) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
      "Second Text Node Follows"
    );
    assert.ok(
      t2.compareDocumentPosition(t1) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
      "First Text Node Precedes"
    );
  });

  specify(
    "Existing element precedes one later in the markup and vice versa",
    () => {
      const doc = load("test");
      const el1 = doc.getElementsByTagName("strong").item(0);
      const el2 = doc.getElementsByTagName("strong").item(1);

      assert.ok(
        el1.compareDocumentPosition(el2) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
        "Second Element Follows"
      );
      assert.ok(
        el2.compareDocumentPosition(el1) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
        "First Element Precedes"
      );
    }
  );

  specify("Element contains and precedes a decendant node and vice versa", () => {
    const doc = load("test");
    const span = doc.getElementsByTagName("span").item(0);
    const strong = doc.getElementsByTagName("strong").item(0);

    assert.ok(
      span.compareDocumentPosition(strong) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
      "Span contains"
    );
    assert.ok(span.compareDocumentPosition(strong) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING, "Span precedes");
    assert.ok(
      strong.compareDocumentPosition(span) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINS,
      "Strong contained"
    );
    assert.ok(
      strong.compareDocumentPosition(span) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
      "Strong follows"
    );
  });

  specify("A Child node precedes a child of a node later in the markup", () => {
    const doc = load("test");
    const strong = doc.getElementsByTagName("strong").item(0);
    const em = doc.getElementsByTagName("em").item(0);

    assert.ok(
      strong.compareDocumentPosition(em) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
      "Second Element Follows"
    );
    assert.ok(
      em.compareDocumentPosition(strong) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
      "First Element Precedes"
    );
  });

  specify(
    "A newly attached child node precedes a child node later in the markup",
    () => {
      const doc = load("test");
      const span = doc.getElementsByTagName("strong").item(0);
      const newEl = doc.createElement("i");
      const em = doc.getElementsByTagName("em").item(0);

      span.appendChild(newEl);

      assert.ok(
        newEl.compareDocumentPosition(em) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
        "Second Element Follows"
      );
      assert.ok(
        em.compareDocumentPosition(newEl) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
        "New Element Precedes"
      );
    }
  );

  specify(
    "A newly attached child node follows a child node earlier in the markup",
    () => {
      const doc = load("test");
      const strong = doc.getElementsByTagName("strong").item(0);
      const p = doc.getElementsByTagName("p").item(0);
      const newEl = doc.createElement("i");

      p.appendChild(newEl);

      assert.ok(
        newEl.compareDocumentPosition(strong) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
        "Second Element Precedes"
      );
      assert.ok(
        strong.compareDocumentPosition(newEl) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
        "New Element Follows"
      );
    }
  );

  specify("Testing a node against a non node type throws an error", () => {
    const doc = load("test");

    assert.throws(doc.compareDocumentPosition.bind(this, {}));
  });
});
