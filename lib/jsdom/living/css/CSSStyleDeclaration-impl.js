"use strict";

const DOMException = require("../../../generated/idl/DOMException.js");
const idlUtils = require("../../../generated/idl/utils.js");
const computedValueResolvers = require("../../../generated/css-property-computed-value-resolvers");
const propertyDefinitions = require("../../../generated/css-property-definitions");
const propertyDescriptors = require("../../../generated/css-property-descriptors");
const propertyMetadata = require("../../../generated/css-property-metadata");
const resolvedValueResolvers = require("../../../generated/css-property-resolved-value-resolvers");
const { asciiLowercase } = require("../helpers/strings");
const computedStyle = require("./helpers/computed-style");
const cssValues = require("./helpers/css-values");
const csstree = require("./helpers/patched-csstree");
const fontSizes = require("./helpers/font-sizes");
const { serializeShorthand } = require("./helpers/shorthand-serialization");
const { parseShorthand } = require("./helpers/shorthand-properties");
const { longhandsByShorthand, shorthandsByLonghand } =
  require("../../../generated/css-shorthand-relationships");
const { systemColors } = require("./helpers/system-colors");

class CSSStyleDeclarationImpl {
  // https://drafts.csswg.org/cssom/#css-declaration-blocks
  // `_priorities` and `#values` together represent the spec's "declarations".
  _computed;
  // A computed declaration is either complete or cascades properties on demand; see
  // `computed-style.js`. An on-demand declaration records the properties cascaded so far and the
  // styles that might apply to its owner element. `_cascadedProperties` is null when complete.
  _cascadedProperties = null;
  _candidateStyles = null;
  _readonly = false;
  _priorities = new Map();
  #values = new Map();
  parentRule;
  #ownerNode;
  #updating = false;
  #pendingStyleUpdate = false;
  #parsing = false;

  // Internal private fields.
  // Computed values are stable once cascaded: DOM and stylesheet changes discard the document's
  // cached declarations rather than modifying them. Clones made by `_copyDeclarationsFrom()`
  // therefore share this cache.
  #computedCache = { values: new Map(), colorOptions: null, dimension: null };
  #cachedCssText = null;
  // Derived authored shorthand values, invalidated by changes to their canonical longhands.
  // Computed declarations use their own cache and never allocate this map.
  #shorthandCache = null;

  constructor(globalObject, args, { computed, ownerNode, parentRule } = {}) {
    this._globalObject = globalObject;
    this._computed = Boolean(computed);
    this.parentRule = parentRule || null;
    this.#ownerNode = ownerNode || null;
  }

  _copyDeclarationsFrom(source) {
    for (const [property, value] of source.#values) {
      this.#values.set(property, value);
    }
    for (const [property, priority] of source._priorities) {
      this._priorities.set(property, priority);
    }
    this.#computedCache = source.#computedCache;
  }

