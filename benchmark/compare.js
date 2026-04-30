#!/usr/bin/env node
"use strict";
/* eslint-disable no-console */

const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { parseArgs } = require("node:util");
const {
  renderSuiteResults,
  compareSuites,
  renderComparisonTable,
  renderComparisonList
} = require("./lib");

const { values, positionals } = parseArgs({
  options: {
    suite: { type: "string", multiple: true, short: "s" },
    format: { type: "string", short: "f", default: "terminal" },
    output: { type: "string", short: "o", default: "table" }
  },
  allowPositionals: true,
  strict: false
});

if (positionals.length !== 2) {
  console.error(
    "Usage: npm run benchmark:compare -- <ref1> <ref2> " +
      "[--suite <name>]... [--format=terminal|markdown] [--output=table|list]"
  );
  process.exit(1);
}
const [ref1, ref2] = positionals;

if (values.format !== "terminal" && values.format !== "markdown") {
  console.error(`Unknown --format: ${values.format}. Expected "terminal" or "markdown".`);
  process.exit(1);
}
if (values.output !== "table" && values.output !== "list") {
  console.error(`Unknown --output: ${values.output}. Expected "table" or "list".`);
  process.exit(1);
}

function git(...args) {
  const r = spawnSync("git", args, { encoding: "utf-8" });
  if (r.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed:\n${r.stderr}`);
  }
  return r.stdout.trim();
}

function ensureCleanTree() {
  const status = git("status", "--porcelain");
  if (status !== "") {
    console.error("Working tree is not clean. Commit or stash your changes before running benchmark:compare.");
    console.error(status);
    process.exit(1);
  }
}

function currentRefName() {
  // If we're on a branch, return its name; otherwise return the detached HEAD SHA.
  const branch = git("rev-parse", "--abbrev-ref", "HEAD");
  if (branch === "HEAD") {
    return git("rev-parse", "HEAD");
  }
  return branch;
}

function checkout(ref) {
  console.error(`\n--- Checking out ${ref} ---`);
  git("checkout", ref);
}

function npmInstall() {
  console.error("--- Running npm install ---");
  const r = spawnSync("npm", ["install"], { stdio: ["ignore", "inherit", "inherit"] });
  if (r.status !== 0) {
    throw new Error(`npm install failed (exit ${r.status})`);
  }
}

function runSuites(suiteFilters) {
  console.error("--- Running benchmarks ---");
  const args = [path.join(__dirname, "run-suites-json.js")];
  if (suiteFilters) {
    for (const s of suiteFilters) {
      args.push("--suite", s);
    }
  }
  const r = spawnSync(process.execPath, args, { encoding: "utf-8", stdio: ["ignore", "pipe", "inherit"] });
  if (r.status !== 0) {
    throw new Error(`benchmark subprocess failed (exit ${r.status})`);
  }
  return r.stdout
    .split("\n")
    .filter(line => line.trim() !== "")
    .map(line => JSON.parse(line));
}

function runForRef(ref, suiteFilters) {
  checkout(ref);
  npmInstall();
  return runSuites(suiteFilters);
}

ensureCleanTree();
const originalRef = currentRefName();
console.error(`Original ref: ${originalRef}`);

let ref1Results, ref2Results;
try {
  ref1Results = runForRef(ref1, values.suite);
  ref2Results = runForRef(ref2, values.suite);
} finally {
  try {
    checkout(originalRef);
    npmInstall();
  } catch (err) {
    console.error("\n!!! Failed to restore original ref. You are likely on a different branch.");
    console.error(`Run 'git checkout ${originalRef} && npm install' manually.`);
    console.error(err);
  }
}

// Render per-suite raw results, then a combined summary at the end.
const ref1BySuite = new Map(ref1Results.map(r => [r.suite, r]));
const ref2BySuite = new Map(ref2Results.map(r => [r.suite, r]));
const allSuites = [...new Set([...ref1BySuite.keys(), ...ref2BySuite.keys()])];

for (const suite of allSuites) {
  console.log(`\n# ${suite}\n`);
  if (ref1BySuite.has(suite)) {
    console.log(`## ${ref1}\n`);
    console.log(renderSuiteResults(values.format, ref1BySuite.get(suite)));
  }
  if (ref2BySuite.has(suite)) {
    console.log(`\n## ${ref2}\n`);
    console.log(renderSuiteResults(values.format, ref2BySuite.get(suite)));
  }
}

console.log(`\n# Summary (${ref2} throughput / ${ref1} throughput; >1 means ${ref2} faster)\n`);

if (values.output === "list") {
  for (const suite of allSuites) {
    const r1 = ref1BySuite.get(suite) ?? { tasks: [] };
    const r2 = ref2BySuite.get(suite) ?? { tasks: [] };
    console.log(`## ${suite}\n`);
    console.log(renderComparisonList(ref1, ref2, compareSuites(r1, r2)));
    console.log("");
  }
} else {
  for (const suite of allSuites) {
    const r1 = ref1BySuite.get(suite) ?? { tasks: [] };
    const r2 = ref2BySuite.get(suite) ?? { tasks: [] };
    console.log(`## ${suite}\n`);
    console.log(renderComparisonTable(values.format, ref1, ref2, compareSuites(r1, r2)));
    console.log("");
  }
}
