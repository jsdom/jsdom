import fs from "node:fs/promises";
import path from "node:path";

import arabicLetterRanges from "@unicode/unicode-17.0.0/Bidi_Class/Arabic_Letter/ranges.mjs";
import ltrRanges from "@unicode/unicode-17.0.0/Bidi_Class/Left_To_Right/ranges.mjs";
import rightToLeftRanges from "@unicode/unicode-17.0.0/Bidi_Class/Right_To_Left/ranges.mjs";
import registry from "language-subtag-registry/data/json/registry.json" with { type: "json" };

const outputDirectory = path.resolve(import.meta.dirname, "../lib/generated");
await fs.mkdir(outputDirectory, { recursive: true });

async function writeData(name, data, source) {
  await fs.writeFile(
    path.join(outputDirectory, name),
    `"use strict";\n\n// Generated from ${source} by scripts/generate-dom-data.mjs.\n` +
      `module.exports = ${JSON.stringify(data)};\n`,
  );
}

const rtlRanges = [...rightToLeftRanges, ...arabicLetterRanges].sort((a, b) => a.begin - b.begin);
await writeData(
  "bidi-ranges.js",
  {
    ltrRanges: ltrRanges.map(({ begin, end }) => [begin, end]),
    rtlRanges: rtlRanges.map(({ begin, end }) => [begin, end]),
  },
  "@unicode/unicode-17.0.0",
);

const mappings = {
  redundant: {},
  languages: {},
  scripts: {},
  regions: {},
  variants: {},
  extlangs: {},
  privateUse: { languages: [], scripts: [], regions: [], variants: [] },
};
const subtagTypes = {
  language: "languages",
  script: "scripts",
  region: "regions",
  variant: "variants",
};
for (const entry of registry) {
  const name = (entry.Tag ?? entry.Subtag).toLowerCase();
  const preferred = entry["Preferred-Value"]?.toLowerCase();
  if (entry.Type === "extlang") {
    mappings.extlangs[name] = entry.Prefix[0].toLowerCase();
  } else if (entry.Type === "redundant") {
    if (preferred) {
      mappings.redundant[name] = preferred;
    }
  } else if (Object.hasOwn(subtagTypes, entry.Type)) {
    const type = subtagTypes[entry.Type];
    if (name.includes("..")) {
      mappings.privateUse[type].push(name.split(".."));
    } else {
      mappings[type][name] = preferred ?? name;
    }
  }
}

await writeData("language-mappings.js", mappings, "language-subtag-registry");
