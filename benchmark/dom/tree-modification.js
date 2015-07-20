"use strict";
const suite = require("../document-suite");

exports["appendChild: no siblings"] = function () {
  let parent;
  let children;
  let it;

  return suite({
    setup: function (document) {
      parent = [];
      children = [];

      for (let i = 0; i < this.count; ++i) {
        parent.push(document.createElement("div"));
        children.push(document.createElement("div"));
      }

      it = 0;
    },
    fn: function () {
      parent[it].appendChild(children[it]);
      ++it;
    }
  });
};

exports["appendChild: many siblings"] = function () {
  const MIN_SIBLINGS = 10000;
  let parent;
  let children;
  let it;

  return suite({
    setup: function (document) {
      parent = document.createElement("div");
      children = [];

      for (let i = 0; i < MIN_SIBLINGS; ++i) {
        parent.appendChild(document.createElement("span"));
      }

      for (let i = 0; i < this.count; ++i) {
        children.push(document.createElement("div"));
      }

      it = 0;
    },
    fn: function () {
      parent.appendChild(children[it]);
      ++it;
    }
  });
};

exports["appendChild: many parents"] = function () {
  const DEPTH = 500;
  let itData;
  let it;

  return suite({
    setup: function (document) {
      itData = new Array(this.count);

      for (let i = 0; i < this.count; ++i) {
        let nodes = new Array(DEPTH);

        for (let n = 0; n < DEPTH; ++n) {
          nodes[n] = document.createElement("div");
        }

        itData[i] = nodes;
      }

      it = 0;
    },
    fn: function () {
      let nodes = itData[it];

      for (let n = 1; n < DEPTH; ++n) {
        nodes[n - 1].appendChild(nodes[n]);
      }

      ++it;
    }
  });
};

exports["insertBefore: many siblings"] = function () {
  const MIN_SIBLINGS = 10000;
  let parent;
  let children;
  let it;
  let first;

  return suite({
    setup: function (document) {
      parent = document.createElement("div");
      children = [];

      for (let i = 0; i < MIN_SIBLINGS; ++i) {
        parent.appendChild(document.createElement("span"));
      }

      for (let i = 0; i < this.count; ++i) {
        children.push(document.createElement("div"));
      }

      it = 0;
      first = parent.firstChild;
    },
    fn: function () {
      const newChild = children[it];
      parent.insertBefore(newChild, parent.firstChild);
      first = newChild;
      ++it;
    }
  });
};

exports["removeChild: no siblings"] = function () {
  let parent;
  let children;
  let it;

  return suite({
    setup: function (document) {
      parent = [];
      children = [];

      for (let i = 0; i < this.count; ++i) {
        parent.push(document.createElement("div"));
        children.push(document.createElement("div"));
        parent[i].appendChild(children[i]);
      }

      it = 0;
    },
    fn: function () {
      parent[it].removeChild(children[it]);
      ++it;
    }
  });
};

exports["removeChild: many siblings"] = function () {
  let parent;
  let children;
  let it;

  return suite({
    setup: function (document) {
      parent = document.createElement("div");
      children = [];

      for (let i = 0; i < this.count; ++i) {
        children.push(document.createElement("div"));
        parent.appendChild(children[i]);
      }

      it = 0;
    },
    fn: function () {
      parent.removeChild(children[it]);
      ++it;
    }
  });
};

exports["removeChild: many parents"] = function () {
  const DEPTH = 100;
  let itData;
  let it;

  return suite({
    setup: function (document) {
      itData = new Array(this.count);

      for (let i = 0; i < this.count; ++i) {
        let nodes = new Array(DEPTH + 1);
        nodes[0] = document.createElement("div");

        for (let n = 0; n < DEPTH; ++n) {
          nodes[n + 1] = document.createElement("div");
          nodes[n].appendChild(nodes[n + 1]);
        }

        itData[i] = nodes;
      }

      it = 0;
    },
    fn: function () {
      let nodes = itData[it];

      for (let n = 0; n < DEPTH; ++n) {
        nodes[n].removeChild(nodes[n + 1]);
      }

      ++it;
    }
  });
};
