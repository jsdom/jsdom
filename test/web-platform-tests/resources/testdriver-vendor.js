// TODO: Implement functions below:
// - delete_all_cookies()
// - get_named_cookie()
// - get_computed_label()
// - get_computed_role()

window.test_driver_internal = {
  ...window.test_driver_internal,
  in_automation: true,

  async click(element, coords) {
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: coords ? coords.x : 0,
      clientY: coords ? coords.y : 0,
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    element.focus();
    element.dispatchEvent(event);
    await new Promise((resolve) => setTimeout(resolve, 0));
  },

  async send_keys(element, keys) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    element.focus();
    for (let i = 0; i < keys.length; i++) {
      const char = keys[i];
      if (char === "\ue004") {
        const focusables = [
          ...document.querySelectorAll("[tabindex], input, button, select, textarea, a[href]"),
        ];
        const currentIndex = focusables.indexOf(document.activeElement);
        if (currentIndex !== -1 && currentIndex + 1 < focusables.length) {
          focusables[currentIndex + 1].focus();
        } else if (focusables.length > 0 && currentIndex === -1) {
          focusables[0].focus();
        }
      }

      const keydownEvent = new KeyboardEvent("keydown", {
        key: char === "\ue004" ? "Tab" : char,
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(keydownEvent);

      // The `keypress` event is deprecated, but kept for compatibility.
      const keypressEvent = new KeyboardEvent("keypress", {
        key: char === "\ue004" ? "Tab" : char,
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(keypressEvent);

      const keyupEvent = new KeyboardEvent("keyup", {
        key: char === "\ue004" ? "Tab" : char,
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(keyupEvent);
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  },

  async action_sequence(actions, context = null) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    for (const source of actions) {
      if (source.type === "pointer") {
        for (const action of source.actions) {
          const target = document.getElementById("target") || document.body;
          if (action.type === "pointerDown") {
            const event = new MouseEvent("mousedown", {
              bubbles: true,
              cancelable: true,
              view: window,
              buttons: 1,
            });
            target.dispatchEvent(event);
          } else if (action.type === "pointerUp") {
            const event = new MouseEvent("mouseup", {
              bubbles: true,
              cancelable: true,
              view: window,
              buttons: 0,
            });
            target.dispatchEvent(event);
          }
        }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
    return Promise.resolve();
  },
};

if (window.test_driver) {
  function getInViewCenterPoint(rect) {
    const left = Math.max(0, rect.left);
    const right = Math.min(window.innerWidth, rect.right);
    const top = Math.max(0, rect.top);
    const bottom = Math.min(window.innerHeight, rect.bottom);

    const x = 0.5 * (left + right);
    const y = 0.5 * (top + bottom);

    return [x, y];
  }

  function getPointerInteractablePaintTree(element) {
    const elementDocument = element.ownerDocument;
    if (!elementDocument.contains(element)) {
      return [];
    }

    const rectangles = element.getClientRects();
    if (rectangles.length === 0) {
      return [];
    }

    const centerPoint = getInViewCenterPoint(rectangles[0]);
    if ("elementsFromPoint" in elementDocument) {
      return elementDocument.elementsFromPoint(centerPoint[0], centerPoint[1]);
    }
    if ("msElementsFromPoint" in elementDocument) {
      const rv = elementDocument.msElementsFromPoint(centerPoint[0], centerPoint[1]);
      return Array.prototype.slice.call(rv ? rv : []);
    }

    throw new Error("document.elementsFromPoint unsupported");
  }

  function inView(element) {
    const pointerInteractablePaintTree = getPointerInteractablePaintTree(element);
    return pointerInteractablePaintTree.indexOf(element) !== -1;
  }

  window.test_driver.click = async function (element) {
    if (typeof element.scrollIntoView === "function" && !inView(element)) {
      element.scrollIntoView({
        behavior: "instant",
        block: "end",
        inline: "nearest",
      });
    }

    return window.test_driver_internal.click(element, { x: 0, y: 0 });
  };

  window.test_driver.send_keys = async function (element, keys) {
    if (typeof element.scrollIntoView === "function" && !inView(element)) {
      element.scrollIntoView({
        behavior: "instant",
        block: "end",
        inline: "nearest",
      });
    }

    return window.test_driver_internal.send_keys(element, keys);
  };
}
