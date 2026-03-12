/**
 * This is a fork from the CSS Style Declaration part of
 * https://github.com/NV/CSSOM
 */
"use strict";

const propertyDescriptors = require("../../../generated/css-property-descriptors");
const {
  borderProperties,
  getPositionValue,
  normalizeProperties,
  prepareBorderProperties,
  prepareProperties,
  shorthandProperties
} = require("./helpers/shorthand-properties");
const {
  hasVarFunc, isGlobalKeyword, parseCSS, parsePropertyValue, prepareValue
} = require("./helpers/css-values");
const { asciiLowercase } = require("../helpers/strings");

/**
 * @see https://drafts.csswg.org/cssom/#the-cssstyledeclaration-interface
 */
class CSSStyleDeclaration {
  /**
   * Creates a new CSSStyleDeclaration instance.
   *
   * @param {object} globalObject - The global object (Window).
   * @param {Array} args - The arguments (not actually used).
   * @param {object} [opt] - Options.
   * @param {boolean} [opt.computed] - The computed flag.
   * @param {object} [opt.context] - The context object (Element, or CSSRule).
   * @param {number} [opt.fontSizeMedium] - Font size in pixels for the keyword "medium".
   * @param {Function} [opt.onChangeCallback] - Callback triggered when style changes.
   * @param {object} [opt.systemColors] - The system colors.
   */
  constructor(globalObject, args, { computed, context, fontSizeMedium, onChangeCallback, systemColors } = {}) {
    // Internals for jsdom.
    this._global = globalObject;
    this._onChange = onChangeCallback;
    this._fontSizeMedium = fontSizeMedium;
    this._systemColors = systemColors;

    // Internals for CSS declaration block.
    // @see https://drafts.csswg.org/cssom/#css-declaration-blocks
    this._computed = Boolean(computed);
    this._ownerNode = null;
    this._parentRule = null;
    this._readonly = false;
    this._updating = false;

    // Other internals.
    this._length = 0;
    this._propertyIndices = new Map();
    this._priorities = new Map();
    this._values = new Map();

    if (context) {
      if (context.nodeType === 1) {
        this._ownerNode = context;
      } else if ("parentRule" in context) {
        this._parentRule = context;
      }
    }
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
    const properties = new Map();
    for (let i = 0; i < this._length; i++) {
      const property = this[i];
      const value = this.getPropertyValue(property);
      const priority = this._priorities.get(property) ?? "";
      if (shorthandProperties.has(property)) {
        const { shorthandFor } = shorthandProperties.get(property);
        for (const [longhand] of shorthandFor) {
          if (priority || !this._priorities.get(longhand)) {
            properties.delete(longhand);
          }
        }
      }
      properties.set(property, { property, value, priority });
    }
    const normalizedProperties = normalizeProperties(properties);
    const parts = [];
    for (const { property, value, priority } of normalizedProperties.values()) {
      if (priority) {
        parts.push(`${property}: ${value} !${priority};`);
      } else {
        parts.push(`${property}: ${value};`);
      }
    }
    return parts.join(" ");
  }

  /**
   * Sets the textual representation of the declaration block.
   * This clears all existing properties and parses the new CSS text.
   *
   * @param {string} text - The new CSS text.
   */
  set cssText(text) {
    if (this._readonly) {
      const msg = "cssText can not be modified.";
      const name = "NoModificationAllowedError";
      throw new this._global.DOMException(msg, name);
    }
    this._clearIndexedProperties();
    this._values.clear();
    this._priorities.clear();
    if (this._parentRule || (this._ownerNode && this._updating)) {
      return;
    }
    try {
      this._updating = true;
      const valueObj = parseCSS(text, { context: "declarationList", parseValue: false });
      if (valueObj?.children) {
        const properties = new Map();
        let shouldSkipNext = false;
        for (const item of valueObj.children) {
          if (item.type === "Atrule") {
            continue;
          }
          if (item.type === "Rule") {
            shouldSkipNext = true;
            continue;
          }
          if (shouldSkipNext === true) {
            shouldSkipNext = false;
            continue;
          }
          const {
            important,
            property,
            value: { value }
          } = item;
          if (typeof property === "string" && typeof value === "string") {
            const priority = important ? "important" : "";
            const isCustomProperty = property.startsWith("--");
            if (isCustomProperty || hasVarFunc(value)) {
              if (properties.has(property)) {
                const { priority: itemPriority } = properties.get(property);
                if (!itemPriority) {
                  properties.set(property, { property, value, priority });
                }
              } else {
                properties.set(property, { property, value, priority });
              }
            } else {
              const parsedValue = parsePropertyValue(property, value);
              if (parsedValue) {
                if (properties.has(property)) {
                  const { priority: itemPriority } = properties.get(property);
                  if (!itemPriority) {
                    properties.set(property, { property, value, priority });
                  }
                } else {
                  properties.set(property, { property, value, priority });
                }
              } else {
                this.removeProperty(property);
              }
            }
          }
        }
        const parsedProperties = prepareProperties(properties);
        for (const [property, item] of parsedProperties) {
          const { priority, value } = item;
          this._priorities.set(property, priority);
          this.setProperty(property, value, priority);
        }
      }
    } catch {
      return;
    } finally {
      this._updating = false;
    }
    if (this._onChange) {
      this._onChange(this.cssText);
    }
  }

