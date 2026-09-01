"use strict";
const idlUtils = require("../../generated/idl/utils.js");
const HTMLCollection = require("../../generated/idl/HTMLCollection.js");
const { HTML_NS } = require("./helpers/namespaces.js");
const { treeOrderSorter } = require("../utils.js");

// We count iframe/frame here too even though it's not in the relevant part of the spec because we still need to track
// named iframes/frames, and we'll process the element -> WindowProxy work as special cases.
const nameAttributeElementLocalNames = new Set(["embed", "form", "img", "object", "iframe", "frame"]);

const trackers = new WeakMap(); // WeakMap<Window, Map<string, Set<Element>>>

function inAssociatedDocument(element) {
  const document = element._ownerDocument;
  return idlUtils.implForWrapper(document._globalObject._document) === document;
}

function upsert(map, key, value) {
  let set = map.get(key);
  if (!set) {
    set = new Set();
    map.set(key, set);
  }
  set.add(value);
}

function remove(map, key, value) {
  const set = map.get(key);
  if (set) {
    set.delete(value);
    if (set.size === 0) {
      map.delete(key);
    }
  }
}

function getNamedObject(window, name) {
  const tracker = trackers.get(window);
  if (tracker === undefined) {
    return undefined;
  }

  const set = tracker.get(name);
  if (set === undefined) {
    return undefined;
  }

  const elements = set.size === 1 ? set : [...set].sort(treeOrderSorter);
  for (const element of elements) {
    if (element._localName === "iframe" || element._localName === "frame") {
      const { contentWindow } = element;
      if (contentWindow !== null && element.getAttributeNS(null, "name") === name) {
        return contentWindow;
      }
    }
  }

  if (set.size === 1) {
    return idlUtils.wrapperForImpl(set.values().next().value);
  }

  return HTMLCollection.create(window, [], {
    element: idlUtils.implForWrapper(window._document),
    query() {
      // Do *not* reuse `elements` or `set` from above. We need to re-get and re-iterate the set each time because it
      // might have changed due to elements being attached, removed, or having their names changed!
      const currentSet = trackers.get(window)?.get(name);
      return currentSet === undefined ? [] : [...currentSet].sort(treeOrderSorter);
    }
  });
}

exports.elementAttached = element => {
  if (element._namespaceURI !== HTML_NS) {
    return;
  }

  const idAttr = element.getAttributeNS(null, "id");
  const nameAttr = nameAttributeElementLocalNames.has(element._localName) ?
    element.getAttributeNS(null, "name") :
    null;
  if (!idAttr && !nameAttr) {
    return;
  }

  const window = element._ownerDocument._globalObject;
  if (!inAssociatedDocument(element)) {
    return;
  }

  let tracker = trackers.get(window);
  if (tracker === undefined) {
    tracker = new Map();
    trackers.set(window, tracker);
  }

  if (nameAttr) {
    upsert(tracker, nameAttr, element);
  }

  if (idAttr) {
    upsert(tracker, idAttr, element);
  }
};

exports.elementDetached = element => {
  if (element._namespaceURI !== HTML_NS) {
    return;
  }

  const idAttr = element.getAttributeNS(null, "id");
  const nameAttr = nameAttributeElementLocalNames.has(element._localName) ?
    element.getAttributeNS(null, "name") :
    null;
  if (!idAttr && !nameAttr) {
    return;
  }

  const window = element._ownerDocument._globalObject;
  if (!inAssociatedDocument(element)) {
    return;
  }

  const tracker = trackers.get(window);

  if (idAttr) {
    remove(tracker, idAttr, element);
  }

  if (nameAttr) {
    remove(tracker, nameAttr, element);
  }

  if (tracker.size === 0) {
    trackers.delete(window);
  }
};

