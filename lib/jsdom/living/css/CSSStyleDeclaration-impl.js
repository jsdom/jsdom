"use strict";

const idlUtils = require("../../../generated/idl/utils.js");
const DOMException = require("../../../generated/idl/DOMException.js");
const values = require("./values/value.js");
const parser = require("./parse/parser.js");
const serialize = require("./serialize.js");
const contexts = require("./parse/context.js");
const shorthand = require("./parse/shorthand.js");
const declarationContexts = require("./parse/declarations.js");
const resolve = require("./resolve.js");
const logicalProperties = require("./properties/logical.js");
const strings = require("./utils/string.js");
const { invalidateStyle } = require("./utils/style.js");
const ruleDefinitions = require("./rules/definitions.js");
const { hasURLDependency } = require("./utils/url.js");
const specifiedValues = new WeakMap();

// Certified records have complete validity and spelling, but their token AST is
// only needed by the cascade. Each style owner receives its own upgradeable record.
function resolveForSerialization(declaration) {
  return declaration.validated ? { ...declaration } : parser.resolveDeclaration(declaration);
}

// These records contain finalized authored syntax. CSSOM mutations replace
// records, so their value serialization can be shared without retaining owners.
function serializeSpecifiedValue(declaration) {
  let key = declaration;
  if (declaration.shorthand) {
    const { value, name } = declaration;
    const group = shorthand.getGroup(value[0]);
    if (group?.name === name && group.length === value.length &&
        value.every(longhand => shorthand.getGroup(longhand) === group)) {
      key = group;
    }
  }
  let value = specifiedValues.get(key);
  if (value === undefined) {
    value = serialize.serializeDeclarationValue(declaration);
    specifiedValues.set(key, value);
  }
  return value;
}

const styleContext = { definition: ruleDefinitions.value.rules.find(rule => rule.qualified) };

// https://drafts.csswg.org/cssom-1/#set-a-css-declaration
function setDeclaration(declaration, declarations, group, baseChanged) {
  const { important, name, pending } = declaration;
  const index = declarations.findIndex(candidate => candidate.name === name);
  if (index > -1) {
    let needsAppend = false;
    if (group) {
      const mapping = logicalProperties[group].find(candidate => !candidate.includes(name));
      needsAppend = declarations.slice(index + 1).some(candidate => mapping.includes(candidate.name));
    }
    if (!needsAppend) {
      const prevDeclaration = declarations[index];
      if (!baseChanged && !pending && important === prevDeclaration.important &&
          serializeSpecifiedValue(declaration) === serializeSpecifiedValue(prevDeclaration)) {
        return false;
      }
      declarations.splice(index, 1, declaration);
      return true;
    }
    declarations.splice(index, 1);
  }
  declarations.push(declaration);
  return true;
}

// https://drafts.csswg.org/cssom-1/#cssstyledeclaration
class CSSStyleDeclarationImpl {
  // https://drafts.csswg.org/cssom-1/#cssstyledeclaration-updating-flag
  _updating = false;
  _serialized = null;
  _propertyValues = null;

  // https://drafts.csswg.org/cssom-1/#css-declaration-block
  // https://drafts.csswg.org/cssom-1/#dom-cssmarginrule-style
  // https://drafts.csswg.org/cssom-1/#dom-csspagerule-style
  // https://drafts.csswg.org/cssom-1/#dom-cssstylerule-style
  // https://drafts.csswg.org/cssom-1/#dom-elementcssinlinestyle-style
  // https://drafts.csswg.org/cssom-1/#dom-window-getcomputedstyle
  constructor(globalObject, args, privateData) {
    const {
      computed = false,
      declarations = [],
      ownerNode = null,
      parentRule = null,
      readOnly = false,
      baseURL
    } = privateData;
    this._globalObject = globalObject;
    this._context = parentRule ? { definition: parentRule._definition } : styleContext;
    this._inlineParseContext = null;
    this._ownerNode = ownerNode;
    this._computed = computed;
    this._rawDeclarations = declarations.some(declaration => declaration.parsing) ? declarations : null;
    this._resolvedDeclarations = this._rawDeclarations ? null : declarations;
    this._readOnly = readOnly;
    this.parentRule = parentRule;
    if (!computed) {
      this._baseURL = baseURL ?? ownerNode?._styleAttributeBaseURL ?? parentRule?.parentStyleSheet?._baseURL ??
        (ownerNode?._ownerDocument ?? globalObject._document).baseURLSerialized();
      this._declarationBaseURLs = null;
    }

    // "When a CSS declaration block object is created, then [...]"
    if (ownerNode && !computed) {
      const value = ownerNode.getAttributeNS(null, "style");
      if (value) {
        this._declarations = parser.parseDeclarations(value, ownerNode);
      }
    }
  }