  /**
   * Returns the number of properties in the declaration block.
   *
   * @returns {number} The property count.
   */
  get length() {
    return this._length;
  }

  /**
   * Returns the CSSRule that is the parent of this declaration block.
   *
   * @returns {object|null} The parent CSSRule or null.
   */
  get parentRule() {
    return this._parentRule;
  }

  /**
   * Alias for the "float" property.
   *
   * @returns {string} The value of the "float" property.
   */
  get cssFloat() {
    return this.getPropertyValue("float");
  }

  /**
   * Sets the "float" property.
   *
   * @param {string} value - The new value for "float".
   */
  set cssFloat(value) {
    this._setProperty("float", value);
  }

  /**
   * Returns the priority of the specified property (e.g. "important").
   *
   * @param {string} property - The property name.
   * @returns {string} The priority string, or empty string if not set.
   */
  getPropertyPriority(property) {
    return this._priorities.get(property) || "";
  }

  /**
   * Returns the value of the specified property.
   *
   * @param {string} property - The property name.
   * @returns {string} The property value, or empty string if not set.
   */
  getPropertyValue(property) {
    if (this._values.has(property)) {
      return this._values.get(property).toString();
    }
    return "";
  }

  /**
   * Returns the property name at the specified index.
   *
   * @param {...number} args - The index (only the first argument is used).
   * @returns {string} The property name, or empty string if index is invalid.
   */
  item(...args) {
    if (!args.length) {
      const msg = "1 argument required, but only 0 present.";
      throw new this._global.TypeError(msg);
    }
    const [value] = args;
    const index = Number(value);
    if (Number.isNaN(index) || index < 0 || index >= this._length) {
      return "";
    }
    return this[index];
  }

  /**
   * Removes the specified property from the declaration block.
   *
   * @param {string} property - The property name to remove.
   * @returns {string} The value of the removed property.
   */
  removeProperty(property) {
    if (this._readonly) {
      const msg = `Property ${property} can not be modified.`;
      const name = "NoModificationAllowedError";
      throw new this._global.DOMException(msg, name);
    }
    if (!this._values.has(property)) {
      return "";
    }
    const prevValue = this._values.get(property);
    this._values.delete(property);
    this._priorities.delete(property);
    const index = this._getIndexOf(property);
    if (index >= 0) {
      this._removeIndexedProperty(index);
      if (this._onChange) {
        this._onChange(this.cssText);
      }
    }
    return prevValue;
  }

  /**
   * Sets a property value with an optional priority.
   *
   * @param {string} property - The property name.
   * @param {string} value - The property value.
   * @param {string} [priority=""] - The priority (e.g. "important").
   */
  setProperty(property, value, priority = "") {
    if (this._readonly) {
      const msg = `Property ${property} can not be modified.`;
      const name = "NoModificationAllowedError";
      throw new this._global.DOMException(msg, name);
    }
    value = prepareValue(value);
    if (value === "") {
      if (Object.hasOwn(propertyDescriptors, property)) {
        // TODO: Refactor handlers to not require `.call()`.
        propertyDescriptors[property].set.call(this, value);
      }
      this.removeProperty(property);
      return;
    }
    // Custom property.
    if (property.startsWith("--")) {
      this._setProperty(property, value, priority);
      return;
    }
    property = asciiLowercase(property);
    if (!Object.hasOwn(propertyDescriptors, property)) {
      return;
    }
    if (priority) {
      this._priorities.set(property, priority);
    } else {
      this._priorities.delete(property);
    }
    propertyDescriptors[property].set.call(this, value);
  }

