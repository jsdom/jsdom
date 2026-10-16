"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const { definitionSyntax } = require("css-tree");
const { lexer } = require("../lib/jsdom/living/css/helpers/patched-csstree.js");

const outputDir = path.resolve(__dirname, "../lib/generated");
const cssDir = path.resolve(__dirname, "../lib/jsdom/living/css");
const propertiesDir = path.resolve(cssDir, "properties");

// WebIDL keywords that must be escaped with a leading underscore.
const webIDLKeywords = new Set(["float"]);

// Webref identifies logical property groups but does not identify each member's mapping logic.
// These are the physical members of each group; its remaining members are flow-relative.
const physicalPropertiesByLogicalGroup = new Map([
  ["background-position", ["background-position-x", "background-position-y"]],
  ["background-repeat", ["background-repeat-x", "background-repeat-y"]],
  ["size", ["width", "height"]],
  ["border-clip", ["border-top-clip", "border-right-clip", "border-bottom-clip", "border-left-clip"]],
  ["border-color", ["border-top-color", "border-right-color", "border-bottom-color", "border-left-color"]],
  ["border-style", ["border-top-style", "border-right-style", "border-bottom-style", "border-left-style"]],
  ["border-width", ["border-top-width", "border-right-width", "border-bottom-width", "border-left-width"]],
  [
    "border-radius",
    ["border-top-left-radius", "border-top-right-radius", "border-bottom-left-radius", "border-bottom-right-radius"]
  ],
  ["inset", ["top", "right", "bottom", "left"]],
  ["contain-intrinsic-size", ["contain-intrinsic-width", "contain-intrinsic-height"]],
  [
    "corner-shape",
    ["corner-top-left-shape", "corner-top-right-shape", "corner-bottom-left-shape", "corner-bottom-right-shape"]
  ],
  ["margin", ["margin-top", "margin-right", "margin-bottom", "margin-left"]],
  ["max-size", ["max-width", "max-height"]],
  ["min-size", ["min-width", "min-height"]],
  ["overflow", ["overflow-x", "overflow-y"]],
  [
    "overflow-clip-margin",
    [
      "overflow-clip-margin-top",
      "overflow-clip-margin-right",
      "overflow-clip-margin-bottom",
      "overflow-clip-margin-left"
    ]
  ],
  ["overscroll-behavior", ["overscroll-behavior-x", "overscroll-behavior-y"]],
  ["padding", ["padding-top", "padding-right", "padding-bottom", "padding-left"]],
  ["scroll-margin", ["scroll-margin-top", "scroll-margin-right", "scroll-margin-bottom", "scroll-margin-left"]],
  ["scroll-padding", ["scroll-padding-top", "scroll-padding-right", "scroll-padding-bottom", "scroll-padding-left"]]
]);

