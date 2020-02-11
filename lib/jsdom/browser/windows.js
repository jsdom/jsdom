"use strict";

const vm = require("vm");
const webIDLConversions = require("webidl-conversions");
const { define } = require("../utils.js");
const idlUtils = require("../living/generated/utils.js");
const Window = require("../living/generated/Window.js");
const { installInterfaces } = require("../living/interfaces.js");
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

  installInterfaces(window);

  const windowPrototype = window.Window.prototype;
  Object.setPrototypeOf(window, windowPrototype);

  Window.setup(window, window, undefined, { globalProxy, options });

  if (options.pretendToBeVisual) {
    define(window, {
      requestAnimationFrame(callback) {
        if (!this || !Window.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        if (arguments.length < 1) {
          throw new TypeError("Failed to execute 'requestAnimationFrame' on 'Window': 1 argument required, but only " +
              arguments.length + " present.");
        }
        const args = [];
        {
          let curArg = callback;
          curArg = webIDLConversions.Function(curArg, {
            context: "Failed to execute 'requestAnimationFrame' on 'Window': parameter 1"
          });
          args.push(curArg);
        }
        return this[idlUtils.implSymbol].requestAnimationFrame(...args);
      },
      cancelAnimationFrame(handle) {
        if (!this || !Window.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        if (arguments.length < 1) {
          throw new TypeError("Failed to execute 'cancelAnimationFrame' on 'Window': 1 argument required, but only " +
              arguments.length + " present.");
        }
        const args = [];
        {
          let curArg = handle;
          curArg = webIDLConversions["unsigned long"](curArg, {
            context: "Failed to execute 'cancelAnimationFrame' on 'Window': parameter 1"
          });
          args.push(curArg);
        }
        return this[idlUtils.implSymbol].cancelAnimationFrame(...args);
      }
    });
  }
}

function contextifyWindow(window) {
  if (vm.isContext(window)) {
    return;
  }

  vm.createContext(window);
}
