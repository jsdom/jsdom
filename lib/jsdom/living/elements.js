"use strict";
const { queueAttributeMutationRecord } = require("./helpers/mutation-observers.js");

// https://dom.spec.whatwg.org/#concept-element-attributes-change
exports.changeAttribute = (element, attribute, value) => {
  const { _localName, _namespace, _value } = attribute;
  queueAttributeMutationRecord(element, _localName, _namespace, _value);

  const oldValue = attribute._value;
  attribute._value = value;

  // Run jsdom hooks; roughly correspond to spec's "An attribute is set and an attribute is changed."
  element._attrModified(attribute._qualifiedName, value, oldValue);
};

exports.appendAttribute = function (element, attribute) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-append

  const { _localName, _namespace } = attribute;
  queueAttributeMutationRecord(element, _localName, _namespace, null);

  const attributeList = element._attributeList;

  attributeList.push(attribute);
  attribute._element = element;

  // Sync name cache
  const name = attribute._qualifiedName;
  const cache = element._attributesByNameMap;
  let entry = cache.get(name);
  if (!entry) {
    entry = [];
    cache.set(name, entry);
  }
  entry.push(attribute);

  // Run jsdom hooks; roughly correspond to spec's "An attribute is set and an attribute is added."
  element._attrModified(name, attribute._value, null);
};
