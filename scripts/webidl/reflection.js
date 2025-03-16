"use strict";

const { XLINK_NS } = require("../../lib/jsdom/living/helpers/namespaces.js");

const recognizedReflectXAttrNames = new Set([
  "Reflect",
  "ReflectURL",
  "ReflectNonNegative",
  "ReflectPositive",
  "ReflectPositiveWithFallback"
]);

function isSimpleIDLType(idlType, expected) {
  if (idlType.generic !== "" || idlType.union) {
    return false;
  }
  return idlType.idlType === expected;
}

function getExtAttrValue(idl, extAttrName) {
  const foundAttr = idl.extAttrs.find(extAttr => extAttr.name === extAttrName);
  if (foundAttr) {
    return JSON.parse(foundAttr.rhs.value);
  }
  return undefined;
}

function checkAttributeNamespace(attr) {
  if (attr.includes(":")) {
    throw new Error(`Namespace not supported for attribute ${attr}`);
  }
}

function extractAttributeInfo(attr) {
  if (attr === undefined) {
    return undefined;
  }

  const parts = attr.split(":");
  if (parts.length === 1) {
    return { ns: null, name: parts[0] };
  }
  if (parts.length === 2) {
    let ns;
    if (parts[0] === "xlink") {
      ns = XLINK_NS;
    } else {
      throw new Error(`Unrecognized attribute namespace name ${parts[0]}`);
    }
    return { ns, name: parts[1] };
  }
  throw new Error(`Invalid attribute "${attr}"`);
}

module.exports = (transformer, idl, implObj) => {
  const reflectAttr = idl.extAttrs.find(attr => recognizedReflectXAttrNames.has(attr.name));
  const attrName = reflectAttr?.rhs ? JSON.parse(reflectAttr.rhs.value) : idl.name.toLowerCase();

  const reflectDefault = getExtAttrValue(idl, "ReflectDefault");

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
    const serializeURL = transformer.addImport("whatwg-url", "serializeURL");
    return {
      get: `
        const value = ${implObj}._reflectGetTheContentAttribute("${attrName}");
        if (value === null) {
          return "";
        }

        if (this._${attrName}URLCacheKey === value) {
          return this._${attrName}URLCache;
        }

        this._${attrName}URLCacheKey = value;

        const urlRecord = ${implObj}._ownerDocument.encodingParseAURL(value);
        if (urlRecord !== null) {
          this._${attrName}URLCache = ${serializeURL}(urlRecord);
          return this._${attrName}URLCache;
        }
        this._${attrName}URLCache = conversions.USVString(value);
        return this._${attrName}URLCache;
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
    const parser = transformer.addImport(
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
      const createDOMException = transformer.addImport("./DOMException", "create");
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
    const parseNonNegativeInteger = transformer.addImport("../helpers/strings", "parseNonNegativeInteger");

    const minimum = reflectAttr.name === "ReflectPositive" || reflectAttr.name === "ReflectPositiveWithFallback" ?
      1 :
      0;
    const maximum = 2147483647;
    const defaultValue = reflectDefault !== undefined ? reflectDefault : minimum;

    let setterPrefix = "";
    if (reflectAttr.name === "ReflectPositive") {
      const createDOMException = transformer.addImport("./DOMException", "create");
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
      const [clampedMinimum, clampedMaximum] = reflectRange;
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
    const parseFloatingPointNumber = transformer.addImport("../helpers/strings", "parseFloatingPointNumber");
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

  if (isSimpleIDLType(idl.idlType, "SVGAnimatedString")) {
    const createSVGAnimatedString = transformer.addImport("./SVGAnimatedString", "create");
    checkAttributeNamespace(attrName);
    const deprecatedAttr = extractAttributeInfo(getExtAttrValue(idl, "ReflectDeprecated"));
    const initialValue = getExtAttrValue(idl, "ReflectInitial");
    if (initialValue !== undefined && typeof initialValue !== "string") {
      throw new Error("Initial value of SVGAnimatedString must be a string");
    }

    return {
      get: `
        return ${createSVGAnimatedString}(globalObject, [], {
          element: ${implObj},
          attribute: "${attrName}",
          ${deprecatedAttr !== undefined ?
            `attributeDeprecatedNamespace: ${JSON.stringify(deprecatedAttr.ns)},
             attributeDeprecated: ${JSON.stringify(deprecatedAttr.name)},` :
            ""}
          ${initialValue !== undefined ?
            `initialValue: ${JSON.stringify(initialValue)},` :
            ""}
        });
      `
    };
  }

  throw new Error("Unrecognized reflection type " + idl.idlType.idlType);
};
