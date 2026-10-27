import { RuleTester } from "eslint";
import mochaSugarFree from "mocha-sugar-free";
import { resolve } from "node:path";
import rule from "../rules/hook-super-invocation.mjs";

RuleTester.describe = mochaSugarFree.describe;
RuleTester.it = mochaSugarFree.specify;

const filename = resolve(import.meta.dirname, "../../../lib/jsdom/living/nodes/HookTest-impl.js");
const options = [{ ancestor: "ElementImpl", hook: "_adoptingSteps" }];
const errors = [{ message: 'Missing invocation to the "_adoptingSteps" jsdom hook super.' }];
const tester = new RuleTester({ languageOptions: { sourceType: "commonjs" } });

tester.run("hook-super-invocation", rule, {
  valid: [
    {
      code: "class ElementImpl { _adoptingSteps() {} }",
      options
    },
    {
      code: "class Unrelated { _adoptingSteps() {} }",
      options
    },
    {
      code: "class NodeImpl {} class ShadowRootImpl extends NodeImpl { _adoptingSteps() {} }",
      options
    },
    {
      code: "class First extends Second {} class Second extends First { _adoptingSteps() {} }",
      options
    },
    {
      code: `
        const first = second;
        const second = first;
        class Child extends first.implementation { _adoptingSteps() {} }
      `,
      options
    },
    {
      code: "class Child extends require().implementation { _adoptingSteps() {} }",
      options
    },
    {
      code: "class Child extends require(1).implementation { _adoptingSteps() {} }",
      options
    },
    {
      filename,
      code: `
        const DocumentFragment = require("./DocumentFragment-impl").implementation;
        class ShadowRootImpl extends DocumentFragment { _adoptingSteps() {} }
      `,
      options
    },
    {
      filename,
      code: `
        const fragment = require("./DocumentFragment-impl");
        class ShadowRootImpl extends fragment.implementation { _adoptingSteps() {} }
      `,
      options
    },
    ...["super._adoptingSteps();", "super._adoptingSteps.call(this);", "super._adoptingSteps.apply(this, []);"]
      .map(invocation => ({
        filename,
        code: `
          const Parent = require("./HTMLElement-impl").implementation;
          class Child extends Parent { _adoptingSteps() { ${invocation} } }
        `,
        options
      }))
  ],
  invalid: [
    {
      code: "class ElementImpl {} class Child extends ElementImpl { _adoptingSteps() {} }",
      options,
      errors
    },
    {
      code: `
        class ElementImpl {}
        class Parent extends ElementImpl {}
        class Child extends Parent { _adoptingSteps() {} }
      `,
      options,
      errors
    },
    {
      filename,
      code: `
        const Parent = require("./Element-impl").implementation;
        class Child extends Parent { _adoptingSteps() {} }
      `,
      options,
      errors
    },
    {
      filename,
      code: `
        const Parent = require("./HTMLElement-impl").implementation;
        class Child extends Parent { _adoptingSteps() {} }
      `,
      options,
      errors
    },
    {
      filename,
      code: `
        const Parent = require("./HTMLElement-impl").implementation;
        const Alias = Parent;
        class Child extends Alias { _adoptingSteps() {} }
      `,
      options,
      errors
    },
    {
      filename,
      code: 'class Child extends require("./HTMLElement-impl").implementation { _adoptingSteps() {} }',
      options,
      errors
    },
    {
      filename,
      code: `
        const parent = require("./HTMLElement-impl");
        const Child = class extends parent.implementation { _adoptingSteps() {} };
      `,
      options,
      errors
    },
    {
      filename,
      code: `
        const DocumentFragment = require("./DocumentFragment-impl").implementation;
        class ShadowRootImpl extends DocumentFragment { _childrenChangedSteps() {} }
      `,
      options: [{ ancestor: "NodeImpl", hook: "_childrenChangedSteps" }],
      errors: [{ message: 'Missing invocation to the "_childrenChangedSteps" jsdom hook super.' }]
    }
  ]
});