  /**
   * Clears all indexed properties, properties indices and resets length to 0.
   *
   * @private
   */
  _clearIndexedProperties() {
    this._propertyIndices.clear();
    for (let i = 0; i < this._length; i++) {
      delete this[i];
    }
    this._length = 0;
  }

  /**
   * Removes an indexed property at the specified index, shifts others, and updates indices.
   *
   * @private
   * @param {number} index - The index of the property to remove.
   */
  _removeIndexedProperty(index) {
    this._propertyIndices.delete(this[index]);
    for (let i = index; i < this._length - 1; i++) {
      const property = this[i + 1];
      this[i] = property;
      this._propertyIndices.set(property, i);
    }
    delete this[this._length - 1];
    this._length--;
  }

  /**
   * Returns the index of the specified property.
   *
   * @private
   * @param {string} property - The property name to search for.
   * @returns {number} The index of the property, or -1 if not found.
   */
  _getIndexOf(property) {
    return this._propertyIndices.get(property) ?? -1;
  }

  /**
   * Sets a property and update indices.
   *
   * @private
   * @param {string} property - The property name.
   * @param {string} value - The property value.
   * @param {string} priority - The priority.
   */
  _setProperty(property, value, priority) {
    if (typeof value !== "string") {
      return;
    }
    if (value === "") {
      this.removeProperty(property);
      return;
    }
    let originalText = "";
    if (this._onChange && !this._updating) {
      originalText = this.cssText;
    }
    if (!this._values.has(property)) {
      // New property.
      this[this._length] = property;
      this._propertyIndices.set(property, this._length);
      this._length++;
    }
    if (priority === "important") {
      this._priorities.set(property, priority);
    } else {
      this._priorities.delete(property);
    }
    this._values.set(property, value);
    if (this._onChange && !this._updating && this.cssText !== originalText) {
      this._onChange(this.cssText);
    }
  }

  /**
   * Helper to handle border property expansion.
   *
   * @private
   * @param {string} property - The property name (e.g. "border").
   * @param {object|Array|string} value - The value to set.
   * @param {string} priority - The priority.
   */
  _borderSetter(property, value, priority) {
    const properties = new Map();
    if (typeof priority !== "string") {
      priority = this._priorities.get(property) ?? "";
    }
    if (property === "border") {
      properties.set(property, { propery: property, value, priority });
    } else {
      for (let i = 0; i < this._length; i++) {
        const itemProperty = this[i];
        if (borderProperties.has(itemProperty)) {
          const itemValue = this.getPropertyValue(itemProperty);
          const longhandPriority = this._priorities.get(itemProperty) ?? "";
          let itemPriority = longhandPriority;
          if (itemProperty === property) {
            itemPriority = priority;
          }
          properties.set(itemProperty, {
            property: itemProperty,
            value: itemValue,
            priority: itemPriority
          });
        }
      }
    }
    const parsedProperties = prepareBorderProperties(property, value, priority, properties);
    for (const [itemProperty, item] of parsedProperties) {
      const { priority: itemPriority, value: itemValue } = item;
      this._setProperty(itemProperty, itemValue, itemPriority);
    }
  }