  get [idlUtils.supportedPropertyIndices]() {
    return this._computed ? this._getComputedPropertyNames().keys() : this._declarations.keys();
  }

  [idlUtils.supportsPropertyIndex](index) {
    return index >= 0 && index < this.length;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstyledeclaration-csstext
  get cssText() {
    if (this._computed) {
      return "";
    }
    const { shorthands } = this._context.definition.value;
    this._serialized ??= serialize.serializeDeclarationBlock(
      this._declarations,
      shorthands,
      serializeSpecifiedValue
    );
    return this._serialized;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstyledeclaration-csstext
  set cssText(value) {
    if (this._readOnly) {
      throw DOMException.create(this._globalObject, [
        "Cannot set cssText on a read-only style declaration.",
        "NoModificationAllowedError"
      ]);
    }
    this._declarations = parser.parseDeclarations(value, this.parentRule ?? this._ownerNode);
    this._baseURL = this._currentBaseURL();
    this._declarationBaseURLs = null;
    this._update();
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstyledeclaration-length
  get length() {
    return this._computed ? this._getComputedPropertyNames().length : this._declarations.length;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstyledeclaration-getpropertypriority
  getPropertyPriority(property) {
    if (this._computed) {
      return "";
    }
    const definition = declarationContexts.getDeclarationDefinition(this._context, property);
    if (!definition) {
      return "";
    }
    const { name } = definition;
    const { shorthands } = this._context.definition.value;
    if (shorthands?.has(name)) {
      if (serialize.getShorthandMetadata(shorthands).byName.get(name).longhands
        .every(longhand => this._getDeclaration(longhand)?.important)) {
        return "important";
      }
      return "";
    }
    if (this._getDeclaration(name)?.important) {
      return "important";
    }
    return "";
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstyledeclaration-getpropertyvalue
  getPropertyValue(property) {
    const definition = declarationContexts.getDeclarationDefinition(this._context, property);
    if (!definition) {
      return "";
    }
    const { name } = definition;
    const { shorthands } = this._context.definition.value;
    if (this._computed) {
      return resolve.hasResolvedStyle(this._ownerNode) ? resolve.getResolvedPropertyValue(name, this._ownerNode) : "";
    }
    const value = this._serializePropertyValue(name, shorthands);
    return value === "" && values.isOmitted(this._getDeclaration(name)?.value) ? " " : value;
  }

  _serializePropertyValue(name, shorthands) {
    this._propertyValues ??= new Map();
    if (this._propertyValues.has(name)) {
      return this._propertyValues.get(name);
    }
    const value = this._getPropertyValue(name, shorthands);
    if (value !== "" || !name.startsWith("--") || this._declarationMap.has(name)) {
      this._propertyValues.set(name, value);
    }
    return value;
  }

  _getPropertyValue(name, shorthands) {
    if (shorthands?.has(name)) {
      const value = [];
      let important = null;
      for (const longhand of serialize.getShorthandMetadata(shorthands).byName.get(name).longhands) {
        const declaration = this._getDeclaration(longhand);
        if (declaration && (declaration.important === important || important === null)) {
          important = declaration.important;
          value.push(declaration);
          continue;
        }
        return "";
      }
      return serializeSpecifiedValue({
        important,
        name,
        shorthand: true,
        value
      });
    }
    const declaration = this._getDeclaration(name);
    if (declaration) {
      return serializeSpecifiedValue(declaration);
    }
    return "";
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstyledeclaration-item
  item(index) {
    return this._computed ? this._getComputedPropertyNames()[index] ?? "" : this._declarations[index]?.name ?? "";
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstyledeclaration-removeproperty
  removeProperty(property) {
    if (this._readOnly) {
      throw DOMException.create(this._globalObject, [
        `Cannot remove property "${property}" from a read-only style declaration.`,
        "NoModificationAllowedError"
      ]);
    }
    const definition = declarationContexts.getDeclarationDefinition(this._context, property);
    if (!definition) {
      return "";
    }
    const { name } = definition;
    const { shorthands } = this._context.definition.value;
    const prevValue = this.getPropertyValue(name);
    const removed = [];
    if (shorthands?.has(name)) {
      serialize.getShorthandMetadata(shorthands).byName.get(name).longhands.forEach(longhand => {
        const index = this._declarations.findIndex(declaration => declaration.name === longhand);
        if (index > -1) {
          this._declarations.splice(index, 1);
          removed.push(longhand);
        }
      });
    } else {
      const index = this._declarations.findIndex(candidate => candidate.name === name);
      if (index > -1) {
        this._declarations.splice(index, 1);
        removed.push(name);
      }
    }
    if (removed.length) {
      for (const removedName of removed) {
        this._declarationBaseURLs?.delete(removedName);
      }
      this._update(removed);
    }
    return prevValue;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssstyledeclaration-setproperty
  setProperty(property, value, priority = "") {
    if (this._readOnly) {
      throw DOMException.create(this._globalObject, [
        `Cannot set property "${property}" on a read-only style declaration.`,
        "NoModificationAllowedError"
      ]);
    }
    if (value === "") {
      this.removeProperty(property);
      return;
    }
    if (priority !== "" && strings.toLowerCase(priority) !== "important") {
      return;
    }
    // Rule contexts read the current stylesheet namespaces. Inline declarations
    // have a fixed grammar and no namespace declarations to refresh.
    const context = this.parentRule ?? (this._inlineParseContext ??= contexts.createContext(this._ownerNode));
    const declaration = parser.parseDestructuredDeclaration(property, value, Boolean(priority), context);
    if (values.isFailure(declaration)) {
      return;
    }
    const { name } = declaration;
    const { properties, shorthands } = this._context.definition.value;
    const updated = [];
    const baseURL = this._currentBaseURL();
    if (shorthands?.has(name)) {
      for (const longhand of shorthand(declaration)) {
        if (this._setDeclaration(longhand, properties?.[longhand.name]?.group, baseURL)) {
          updated.push(longhand.name);
        }
      }
    } else if (this._setDeclaration(declaration, properties?.[name]?.group, baseURL)) {
      updated.push(name);
    }
    if (updated.length) {
      this._update(updated);
    }
  }

  _change(name, value, namespace) {
    if (this._computed || this._updating || name !== "style" || namespace !== null) {
      return;
    }
    this._declarations = value ? parser.parseDeclarations(value, this.parentRule ?? this._ownerNode) : [];
    this._baseURL = this._currentBaseURL();
    this._declarationBaseURLs = null;
    this._declarationMap = null;
    this._serialized = null;
    this._propertyValues = null;
  }

  // https://drafts.csswg.org/cssom-1/#update-style-attribute-for
  get _declarations() {
    if (this._resolvedDeclarations === null) {
      const { shorthands } = this._context.definition.value;
      const selected = this._declarationMap;
      const resolveDeclaration = selected ?
declaration => {
  if (declaration.validated) {
    const previous = selected.get(declaration.name);
    if (previous && previous.source === declaration.source &&
              previous.important === declaration.important) {
      return previous;
    }
  }
  return resolveForSerialization(declaration);
} :
resolveForSerialization;
      this._resolvedDeclarations = parser.resolveDeclarations(this._rawDeclarations, shorthands, resolveDeclaration);
      this._rawDeclarations = null;
      this._declarationMap = null;
    }
    return this._resolvedDeclarations;
  }

  set _declarations(declarations) {
    this._rawDeclarations = null;
    this._resolvedDeclarations = declarations;
    this._declarationMap = null;
  }

  get _declarationsByName() {
    const declarations = this._declarations;
    this._declarationMap ??= new Map(declarations.map(declaration => [declaration.name, declaration]));
    return this._declarationMap;
  }

  _currentBaseURL() {
    return this._ownerNode ? this._ownerNode._ownerDocument.baseURLSerialized() : this._baseURL;
  }

  _getBaseURL(name) {
    return this._declarationBaseURLs?.get(name) ?? this._baseURL;
  }

  _setDeclaration(declaration, group, baseURL) {
    const { name, pending, value } = declaration;
    // Custom properties compare their unparsed tokens; typed URLs also carry a source base.
    const baseChanged = !name.startsWith("--") && baseURL !== this._getBaseURL(name) &&
      (pending || hasURLDependency(value));
    if (!setDeclaration(declaration, this._declarations, group, baseChanged)) {
      return false;
    }
    if (baseURL === this._baseURL) {
      this._declarationBaseURLs?.delete(name);
    } else {
      this._declarationBaseURLs ??= new Map();
      this._declarationBaseURLs.set(name, baseURL);
    }
    return true;
  }

  _getDeclaration(name, parsed = false) {
    let declaration;
    if (!this._rawDeclarations) {
      declaration = this._declarationsByName.get(name);
    } else {
      this._declarationMap ??= new Map();
      if (!this._declarationMap.has(name)) {
        const { shorthands } = this._context.definition.value;
        const containing = serialize.getShorthandMetadata(shorthands).byLonghand.get(name);
        let result;
        let authored = false;
        for (const syntax of this._rawDeclarations) {
          if (syntax.name !== name && !containing?.some(group => group.name === syntax.name)) {
            continue;
          }
          authored = true;
          const selected = parsed && syntax.validated ? syntax : resolveForSerialization(syntax);
          if (!selected || (result?.important && !selected.important)) {
            continue;
          }
          result = selected.name === name ?
            selected :
            shorthand(selected).find(longhand => longhand.name === name);
        }
        // Certified raw records are valid candidates; parse only the winner.
        if (parsed && result?.validated) {
          result = parser.resolveDeclaration(result);
        }
        // Authored failures are finite; arbitrary names supplied to getters are not.
        if (authored || !name.startsWith("--")) {
          this._declarationMap.set(name, result);
        }
      }
      declaration = this._declarationMap.get(name);
    }
    if (parsed && declaration?.validated) {
      // Only a previously observed specified record needs an in-place upgrade.
      // Its owner map and ordered array retain the same object identity.
      Object.assign(declaration, parser.resolveDeclaration(declaration));
      delete declaration.parsing;
      delete declaration.validated;
    }
    return declaration;
  }

  _getParsedDeclaration(name) {
    return this._getDeclaration(name, true);
  }

  _getComputedPropertyNames() {
    return resolve.hasResolvedStyle(this._ownerNode) ? resolve.getComputedPropertyNames(this._ownerNode) : [];
  }

  _update(changedNames) {
    this._declarationMap = null;
    this._serialized = null;
    if (changedNames && this._propertyValues) {
      const { shorthands } = this._context.definition.value;
      const shorthandIndex = shorthands && serialize.getShorthandMetadata(shorthands).byLonghand;
      for (const name of changedNames) {
        this._propertyValues.delete(name);
        for (const entry of shorthandIndex?.get(name) ?? []) {
          this._propertyValues.delete(entry.name);
        }
      }
    } else {
      this._propertyValues = null;
    }
    if (this._ownerNode) {
      this._updating = true;
      this._ownerNode.setAttributeNS(null, "style", this.cssText);
      this._updating = false;
    } else {
      invalidateStyle(this._globalObject, this.parentRule?.parentStyleSheet);
    }
  }
}
exports.implementation = CSSStyleDeclarationImpl;