  /**
   * Returns the textual representation of the declaration block.
   *
   * @returns {string} The serialized CSS text.
   */
  get cssText() {
    if (this._computed) {
      return "";
    }
    if (this.#cachedCssText !== null) {
      return this.#cachedCssText;
    }
    const serialized = new Set();
    const attemptedShorthands = new Set();
    const parts = [];
    const names = [...this.#values.keys()];
    const hasLogicalProperties = names.some(name => propertyDefinitions.get(name)?.logical);
    function append(property, value, priority) {
      parts.push(`${property}: ${value}${priority ? " !important" : ""};`);
    }
    for (const property of names) {
      if (serialized.has(property)) {
        continue;
      }
      const priority = this._priorities.get(property);
      for (const shorthand of shorthandsByLonghand.get(property) ?? []) {
        if (attemptedShorthands.has(shorthand)) {
          continue;
        }
        attemptedShorthands.add(shorthand);
        const longhands = longhandsByShorthand.get(shorthand);
        if (longhands.some(name => serialized.has(name))) {
          continue;
        }
        const value = this._getPropertyValue(shorthand);
        if (!value) {
          continue;
        }
        if (hasLogicalProperties) {
          // Combining physical properties across a logical declaration can change its precedence.
          const positions = longhands.map(name => names.indexOf(name));
          if (names.slice(Math.min(...positions), Math.max(...positions)).some(name => {
            const definition = propertyDefinitions.get(name);
            return !longhands.includes(name) && definition?.logicalPropertyGroup && longhands.some(longhand => {
              const otherDefinition = propertyDefinitions.get(longhand);
              return otherDefinition.logicalPropertyGroup === definition.logicalPropertyGroup &&
                otherDefinition.logical !== definition.logical;
            });
          })) {
            continue;
          }
        }
        // A serialized shorthand has the same priority on all its longhands.
        append(shorthand, value, priority);
        for (const name of longhands) {
          serialized.add(name);
        }
        break;
      }
      if (!serialized.has(property)) {
        append(property, this._getPropertyValue(property), priority);
        serialized.add(property);
      }
    }
    this.#cachedCssText = parts.join(" ");
    return this.#cachedCssText;
  }

  /**
   * Sets the textual representation of the declaration block.
   * This clears all existing properties and parses the new CSS text.
   *
   * @param {string} text - The new CSS text.
   */
  set cssText(text) {
    if (this._readonly) {
      throw DOMException.create(this._globalObject, [
        "cssText can not be modified.",
        "NoModificationAllowedError"
      ]);
    }
    const originalText = this.parentRule ? this.cssText : null;
    this.#cachedCssText = null;
    this.#values.clear();
    this._priorities.clear();
    this.#shorthandCache?.clear();
    this.#updating = true;
    text = cssValues.preprocessValue(text);
    const valueObj = csstree.parse(text, { context: "declarationList", parseValue: false });
    if (valueObj?.children) {
      let shouldSkipNext = false;
      for (const item of valueObj.children) {
        if (item.type === "Atrule") {
          continue;
        }
        if (item.type === "Rule") {
          shouldSkipNext = true;
          continue;
        }
        if (shouldSkipNext) {
          shouldSkipNext = false;
          continue;
        }
        if (item.type === "Declaration" && item.value.type === "Raw") {
          this._parseDeclaration(item.property, item.value.value, item.important ? "important" : "");
        }
      }
    }
    this.#updating = false;
    if (!this.parentRule || this.cssText !== originalText) {
      this.#notifyChange();
    }
  }

  /**
   * Returns the number of properties in the declaration block.
   *
   * @returns {number} The property count.
   */
  get length() {
    return this.#values.size;
  }

  /**
   * Returns the property names in the declaration block, in declaration order.
   *
   * @returns {Iterator<string>} The property names.
   */
  _propertyNames() {
    return this.#values.keys();
  }

  /**
   * Returns the priority of the specified property (e.g. "important").
   *
   * @param {string} property - The property name.
   * @returns {string} The priority string, or empty string if not set.
   */
  getPropertyPriority(property) {
    return this._getPropertyPriority(property.startsWith("--") ? property : asciiLowercase(property));
  }

  // Internal callers supply canonical property names.
  _getPropertyPriority(property) {
    const longhands = longhandsByShorthand.get(property);
    if (longhands) {
      return longhands.every(name => this._priorities.get(name) === "important") ? "important" : "";
    }
    return this._priorities.get(property) || "";
  }

  /**
   * Returns the value of the specified property.
   *
   * For a computed style declaration this is the resolved value
   * (https://drafts.csswg.org/cssom/#resolved-value), which is the computed value except for the
   * properties in `resolvedValueResolvers`.
   *
   * @param {string} property - The property name.
   * @returns {string} The property value, or empty string if not set.
   */
  getPropertyValue(property) {
    return this._getPropertyValue(property.startsWith("--") ? property : asciiLowercase(property));
  }

  // Internal callers supply canonical property names.
  _getPropertyValue(property) {
    if (this._computed) {
      if (longhandsByShorthand.has(property)) {
        return serializeShorthand(property, longhand => this._getPropertyValue(longhand));
      }
      const computedValue = this._getComputedPropertyValue(property);
      const getResolvedValue = resolvedValueResolvers.get(property);
      if (getResolvedValue) {
        return getResolvedValue(computedValue, {
          getComputedValue: otherProperty => this._getComputedPropertyValue(otherProperty)
        });
      }
      return computedValue;
    }
    const longhands = longhandsByShorthand.get(property);
    if (longhands) {
      const cache = this.#shorthandCache ??= new Map();
      let value = cache.get(property);
      if (value === undefined) {
        value = this.#serializeAuthoredShorthand(property, longhands);
        cache.set(property, value);
      }
      return value;
    }
    const value = this.#values.get(property);
    return typeof value === "string" ? value : "";
  }

  #serializeAuthoredShorthand(property, longhands) {
    const first = this.#values.get(longhands[0]);
    if (first === undefined) {
      return "";
    }
    const priority = this._priorities.get(longhands[0]);
    if (typeof first === "object") {
      if (first.shorthand !== property || longhands.some(name => {
        return this.#values.get(name) !== first || this._priorities.get(name) !== priority;
      })) {
        return "";
      }
      return first.value;
    }
    return serializeShorthand(property, name => {
      const value = this.#values.get(name);
      return typeof value === "string" && this._priorities.get(name) === priority ? value : "";
    }, { computed: false });
  }