  /**
   * Helper to handle flexbox shorthand expansion.
   *
   * @private
   * @param {string} property - The property name.
   * @param {string} value - The property value.
   * @param {string} priority - The priority.
   * @param {string} shorthandProperty - The shorthand property name.
   */
  _flexBoxSetter(property, value, priority, shorthandProperty) {
    if (!shorthandProperty || !shorthandProperties.has(shorthandProperty)) {
      return;
    }
    const shorthandPriority = this._priorities.get(shorthandProperty);
    this.removeProperty(shorthandProperty);
    if (typeof priority !== "string") {
      priority = this._priorities.get(property) ?? "";
    }
    this.removeProperty(property);
    if (shorthandPriority && priority) {
      this._setProperty(property, value);
    } else {
      this._setProperty(property, value, priority);
    }
    if (value && !hasVarFunc(value)) {
      const longhandValues = [];
      const shorthandItem = shorthandProperties.get(shorthandProperty);
      let hasGlobalKeyword = false;
      for (const [longhandProperty] of shorthandItem.shorthandFor) {
        if (longhandProperty === property) {
          if (isGlobalKeyword(value)) {
            hasGlobalKeyword = true;
          }
          longhandValues.push(value);
        } else {
          const longhandValue = this.getPropertyValue(longhandProperty);
          const longhandPriority = this._priorities.get(longhandProperty) ?? "";
          if (!longhandValue || longhandPriority !== priority) {
            break;
          }
          if (isGlobalKeyword(longhandValue)) {
            hasGlobalKeyword = true;
          }
          longhandValues.push(longhandValue);
        }
      }
      if (longhandValues.length === shorthandItem.shorthandFor.size) {
        if (hasGlobalKeyword) {
          const [firstValue, ...restValues] = longhandValues;
          if (restValues.every(val => val === firstValue)) {
            this._setProperty(shorthandProperty, firstValue, priority);
          }
        } else {
          const parsedValue = shorthandItem.parse(longhandValues.join(" "));
          const shorthandValue = Object.values(parsedValue).join(" ");
          this._setProperty(shorthandProperty, shorthandValue, priority);
        }
      }
    }
  }

  /**
   * Helper to handle position shorthand expansion.
   *
   * @private
   * @param {string} property - The property name.
   * @param {Array|string} value - The property value.
   * @param {string} priority - The priority.
   */
  _positionShorthandSetter(property, value, priority) {
    if (!shorthandProperties.has(property)) {
      return;
    }
    const shorthandValues = [];
    if (Array.isArray(value)) {
      shorthandValues.push(...value);
    } else if (typeof value === "string") {
      shorthandValues.push(value);
    } else {
      return;
    }
    if (typeof priority !== "string") {
      priority = this._priorities.get(property) ?? "";
    }
    const { position, shorthandFor } = shorthandProperties.get(property);
    let hasPriority = false;
    for (const [longhandProperty, longhandItem] of shorthandFor) {
      const { position: longhandPosition } = longhandItem;
      const longhandValue = getPositionValue(shorthandValues, longhandPosition);
      if (priority) {
        this._setProperty(longhandProperty, longhandValue, priority);
      } else {
        const longhandPriority = this._priorities.get(longhandProperty) ?? "";
        if (longhandPriority) {
          hasPriority = true;
        } else {
          this._setProperty(longhandProperty, longhandValue, priority);
        }
      }
    }
    if (hasPriority) {
      this.removeProperty(property);
    } else {
      const shorthandValue = getPositionValue(shorthandValues, position);
      this._setProperty(property, shorthandValue, priority);
    }
  }

  /**
   * Helper to handle position longhand updates affecting shorthands.
   *
   * @private
   * @param {string} property - The property name.
   * @param {string} value - The property value.
   * @param {string} priority - The priority.
   * @param {string} shorthandProperty - The shorthand property name.
   */
  _positionLonghandSetter(property, value, priority, shorthandProperty) {
    if (!shorthandProperty || !shorthandProperties.has(shorthandProperty)) {
      return;
    }
    const shorthandPriority = this._priorities.get(shorthandProperty);
    this.removeProperty(shorthandProperty);
    if (typeof priority !== "string") {
      priority = this._priorities.get(property) ?? "";
    }
    this.removeProperty(property);
    if (shorthandPriority && priority) {
      this._setProperty(property, value);
    } else {
      this._setProperty(property, value, priority);
    }
    if (value && !hasVarFunc(value)) {
      const longhandValues = [];
      const { shorthandFor, position: shorthandPosition } = shorthandProperties.get(shorthandProperty);
      for (const [longhandProperty] of shorthandFor) {
        const longhandValue = this.getPropertyValue(longhandProperty);
        const longhandPriority = this._priorities.get(longhandProperty) ?? "";
        if (!longhandValue || longhandPriority !== priority) {
          return;
        }
        longhandValues.push(longhandValue);
      }
      if (longhandValues.length === shorthandFor.size) {
        const replacedValue = getPositionValue(longhandValues, shorthandPosition);
        this._setProperty(shorthandProperty, replacedValue);
      }
    }
  }
}

// TODO: Remove once the CSSStyleDeclaration is fully spec-compliant.
// @see https://github.com/jsdom/cssstyle/issues/255#issuecomment-3630183207
Object.defineProperties(CSSStyleDeclaration.prototype, propertyDescriptors);

module.exports = {
  CSSStyleDeclaration
};
