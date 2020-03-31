"use strict";

const vm = require("vm");
const idlUtils = require("../living/generated/utils.js");
const { installInterfaces } = require("../living/interfaces.js");
const Window = require("../living/generated/Window.js");
const jsGlobals = require("./js-globals.json");
const jsGlobalEntriesToInstall = Object.entries(jsGlobals).filter(([name]) => name in global);

exports.createWindow = options => {
  const window = Object.create(null);
  setupWindow(window, options);
  return idlUtils.implForWrapper(window);
};

// https://html.spec.whatwg.org/#the-window-object
function setupWindow(window, options) {
  const { runScripts } = options;

  let globalProxy = window;

  // Future-proofing for: https://github.com/nodejs/node/pull/30709
  let vmContext;

  if (runScripts === "outside-only" || runScripts === "dangerously") {
    contextifyWindow(window);
    globalProxy = vm.runInContext("this", window);
    vmContext = window;

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

  installInterfaces(window);
  Object.setPrototypeOf(window, window.Window.prototype);
  Window.setup(window, window, undefined, { globalProxy, options, vmContext });

  // TODO: Support this in WebIDL2JS
  if (!options.pretendToBeVisual) {
    delete window.requestAnimationFrame;
    delete window.cancelAnimationFrame;
  }
}

function contextifyWindow(window) {
  if (vm.isContext(window)) {
    return;
  }

  vm.createContext(window);
}