  #invalidateShorthands(property) {
    if (this.#shorthandCache !== null) {
      for (const shorthand of shorthandsByLonghand.get(property) ?? []) {
        this.#shorthandCache.delete(shorthand);
      }
    }
  }

  /**
   * Returns the specified value of the specified property, even on a computed style declaration.
   *
   * The cascade copies these already-parsed values without running property setters or resolving
   * computed values. Each longhand can therefore be cascaded independently of its siblings.
   *
   * @param {string} property - The property name.
   * @returns {string} The specified value, or empty string if not set.
   */
  _getSpecifiedPropertyValue(property) {
    if (this._cascadedProperties !== null && !this._cascadedProperties.has(property)) {
      computedStyle.cascadeProperty(this.#ownerNode, this, property);
    }
    const value = this.#values.get(property);
    // TODO: Substitute variables before computing a pending shorthand's longhands. They still
    // participate in the cascade and are invalid at computed-value time, rather than absent.
    return typeof value === "object" ? "unset" : value ?? "";
  }

  /**
   * Returns the computed value (https://drafts.csswg.org/css-cascade/#computed) of the specified
   * property. Only meaningful on a computed style declaration.
   *
   * This is the value inheritance transfers, as opposed to the resolved value that
   * `getPropertyValue()` returns: a child inherits the 5px of `border-top: 5px none`, while the
   * resolved value is 0px.
   *
   * @param {string} property - The property name.
   * @returns {string} The computed value, or empty string if not set.
   */
  _getComputedPropertyValue(property) {
    const { values } = this.#computedCache;
    if (values.has(property)) {
      return values.get(property);
    }
    const value = this._getSpecifiedPropertyValue(property);
    const computedValue = this.#getComputedValue(property, value);
    if (propertyDefinitions.has(property)) {
      values.set(property, computedValue);
    }
    return computedValue;
  }

  /**
   * Returns the property name at the specified index.
   *
   * @param {number} index - The index.
   * @returns {string} The property name, or empty string if index is invalid.
   */
  item(index) {
    if (index >= this.#values.size) {
      return "";
    }
    let i = 0;
    for (const key of this.#values.keys()) {
      if (i === index) {
        return key;
      }
      i++;
    }
    return "";
  }

  /**
   * Removes the specified property from the declaration block.
   *
   * @param {string} property - The property name to remove.
   * @returns {string} The value of the removed property.
   */
  removeProperty(property) {
    if (this._readonly) {
      throw DOMException.create(this._globalObject, [
        `Property ${property} can not be modified.`,
        "NoModificationAllowedError"
      ]);
    }
    property = property.startsWith("--") ? property : asciiLowercase(property);
    const previous = this._getPropertyValue(property);
    this._updateStyle(() => {
      const longhands = longhandsByShorthand.get(property) ?? [property];
      let changed = false;
      for (const name of longhands) {
        if (this.#values.delete(name)) {
          changed = true;
          this.#invalidateShorthands(name);
        }
        this._priorities.delete(name);
      }
      if (changed) {
        this.#cachedCssText = null;
        this.#notifyChange();
      }
    });
    return previous;
  }

  /**
   * Sets a property value with an optional priority.
   *
   * @param {string} property - The property name.
   * @param {string} value - The property value.
   * @param {string} [priority=""] - The priority (e.g. "important").
   */
  setProperty(property, value, priority = "") {
    this._updateStyle(() => this._setPropertyValue(property, value, priority));
  }

  // Adds a declaration parsed from a declaration block or style rule. Unlike CSSOM mutations, parsed
  // declarations follow https://drafts.csswg.org/cssom/#concept-declarations-specified-order: an
  // earlier important declaration survives a later normal one, and invalid declarations are dropped
  // rather than removing an existing declaration. The block is not serialized after each
  // declaration as `_updateStyle()` does; callers notify once the whole block is parsed.
  _parseDeclaration(property, value, priority) {
    this.#parsing = true;
    try {
      this._setPropertyValue(property, value, priority);
    } finally {
      this.#parsing = false;
    }
  }

  _setPropertyValue(property, value, priority) {
    if (this._readonly) {
      throw DOMException.create(this._globalObject, [
        `Property ${property} can not be modified.`,
        "NoModificationAllowedError"
      ]);
    }
    value = cssValues.preprocessValue(value).trim();
    if (value === "") {
      if (!this.#parsing) {
        this.removeProperty(property);
      }
      return;
    }
    if (priority !== "" && asciiLowercase(priority) !== "important") {
      return;
    }
    priority = asciiLowercase(priority);
    // Custom property.
    if (property.startsWith("--")) {
      this._setProperty(property, value, priority);
      return;
    }
    property = asciiLowercase(property);
    if (!Object.hasOwn(propertyDescriptors, property)) {
      return;
    }
    propertyDescriptors[property].set.call(this, value, priority);
  }

  get [idlUtils.supportedPropertyIndices]() {
    return Array(this.#values.size).keys();
  }

  [idlUtils.supportsPropertyIndex](index) {
    return index >= 0 && index < this.#values.size;
  }

  _updateStyle(update) {
    if (this._readonly) {
      throw DOMException.create(this._globalObject, [
        "The declaration is read-only.",
        "NoModificationAllowedError"
      ]);
    }
    if (this.#updating || this._computed || (!this.#ownerNode && !this.parentRule)) {
      update();
      return;
    }
    const originalText = this.cssText;
    this.#updating = true;
    this.#pendingStyleUpdate = false;
    try {
      update();
    } finally {
      this.#updating = false;
      if (this.#pendingStyleUpdate && this.cssText !== originalText) {
        this.#notifyChange();
      }
    }
  }

  #notifyChange() {
    if (this.#updating) {
      this.#pendingStyleUpdate = true;
      return;
    }
    if (this._computed) {
      return;
    }
    if (this.parentRule) {
      this.parentRule._invalidateStyleCache();
      return;
    }

    // https://drafts.csswg.org/cssom/#update-style-attribute-for
    if (!this.#ownerNode || this.#ownerNode._settingCssText) {
      return;
    }
    this.#ownerNode._settingCssText = true;
    this.#ownerNode.setAttributeNS(null, "style", this.cssText);
    this.#ownerNode._settingCssText = false;
  }

  _setShorthand(property, value, priority) {
    if (value === "") {
      this.removeProperty(property);
      return;
    }
    if (cssValues.hasVarFunc(value)) {
      const pending = { shorthand: property, value };
      for (const longhand of longhandsByShorthand.get(property)) {
        this.#setDeclaration(longhand, pending, priority);
      }
      return;
    }
    const updates = parseShorthand(property, value);
    if (updates) {
      for (const [longhand, parsedValue] of updates) {
        this.#setDeclaration(longhand, parsedValue, priority);
      }
    }
  }

  _setProperty(property, value, priority = "") {
    if (typeof value !== "string") {
      return;
    }
    if (value === "") {
      this.removeProperty(property);
      return;
    }
    this.#setDeclaration(property, value, priority);
  }

  #setDeclaration(property, value, priority) {
    if (this.#parsing) {
      if (this._priorities.has(property) && priority !== "important") {
        return;
      }
      // Parsed declarations retain the winning declaration's source position, even if its value
      // is unchanged: https://drafts.csswg.org/cssom/#specified-order
      this.#values.delete(property);
    }
    // Physical and logical properties in the same group can overwrite each other. A later
    // assignment must follow any intervening declarations in that group, even at the same value.
    const group = this._computed ? undefined : propertyDefinitions.get(property)?.logicalPropertyGroup;
    if (group && this.#values.has(property)) {
      let found = false;
      for (const name of this.#values.keys()) {
        if (name === property) {
          found = true;
        } else if (found && propertyDefinitions.get(name)?.logicalPropertyGroup === group &&
                   propertyDefinitions.get(name).logical !== propertyDefinitions.get(property).logical) {
          this.#values.delete(property);
          break;
        }
      }
    }
    if (this.#values.get(property) === value && (this._priorities.get(property) ?? "") === priority) {
      return;
    }
    if (priority === "important") {
      this._priorities.set(property, priority);
    } else {
      this._priorities.delete(property);
    }
    this.#cachedCssText = null;
    this.#values.set(property, value);
    this.#invalidateShorthands(property);
    this.#notifyChange();
  }

  #getComputedValue(property, value) {
    // Invalid or unsupported property.
    if (!propertyDefinitions.has(property) && !property.startsWith("--")) {
      return "";
    }

    const { inherited, initial = "", longhands } = cssValues.getPropertyDefinition(property);
    const { caseSensitive, dimensionTypes = {}, functionTypes = {} } = this.#getPropertyMetadata(property, value);
    const isColor = Boolean(functionTypes.color || functionTypes.paint);

    if (!value || cssValues.isGlobalKeyword(value)) {
      value = computedStyle.replaceEmptyValueAndKeywords(
        property,
        value,
        this.#ownerNode,
        { inherit: inherited === "yes", initial, isColor }
      );
    }

    if (property === "color" && /currentcolor/i.test(value)) {
      value = computedStyle.getInheritedPropertyValue(
        property,
        this.#ownerNode,
        { inherit: true, initial, isColor }
      );
    }

    if (cssValues.hasVarFunc(value)) {
      // TODO: Resolve css var().
    }

    if (longhands) {
      // Expanded shorthands are serialized from their longhands by the public getter. Shorthands we
      // still store as one value use the same defaulting and inheritance as other declarations.
      if (isColor) {
        value = asciiLowercase(value);
      }
      return value;
    }

    return this.#resolveLonghand(property, value, { caseSensitive, dimensionTypes, isColor });
  }

  #getPropertyMetadata(property, value) {
    if (propertyMetadata.has(property)) {
      return propertyMetadata.get(property);
    }

    // TODO: Also check if all or part of the value is quoted.
    const caseSensitive = (cssValues.hasVarFunc(value) || value.startsWith("--")) ? true : undefined;

    return { caseSensitive };
  }

  #resolveLonghand(property, value, metadata) {
    const resolveDefault = valueToResolve => this.#resolveLonghandDefault(property, valueToResolve, metadata);
    const resolveComputedValue = computedValueResolvers.get(property);
    if (resolveComputedValue) {
      return resolveComputedValue(value, {
        getInheritedValue: (inheritedProperty, options) => {
          return computedStyle.getInheritedPropertyValue(inheritedProperty, this.#ownerNode, options);
        },
        resolveDefault
      });
    }

    return resolveDefault(value);
  }

  #resolveLonghandDefault(property, value, { caseSensitive, dimensionTypes, isColor }) {
    // Preparing color options resolves inherited styles, so only do so when needed.
    const options = { format: "computedValue" };
    if (isColor) {
      Object.assign(options, this.#prepareColorOptions());
    }

    const parsedValue = cssValues.parsePropertyValue(property, value, {
      caseSensitive,
      ...options
    });

    if (isColor) {
      const resolvedValue = cssValues.serializeColor(parsedValue, options);
      if (resolvedValue) {
        return resolvedValue;
      }
    } else if (dimensionTypes.length) {
      const isFontSize = property === "font-size";
      const { documentElement } = this.#ownerNode._ownerDocument;
      // Relative lengths on the root element fall back to the initial font size inside
      // `resolveLengthInPixels()`. Elsewhere they resolve against inherited font sizes, which are
      // only prepared when needed.
      const dimension = this.#ownerNode === documentElement ? {} : { ...this.#prepareDimension() };

      // Use the element's own font-size for em units if the property is not "font-size".
      if (!isFontSize) {
        const ownFontSize = this._getPropertyValue("font-size");
        if (ownFontSize) {
          const parsedOwnFontSize = parseFloat(ownFontSize);
          if (!Number.isNaN(parsedOwnFontSize)) {
            dimension.em = parsedOwnFontSize;
          }
        }
      }
      const resolvedValue =
        fontSizes.resolveLengthInPixels(this.#ownerNode, value, dimension, isFontSize);
      if (typeof resolvedValue === "number" && !Number.isNaN(resolvedValue)) {
        return `${Number(resolvedValue.toPrecision(6))}px`;
      }
      // A percentage prevents the math function from being fully reduced, e.g.
      // width: calc(100% - 1rem) computes to calc(100% - 16px). Only serialize the partially
      // reduced string when the math function is the whole value, because reducing it
      // lowercases the value, which would destroy case-sensitive tokens surrounding it, e.g.
      // the line names in grid-template-rows: [Foo] minmax(1rem, calc(100% - 2rem)) [Bar].
      if (
        typeof resolvedValue === "string" && resolvedValue &&
        Array.isArray(parsedValue) && parsedValue.length === 1 &&
        parsedValue[0].type === cssValues.AST_TYPES.CALC
      ) {
        return resolvedValue;
      }
    }

    // TODO: Resolve special cases other than color.

    return value;
  }

  // Returns the color scheme and current color that color values resolve against.
  #prepareColorOptions() {
    const cache = this.#computedCache;
    if (cache.colorOptions !== null) {
      return cache.colorOptions;
    }

    const colorScheme = computedStyle.replaceEmptyValueAndKeywords(
      "color-scheme",
      this._getSpecifiedPropertyValue("color-scheme"),
      this.#ownerNode,
      { inherit: true, initial: "normal" }
    );
    cache.values.set("color-scheme", colorScheme);

    let currentColor = computedStyle.replaceEmptyValueAndKeywords(
      "color",
      this._getSpecifiedPropertyValue("color"),
      this.#ownerNode,
      { inherit: true, initial: "canvastext" }
    );
    currentColor = asciiLowercase(currentColor);
    // Replace currentcolor keyword.
    if (currentColor === "currentcolor") {
      currentColor = computedStyle.getInheritedPropertyValue(
        "color",
        this.#ownerNode,
        { inherit: true, initial: "canvastext", isColor: true }
      );
    }
    // The color resolver does not support system colors.
    if (systemColors.has(currentColor)) {
      currentColor = cssValues.resolveSystemColorValue(currentColor, colorScheme);
    } else {
      currentColor = cssValues.resolveColor(currentColor, { format: "computedValue", colorScheme });
    }

    cache.colorOptions = { colorScheme, currentColor };
    return cache.colorOptions;
  }

  // Returns the lengths that relative units resolve against. Not used for the root element; see
  // `#resolveLonghandDefault()`.
  #prepareDimension() {
    const cache = this.#computedCache;
    if (cache.dimension !== null) {
      return cache.dimension;
    }

    const { documentElement } = this.#ownerNode._ownerDocument;
    const rootFontSize = computedStyle.getComputedStylePropertyValue(documentElement, "font-size");
    const rem = fontSizes.resolveFontSizeInPixels(this.#ownerNode, rootFontSize);
    const em = this.#ownerNode.parentElement ? computedStyle.getParentFontSizeInPixels(this.#ownerNode) : rem;
    cache.dimension = {
      em,
      rem,
      vh: this._globalObject.innerHeight / 100,
      vw: this._globalObject.innerWidth / 100
    };
    return cache.dimension;
  }
}

exports.implementation = CSSStyleDeclarationImpl;
