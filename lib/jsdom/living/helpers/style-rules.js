"use strict";
const cssom = require("cssom");
const defaultStyleSheet = require("../../browser/default-stylesheet");
const { matchesDontThrow } = require("./selectors");
const { isValidComputedType,
        propertiesWithResolvedValueImplemented } = require("./resolved-properties");

const { forEach, indexOf } = Array.prototype;

let parsedDefaultStyleSheet;

exports.forEachMatchingSheetRuleOfElement = (elementImpl, handleRule) => {
  function handleSheet(sheet) {
    forEach.call(sheet.cssRules, rule => {
      if (rule.media) {
        if (indexOf.call(rule.media, "screen") !== -1) {
          forEach.call(rule.cssRules, innerRule => {
            if (matches(innerRule, elementImpl)) {
              handleRule(innerRule);
            }
          });
        }
      } else if (matches(rule, elementImpl)) {
        handleRule(rule);
      }
    });
  }

  if (!parsedDefaultStyleSheet) {
    parsedDefaultStyleSheet = cssom.parse(defaultStyleSheet);
  }

  handleSheet(parsedDefaultStyleSheet);
  forEach.call(elementImpl._ownerDocument.styleSheets._list, handleSheet);
};

function matches(rule, element) {
  return matchesDontThrow(element, rule.selectorText);
}

// Naive implementation of https://drafts.csswg.org/css-cascade-4/#cascading
// based on the previous jsdom implementation of getComputedStyle.
// Does not implement https://drafts.csswg.org/css-cascade-4/#cascade-specificity,
// or rather specificity is only implemented by the order in which the matching
// rules appear. The last rule is the most specific while the first rule is
// the least specific.
function getCascadedPropertyValue(element, property) {
  let style = {
    value: '',
    priority: null,
  };

  exports.forEachMatchingSheetRuleOfElement(element, rule => {
    const propertyValue = rule.style.getPropertyValue(property);
    // getPropertyValue returns "" if the property is not found
    if (propertyValue !== "") {
      style.value = propertyValue;
      style.priority = rule.style.getPropertyPriority(property);
    }
  });

  const inlineValue = element.style.getPropertyValue(property);
  if (inlineValue !== "" && inlineValue !== null) {
    style.value = inlineValue;
    style.priority = null;
  }

  return style;
}

// https://www.w3.org/TR/css-cascade-4/#defaulting
// 
// Note that "revert" and "unset" keywords will behave exactly the same in the
// current implementation. The difference will need to be addressed if the
// getCascadedPropertyValue function above is made to meet the spec. 
function getDefaultValue(element, property, request=null) {
  const { initial,
          inherited } = propertiesWithResolvedValueImplemented[property];

  if (request !== 'initial' &&
      (request === 'inherit' || inherited) &&
      element.parentElement !== null) {
    const parentVal = getComputedValue(element.parentElement, property);
    return parentVal;
  }

  // root element without parent element or inherited property
  return {
    value: initial,
    priority: null,
  };
}

// https://drafts.csswg.org/css-cascade-4/#specified-value
function getSpecifiedValue(element, property) {
  const cascade = getCascadedPropertyValue(element, property);

  if (cascade.value !== "") {
    return cascade;
  }
  
  return getDefaultValue(element, property);
}

// // https://www.w3.org/TR/css-variables-1/#using-variables
// function _getIndividualVarSubstitute(element, property, variable) {
//   const matches = typeof variable !== 'string' ? [] :
//         variable.matchAll(/^var\((--[-\w]+),?\s*(.*)\)/g);

//   for (let match of matches) {
//     const [_, customProp, fallback] = [...match];

//     let substitute = exports.getResolvedValue(element, customProp);
//     if (!substitute.value && fallback) {
//       let fallbackValMatches = [...fallback.matchAll(/([^,()]+(?:\(.*?\))?)/g)];
//       const fallbackVals = fallbackValMatches.map(match => {
//         const [_, arg] = [...match];
//         if (arg === 'initial' || arg === 'inherit' ||
//             arg === 'unset' || arg === 'revert') {
//           return getDefaultValue(element, property, arg);
//         }
        
//         const fallbackVal = {
//           value: arg,
//           priority: null,
//         };
//         return getVarSubstitute(element, property, fallbackVal);
//       });

//       substitute.value = fallbackVals.map(e=>e.value).join(',');
//     }

//     // TODO: Check for animation-taintedness
//     // https://www.w3.org/TR/css-variables/#animation-tainted
//     //
//     // Left this undone since there's currently no way to check whether a
//     // property is animatable. 

