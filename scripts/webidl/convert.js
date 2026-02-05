/* eslint-disable no-console */

"use strict";
const path = require("path");
const fs = require("fs");
const Webidl2js = require("webidl2js");
const processReflect = require("./reflection.js");

const transformer = new Webidl2js({
  implSuffix: "-impl",
  suppressErrors: true,
  processCEReactions(code) {
    const preSteps = this.addImport("../helpers/custom-elements", "ceReactionsPreSteps");
    const postSteps = this.addImport("../helpers/custom-elements", "ceReactionsPostSteps");

    return `
      ${preSteps}(globalObject);
      try {
        ${code}
      } finally {
        ${postSteps}(globalObject);
      }
    `;
  },
  processHTMLConstructor() {
    const identifier = this.addImport("../helpers/html-constructor", "HTMLConstructor");

    return `
      return ${identifier}(globalObject, interfaceName, new.target);
    `;
  },
  processReflect(idl, implObj) {
    return processReflect(this, idl, implObj);
  }
});

function addDir(dir) {
  const resolved = path.resolve(__dirname, dir);
  transformer.addSource(resolved, resolved);
}

addDir("../../lib/jsdom/living/aborting");
addDir("../../lib/jsdom/living/aria");
addDir("../../lib/jsdom/living/attributes");
addDir("../../lib/jsdom/living/constraint-validation");
addDir("../../lib/jsdom/living/crypto");
addDir("../../lib/jsdom/living/cssom");
addDir("../../lib/jsdom/living/custom-elements");
addDir("../../lib/jsdom/living/deviceorientation");
addDir("../../lib/jsdom/living/domparsing");
addDir("../../lib/jsdom/living/encoding");
addDir("../../lib/jsdom/living/events");
addDir("../../lib/jsdom/living/fetch");
addDir("../../lib/jsdom/living/file-api");
addDir("../../lib/jsdom/living/geometry");
addDir("../../lib/jsdom/living/hr-time");
addDir("../../lib/jsdom/living/mutation-observer");
addDir("../../lib/jsdom/living/navigator");
addDir("../../lib/jsdom/living/nodes");
addDir("../../lib/jsdom/living/range");
addDir("../../lib/jsdom/living/selection");
addDir("../../lib/jsdom/living/svg");
addDir("../../lib/jsdom/living/traversal");
addDir("../../lib/jsdom/living/websockets");
addDir("../../lib/jsdom/living/webstorage");
addDir("../../lib/jsdom/living/window");
addDir("../../lib/jsdom/living/xhr");
addDir("../../lib/jsdom/living/webidl");

const outputDir = path.resolve(__dirname, "../../lib/jsdom/living/generated/");

// Clean up any old stuff lying around.
fs.rmSync(outputDir, { force: true, recursive: true, maxRetries: 2 });
fs.mkdirSync(outputDir);

function applyGH2265Patches() {
  // 1) Patch utils.js: WeakMap + registerWrapper + implForWrapper uses WeakMap (GH-2265)
  const utilsPath = path.join(outputDir, "utils.js");
  let utilsCode = fs.readFileSync(utilsPath, "utf8");
  if (!utilsCode.includes("wrapperToImpl")) {
    utilsCode = utilsCode.replace(
      "const ctorRegistrySymbol = Symbol.for(\"[webidl2js] constructor registry\");",
      "const ctorRegistrySymbol = Symbol.for(\"[webidl2js] constructor registry\");\n\nconst wrapperToImpl = new WeakMap();"
    );
    utilsCode = utilsCode.replace(
      "function implForWrapper(wrapper) {\n  return wrapper ? wrapper[implSymbol] : null;\n}",
      "function registerWrapper(wrapper, impl) {\n  wrapperToImpl.set(wrapper, impl);\n}\n\nfunction implForWrapper(wrapper) {\n  if (!wrapper) return null;\n  const impl = wrapperToImpl.get(wrapper);\n  return impl !== undefined ? impl : null;\n}"
    );
    utilsCode = utilsCode.replace(
      "  wrapperForImpl,\n  implForWrapper,",
      "  registerWrapper,\n  wrapperForImpl,\n  implForWrapper,"
    );
    fs.writeFileSync(utilsPath, utilsCode);
  }

  // 2) Add registerWrapper after each wrapper setup; fix exports.is to use implForWrapper
  const files = fs.readdirSync(outputDir).filter((f) => f.endsWith(".js") && f !== "utils.js");
  const registerBlock = "\n  utils.registerWrapper(wrapper, wrapper[implSymbol]);\n  if (Impl.init)";
  const setupPattern = /  wrapper\[implSymbol]\[utils\.wrapperSymbol\] = wrapper;\r?\n  if \(Impl\.init\)/g;
  const isOld = "Object.hasOwn(value, implSymbol) && value[implSymbol] instanceof";
  const isNew = "utils.implForWrapper(value) instanceof";

  for (const f of files) {
    const p = path.join(outputDir, f);
    let s = fs.readFileSync(p, "utf8");
    if (s.includes("wrapper[implSymbol][utils.wrapperSymbol] = wrapper") && !s.includes("utils.registerWrapper(wrapper, wrapper[implSymbol])")) {
      s = s.replace(setupPattern, "  wrapper[implSymbol][utils.wrapperSymbol] = wrapper;" + registerBlock);
      fs.writeFileSync(p, s);
    }
    if (s.includes(isOld)) {
      s = s.split(isOld).join(isNew);
      fs.writeFileSync(p, s);
    }
  }
}

transformer.generate(outputDir)
  .then(applyGH2265Patches)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
