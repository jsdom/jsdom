"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  const bench = new Bench();

  for (const count of [16, 128, 1024]) {
    const cssText = Array.from({ length: count }, (_, i) => {
      return `.rule-${i} { color: blue; background: white; padding: ${i % 10}px; border: 1px solid black; }`;
    }).join("\n");
    let window, style, target;
    let revision = 0;
    function createNewStylesheetText() {
      revision++;
      return Array.from({ length: count }, (_, index) => {
        return (
          `.revision-${revision}-${index} { color: blue; background: white; ` +
          `padding: ${revision * count + index}px; border: 1px solid black; }`
        );
      }).join("\n");
    }
    const options = {
      beforeAll() {
        ({ window } = new JSDOM());
        style = window.document.createElement("style");
        window.document.head.append(style);
        style.textContent = cssText;
        target = window.document.createElement("div");
        window.document.body.append(target);
      },
      afterAll() {
        window.close();
      },
    };

    bench.add(
      `replace stylesheet text (${count} rules)`,
      () => {
        style.textContent = cssText;
        return style.sheet.cssRules.length;
      },
      options,
    );

    bench.add(
      `parse new stylesheet text (${count} rules)`,
      () => {
        style.textContent = createNewStylesheetText();
        return style.sheet.cssRules.length;
      },
      options,
    );

    bench.add(
      `parse new stylesheet and compute style (${count} rules)`,
      () => {
        style.textContent = createNewStylesheetText();
        target.className = `revision-${revision}-${count - 1}`;
        return window.getComputedStyle(target).paddingLeft;
      },
      options,
    );

    bench.add(
      `parse new stylesheet and serialize declarations (${count} rules)`,
      () => {
        style.textContent = createNewStylesheetText();
        let length = 0;
        for (const rule of style.sheet.cssRules) {
          length += rule.style.cssText.length;
        }
        return length;
      },
      options,
    );

    bench.add(
      `serialize rule declarations (${count} rules)`,
      () => {
        let length = 0;
        for (const rule of style.sheet.cssRules) {
          length += rule.style.cssText.length;
        }
        return length;
      },
      options,
    );
  }

  for (const count of [128, 1024]) {
    for (const [encoding, prefix, separator] of [
      ["ASCII", "", "\n"],
      ["CRLF", "", "\r\n"],
      ["non-BMP", "/* 😀 */", "\n"],
    ]) {
      let window, style, target;
      let revision = 0;
      function createNewCustomStylesheetText() {
        revision++;
        return (
          prefix +
          Array.from({ length: count }, (_, index) => {
            return `.rule-${index} { --value: value-${encoding}-${revision}-${index}; }`;
          }).join(separator)
        );
      }
      const options = {
        beforeAll() {
          ({ window } = new JSDOM());
          style = window.document.createElement("style");
          window.document.head.append(style);
          target = window.document.createElement("div");
          window.document.body.append(target);
        },
        afterAll() {
          window.close();
        },
      };

      bench.add(
        `parse ${encoding} stylesheet with custom properties (${count} rules)`,
        () => {
          style.textContent = createNewCustomStylesheetText();
          return style.sheet.cssRules.length;
        },
        options,
      );

      bench.add(
        `parse ${encoding} stylesheet and read custom properties (${count} rules)`,
        () => {
          style.textContent = createNewCustomStylesheetText();
          let length = 0;
          for (const rule of style.sheet.cssRules) {
            length += rule.style.getPropertyValue("--value").length;
          }
          return length;
        },
        options,
      );

      if (encoding === "ASCII") {
        bench.add(
          `parse unmatched stylesheet with complex custom properties (${count} rules)`,
          () => {
            revision++;
            style.textContent = Array.from({ length: count }, (_, index) => {
              return `.rule-${index} { --value: var(--missing, f([${revision} ${index}] {a b c})); }`;
            }).join("\n");
            return window.getComputedStyle(target).color;
          },
          options,
        );
      }
    }
  }

  for (const count of [128, 512, 1024]) {
    for (const kind of ["plain", "range", "nested"]) {
      let window, style;
      let revision = 0;
      const options = {
        beforeAll() {
          ({ window } = new JSDOM());
          style = window.document.createElement("style");
          window.document.head.append(style);
        },
        afterAll() {
          window.close();
        },
      };
      bench.add(
        `parse new ${kind} media stylesheet (${count} rules)`,
        () => {
          revision++;
          const rules = Array.from({ length: count }, (_, index) => {
            const query = kind === "range" ? "(0px < width < 2000px)" : "(min-width: 0px)";
            return `@media ${query} { .rule-${index} { --value: ${revision}; } }`;
          }).join("\n");
          style.textContent = kind === "nested" ? `@media all { ${rules} }` : rules;
          const parsed =
            kind === "nested" ? style.sheet.cssRules[0].cssRules : style.sheet.cssRules;
          if (parsed.length !== count) {
            throw new Error("Incorrect media rule count");
          }
          return parsed.length;
        },
        options,
      );
    }
  }

  for (const count of [128, 512, 1024]) {
    let window, style;
    let revision = 0;
    const options = {
      beforeAll() {
        ({ window } = new JSDOM());
        style = window.document.createElement("style");
        window.document.head.append(style);
      },
      afterAll() {
        window.close();
      },
    };
    bench.add(
      `parse new page selector stylesheet (${count} rules)`,
      () => {
        revision++;
        style.textContent = Array.from({ length: count }, () => {
          return `@page :nth(+n) { margin: ${revision}px; }`;
        }).join("\n");
        return style.sheet.cssRules.length;
      },
      options,
    );
  }

  {
    let window, style;
    let revision = 0;
    bench.add(
      "parse stylesheet exceeding the syntax cache budget (16384 rules)",
      () => {
        ++revision;
        style.textContent = Array.from({ length: 16384 }, (_, index) => {
          return `.rule-${index} { --value: value-${revision}-${index}; }`;
        }).join("\n");
        if (style.sheet.cssRules.length !== 16384) {
          throw new Error("Incorrect rule count");
        }
      },
      {
        beforeAll() {
          ({ window } = new JSDOM());
          style = window.document.createElement("style");
          window.document.head.append(style);
        },
        afterAll() {
          window.close();
        },
      },
    );
  }

  return bench;
};
