import fs from "node:fs/promises";
import path from "node:path";

import parser from "../lib/jsdom/living/css/parse/parser.js";
import values from "../lib/jsdom/living/css/values/value.js";
import { generateCSSModule } from "./generate-css-module.mjs";

const projectRoot = path.resolve(import.meta.dirname, "..");
const source = await fs.readFile(
  path.join(projectRoot, "lib/jsdom/browser/default-stylesheet.css"),
  "utf8",
);
const syntax = parser.parseStyleSheetSyntax(source, (error) => {
  throw new Error("The default stylesheet could not be parsed", { cause: error });
});
const rules = [];
const namespaces = new Map();
for (const rule of syntax) {
  if (rule.definition.cssom === "CSSNamespaceRule") {
    const [prefix, location] = rule.prelude;
    namespaces.set(
      values.isOmitted(prefix) ? "" : prefix.value,
      values.isFunction(location) ? location.value[0].value : location.value,
    );
  }
}

function collectRules(cssRules, conditions = []) {
  for (const rule of cssRules) {
    if (rule.definition.cssom === "CSSStyleRule") {
      if (rule.block.length > 1 || (rule.block.length === 1 && !Array.isArray(rule.block[0]))) {
        throw new Error(
          "Nested rules in the default stylesheet need an explicit compilation strategy",
        );
      }
      rules.push({
        selectors: rule.prelude,
        declarations: new Map(
          parser
            .resolveDeclarations(rule.block[0] ?? [], rule.definition.value.shorthands)
            .map((declaration) => [declaration.name, declaration]),
        ),
        conditions,
      });
    } else if (rule.definition.cssom === "CSSMediaRule") {
      collectRules(rule.block, [...conditions, rule.prelude]);
    } else if (rule.definition.cssom !== "CSSNamespaceRule") {
      throw new Error(`Unsupported default stylesheet rule: ${rule.definition.cssom}`);
    }
  }
}
collectRules(syntax);

const output = generateCSSModule(
  { rules, namespaces },
  "browser/default-stylesheet.css by scripts/generate-default-stylesheet.mjs",
);
await fs.writeFile(path.join(projectRoot, "lib/generated/default-stylesheet.js"), output);
