/* eslint-disable no-console */

"use strict";

const path = require("path");
const fs = require("fs");

const Webidl2js = require("webidl2js");

function isSimpleIDLType(idlType, expected) {
  if (idlType.generic !== "" || idlType.union) {
    return false;
  }
  return idlType.idlType === expected;
}

const recognizedReflectXAttrNames = new Set([
  "Reflect",
  "ReflectURL",
  "ReflectNonNegative",
  "ReflectPositive",
  "ReflectPositiveWithFallback"
]);

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
  // https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
  processReflect(idl, implObj) {
    const reflectAttr = idl.extAttrs.find(attr => recognizedReflectXAttrNames.has(attr.name));
    const attrName = reflectAttr?.rhs ? JSON.parse(reflectAttr.rhs.value) : idl.name.toLowerCase();

    const reflectDefaultAttr = idl.extAttrs.find(attr => attr.name === "ReflectDefault");
    const reflectDefault = reflectDefaultAttr?.rhs ? JSON.parse(reflectDefaultAttr.rhs.value) : undefined;

    const reflectRangeAttr = idl.extAttrs.find(attr => attr.name === "ReflectRange");
    const reflectRange = reflectRangeAttr?.rhs ? reflectRangeAttr.rhs.value.map(v => JSON.parse(v.value)) : undefined;
    if (reflectRange && reflectRange.length !== 2) {
      throw new Error("Invalid [ReflectRange] value");
    }

    if (reflectAttr.name === "ReflectURL") {
      // Allow DOMString also due to https://github.com/whatwg/html/issues/5241.
      if (!isSimpleIDLType(idl.idlType, "USVString") && !isSimpleIDLType(idl.idlType, "DOMString")) {
        throw new Error("[ReflectURL] specified on non-USVString, non-DOMString IDL attribute");
      }
      const parseURLToResultingURLRecord =
        this.addImport("../helpers/document-base-url", "parseURLToResultingURLRecord");
      const serializeURL = this.addImport("whatwg-url", "serializeURL");
      return {
        get: `
          const value = ${implObj}._reflectGetTheContentAttribute("${attrName}");
          if (value === null) {
            return "";
          }
          const urlRecord = ${parseURLToResultingURLRecord}(value, ${implObj}._ownerDocument);
          if (urlRecord !== null) {
            return ${serializeURL}(urlRecord);
          }
          return conversions.USVString(value);
        `,
        set: `
          ${implObj}._reflectSetTheContentAttribute("${attrName}", V);
        `
      };
    }

    // For all these cases, we'll process them later, but we do the checks now.
    if (reflectAttr.name === "ReflectNonNegative") {
      if (!isSimpleIDLType(idl.idlType, "long")) {
        throw new Error("[ReflectNonNegative] specified on non-long IDL attribute");
      }
    }
    if (reflectAttr.name === "ReflectPositive") {
      if (!isSimpleIDLType(idl.idlType, "unsigned long") && !isSimpleIDLType(idl.idlType, "double")) {
        throw new Error("[ReflectPositive] specified on non-unsigned long, non-double IDL attribute");
      }
    }
    if (reflectAttr.name === "ReflectPositiveWithFallback") {
      if (!isSimpleIDLType(idl.idlType, "unsigned long")) {
        throw new Error("[ReflectPositiveWithFallback] specified on non-unsigned long IDL attribute");
      }
    }

    if (isSimpleIDLType(idl.idlType, "DOMString") || isSimpleIDLType(idl.idlType, "USVString")) {
      if (idl.idlType.nullable) {
        // Nonstandard; see https://github.com/whatwg/html/issues/10037. This passes the WPTs though.
        return {
          get: `
            return ${implObj}._reflectGetTheContentAttribute("${attrName}");
          `,
          set: `
            if (V === null) {
              ${implObj}._reflectDeleteTheContentAttribute("${attrName}");
            } else {
              ${implObj}._reflectSetTheContentAttribute("${attrName}", V);
            }
          `
        };
      }

      const isUSV = isSimpleIDLType(idl.idlType, "USVString");
      return {
        get: `
          const value = ${implObj}._reflectGetTheContentAttribute("${attrName}");
          return value === null ? "" : ${isUSV ? "conversions.USVString(value)" : "value"};
        `,
        set: `
          ${implObj}._reflectSetTheContentAttribute("${attrName}", V);
        `
      };
    }

    if (isSimpleIDLType(idl.idlType, "boolean")) {
      return {
        get: `
          return ${implObj}._reflectGetTheContentAttribute("${attrName}") !== null;
        `,
        set: `
          if (V) {
            ${implObj}._reflectSetTheContentAttribute("${attrName}", "");
          } else {
            ${implObj}._reflectDeleteTheContentAttribute("${attrName}");
          }
        `
      };
    }

    if (isSimpleIDLType(idl.idlType, "long")) {
      const parser = this.addImport(
        "../helpers/strings",
        reflectAttr.name === "ReflectNonNegative" ? "parseNonNegativeInteger" : "parseInteger"
      );

      let defaultValue;
      if (reflectDefault !== undefined) {
        defaultValue = reflectDefault;
      } else if (reflectAttr.name === "ReflectNonNegative") {
        defaultValue = -1;
      } else {
        defaultValue = 0;
      }

      let setterPrefix = "";
      if (reflectAttr.name === "ReflectNonNegative") {
        const createDOMException = this.addImport("./DOMException", "create");
        setterPrefix = `
          if (V < 0) {
            throw ${createDOMException}(
              globalObject,
              [\`The negative value \${V} cannot be set for the ${idl.name} property.\`, "IndexSizeError"]
            );
          }
        `;
      }

      return {
        get: `
          let value = ${implObj}._reflectGetTheContentAttribute("${attrName}");
          if (value !== null) {
            value = ${parser}(value);
            if (value !== null && conversions.long(value) === value) {
              return value;
            }
          }
          return ${defaultValue};
        `,
        set: `
          ${setterPrefix}
          ${implObj}._reflectSetTheContentAttribute("${attrName}", String(V));
        `
      };
    }

    if (isSimpleIDLType(idl.idlType, "unsigned long")) {
      const parseNonNegativeInteger = this.addImport("../helpers/strings", "parseNonNegativeInteger");

      const minimum = reflectAttr.name === "ReflectPositive" || reflectAttr.name === "ReflectPositiveWithFallback" ?
        1 :
        0;
      const maximum = 2147483647;
      const defaultValue = reflectDefault !== undefined ? reflectDefault : minimum;

      let setterPrefix = "";
      if (reflectAttr.name === "ReflectPositive") {
        const createDOMException = this.addImport("./DOMException", "create");
        setterPrefix = `
          if (V === 0) {
            throw ${createDOMException}(
              globalObject,
              [\`The value \${V} cannot be set for the ${idl.name} property.\`, "IndexSizeError"]
            );
          }
        `;
      }

      let get;
      if (reflectRange) {
        const clampedMinimum = reflectRange[0];
        const clampedMaximum = reflectRange[1];
        const clampedDefaultValue = reflectDefault !== undefined ? reflectDefault : clampedMinimum;

        get = `
          let value = ${implObj}._reflectGetTheContentAttribute("${attrName}");
          if (value !== null) {
            value = ${parseNonNegativeInteger}(value);
            if (value !== null) {
              if (value < ${clampedMinimum}) {
                return ${clampedMinimum};
              } else if (value >= ${clampedMinimum} && value <= ${clampedMaximum}) {
                return value;
              } else {
                return ${clampedMaximum};
              }
            }
          }
          return ${clampedDefaultValue};
        `;
      } else {
        get = `
          let value = ${implObj}._reflectGetTheContentAttribute("${attrName}");
          if (value !== null) {
            value = ${parseNonNegativeInteger}(value);
            if (value !== null && value >= ${minimum} && value <= ${maximum}) {
              return value;
            }
          }
          return ${defaultValue};
        `;
      }

      return {
        get,
        set: `
          ${setterPrefix}
          const newValue = V <= ${maximum} && V >= ${minimum} ? V : ${defaultValue};
          ${implObj}._reflectSetTheContentAttribute("${attrName}", String(newValue));
        `
      };
    }

    if (isSimpleIDLType(idl.idlType, "double")) {
      const parseFloatingPointNumber = this.addImport("../helpers/strings", "parseFloatingPointNumber");
      const defaultValue = reflectDefault !== undefined ? reflectDefault : 0;

      if (reflectAttr.name === "ReflectPositive") {
        return {
          get: `
            let value = ${implObj}._reflectGetTheContentAttribute("${attrName}");
            if (value !== null) {
              value = ${parseFloatingPointNumber}(value);
              if (value !== null && value > 0) {
                return value;
              }
            }
            return ${defaultValue};
          `,
          set: `
            if (V > 0) {
              ${implObj}._reflectSetTheContentAttribute("${attrName}", String(V));
            }
          `
        };
      }

      return {
        get: `
          let value = ${implObj}._reflectGetTheContentAttribute("${attrName}");
          if (value !== null) {
            value = ${parseFloatingPointNumber}(value);
            if (value !== null) {
              return value;
            }
          }
          return ${defaultValue};
        `,
        set: `
          ${implObj}._reflectSetTheContentAttribute("${attrName}", String(V));
        `
      };
    }

    throw new Error("Unrecognized reflection type " + idl.idlType.idlType);
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
addDir("../../lib/jsdom/living/domparsing");
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

transformer.generate(outputDir)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