//     // Sorry for the magic number here. It's needed to prevent a variation
//     // of the "billion laughs attack" mentioned in the spec. See here:
//     // https://www.w3.org/TR/css-variables-1/#long-variables
//     if (substitute.value.length > 1000) {
//       substitute.value = '';
//     }
//     return substitute.value;
//   }

//   return '';
// }

function getCssVars(propertyValue) {
  const cssVars = [];
  let buffer = '';
  let startOfCurrentVar = undefined;
  let openParens = 0;

  for (let ii = 0; ii < propertyValue.length; ii++) {
    const newChar = propertyValue[ii];
    buffer += newChar;
    if (startOfCurrentVar === undefined && buffer.includes('var(')) {
      buffer = 'var(';
      startOfCurrentVar = ii - buffer.length - 1;
      openParens = 1; 
    } else if (startOfCurrentVar !== undefined && newChar === '(') {
      openParens += 1;
    } else if (startOfCurrentVar !== undefined && newChar === ')') {
      openParens -= 1;
      if (openParens === 0) {
        cssVars.push(buffer);
        startOfCurrentVar = undefined;
        buffer = '';
      }
    }
  }

  return cssVars;
}

// function _getVarSubstitute(element, propertyName, propertyInfo) {
//   const cssVars = getCssVars(propertyInfo.value);

//   const substitute = cssVars.map(v => {
//     return _getIndividualVarSubstitute(element, propertyName, v);
//   }).join(' ');
                                
//   return {
//     value: substitute ? substitute : propertyInfo.value,
//     priority: propertyInfo.priority,
//   };
// }

function isCustomProperty(propertyName) {
  return typeof propertyName === 'string' &&
    propertyName.indexOf('--') === 0;
}

function getVarListSubstitute(element, cssVarList) {
  let substitutes = [];
  for (let cssVar of cssVarList) {
    const cssVarArgs = cssVar.matchAll(/^var\((--[-\w]+),?\s*(.*)\)/g);

    for (let cssVarArg of cssVarArgs) {
      const [_, customProp, fallback] = [...cssVarArg];
      let substitute = getVarSubstitute(element, customProp);
      if (!substitute.value) {
        const fallbackCssVars = getCssVars(fallback);
        if (fallbackCssVars.length === 0) {
          substitute.value = fallback;
          
        } else {
          substitute = getVarListSubstitute(element, fallbackCssVars);
        }
      }
      
      substitutes.push(substitute);
    }
  }

  return {
    value: substitutes.map(e => e.value).join(' '),
    priority: substitutes.some(e => e.priority !== null) ? 'important' : null,
  };
}

class CustomPropertyGraph {
  constructor(element) {
    this._element = element;
    this._nodes = [];
  }

  createNodesFrom(propertyName) {
    // Build graph
    //   propertyName is first node in graph
    //   1. for each custom property in propertyInfo (use regex 'var(--[\w]+')
    //        create node
    //        draw outgoing edge to each new node (find using getCascadedPropertyValue)
    //        for each new node
    //          if the node is a custom property that does not have outgoing edges 
    //            return to 1
    this._nodes = [];
    this._attachNodes(undefined, propertyName);
  }

  isCyclicAround(propertyName) {
    // Check for cycles
    //   start on propertyName
    //   2. Mark node as visited
    //        for each outgoing edge,
    //          if node on other end is not visited,
    //            return to 2
    //          if node on other end is (original) propertyName
    //            return true
    const node = this._getNode(propertyName);
    const isCyclic = node.find(propertyName);
    this._unvisitNodes();
    return isCyclic;
  }

  findSubstitute(propertyName) {
    // Determine variable 
    //   start on propertyName
    //   3. if node is already visited, return ""
    //      visit node
    //      retrieve custom property substitution val (with getCascadedPropertyValue)
    //      *if substitution value is not a custom property, return it
    //      get each individual variable of substitution val (with getIndividualVars)
    //      for each variable 
    //        go to node for custom property (get with ^var((--[\w-]+)
    //          go to 3
    //        if valid value wasnt found, get fallback with (var^(--[], (.*))
    //        recurse to *
    //          go to 3
    //   Reset visits
    const node = this._getNode(propertyName);
    const substitute = node.resolveFor(this._element);
    this._unvisitNodes();
    return substitute;
  }

  contains(nodeName) {
    return this._nodes.some(e => e.name === nodeName);
  }

