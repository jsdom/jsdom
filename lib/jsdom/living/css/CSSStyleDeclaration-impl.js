"use strict";

const DOMException = require("../../../generated/idl/DOMException.js");
const idlUtils = require("../../../generated/idl/utils.js");
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
  hasVarFunc, isGlobalKeyword, parsePropertyValue
} = require("./helpers/css-values");
const csstree = require("./helpers/patched-csstree");
const { asciiLowercase } = require("../helpers/strings");

class CSSStyleDeclarationImpl {
  // https://drafts.csswg.org/cssom/#css-declaration-blocks
  // `_priorities` and `#values` together represent the spec's "declarations".
  #computed;
  _readonly = false;
  _priorities = new Map();
  #values = new Map();
  parentRule;
  #ownerNode;
  #updating = false;

  constructor(globalObject, args, { computed, ownerNode, parentRule } = {}) {
    this._globalObject = globalObject;

    this.#computed = Boolean(computed);
    this.parentRule = parentRule || null;
    this.#ownerNode = ownerNode || null;
  }

  /**
   * Returns the textual representation of the declaration block.
   *
   * @returns {string} The serialized CSS text.
   */
  get cssText() {
    if (this.#computed) {
      return "";
    }
    const properties = new Map();
    for (const property of this.#values.keys()) {
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
      throw DOMException.create(this._globalObject, [
        "cssText can not be modified.",
        "NoModificationAllowedError"
      ]);
    }
    this.#values.clear();
    this._priorities.clear();
    try {
      this.#updating = true;
      const valueObj = csstree.parse(text, { context: "declarationList", parseValue: false });
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
      this.#updating = false;
    }
    this.#updateStyleAttribute();
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
    if (this.#values.has(property)) {
      return this.#values.get(property).toString();
    }
    return "";
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
    if (!this.#values.has(property)) {
      return "";
    }
    const prevValue = this.#values.get(property);
    this.#values.delete(property);
    this._priorities.delete(property);
    this.#updateStyleAttribute();
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
      throw DOMException.create(this._globalObject, [
        `Property ${property} can not be modified.`,
        "NoModificationAllowedError"
      ]);
    }
    value = value.trim();
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

  get [idlUtils.supportedPropertyIndices]() {
    return Array(this.#values.size).keys();
  }

  [idlUtils.supportsPropertyIndex](index) {
    return index >= 0 && index < this.#values.size;
  }

  // https://drafts.csswg.org/cssom/#update-style-attribute-for
  #updateStyleAttribute() {
    if (this.#computed || !this.#ownerNode || this.#ownerNode._settingCssText) {
      return;
    }
    this.#ownerNode._settingCssText = true;
    this.#ownerNode.setAttributeNS(null, "style", this.cssText);
    this.#ownerNode._settingCssText = false;
  }

  _setProperty(property, value, priority) {
    if (typeof value !== "string") {
      return;
    }
    if (value === "") {
      this.removeProperty(property);
      return;
    }

    let originalText = "";
    if (this.#ownerNode && !this.#updating) {
      originalText = this.cssText;
    }

    if (priority === "important") {
      this._priorities.set(property, priority);
    } else {
      this._priorities.delete(property);
    }

    this.#values.set(property, value);

    if (this.#ownerNode && !this.#updating && this.cssText !== originalText) {
      this.#updateStyleAttribute();
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
      for (const itemProperty of this.#values.keys()) {
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

exports.implementation = CSSStyleDeclarationImpl;
