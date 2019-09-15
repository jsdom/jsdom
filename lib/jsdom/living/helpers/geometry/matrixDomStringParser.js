"use strict";
/**
 * Expected symbols when parsing dom string -> transform function
 */
const SYMBOL = {
  number: /\d/,
  char: /\D/,
  lparen: /\(/,
  rparen: /\)/,
  whitespace: /\s/,
  radixPoint: /\./,
  comma: /,/,
  commentOpen: /\/\*/,
  commentClose: /\*\//
};

/**
 * A very slim css-parser for extracting functions from a css dom string
 */
class CssFunctionParser {
  constructor(domString) {
    this.buffer = domString;
    this.index = 0;
  }

  is(symbol, lookahead = 0) {
    return symbol.test(this.buffer.slice(this.index, this.index + 1 + lookahead));
  }

  get currentChar() {
    return this.buffer[this.index];
  }

  get peek() {
    return this.buffer[this.index + 1];
  }

  advance() {
    this.index += 1;

    if (this.index > this.buffer.length) {
      throw new RangeError(`Advanced beyond the buffer length`);
    }

    return this.currentChar;
  }

  skipWhiteSpace() {
    while (this.is(SYMBOL.whitespace)) {
      this.advance();
    }
  }

  skipComment() {
    if (this.is(SYMBOL.commentOpen, 1)) {
      while (this.index < this.buffer.length) {
        this.advance();
        if (this.is(SYMBOL.commentClose, 1)) {
          // clear closing comments
          this.advance();
          this.advance();
          break;
        }
      }
    }
  }

  getFunction() {
    let buffer = "";

    while (!this.is(SYMBOL.lparen)) {
      buffer += this.currentChar;
      this.advance();
    }

    // discard lparen
    this.advance();

    return buffer;
  }

  getParams() {
    let buffer = "";
    const params = [];

    while (!this.is(SYMBOL.rparen)) {
      if (
        !this.is(SYMBOL.whitespace) &&
        !this.is(SYMBOL.comma)
      ) {
        buffer += this.currentChar;
      } else if (buffer.length > 0) {
        params.push(buffer);
        buffer = "";
      }

      this.advance();
    }

    // clear remaining buffer
    if (buffer.length > 0) {
      params.push(buffer);
    }

    // discard rparen
    this.advance();

    return params;
  }

  parse() {
    const functions = [];

    while (this.index < this.buffer.length - 1) {
      this.skipWhiteSpace();
      this.skipComment();

      const transformFunction = this.getFunction();
      const transformParams = this.getParams();

      functions.push([transformFunction, transformParams]);
    }

    return functions;
  }
}

function validateParameterLength(expectedLength, params, fnName = "") {
  const isValidLength = Array.isArray(expectedLength) ?
    params.length >= expectedLength[0] && params.length <= expectedLength[1] :
    params.length === expectedLength;

  if (!isValidLength) {
    throw new TypeError(`Received invalid number of parameters for function ${fnName}`);
  }
}

// https://drafts.csswg.org/css-transforms-1/#typedef-transform-function
// https://drafts.csswg.org/css-transforms-2/#three-d-transform-functions
const transformFunctionNames = [
  "matrix3d",
  "matrix",
  "translate3d",
  "translate",
  "translateX",
  "translateY",
  "translateZ",
  "scale3d",
  "scale",
  "scaleX",
  "scaleY",
  "scaleZ",
  "rotate3d",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "perspective",
  "skew",
  "skewX",
  "skewY"
];
// https://www.w3.org/TR/css-values-4/#absolute-length
const absoluteLengths = ["cm", "mm", "Q", "in", "pc", "pt", "px"];
const LENGTH_CONVERTERS = {
  cm(x) {
    return this.in(x) / 2.54;
  },
  mm(x) {
    return this.cm(x) / 10;
  },
  Q(x) {
    return this.cm(x) / 40;
  },
  in(x) {
    return x * 96;
  },
  pc(x) {
    return this.in(x) / 6;
  },
  pt(x) {
    return this.in(x) / 72;
  },
  px(x) {
    return x;
  }
};

// https://drafts.csswg.org/css-values-3/#angles
const angleUnits = ["deg", "grad", "rad", "turn"];
const ANGLE_CONVERTERS = {
  deg(x) {
    return x;
  },
  grad(x) {
    return this.turn(x) / 400;
  },
  rad(x) {
    return x * (180 / Math.PI);
  },
  turn(x) {
    return x * 360;
  }
};

