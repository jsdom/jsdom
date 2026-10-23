"use strict";

exports.simplifyCalculation = simplifyCalculation;
exports.completeNumericFunction = completeNumericFunction;
const values = require("./values/value.js");
const math = require("./utils/math.js");
const calculationTypes = require("./parse/types.js");
const dimensions = require("./values/dimension.js");
// Validate a top-level numeric function and simplify its calculation once.
function completeNumericFunction(
  match,
  replacedType,
  resolutionType,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  round = false
) {
  const type = calculationTypes.getCalculationType(match, resolutionType);
  if (!calculationTypes.matchNumericType(type, replacedType, resolutionType)) {
    return null;
  }
  return {
    ...match,
    range: { max, min },
    round,
    type,
    types: [...match.types, "<calc-function>"],
    value: simplifyCalculation(match, resolutionType)
  };
}

function isResolvableCalculation(value, resolutionType) {
  if (values.isList(value)) {
    return value.every(node => isResolvableCalculation(node, resolutionType));
  }
  return (
    !values.isCalculation(value) ||
    values.isNumeric(value, {
      resolutionType,
      resolved: true
    })
  );
}

// https://drafts.csswg.org/css-values-4/#snap-as-a-line-width
function roundToDevicePixel(a, devicePixelRatio) {
  const absolute = Math.abs(a) * devicePixelRatio;
  if (absolute % 1) {
    let strategy;
    if (0 < absolute && absolute < 1) {
      strategy = a < 0 ? "down" : "up";
    } else {
      strategy = "nearest";
    }
    a = math.round(strategy, a, 1 / devicePixelRatio);
  }
  return a;
}

