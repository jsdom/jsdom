"use strict";

const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const tree = require("../../lib/jsdom/living/helpers/dom-tree");

function nodes(count) {
  return Array.from({ length: count }, (_, id) => ({ id, [tree.symbol]: null }));
}

function ids(iterable) {
  return Array.from(iterable, node => node.id);
}

describe("DOM tree", () => {
  it("keeps index queries bounded across appends and repeated middle edits", () => {
    let reads = 0;
    function countedNode() {
      let data = null;
      return Object.defineProperty({}, tree.symbol, {
        get() {
          ++reads;
          return data;
        },
        set(value) {
          data = value;
        }
      });
    }

    const root = countedNode();
    const children = Array.from({ length: 1000 }, countedNode);
    const extra = countedNode();
    for (const child of children) {
      tree.appendChild(root, child);
    }
    reads = 0;
    assert.equal(tree.index(children[500]), 500);
    assert.ok(reads < 10, "Append-time indexes should not require a sibling scan");

    reads = 0;
    for (let i = 0; i < 100; ++i) {
      tree.insertBefore(children[500], extra);
      assert.equal(tree.index(children[500]), 501);
      tree.remove(extra);
      assert.equal(tree.index(children[500]), 500);
    }
    assert.ok(reads < 5000, "Middle edits should not repeatedly scan the unchanged prefix");
  });

  it("does not allocate links when reading an unattached node", () => {
    const [node, other] = nodes(2);
    for (const accessor of ["parent", "firstChild", "lastChild", "previousSibling", "nextSibling"]) {
      assert.equal(tree[accessor](node), null);
    }
    assert.equal(tree.hasChildren(node), false);
    assert.equal(tree.childrenCount(node), 0);
    assert.equal(tree.index(node), -1);
    assert.equal(tree.following(node), null);
    assert.equal(tree.preceding(node), null);
    assert.equal(tree.compareTreePosition(node, other), tree.TreePosition.DISCONNECTED);
    for (const method of ["childrenIterator", "nextSiblingsIterator", "previousSiblingsIterator", "childrenToArray"]) {
      assert.deepEqual(Array.from(tree[method](node)), []);
    }
    for (const method of ["treeIterator", "ancestorsIterator", "treeToArray"]) {
      assert.deepEqual(Array.from(tree[method](node)), [node]);
    }
    assert.equal(node[tree.symbol], null);
    assert.equal(other[tree.symbol], null);
  });

  it("matches an array-based forest through seeded subtree moves and index queries", () => {
    for (let seed = 1; seed <= 6; ++seed) {
      let state = seed;
      function random(max) {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return state % max;
      }
      const all = nodes(80);
      const children = all.map(() => []);
      const parents = all.map(() => -1);
      function ancestors(id) {
        const result = [];
        while (id !== -1) {
          result.push(id);
          id = parents[id];
        }
        return result;
      }
      function descendants(id) {
        return [id, ...children[id].flatMap(descendants)];
      }

      for (let i = 1; i < 70; ++i) {
        tree.appendChild(all[0], all[i]);
        children[0].push(i);
        parents[i] = 0;
      }

      for (let step = 0; step < 300; ++step) {
        const child = random(all.length);
        const reference = random(all.length);
        const action = random(3);
        const target = action === 1 ? parents[reference] : reference;
        if (child === reference || target === -1 || ancestors(target).includes(child)) {
          continue;
        }

        tree.remove(all[child]);
        if (parents[child] !== -1) {
          const siblings = children[parents[child]];
          siblings.splice(siblings.indexOf(child), 1);
        }
        parents[child] = -1;
        if (action === 0) {
          tree.appendChild(all[target], all[child]);
          children[target].push(child);
          parents[child] = target;
        } else if (action === 1) {
          tree.insertBefore(all[reference], all[child]);
          children[target].splice(children[target].indexOf(reference), 0, child);
          parents[child] = target;
        }

        if (step % 11 !== 0) {
          continue;
        }
        for (let n = 0; n < all.length; ++n) {
          const id = (n * 37) % all.length;
          const node = all[id];
          const parentID = parents[id];
          const siblings = parentID === -1 ? [] : children[parentID];
          const index = siblings.indexOf(id);
          assert.equal(tree.parent(node), all[parentID] || null);
          assert.equal(tree.index(node), index, `seed ${seed}, step ${step}, node ${id}`);
          assert.equal(tree.previousSibling(node), index > 0 ? all[siblings[index - 1]] : null);
          assert.equal(tree.nextSibling(node), index >= 0 ? all[siblings[index + 1]] || null : null);
          assert.equal(tree.childrenCount(node), children[id].length);
          assert.deepEqual(ids(tree.childrenToArray(node)), children[id]);
          assert.deepEqual(ids(tree.childrenIterator(node, { reverse: true })), children[id].toReversed());
          const order = descendants(id);
          assert.deepEqual(ids(tree.treeIterator(node)), order);
          assert.deepEqual(ids(tree.treeIterator(node, { reverse: true })), order.toReversed());
          assert.deepEqual(ids(tree.ancestorsIterator(node)), ancestors(id));

          const other = reference;
          const a = ancestors(id);
          const b = ancestors(other);
          let position;
          if (id === other) {
            position = 0;
          } else if (a.includes(other)) {
            position = tree.TreePosition.CONTAINS | tree.TreePosition.PRECEDING;
          } else if (b.includes(id)) {
            position = tree.TreePosition.CONTAINED_BY | tree.TreePosition.FOLLOWING;
          } else if (a.at(-1) !== b.at(-1)) {
            position = tree.TreePosition.DISCONNECTED;
          } else {
            const treeOrder = descendants(a.at(-1));
            position = treeOrder.indexOf(id) < treeOrder.indexOf(other) ?
              tree.TreePosition.FOLLOWING :
              tree.TreePosition.PRECEDING;
          }
          assert.equal(tree.compareTreePosition(node, all[other]), position);
        }
      }
    }
  });

  it("captures the next sibling before the current node is removed", () => {
    for (const reverse of [false, true]) {
      const [root, a, b, c] = nodes(4);
      for (const child of [a, b, c]) {
        tree.appendChild(root, child);
      }
      const iterator = tree.childrenIterator(root, { reverse });
      const first = iterator.next().value;
      tree.remove(first);
      assert.deepEqual(Array.from(iterator), reverse ? [b, a] : [b, c]);
    }
  });

  it("observes a new shadow root after yielding its host and retains light-tree lookahead", () => {
    const [root, host, tail, light, shadow, inside] = nodes(6);
    tree.appendChild(root, host);
    tree.appendChild(root, tail);
    tree.appendChild(host, light);
    tree.appendChild(shadow, inside);
    const iterator = tree.shadowIncludingInclusiveDescendantsIterator(root);
    assert.equal(iterator.next().value, root);
    assert.equal(iterator.next().value, host);
    host._shadowRoot = shadow;
    tree.remove(light);
    assert.deepEqual(Array.from(iterator), [shadow, inside, light]);
  });

  it("visits nested shadow roots without recursion", () => {
    const all = nodes(40001);
    for (let i = 0; i < 40000; i += 2) {
      all[i]._shadowRoot = all[i + 1];
      tree.appendChild(all[i + 1], all[i + 2]);
    }
    assert.deepEqual(Array.from(tree.shadowIncludingInclusiveDescendantsIterator(all[0])), all);
    const iterator = tree.shadowIncludingDescendantsIterator(all[0]);
    assert.equal(iterator.next().value, all[1]);
  });

  it("observes mutations in array filters while preserving the receiver and output array", () => {
    const [root, a, b, c] = nodes(4);
    for (const child of [a, b, c]) {
      tree.appendChild(root, child);
    }
    const receiver = {};
    const array = [root];
    const result = tree.childrenToArray(root, { array, thisArg: receiver, filter(node) {
      assert.equal(this, receiver);
      if (node === a) {
        tree.remove(b);
      }
      return true;
    } });
    assert.equal(result, array);
    assert.deepEqual(result, [root, a, c]);
  });
});
