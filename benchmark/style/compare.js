// compare.js
/* eslint no-console: 0 */
/**
 * jsdom Performance Regression - Pure DOM Style Operations
 * @see https://github.com/jsdom/jsdom/issues/3985
 */

"use strict";

const { execSync } = require("node:child_process");
const { JSDOM } = require("../..");

function getCurrentBranch() {
  const command = "git rev-parse --abbrev-ref @";
  return execSync(command).toString("utf8").trim();
}

function testJsdomVersion() {
  const branch = getCurrentBranch();

  // Initialize jsdom with empty HTML
  const dom = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>", {
    url: "http://localhost",
    pretendToBeVisual: true
  });
  const { document } = dom.window;

  // Test 1: innerHTML with simple elements (no styles)
  function testInnerHTMLSimple() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const start = performance.now();
    container.innerHTML = "<div>Hello</div>".repeat(20);
    const duration = performance.now() - start;

    document.body.removeChild(container);
    return duration;
  }

  // Test 2: innerHTML with inline styles
  function testInnerHTMLStyled() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const start = performance.now();
    container.innerHTML =
      '<div style="color: blue; background-color: white; padding: 10px; border: 1px solid black;">Cell</div>'.repeat(
        20
      );
    const duration = performance.now() - start;

    document.body.removeChild(container);
    return duration;
  }

  // Test 3: createElement + style property setting
  function testCreateElementWithStyles() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const start = performance.now();
    for (let i = 0; i < 20; i++) {
      const div = document.createElement("div");
      div.style.color = "blue";
      div.style.backgroundColor = "white";
      div.style.padding = "10px";
      div.style.border = "1px solid black";
      div.textContent = `Cell ${i}`;
      container.appendChild(div);
    }
    const duration = performance.now() - start;

    document.body.removeChild(container);
    return duration;
  }

  // Test 4: createElement + setAttribute('style')
  function testCreateElementWithStyleAttribute() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const start = performance.now();
    for (let i = 0; i < 20; i++) {
      const div = document.createElement("div");
      div.setAttribute(
        "style",
        "color: blue; background-color: white; padding: 10px; border: 1px solid black;"
      );
      div.textContent = `Cell ${i}`;
      container.appendChild(div);
    }
    const duration = performance.now() - start;

    document.body.removeChild(container);
    return duration;
  }

  // Test 5: createElement + style.cssText
  function testCreateElementWithCssText() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const start = performance.now();
    for (let i = 0; i < 20; i++) {
      const div = document.createElement("div");
      div.style.cssText =
        "color: blue; background-color: white; padding: 10px; border: 1px solid black;";
      div.textContent = `Cell ${i}`;
      container.appendChild(div);
    }
    const duration = performance.now() - start;

    document.body.removeChild(container);
    return duration;
  }

  // Warmup runs
  for (let i = 0; i < 5; i++) {
    testInnerHTMLSimple();
    testInnerHTMLStyled();
    testCreateElementWithStyles();
    testCreateElementWithStyleAttribute();
    testCreateElementWithCssText();
  }

  // Run tests multiple times
  const iterations = 10;
  const results = {
    innerHTMLSimple: [],
    innerHTMLStyled: [],
    createElementWithStyles: [],
    createElementWithStyleAttribute: [],
    createElementWithCssText: []
  };

  for (let i = 0; i < iterations; i++) {
    results.innerHTMLSimple.push(testInnerHTMLSimple());
    results.innerHTMLStyled.push(testInnerHTMLStyled());
    results.createElementWithStyles.push(testCreateElementWithStyles());
    results.createElementWithStyleAttribute.push(testCreateElementWithStyleAttribute());
    results.createElementWithCssText.push(testCreateElementWithCssText());
  }

  // Calculate averages
  const avg = {
    innerHTMLSimple: results.innerHTMLSimple.reduce((a, b) => a + b, 0) / iterations,
    innerHTMLStyled: results.innerHTMLStyled.reduce((a, b) => a + b, 0) / iterations,
    createElementWithStyles:
      results.createElementWithStyles.reduce((a, b) => a + b, 0) / iterations,
    createElementWithStyleAttribute:
      results.createElementWithStyleAttribute.reduce((a, b) => a + b, 0) / iterations,
    createElementWithCssText:
      results.createElementWithCssText.reduce((a, b) => a + b, 0) / iterations
  };

  return {
    branch,
    avg
  };
}

const jsdomResults = testJsdomVersion("jsdom main");

function printResults(targetResults) {
  console.log("jsdom Performance Regression - Pure DOM Style Operations");
  console.log(`jsdom ${targetResults.branch}:`);
  console.log(
    `  innerHTML (20 simple divs, no styles):     ${targetResults.avg.innerHTMLSimple.toFixed(3)}ms`
  );
  console.log(
    `  innerHTML (20 divs with inline styles):    ${targetResults.avg.innerHTMLStyled.toFixed(3)}ms`
  );
  console.log(
    `  createElement + style.property (20 divs):  ${targetResults.avg.createElementWithStyles.toFixed(3)}ms`
  );
  console.log(
    `  createElement + style.cssText (20 divs):   ${targetResults.avg.createElementWithCssText.toFixed(3)}ms`
  );
  console.log(
    `  createElement + setAttribute (20 divs):    ${targetResults.avg.createElementWithStyleAttribute.toFixed(3)}ms`
  );
}

printResults(jsdomResults);