exports.elementAttributeModified = (element, attributeName, value, oldValue) => {
  const isIdAttribute = attributeName === "id";
  const isNameAttribute = attributeName === "name" && nameAttributeElementLocalNames.has(element._localName);
  if ((!isIdAttribute && !isNameAttribute) || value === oldValue) {
    return;
  }

  // A qualified name alone does not tell us the attribute's namespace. A non-null-namespace attribute cannot be the
  // current value returned here, except for a removal; removals of attributes that were never tracked are harmless.
  if (element.getAttributeNS(null, attributeName) !== value) {
    return;
  }

  // Window and Document named properties share this filtered mutation path, but have different contributors.
  element._ownerDocument._namedPropertyElementAttributeModified(element, attributeName, value, oldValue);

  if (element._namespaceURI !== HTML_NS) {
    return;
  }

  const window = element._ownerDocument._globalObject;
  if (!inAssociatedDocument(element)) {
    return;
  }

  if (!element._isInDocumentTree) {
    return;
  }

  let tracker = trackers.get(window);
  if (tracker === undefined) {
    if (!value) {
      return;
    }
    tracker = new Map();
    trackers.set(window, tracker);
  }

  if (isIdAttribute) {
    const nameAttr = nameAttributeElementLocalNames.has(element._localName) ?
      element.getAttributeNS(null, "name") :
      null;
    if (oldValue && nameAttr !== oldValue) {
      remove(tracker, oldValue, element);
    }
    if (value) {
      upsert(tracker, value, element);
    }
  } else {
    const idAttr = element.getAttributeNS(null, "id");
    if (oldValue && idAttr !== oldValue) {
      remove(tracker, oldValue, element);
    }
    if (value) {
      upsert(tracker, value, element);
    }
  }

  if (tracker.size === 0) {
    trackers.delete(window);
  }
};

exports.create = (eventTargetPrototype, window) => {
  const windowProperties = Object.create(eventTargetPrototype, {
    [Symbol.toStringTag]: {
      value: "WindowProperties",
      configurable: true
    }
  });

  const windowPropertiesProxy = new Proxy(windowProperties, {
    getOwnPropertyDescriptor(target, property) {
      if (typeof property === "symbol") {
        return Reflect.getOwnPropertyDescriptor(target, property);
      }

      // Named property visibility algorithm check, modified as discused in
      // https://github.com/whatwg/webidl/issues/607.
      let targetObj = Object.getPrototypeOf(target);
      while (targetObj !== null) {
        if (Object.hasOwn(targetObj, property)) {
          return Reflect.getOwnPropertyDescriptor(target, property);
        }

        targetObj = Object.getPrototypeOf(targetObj);
      }

      const value = getNamedObject(window, property);
      if (value) {
        return {
          value,
          enumerable: false, // Window is [LegacyUnenumerableNamedProperties]
          writable: true,
          configurable: true
        };
      }

      return Reflect.getOwnPropertyDescriptor(target, property);
    },
    has(target, property) {
      if (typeof property === "symbol") {
        return Reflect.has(target, property);
      }

      const desc = this.getOwnPropertyDescriptor(target, property);
      if (desc !== undefined) {
        return true;
      }

      const parent = Object.getPrototypeOf(target);
      return Reflect.has(parent, property);
    },
    get(target, property, receiver) {
      if (typeof property === "symbol") {
        return Reflect.get(target, property, receiver);
      }

      const desc = this.getOwnPropertyDescriptor(target, property);
      if (desc === undefined) {
        const parent = Object.getPrototypeOf(target);
        return Reflect.get(parent, property, receiver);
      }

      // Named properties object only has data properties.
      return desc.value;
    },
    set(target, property, value, receiver) {
      if (typeof property === "symbol") {
        return Reflect.set(target, property, value, receiver);
      }

      const ownDesc = this.getOwnPropertyDescriptor(target, property);
      return idlUtils.ordinarySetWithOwnDescriptor(target, property, value, receiver, ownDesc);
    },
    defineProperty() {
      return false;
    },
    deleteProperty() {
      return false;
    },
    setPrototypeOf() {
      throw new TypeError("Immutable prototype object WindowProperties cannot have its prototype set.");
    },
    preventExtensions() {
      return false;
    }
  });

  return windowPropertiesProxy;
};