  _createNode(nodeName) {
    this._nodes.push({
      name: nodeName,
      outgoing: [],
      visited: false,

      find: function(nodeName) {
        this.visited = true;
        for (let outgoingNode of this.outgoing) {
          if (outgoingNode.name === nodeName) {
            return true;
          }
          if (!outgoingNode.visited) {
            const wasFound = outgoingNode.find(nodeName);
            if (wasFound) {
              return wasFound;
            }
          }
        }
        return false;
      },

      resolveFor: function(element) {
        if (this.visited) {
          return {
            value: '',
            priority: null,
          };
        }
        this.visited = true;

        const substitute = getSpecifiedValue(element, this.name);
        const cssVars = getCssVars(substitute.value);
        if (cssVars.length === 0) {
          return substitute;
        }

        return getVarListSubstitute(element, cssVars);
      },
    });
  }

  _getNode(nodeName) {
    return this._nodes.find(e => e.name === nodeName);
  }

  _drawEdgeConnecting(fromNodeName, toNodeName) {
    if (!fromNodeName || !toNodeName) {
      return;
    }

    const fromNodeRef = this._getNode(fromNodeName);
    const toNodeRef = this._getNode(toNodeName);
    if (!fromNodeRef) {
      return;
    }

    if (!fromNodeRef.outgoing.some(e => e === toNodeRef)) {
      fromNodeRef.outgoing.push(toNodeRef);
    }
  }

  _attachNodes(fromNode, newNode) {
    if (!isCustomProperty(newNode)) {
      return;
    }
    
    if (!this.contains(newNode)) {
      this._createNode(newNode);
      this._drawEdgeConnecting(fromNode, newNode);
      const varSubstituteVal = getSpecifiedValue(this._element, newNode);
      const dependencies = varSubstituteVal.value.matchAll(/var\((--[-\w]+)/g);

      let outgoingEdges = [];
      if (dependencies) {
        outgoingEdges = [...dependencies].map(match => match[1]);
      }
      
      for (let nodeAtEndOfEdge of outgoingEdges) {
        this._attachNodes(newNode, nodeAtEndOfEdge);
      }
        
    } else {
      this._drawEdgeConnecting(fromNode, newNode);
    }
  }

  _unvisitNodes() {
    this._nodes.forEach(e => e.visited = false);    
  }
}

// https://www.w3.org/TR/css-variables-1/#cycles
function getVarSubstitute(element, property) {
  if (isCustomProperty(property)) {
    let graph = new CustomPropertyGraph(element);
    graph.createNodesFrom(property);

    if (graph.isCyclicAround(property)) {
      return {
        value: '',
        priority: null,
      };
    }

    return graph.findSubstitute(property);
    
  } else {
    // If propertyName is not --a:
    //   check if var() is in propertyInfo
    //   if not:
    //     return
    //   if yes:
    //     split into individual cssVar()
    //     for each cssVar():
    //       getVarSubstitute of customProp
    //       if customProp does not evaluate:
    //         getVarSubstitute of fallback
    //     join results with ' '
    const cascadedProperty = getSpecifiedValue(element, property);
    const cssVars = getCssVars(cascadedProperty.value);
    if (cssVars.length === 0) {
      return cascadedProperty;
    }
    
    return getVarListSubstitute(element, cssVars);
  }
}

// https://drafts.csswg.org/css-cascade-4/#computed-value
function getComputedValue(element, property) {
  const { computedValue } = propertiesWithResolvedValueImplemented[property];
  if (isValidComputedType(computedValue)) {
    return getVarSubstitute(element, property);
  }

  throw new TypeError(`Internal error: unrecognized computed value instruction '${computedValue}'`);
}

function replaceKeywords(element, property, computedValue) {
  let resolvedValue = computedValue.value;
  resolvedValue = resolvedValue.replace(
    /\binitial\b/,
    getDefaultValue(element, property, 'initial').value);
  resolvedValue = resolvedValue.replace(
    /\binherit\b/,
    getDefaultValue(element, property, 'inherit').value);
  resolvedValue = resolvedValue.replace(
    /\brevert\b/,
    getDefaultValue(element, property, 'revert').value);
  resolvedValue = resolvedValue.replace(
    /\bunset\b/,
    getDefaultValue(element, property, 'unset').value);

  return {
    value: resolvedValue,
    priority: computedValue.priority,
  };
}

// https://drafts.csswg.org/cssom/#resolved-value
// Only implements `visibility`
exports.getResolvedValue = (element, property) => {
  // Determined for special case properties, none of which are implemented here.
  // So we skip to "any other property: The resolved value is the computed value."
  if (propertiesWithResolvedValueImplemented[property]) {
    const computedValue = getComputedValue(element, property);
    return replaceKeywords(element, property, computedValue);
  } else {
    return getCascadedPropertyValue(element, property);
  }
};

exports.SHADOW_DOM_PSEUDO_REGEXP = /^::(?:part|slotted)\(/i;
