/* eslint-disable no-console */

import fs from "node:fs";
import path from "node:path";

import WebIDL2JS from "webidl2js";

import processReflect from "./reflection.mjs";

const transformer = new WebIDL2JS({
  implSuffix: "-impl",
  suppressErrors: true,
  processCEReactions(code) {
    const preSteps = this.addImport(
      "../../jsdom/living/helpers/custom-elements",
      "ceReactionsPreSteps",
    );
    const postSteps = this.addImport(
      "../../jsdom/living/helpers/custom-elements",
      "ceReactionsPostSteps",
    );

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
    const identifier = this.addImport(
      "../../jsdom/living/helpers/html-constructor",
      "HTMLConstructor",
    );

    return `
      return ${identifier}(globalObject, interfaceName, new.target);
    `;
  },
  processReflect(idl, implObj) {
    const reflectStyle = idl.extAttrs.find((attribute) => attribute.name === "ReflectStyle");
    if (reflectStyle) {
      const property = reflectStyle.rhs.value;
      return {
        get: `return ${implObj}.getPropertyValue(${property});`,
        set: `${implObj}.setProperty(${property}, V, "");`,
      };
    }
    return processReflect(this, idl, implObj);
  },
});

function addDir(dir) {
  const resolved = path.resolve(import.meta.dirname, dir);
  transformer.addSource(resolved, resolved);
}

addDir("../../lib/jsdom/living/aborting");
addDir("../../lib/jsdom/living/aria");
addDir("../../lib/jsdom/living/attributes");
addDir("../../lib/jsdom/living/constraint-validation");
addDir("../../lib/jsdom/living/crypto");
addDir("../../lib/jsdom/living/css");
transformer.addSource(
  path.resolve(import.meta.dirname, "../../lib/generated/css-webidl"),
  path.resolve(import.meta.dirname, "../../lib/jsdom/living/css"),
);
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

const outputDir = path.resolve(import.meta.dirname, "../../lib/generated/idl/");

// Clean up any old stuff lying around.
fs.rmSync(outputDir, { force: true, recursive: true, maxRetries: 2 });
fs.mkdirSync(outputDir, { recursive: true });

transformer.generate(outputDir).catch((err) => {
  console.error(err);
  process.exit(1);
});