const paramConverter = {
  _rules: {
    number(x) {
      return (SYMBOL.radixPoint.test(x) || !isNaN(x)) && x !== null;
    },
    angleUnit(x) {
      return angleUnits.includes(x);
    },
    absoluteLengthUnit(x) {
      return absoluteLengths.includes(x);
    }
  },
  _validate(rules, param) {
    rules.forEach(matcher => {
      if (!matcher(param)) {
        throw new TypeError(`Failed to validate a parameter, ${rules} ${param}`);
      }
    });
  },
  _getUnitParam(paramString) {
    let quantity = "";
    let unit = "";

    if (typeof paramString !== "string") {
      throw new TypeError();
    }

    for (const next of paramString) {
      if (this._rules.number(next) && unit.length === 0) {
        quantity += next;
      } else {
        unit += next;
      }
    }

    if (
      quantity.length === 0
    ) {
      throw new TypeError();
    }

    return [quantity, unit];
  },
  number(param) {
    const { number } = this._rules;
    this._validate([number], param);

    return Number(param);
  },
  lengthPercentage(param) {
    const { number, absoluteLengthUnit } = this._rules;
    const [length, unit] = this._getUnitParam(param);
    this._validate([number], length);
    this._validate([absoluteLengthUnit], unit);

    return LENGTH_CONVERTERS[unit](Number(length));
  },
  angle(param) {
    const { number, angleUnit } = this._rules;
    const [length, unit] = this._getUnitParam(param);

    this._validate([number], length);
    // All transform functions expect 0 or angle type
    if (Number(length) !== 0) {
      this._validate([angleUnit], unit);
    }

    return ANGLE_CONVERTERS[unit || "deg"](Number(length));
  }
};

// https://drafts.csswg.org/css-transforms-1/#two-d-transform-functions
// https://drafts.csswg.org/css-transforms-2/#three-d-transform-functions

// Contains the definitions for valid parameters per transform function.
// Preforms conversion of parameters to expected values.
const transformFnParameterValidation = {
  matrix3d: (...params) => {
    validateParameterLength(16, params, "matrix3d");
    return params.map(paramConverter.number.bind(paramConverter));
  },
  matrix: (...params) => {
    validateParameterLength(6, params, "matrix");
    return params.map(paramConverter.number.bind(paramConverter));
  },
  translate3d: (...params) => {
    validateParameterLength(3, params, "translate3d");
    return [
      paramConverter.lengthPercentage(params[0]),
      paramConverter.lengthPercentage(params[1]),
      paramConverter.lengthPercentage(params[2])
    ];
  },
  translate: (...params) => {
    validateParameterLength([1, 2], params, "translate");
    return [
      paramConverter.lengthPercentage(params[0]),
      paramConverter.lengthPercentage(params[1])
    ];
  },
  translateX: (...params) => {
    validateParameterLength(1, params, "translateX");
    return params.map(paramConverter.lengthPercentage.bind(paramConverter));
  },
  translateY: (...params) => {
    validateParameterLength(1, params, "translateY");
    return params.map(paramConverter.lengthPercentage.bind(paramConverter));
  },
  translateZ: (...params) => {
    validateParameterLength(1, params, "translateZ");
    return params.map(paramConverter.lengthPercentage.bind(paramConverter));
  },
  scale3d: (...params) => {
    validateParameterLength(3, params, "scale3d");
    return params.map(paramConverter.number.bind(paramConverter));
  },
  scale: (...params) => {
    validateParameterLength([1, 2], params, "scale");
    return params.map(paramConverter.number.bind(paramConverter));
  },
  scaleX: (...params) => {
    validateParameterLength(1, params, "scaleX");
    return params.map(paramConverter.number.bind(paramConverter));
  },
  scaleY: (...params) => {
    validateParameterLength(1, params, "scaleY");
    return params.map(paramConverter.number.bind(paramConverter));
  },
  scaleZ: (...params) => {
    validateParameterLength(1, params, "scaleX");
    return params.map(paramConverter.number.bind(paramConverter));
  },
  rotate3d: (...params) => {
    validateParameterLength(4, params, "rotate3d");
    return [
      ...params.slice(0, 3).map(paramConverter.number.bind(paramConverter)),
      paramConverter.angle(params[3])
    ];
  },
  rotate: (...params) => {
    validateParameterLength(1, params, "rotate");
    return params.map(paramConverter.angle.bind(paramConverter));
  },
  rotateX: (...params) => {
    validateParameterLength(1, params, "rotateX");
    return params.map(paramConverter.angle.bind(paramConverter));
  },
  rotateY: (...params) => {
    validateParameterLength(1, params, "rotateY");
    return params.map(paramConverter.angle.bind(paramConverter));
  },
  rotateZ: (...params) => {
    validateParameterLength(1, params, "rotateZ");
    return params.map(paramConverter.angle.bind(paramConverter));
  },
  perspective: (...params) => {
    validateParameterLength(1, params, "perspective");
    return params.map(paramConverter.lengthPercentage.bind(paramConverter));
  },
  skew: (...params) => {
    validateParameterLength([1, 2], params, "skew");
    return params.map(paramConverter.angle.bind(paramConverter));
  },
  skewX: (...params) => {
    validateParameterLength(1, params, "skewX");
    return params.map(paramConverter.angle.bind(paramConverter));
  },
  skewY: (...params) => {
    validateParameterLength(1, params, "skewY");
    return params.map(paramConverter.angle.bind(paramConverter));
  }
};

function validateTransformFunction([fnName, fnParams]) {
  if (!transformFunctionNames.includes(fnName)) {
    throw new TypeError(`invalid transform function ${fnName}`);
  }

  const expectedParams = transformFnParameterValidation[fnName](...fnParams);

  return [fnName, expectedParams];
}

exports.parseDOMStringToMatrixFunctions = function (domString) {
  try {
    const fnList = new CssFunctionParser(domString).parse();

    return fnList.map(validateTransformFunction);
  } catch (e) {
    throw new TypeError(`Failed to parse DOMString ${e.stack}`);
  }
};
