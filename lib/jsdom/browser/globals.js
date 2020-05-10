"use strict";
const vm = require("vm");
const { installInterfaces } = require("../living/interfaces.js");
const { addWindowMethods } = require("../living/window/Window-impl.js");
const EventTarget = require("../living/generated/EventTarget.js");
const jsGlobals = require("./js-globals.json");
const jsGlobalEntriesToInstall = Object.entries(jsGlobals).filter(([name]) => name in global);

// This file will eventually handle the creation and setup of all Global objects
exports.createWindow = options => {
  const window = Object.create(null);
  setupWindow(window, options);
  return window;
};

// https://html.spec.whatwg.org/#the-window-object
function setupWindow(window, options) {
  const { runScripts } = options;

  let globalProxy = window;

  if (runScripts === "outside-only" || runScripts === "dangerously") {
    contextifyWindow(window);
    globalProxy = vm.runInContext("this", window);

    // Without this, these globals will only appear to scripts running inside the context using vm.runScript; they will
    // not appear to scripts running from the outside, including to JSDOM implementation code.
    for (const [globalName, globalPropDesc] of jsGlobalEntriesToInstall) {
      const propDesc = { ...globalPropDesc, value: vm.runInContext(globalName, window) };
      Object.defineProperty(window, globalName, propDesc);
    }
  } else {
    // Without contextifying the window, none of the globals will exist. So, let's at least alias them from the Node.js
    // context. See https://github.com/jsdom/jsdom/issues/2727 for more background and discussion.
    for (const [globalName, globalPropDesc] of jsGlobalEntriesToInstall) {
      const propDesc = { ...globalPropDesc, value: global[globalName] };
      Object.defineProperty(window, globalName, propDesc);
    }
  }

  installInterfaces(window, ["Window"]);

  const EventTargetConstructor = window.EventTarget;

  // eslint-disable-next-line no-shadow
  const windowConstructor = class Window extends EventTargetConstructor {
    constructor() {
      throw new TypeError("Illegal constructor");
    }
  };

  Object.defineProperty(window, "Window", {
    configurable: true,
    writable: true,
    value: windowConstructor
  });

  const windowPrototype = windowConstructor.prototype;
  Object.defineProperties(windowPrototype, {
    [Symbol.toStringTag]: {
      value: "Window",
      configurable: true
    }
  });

  Object.setPrototypeOf(window, windowPrototype);
  EventTarget.setup(window, window);
  addWindowMethods.call(window, globalProxy, options);
}

function contextifyWindow(window) {
  if (vm.isContext(window)) {
    return;
  }

  vm.createContext(window);
}