async function main() {
  const css = await import("@webref/css");
  const propertyFiles = await fs.readdir(propertiesDir);
  const implementedProperties = new Map(propertyFiles.map(file => [file.replace(/\.js$/, ""), file]));

  const { properties, types } = await css.listAll();
  const definitions = new Map(
    properties.map(definition => {
      delete definition.extended;
      return [definition.name, definition];
    })
  );
  const syntaxes = new Map(types.map(definition => [`<${definition.name}>`, definition]));

  const caseSensitiveTypes = ["custom-ident", "dashed-ident", "string"];
  const dimensionTypes = [
    "angle",
    "angle-percentage",
    "flex",
    "frequency",
    "frequency-percentage",
    "integer",
    "length",
    "length-percentage",
    "number",
    "percentage",
    "ratio",
    "time",
    "time-percentage"
  ];
  const functionTypes = ["color", "image", "paint"];
  const typeList = new Set([...caseSensitiveTypes, ...dimensionTypes, ...functionTypes]);

  await generateDefinitions();
  await Promise.all([generateDescriptors(), generateWebIDL(), generateShorthandRelationships()]);

  function generateDefinitions() {
    // Emit only fields consumed at runtime; update this list when runtime consumers
    // need additional fields. Build-time generation uses the full definitions.
    const runtimeDefinitions = Array.from(definitions, ([property, definition]) => {
      // Aliases such as `font-stretch` carry their defaults on the target definition.
      definition = definitions.get(definition.legacyAliasOf) ?? definition;
      const { inherited, longhands, logicalPropertyGroup } = definition;
      let { initial } = definition;
      // Shorthand definitions can contain prose such as "see individual properties" instead of
      // an initial CSS value. Only retain defaults that can be used as property values.
      if (longhands && initial !== undefined && !lexer.matchProperty(property, initial).matched) {
        initial = undefined;
      }
      let logical;
      if (logicalPropertyGroup) {
        const physicalProperties = physicalPropertiesByLogicalGroup.get(logicalPropertyGroup);
        if (!physicalProperties) {
          throw new Error(`Unknown logical property group: ${logicalPropertyGroup}`);
        }
        logical = !physicalProperties.includes(definition.name);
      }
      return [property, { inherited, initial, longhands, logicalPropertyGroup, logical }];
    });
    const output = `"use strict";

module.exports = new Map(${JSON.stringify(runtimeDefinitions, undefined, 2)});
`;
    return fs.writeFile(path.resolve(outputDir, "css-property-definitions.js"), output);
  }

  function generateShorthandRelationships() {
    // Use the shorthands we actually expand, rather than every shorthand in the specifications.
    // The property implementations can be loaded now that their definitions have been generated.
    const { resetOnlyLonghands, shorthandProperties } =
      require(path.resolve(cssDir, "helpers/shorthand-properties.js"));
    const longhandsByShorthand = new Map();
    const shorthandsByLonghand = new Map();
    for (const shorthand of shorthandProperties.keys()) {
      const longhands = [...new Set(longhandNames(shorthand))];
      longhandsByShorthand.set(shorthand, longhands);
      for (const longhand of longhands) {
        if (!shorthandsByLonghand.has(longhand)) {
          shorthandsByLonghand.set(longhand, []);
        }
        shorthandsByLonghand.get(longhand).push(shorthand);
      }
    }
    // CSSOM prefers shorthands covering more longhands, then sorts equal-sized shorthands by name.
    // All implemented shorthands are unprefixed and none are legacy shorthands.
    for (const shorthands of shorthandsByLonghand.values()) {
      shorthands.sort().sort((a, b) => longhandsByShorthand.get(b).length - longhandsByShorthand.get(a).length);
    }
    const output = `"use strict";

exports.longhandsByShorthand = new Map(${JSON.stringify([...longhandsByShorthand], undefined, 2)});
exports.shorthandsByLonghand = new Map(${JSON.stringify([...shorthandsByLonghand], undefined, 2)});
`;
    return fs.writeFile(path.resolve(outputDir, "css-shorthand-relationships.js"), output);

    function* longhandNames(property) {
      const shorthand = shorthandProperties.get(property);
      if (shorthand) {
        for (const name of shorthand.shorthandFor.keys()) {
          yield* longhandNames(name);
        }
        yield* resetOnlyLonghands.get(property)?.keys() ?? [];
      } else {
        yield property;
      }
    }
  }

  function generateDescriptors() {
    const requires = [];
    const computedValueResolverRequires = [];
    const computedValueResolvers = [];
    const resolvedValueResolverRequires = [];
    const resolvedValueResolvers = [];
    const descriptors = [];
    const metadata = [];
    for (const [canonicalProperty, { legacyAliasOf, styleDeclaration, syntax }] of definitions) {
      const camelizedProperty = dashedToCamelCase(canonicalProperty);
      const camelizedAliasProperty = legacyAliasOf ? dashedToCamelCase(legacyAliasOf) : "";
      let descriptorSource;
      if (implementedProperties.has(camelizedProperty)) {
        const fileName = implementedProperties.get(camelizedProperty);
        requires.push(`const ${camelizedProperty} = require("../jsdom/living/css/properties/${fileName}");`);
        descriptorSource = `${camelizedProperty}.descriptor`;
        const implementation = require(path.resolve(propertiesDir, fileName));
        if (typeof implementation.resolveComputedValue === "function") {
          computedValueResolverRequires.push(
            `const ${camelizedProperty} = require("../jsdom/living/css/properties/${fileName}");`
          );
          computedValueResolvers.push(`["${canonicalProperty}", ${camelizedProperty}.resolveComputedValue]`);
        }
        if (typeof implementation.getResolvedValue === "function") {
          resolvedValueResolverRequires.push(
            `const ${camelizedProperty} = require("../jsdom/living/css/properties/${fileName}");`
          );
          resolvedValueResolvers.push(`["${canonicalProperty}", ${camelizedProperty}.getResolvedValue]`);
        }
        const opts = createDescriptorOpts(syntax);
        metadata.push([canonicalProperty, opts]);
      } else if (implementedProperties.has(camelizedAliasProperty)) {
        // No need to add to `requires` since the non-alias branch of the outer
        // loop will ensure the corresponding handler file is included there.
        descriptorSource = `${camelizedAliasProperty}.descriptor`;
      } else {
        const opts = createDescriptorOpts(syntax);
        descriptorSource = `createGenericPropertyDescriptor("${canonicalProperty}", ${JSON.stringify(opts)})`;
        metadata.push([canonicalProperty, opts]);
      }
      for (const property of styleDeclaration) {
        descriptors.push(`"${property}": ${descriptorSource}`);
      }
    }
    const descriptorOutput = `"use strict";
${requires.sort().join("\n")}
const { createGenericPropertyDescriptor } = require("../jsdom/living/css/helpers/generic-property-descriptor.js");

module.exports = {
  ${descriptors.join(",\n  ")}
};
`;
    const computedValueResolverOutput = `"use strict";
${computedValueResolverRequires.sort().join("\n")}

module.exports = new Map([
  ${computedValueResolvers.join(",\n  ")}
]);
`;
    const resolvedValueResolverOutput = `"use strict";
${resolvedValueResolverRequires.sort().join("\n")}

module.exports = new Map([
  ${resolvedValueResolvers.join(",\n  ")}
]);
`;
    // Share identical metadata to reduce generated code and allocations.
    const uniqueMetadata = new Map();
    const metadataEntries = metadata.map(([property, opts]) => {
      const source = JSON.stringify(opts);
      if (!uniqueMetadata.has(source)) {
        uniqueMetadata.set(source, `metadata${uniqueMetadata.size}`);
      }
      return `["${property}", ${uniqueMetadata.get(source)}]`;
    });
    const metadataOutput = `"use strict";

// Metadata objects, including nested values, are shared across properties.
// Treat them as immutable.
${Array.from(uniqueMetadata, ([source, identifier]) => `const ${identifier} = ${source};`).join("\n")}

module.exports = new Map([
  ${metadataEntries.join(",\n  ")}
]);
`;
    return Promise.all([
      fs.writeFile(
        path.resolve(outputDir, "css-property-computed-value-resolvers.js"),
        computedValueResolverOutput
      ),
      fs.writeFile(
        path.resolve(outputDir, "css-property-resolved-value-resolvers.js"),
        resolvedValueResolverOutput
      ),
      fs.writeFile(path.resolve(outputDir, "css-property-descriptors.js"), descriptorOutput),
      fs.writeFile(path.resolve(outputDir, "css-property-metadata.js"), metadataOutput)
    ]);
  }

  function generateWebIDL() {
    const attributes = [];
    // Add cssFloat explicitly (not in @webref/css styleDeclaration data for "float").
    attributes.push("  [CEReactions] attribute [LegacyNullToEmptyString] CSSOMString cssFloat;");
    for (const [, { styleDeclaration }] of definitions) {
      for (const property of styleDeclaration) {
        let idlName = property;
        if (webIDLKeywords.has(idlName)) {
          idlName = `_${idlName}`;
        }
        attributes.push(`  [CEReactions] attribute [LegacyNullToEmptyString] CSSOMString ${idlName};`);
      }
    }
    const output = `// Generated by generate-css-style-properties.js
// https://drafts.csswg.org/cssom/#the-cssstyleproperties-mixin
[Exposed=Window]
interface CSSStyleProperties : CSSStyleDeclaration {
${attributes.join("\n")}
};
`;
    return fs.writeFile(path.resolve(cssDir, "CSSStyleProperties.webidl"), output);
  }

  function createDescriptorOpts(syntax) {
    const opts = {
      caseSensitive: false
    };
    const collectedTypes = collectTypes(syntax);
    if (!collectedTypes.size) {
      return opts;
    }
    for (const type of caseSensitiveTypes) {
      if (collectedTypes.has(type)) {
        opts.caseSensitive = true;
        break;
      }
    }
    const dimensions = {};
    for (const key of dimensionTypes) {
      if (collectedTypes.has(key)) {
        const { opts: keyOpts } = collectedTypes.get(key);
        const opt = {};
        if (keyOpts) {
          const { max, min } = keyOpts;
          if (max !== undefined) {
            opt.max = max;
          }
          if (min !== undefined) {
            opt.min = min;
          }
        }
        let type;
        switch (key) {
          case "angle":
          case "angle-percentage": {
            type = "angle";
            break;
          }
          case "integer":
          case "number": {
            type = "number";
            break;
          }
          case "length":
          case "length-percentage": {
            type = "length";
            break;
          }
          case "percentage": {
            type = "percentage";
            break;
          }
          case "ratio": {
            type = "ratio";
            break;
          }
          default: {
            type = "dimension";
          }
        }
        opt.type = type;
        dimensions[type] = opt;
      }
    }
    if (Object.keys(dimensions).length) {
      opts.dimensionTypes = dimensions;
    }
    const functions = {};
    for (const type of functionTypes) {
      if (collectedTypes.has(type)) {
        functions[type] = type;
      }
    }
    if (Object.keys(functions).length) {
      opts.functionTypes = functions;
    }
    return opts;
  }

  function collectTypes(syntax) {
    const collectedTypes = new Map();
    if (!syntax) {
      return collectedTypes;
    }
    const ast = definitionSyntax.parse(syntax);
    if (ast.type === "Group") {
      const subTypeList = new Set();
      const propertyList = new Set();
      definitionSyntax.walk(ast, {
        enter(node) {
          const { name, type } = node;
          if (type === "Type") {
            if (typeList.has(name)) {
              collectedTypes.set(name, node);
            } else if (!name.endsWith("()")) {
              subTypeList.add(name);
            }
          } else if (type === "Property") {
            propertyList.add(name);
          }
        }
      });
      for (const type of subTypeList) {
        const typeKey = `<${type}>`;
        if (syntaxes.has(typeKey)) {
          const { syntax: typeSyntax } = syntaxes.get(typeKey);
          const expandedList = collectTypes(typeSyntax);
          for (const [key, value] of expandedList) {
            collectedTypes.set(key, value);
          }
        }
      }
      for (const property of propertyList) {
        if (definitions.has(property)) {
          const { syntax: propertySyntax } = definitions.get(property);
          const expandedList = collectTypes(propertySyntax);
          for (const [key, value] of expandedList) {
            collectedTypes.set(key, value);
          }
        }
      }
    }
    return collectedTypes;
  }
}

function dashedToCamelCase(dashed) {
  if (dashed.startsWith("--")) {
    return dashed;
  }
  return dashed.replace(/^-(webkit)/, "$1").replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
}

main();
