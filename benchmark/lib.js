"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { formatNumber } = require("tinybench");

const benchmarkDir = __dirname;

function discoverSuites() {
  const suites = [];
  for (const category of fs.readdirSync(benchmarkDir, { withFileTypes: true })) {
    if (!category.isDirectory()) {
      continue;
    }
    for (const file of fs.readdirSync(path.join(benchmarkDir, category.name), { withFileTypes: true })) {
      if (file.isFile() && file.name.endsWith(".js")) {
        suites.push(`${category.name}/${path.basename(file.name, ".js")}`);
      }
    }
  }
  suites.sort();
  return suites;
}

function filterSuites(suites, filters) {
  if (!filters || filters.length === 0) {
    return suites;
  }
  return suites.filter(s => filters.some(f => s.startsWith(f)));
}

async function runSuite(suiteName) {
  const factory = require(path.join(benchmarkDir, suiteName));
  const bench = factory();
  await bench.run();
  return {
    suite: suiteName,
    // bench.table() returns rows pre-formatted by tinybench (one record per task,
    // matching tinybench's own console output); used as-is for rendering.
    table: bench.table(),
    // Raw results retained so the comparison step can compute throughput ratios.
    tasks: bench.tasks.map(t => ({ name: t.name, result: t.result }))
  };
}

function renderTerminalTable(headers, rows) {
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map(r => String(r[i]).length)));
  const top = `┌${widths.map(w => "─".repeat(w + 2)).join("┬")}┐`;
  const sep = `├${widths.map(w => "─".repeat(w + 2)).join("┼")}┤`;
  const bot = `└${widths.map(w => "─".repeat(w + 2)).join("┴")}┘`;
  function fmtRow(cells) {
    return `│${cells.map((c, i) => ` ${String(c).padEnd(widths[i])} `).join("│")}│`;
  }
  const lines = [top, fmtRow(headers), sep, ...rows.map(fmtRow), bot];
  return lines.join("\n");
}

function escapeMarkdownCell(value) {
  return String(value).replace(/\|/g, "\\|");
}

function renderMarkdownTable(headers, rows) {
  const lines = [
    `| ${headers.map(escapeMarkdownCell).join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map(r => `| ${r.map(escapeMarkdownCell).join(" | ")} |`)
  ];
  return lines.join("\n");
}

function renderTable(format, headers, rows) {
  return format === "markdown" ? renderMarkdownTable(headers, rows) : renderTerminalTable(headers, rows);
}

function renderSuiteResults(format, suiteResult) {
  const headers = Object.keys(suiteResult.table[0]);
  const rows = suiteResult.table.map(record => headers.map(h => record[h]));
  return renderTable(format, headers, rows);
}

function formatRatio(ratio) {
  if (!Number.isFinite(ratio)) {
    return "n/a";
  }
  return `${ratio.toFixed(2)}×`;
}

function compareSuites(ref1Result, ref2Result) {
  const tasksByName = new Map(ref1Result.tasks.map(t => [t.name, { ref1: t }]));
  for (const t of ref2Result.tasks) {
    const entry = tasksByName.get(t.name) ?? {};
    entry.ref2 = t;
    tasksByName.set(t.name, entry);
  }
  const rows = [];
  for (const [name, { ref1, ref2 }] of tasksByName) {
    const ratio = ref1 && ref2 ? ref2.result.throughput.p50 / ref1.result.throughput.p50 : NaN;
    rows.push({ name, ref1, ref2, ratio });
  }
  return rows;
}

function renderComparisonTable(format, ref1Label, ref2Label, comparisonRows) {
  const headers = [
    "Task name",
    `${ref1Label} (ops/s)`,
    `${ref2Label} (ops/s)`,
    `${ref2Label} / ${ref1Label}`
  ];
  const rows = comparisonRows.map(({ name, ref1, ref2, ratio }) => [
    name,
    ref1 ? formatNumber(ref1.result.throughput.p50, 5, 2) : "—",
    ref2 ? formatNumber(ref2.result.throughput.p50, 5, 2) : "—",
    formatRatio(ratio)
  ]);
  return renderTable(format, headers, rows);
}

function renderComparisonList(ref1Label, ref2Label, comparisonRows) {
  return comparisonRows
    .map(({ name, ratio }) => `- '${name}': ${ref2Label} is ${formatRatio(ratio)} ${ref1Label}`)
    .join("\n");
}

module.exports = {
  discoverSuites,
  filterSuites,
  runSuite,
  renderSuiteResults,
  compareSuites,
  renderComparisonTable,
  renderComparisonList
};