// https://drafts.csswg.org/css-values-4/#simplify-a-calculation-tree
function simplifyCalculation(calculation, resolutionType, devicePixelRatio) {
  // Leaf: numeric
  if (values.isNumeric(calculation)) {
    return calculation;
  }
  let { name, types: nodeTypes, value: operands } = calculation;
  // Operator: calculation operator or calculation function
  calculation = values.map(calculation, function simplify(value) {
    if (values.isCalculation(value)) {
      return simplifyCalculation(value, resolutionType, devicePixelRatio);
    }
    if (values.isList(value)) {
      return values.map(value, simplify);
    }
    return value;
  });
  operands = calculation.value;
  // Operator: calculation operator
  if (nodeTypes.includes("<calc-negate>")) {
    if (
      values.isNumeric(operands, {
        literal: true
      })
    ) {
      return values.map(operands, value => 0 - value);
    }
    return calculation;
  }
  if (nodeTypes.includes("<calc-invert>")) {
    if (operands.types.includes("<number>")) {
      return values.map(operands, value => 1 / value);
    }
    if (operands.types.includes("<calc-invert>")) {
      return operands.value;
    }
    return calculation;
  }
  if (nodeTypes.includes("<calc-sum>")) {
    calculation = calculation
      // Flatten unresolved nested sums
      .reduce((sum, operand) => {
        if (operand.types.includes("<calc-sum>")) {
          sum.push(...operand);
        } else {
          sum.push(operand);
        }
        return sum;
      }, [])
      // Resolve each sum of numerics with the same unit
      .reduce(
        (sum, operand) => {
          if (
            values.isNumeric(operand, {
              literal: true
            })
          ) {
            const index = sum.findIndex(
              term => values.isNumeric(term, {
                literal: true
              }) && term.unit === operand.unit
            );
            if (index > -1) {
              const match = sum[index];
              sum[index] = values.map(match, value => value + operand.value);
              return sum;
            }
          }
          sum.push(operand);
          return sum;
        },
        values.list([], "+", ["<calc-sum>"])
      );
    if (calculation.length === 1) {
      return calculation[0];
    }
    return calculation;
  }
  if (nodeTypes.includes("<calc-product>")) {
    let factor = 1;
    calculation = calculation
      // Flatten unresolved nested products
      .reduce((product, operand) => {
        if (operand.types.includes("<calc-product>")) {
          product.push(...operand);
        } else {
          product.push(operand);
        }
        return product;
      }, [])
      // Resolve the product (factor) of numbers
      .reduce(
        (calculations, multiplier) => {
          const { types, value } = multiplier;
          if (types.includes("<number>")) {
            factor *= value;
          } else {
            calculations.push(multiplier);
          }
          return calculations;
        },
        values.list([], "*", ["<calc-product>"])
      );
    if (calculation.length === 0) {
      return values.number(factor, ["<calc-value>"]);
    }
    // Apply factor to the first dimension, percentage, or sum of dimensions/percentages
    const index = calculation.findIndex(node => values.isNumeric(node, {
      literal: true
    }));
    if (index > -1) {
      const numeric = calculation[index];
      calculation[index] = values.map(numeric, value => value * factor);
    } else {
      const sumIndex = calculation.findIndex(
        child => child.types.includes("<calc-sum>") &&
          child.every(node => values.isNumeric(node, {
            literal: true
          }))
      );
      if (sumIndex > -1) {
        const sum = calculation[sumIndex];
        calculation[sumIndex] = values.map(sum, term => values.map(term, value => value * factor));
      } else if (factor !== 1) {
        calculation.push(values.number(factor));
      }
    }
    if (calculation.length === 1) {
      return calculation[0];
    }
    // Resolve the product of combinables
    if (calculation.every(node => values.isCombinable(node, resolutionType))) {
      const productType = calculationTypes.getCalculationType(calculation);
      const matchType =
        productType &&
        calculationTypes.types.find(mathFnType => calculationTypes.matchNumericType(productType, mathFnType));
      if (matchType) {
        const productValue = calculation.reduce((product, { types, value }) => {
          if (types.includes("<calc-invert>")) {
            return product / value.value;
          }
          return product * value;
        }, 1);
        if (matchType === "<number>") {
          return values.number(productValue, ["<calc-value>"]);
        }
        if (matchType === "<percentage>") {
          return values.percentage(productValue, ["<calc-value>"]);
        }
        return values.dimension(productValue, dimensions.getCanonicalUnitFromType(matchType), [
          matchType,
          "<calc-value>"
        ]);
      }
    }
    return calculation;
  }
  // Operator: calculation function
  if (name === "calc") {
    return operands;
  }
  if (name === "calc-mix") {
    let weightSum = 0;
    let omitted = 0;
    for (const [, weight] of operands) {
      if (values.isOmitted(weight)) {
        omitted++;
        continue;
      }
      if (
        values.isNumeric(weight, {
          literal: true
        })
      ) {
        weightSum += weight.value;
        continue;
      }
      return calculation;
    }
    const distributedWeight = omitted > 0 ? Math.max(0, 100 - weightSum) / omitted : 0;
    const multiplier = weightSum > 100 ? 100 / weightSum : 1;
    const items = new Map();
    let { length } = operands;
    operands.forEach(([term, weight]) => {
      if (values.isOmitted(weight)) {
        weight = values.percentage(distributedWeight);
      }
      if (weight.value === 0) {
        length--;
        if (!resolutionType || !calculationTypes.getCalculationType(term, resolutionType).percentHint) {
          return;
        }
        if (
          values.isNumeric(term, {
            literal: true
          }) &&
          term.types[0] === "<percentage-token>"
        ) {
          items.set("zero-weight", [weight, weight]);
          return;
        }
      }
      if (
        values.isNumeric(term, {
          literal: true
        })
      ) {
        if (items.has(term.unit)) {
          items.get(term.unit).push([term, weight]);
        } else {
          items.set(term.unit, [[term, weight]]);
        }
      } else if (items.has("non-numeric")) {
        items.get("non-numeric").push([term, weight]);
      } else {
        items.set("non-numeric", [[term, weight]]);
      }
    });
    const simplified = [];
    items.forEach((itemsOfUnit, unit) => {
      if (unit === "non-numeric") {
        simplified.push(...itemsOfUnit.map(item => values.list(item)));
      } else if (unit === "zero-weight") {
        simplified.push(values.list(itemsOfUnit));
      } else {
        const average = itemsOfUnit.reduce((sum, [v, w]) => sum + v.value * w.value, 0) / 100;
        const ratio = itemsOfUnit.length / length;
        const itemValue = values.map(itemsOfUnit[0][0], () => (average / ratio) * multiplier);
        const weight = values.percentage(100 * ratio);
        simplified.push(values.list([itemValue, weight]));
      }
    });
    switch (simplified.length) {
      case 0:
        return values.map(
          operands.find(item => values.isNumeric(item[0], {
            literal: true
          }))[0],
          () => 0
        );
      case 1:
        return simplified[0][0];
      default:
        return values.map(calculation, () => values.list(simplified, ","));
    }
  }
  if (isResolvableCalculation(operands, resolutionType) ||
      ((name === "mod" || name === "rem") && values.isNumeric(operands[0], { literal: true }) &&
        values.isNumeric(operands[2], { literal: true }) && operands[0].types.includes("<percentage>") &&
        operands[2].types.includes("<percentage>"))) {
    switch (name) {
      case "abs":
        return values.map(operands, Math.abs);
      case "acos":
      case "asin":
      case "atan":
        return values.angle(math.toDegrees(Math[name](operands.value)), "deg", ["<calc-value>"]);
      case "atan2":
        return values.angle(math.toDegrees(Math.atan2(operands[0].value, operands[2].value)), "deg", ["<calc-value>"]);
      case "clamp": {
        const [min, , center, , max] = operands;
        return values.map(center, () => math.clamp(
          min.value === "none" ? -Infinity : min.value,
          center.value,
          max.value === "none" ? Infinity : max.value
        ));
      }
      case "cos":
        return values.number(
          Math.cos(operands.unit === "deg" ? math.toRadians(operands.value) : operands.value),
          ["<calc-value>"]
        );
      case "exp":
      case "sign":
      case "sqrt":
        return values.number(Math[name](operands.value), ["<calc-value>"]);
      case "hypot":
      case "max":
      case "min":
        return values.map(operands[0], () => Math[name](...operands.map(node => node.value)));
      case "log":
        return values.map(operands[0], a => {
          const b = operands[2];
          a = Math.log(a);
          if (values.isOmitted(b)) {
            return a;
          }
          return a / Math.log(b.value);
        });
      case "mod":
        return values.map(operands[0], a => {
          const b = operands[2].value;
          if (math.isInfinite(a) || b === 0) {
            return NaN;
          }
          if (math.isInfinite(b)) {
            if (math.sign(a) !== math.sign(b)) {
              return NaN;
            }
            return a;
          }
          return a - b * Math.floor(a / b);
        });
      case "pow":
        return values.number(operands[0].value ** operands[2].value, ["<calc-value>"]);
      case "progress": {
        const [noClamp, , { value: progress }, , { value: start }, , { value: end }] = operands;
        if (start === end) {
          if (values.isOmitted(noClamp) || progress === start) {
            return values.number(0, ["<calc-value>"]);
          }
          return values.number(progress < start ? -Infinity : Infinity, ["<calc-value>"]);
        }
        let distance = (progress - start) / (end - start);
        if (values.isOmitted(noClamp)) {
          distance = math.clamp(0, distance, 1);
        }
        return values.number(distance, ["<calc-value>"]);
      }
      case "random": {
        if (calculation.base === undefined) {
          return calculation;
        }
        const [, min, max, step] = operands;
        if (math.isInfinite(min.value)) {
          return min;
        }
        if (step) {
          if (math.isInfinite(step.value)) {
            return min;
          }
          const epsilon = step.value / 1000 || Number.MIN_VALUE;
          let multiplier = Math.floor((max.value - min.value) / step.value);
          if (!math.areEqual(multiplier, max.value, epsilon) && math.areEqual(multiplier + 1, max.value, epsilon)) {
            multiplier++;
          }
          const index = math.round("down", calculation.base * (multiplier + 1), 1);
          if (!math.isInfinite(index)) {
            const value = min.value + index * step.value;
            if (index === multiplier && math.areEqual(value, max.value, epsilon)) {
              return max;
            }
            return values.map(min, () => value);
          }
        }
        return values.map(min, () => min.value + calculation.base * (max.value - min.value));
      }
      case "rem":
        return values.map(operands[0], a => {
          const b = operands[2].value;
          if (b === 0 || math.isInfinite(a)) {
            return NaN;
          }
          if (math.isInfinite(b)) {
            return a;
          }
          return a - b * Math.trunc(a / b);
        });
      case "round": {
        const [strategy, inputValue, b] = operands;
        if (strategy.value === "line-width") {
          if (devicePixelRatio === undefined) {
            return calculation;
          }
          if (values.isOmitted(b)) {
            return values.map(inputValue, a => roundToDevicePixel(a, devicePixelRatio));
          }
          const step = b.value;
          return values.map(inputValue, a => {
            let value = math.round("nearest", a, step);
            if (value === 0) {
              value = Math[a < 0 ? "min" : "max"](math.round("down", a, step), math.round("up", a, step));
            }
            return roundToDevicePixel(value, devicePixelRatio);
          });
        }
        return values.map(inputValue, a => math.round(strategy.value, a, b.value));
      }
      case "sin":
        return values.number(
          values.map(operands, a => {
            if (math.isNegativeZero(a)) {
              return a;
            }
            if (operands.unit === "deg") {
              return Math.sin(math.toRadians(a));
            }
            return Math.sin(a);
          }).value,
          ["<calc-value>"]
        );
      case "tan":
        return values.number(
          values.map(operands, a => {
            if (math.isNegativeZero(a)) {
              return a;
            }
            if (operands.types.includes("<number>")) {
              a = math.toDegrees(a);
            }
            switch (a % 360) {
              case -270:
              case 90:
                return Infinity;
              case 270:
              case -90:
                return -Infinity;
              default:
                return Math.tan(math.toRadians(a));
            }
          }).value,
          ["<calc-value>"]
        );
    }
  } else if (name === "min" || name === "max") {
    if (operands.length === 1) {
      return operands[0];
    }
    const entries = new Map();
    operands.forEach(term => {
      const unit = values.isNumeric(term, {
        resolutionType,
        resolved: true
      }) ?
        term.unit :
        "unresolved";
      const entry = entries.get(unit);
      if (entry) {
        entry.push(term);
      } else {
        entries.set(unit, [term]);
      }
    });
    operands = [];
    for (const [unit, nodes] of entries) {
      if (nodes.length > 1 && unit !== "unresolved") {
        operands.push(
          nodes.reduce((a, b) => {
            if (a.value < b.value) {
              return name === "min" ? a : b;
            }
            return name === "min" ? b : a;
          })
        );
      } else {
        operands.push(...nodes);
      }
    }
    if (operands.length === 1) {
      return operands[0];
    }
    calculation = values.map(calculation, () => values.list(operands, ","));
  }
  return calculation;
}
