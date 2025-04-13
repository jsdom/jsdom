import domenicConfig from "@domenic/eslint-config";
import globals from "globals";
import html from "eslint-plugin-html";
import jsdomInternal from "./scripts/eslint-plugin/index.mjs";

export default [
  {
    ignores: [
      "benchmark/selectors/sizzle-speed/**",
      "lib/jsdom/browser/default-stylesheet.js",
      "lib/jsdom/level3/xpath.js",
      "lib/jsdom/living/generated/**",
      "test/api/fixtures/**",
      "test/to-port-to-wpts/jquery-fixtures/**",
      "test/to-port-to-wpts/files/**",
      "test/to-port-to-wpts/frame.js",
      "test/to-port-to-wpts/level1/**",
      "test/to-port-to-wpts/level2/**",
      "test/to-port-to-wpts/level3/**",
      "test/to-port-to-wpts/script.js",
      "test/web-platform-tests/tests/**",
      "test/web-platform-tests/to-upstream/dom/nodes/Document-createComment-createTextNode.js",
      "test/web-platform-tests/to-upstream/svg/element-svg.html",
      "test/web-platform-tests/to-upstream/svg/svgstringlist.html",
      "test/web-platform-tests/to-upstream/**/*dont-upstream*"
    ]
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node
    }
  },
  ...domenicConfig,
  {
    plugins: {
      "jsdom-internal": jsdomInternal
    },
    rules: {
      // Overrides for jsdom
      "array-element-newline": "off",
      "no-implied-eval": "off",
      "no-invalid-this": "off",
      "require-unicode-regexp": "off",
      "prefer-template": "off",
      "new-cap": ["error", { capIsNewExceptions: ["ByteString", "USVString", "DOMString"] }],

      // Custom rules
      "jsdom-internal/hook-super-invocation": [
        "error",
        { ancestor: "NodeImpl", hook: "_attach" },
        { ancestor: "NodeImpl", hook: "_detach" },
        { ancestor: "NodeImpl", hook: "_descendantAdded" },
        { ancestor: "NodeImpl", hook: "_descendantRemoved" },
        { ancestor: "NodeImpl", hook: "_childTextContentChangeSteps" },
        { ancestor: "ElementImpl", hook: "_attrModified" }
      ]
    }
  },
  {
    files: ["lib/**"],
    rules: {
      "no-restricted-properties": [
        "error",
        {
          property: "getAttribute",
          message: "Use 'getAttributeNS' with null as the namespace to access attributes within jsdom"
        },
        {
          property: "setAttribute",
          message: "Use 'setAttributeNS' with null as the namespace to access attributes within jsdom"
        },
        {
          property: "hasAttribute",
          message: "Use 'hasAttributeNS' with null as the namespace to access attributes within jsdom"
        },
        {
          property: "removeAttribute",
          message: "Use 'removeAttributeNS' with null as the namespace to access attributes within jsdom"
        },
        {
          property: "toggleAttribute",
          message: "Use 'setAttributeNS' and 'removeAttributeNS' with null as the namespace to access attributes " +
                   "within jsdom"
        }
      ]
    }
  },
  {
    files: ["test/api/**"],
    rules: {
      "no-loop-func": "off"
    }
  },
  {
    files: ["test/web-platform-tests/to-upstream/**/*.{js,mjs,html}"],
    plugins: { html },
    languageOptions: {
      sourceType: "script",
      globals: {
        ...globals.browser,

        /* eslint-disable camelcase */
        EventWatcher: "readonly",
        test: "readonly",
        async_test: "readonly",
        promise_test: "readonly",
        promise_rejects: "readonly",
        generate_tests: "readonly",
        setup: "readonly",
        done: "readonly",
        on_event: "readonly",
        step_timeout: "readonly",
        format_value: "readonly",
        assert_true: "readonly",
        assert_false: "readonly",
        assert_equals: "readonly",
        assert_not_equals: "readonly",
        assert_in_array: "readonly",
        assert_object_equals: "readonly",
        assert_array_equals: "readonly",
        assert_approx_equals: "readonly",
        assert_less_than: "readonly",
        assert_greater_than: "readonly",
        assert_between_exclusive: "readonly",
        assert_less_than_equal: "readonly",
        assert_greater_than_equal: "readonly",
        assert_between_inclusive: "readonly",
        assert_regexp_match: "readonly",
        assert_class_string: "readonly",
        assert_exists: "readonly",
        assert_own_property: "readonly",
        assert_not_exists: "readonly",
        assert_inherits: "readonly",
        assert_idl_attribute: "readonly",
        assert_readonly: "readonly",
        assert_throws_dom: "readonly",
        assert_throws_js: "readonly",
        assert_unreached: "readonly",
        assert_any: "readonly",
        fetch_tests_from_worker: "readonly",
        timeout: "readonly",
        add_start_callback: "readonly",
        add_test_state_callback: "readonly",
        add_result_callback: "readonly",
        add_completion_callback: "readonly"
        /* eslint-enable camelcase */
      }
    },
    rules: {
      "padded-blocks": "off", // we like to add spaces around the main test block
      "camelcase": "off", // setting options like allow_uncaught_exception requires this
      "no-implicit-globals": "off", // it doesn't much matter if we use top-level function declarations here
      "new-cap": [
        "error", {
        // window.external
          capIsNewExceptions: ["AddSearchProvider", "IsSearchProviderInstalled"]
        }
      ]
    }
  }
];
