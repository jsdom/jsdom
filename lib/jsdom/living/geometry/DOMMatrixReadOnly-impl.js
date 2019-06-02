/* eslint-disable no-use-before-define */
"use strict";
const DOMException = require("domexception");
const {
  matrix3dArrayProperties,
  matrix2dArrayProperties
} = require("../helpers/geometry/matrix");
const {
  validateDOMMatrixInit,
  arrayFromDOMMatrixInit
} = require("../helpers/geometry/dommatrix-init");

class DOMMatrixReadOnlyImpl {
  constructor(constructorArgs) {
    let [matrixInit] = constructorArgs;

    if (typeof matrixInit === "undefined") {
      matrixInit = [1, 0, 0, 1, 0, 0];
    }

    if (typeof matrixInit === "string") {
      matrixInit = this.parseDomString(matrixInit);
      throw new Error(`Matrix as DOMString not implemented.`);
    }

    /**
     * Note: An underscore indicates that the property is defined by a property accessor.
     * These properties produce side effects upon getting or setting.
     * To prevent a ton of property accessors, only those that produce side effects are defined as property accessors.
     */
    this.m11 = 0;
    this.m12 = 0;
    this._m13 = 0;
    this._m14 = 0;
    this.m21 = 0;
    this.m22 = 0;
    this._m23 = 0;
    this._m24 = 0;
    this._m31 = 0;
    this._m32 = 0;
    this._m33 = 0;
    this._m34 = 0;
    this.m41 = 0;
    this.m42 = 0;
    this._m43 = 0;
    this._m44 = 0;
    this._is2D = false;


    if (matrixInit.length === 6) {
      this._initialize2dMatrix(matrixInit);
    } else if (matrixInit.length === 16) {
      this._initialize3dMatrix(matrixInit);
    } else {
      throw new TypeError(`Invalid length for constructor init, expected 6 or 16, but received ${matrixInit.length}`);
    }
  }

  parseDomString(domstring) {
    // Not implemented
  }

  _initialize2dMatrix(init) {
    matrix2dArrayProperties.forEach((prop, idx) => {
      this[prop] = init[idx];
    });

    this.m33 = 1;
    this.m44 = 1;
    this._is2D = true;
  }

  _initialize3dMatrix(init) {
    matrix3dArrayProperties.forEach((prop, idx) => {
      this[prop] = init[idx];
    });
  }

  _getCurrentMatrix() {
    if (this.is2D) {
      return matrix2dArrayProperties.map(prop => this[prop]);
    }

    return matrix3dArrayProperties.map(prop => this[prop]);
  }

  _updatePropsFromMatrix(matrix) {
    matrix3dArrayProperties.forEach((prop, idx) => {
      this[prop] = matrix[idx];
    });
  }

  * [Symbol.iterator]() {
    for (const i of matrix3dArrayProperties.map(prop => this[prop])) {
      yield i;
    }
  }

  get a() {
    return this.m11;
  }

  set a(value) {
    this.m11 = value;
  }

  get b() {
    return this.m12;
  }

  set b(value) {
    this.m12 = value;
  }

  get c() {
    return this.m21;
  }

  set c(value) {
    this.m21 = value;
  }

  get d() {
    return this.m22;
  }

  set d(value) {
    this.m22 = value;
  }

  get e() {
    return this.m41;
  }

  set e(value) {
    this.m41 = value;
  }

  get f() {
    return this.m42;
  }

  set f(value) {
    this.m42 = value;
  }

  get m13() {
    return this._m13;
  }

  set m13(value) {
    if (value !== 0) {
      this.is2D = false;
    }
    this._m13 = value;
  }

  get m14() {
    return this._m14;
  }

  set m14(value) {
    if (value !== 0) {
      this.is2D = false;
    }
    this._m14 = value;
  }

  get m23() {
    return this._m23;
  }

  set m23(value) {
    if (value !== 0) {
      this.is2D = false;
    }
    this._m23 = value;
  }

  get m24() {
    return this._m24;
  }

  set m24(value) {
    if (value !== 0) {
      this.is2D = false;
    }
    this._m24 = value;
  }

  get m31() {
    return this._m31;
  }

  set m31(value) {
    if (value !== 0) {
      this.is2D = false;
    }
    this._m31 = value;
  }

  get m32() {
    return this._m32;
  }

  set m32(value) {
    if (value !== 0) {
      this.is2D = false;
    }
    this._m32 = value;
  }

  get m33() {
    return this._m33;
  }

  set m33(value) {
    if (value !== 1) {
      this.is2D = false;
    }
    this._m33 = value;
  }


  get m34() {
    return this._m34;
  }

  set m34(value) {
    if (value !== 0) {
      this.is2D = false;
    }
    this._m34 = value;
  }

  get m43() {
    return this._m43;
  }

  set m43(value) {
    if (value !== 0) {
      this.is2D = false;
    }
    this._m43 = value;
  }

  get m44() {
    return this._m44;
  }

  set m44(value) {
    if (value !== 1) {
      this.is2D = false;
    }
    this._m44 = value;
  }

  get is2D() {
    return this._is2D;
  }

  set is2D(value) {
    if (value === true && !this._is2D) {
      // see note https://www.w3.org/TR/geometry-1/#matrix-is-2d
      return;
    }
    this._is2D = Boolean(value);
  }

  get isIdentity() {
    const hasRequiredZeroProps = [
      "m12", "m13", "m14", "m21", "m23", "m24",
      "m31", "m32", "m34", "m41", "m42", "m43"
    ].every(prop => this[prop] === 0);

    const hasRequiredIdentityProps = ["m11", "m22", "m33", "m44"].every(prop => this[prop] === 1);

    return hasRequiredZeroProps && hasRequiredIdentityProps;
  }

  static fromMatrix(other) {
    const matrixInitialization = validateDOMMatrixInit(other);
    const initializationArray = arrayFromDOMMatrixInit(matrixInitialization);

    return new DOMMatrixReadOnlyImpl([initializationArray]);
  }

  static fromFloat32Array(array32) {
    return new DOMMatrixReadOnlyImpl([Array.from(array32)]);
  }

  static fromFloat64Array(array64) {
    return new DOMMatrixReadOnlyImpl([Array.from(array64)]);
  }

  translate(tX = 0, tY = 0, tZ = 0) {
    const m = DOMMatrix.createImpl([this._getCurrentMatrix()]);

    m.translateSelf(tX, tY, tZ);

    return m;
  }

  scale(scaleX = 1, scaleY, scaleZ = 1, originX = 0, originY = 0, originZ = 0) {
    if (typeof scaleY === "undefined") {
      scaleY = scaleX;
    }

    const m = DOMMatrix.createImpl([this._getCurrentMatrix()]);

    m.scaleSelf(scaleX, scaleY, scaleZ, originX, originY, originZ);

    return m;
  }

  scaleNonUniform(scaleX = 1, scaleY = 1) {
    // Deprecated: https://www.w3.org/TR/geometry-1/#dom-dommatrixreadonly-scalenonuniform

    const m = DOMMatrix.createImpl([this._getCurrentMatrix()]);

    m.scaleSelf(scaleX, scaleY);

    return m;
  }

  scale3d(scale = 1, originX = 0, originY = 0, originZ = 0) {
    const m = DOMMatrix.createImpl([this._getCurrentMatrix()]);

    m.scale3dSelf(scale, originX, originY, originZ);

    return m;
  }

  rotate(rotX = 0, rotY, rotZ) {
    const m = DOMMatrix.createImpl([this._getCurrentMatrix()]);

    m.rotateSelf(rotX, rotY, rotZ);

    return m;
  }

  rotateFromVector(x = 0, y = 0) {
    const m = DOMMatrix.createImpl([this._getCurrentMatrix()]);

    m.rotateFromVectorSelf(x, y);

    return m;
  }

  rotateAxisAngle(x = 0, y = 0, z = 0, angle = 0) {
    const m = DOMMatrix.createImpl([this._getCurrentMatrix()]);

    m.rotateAxisAngleSelf(x, y, z, angle);

    return m;
  }

  skewX(sX = 0) {
    const m = DOMMatrix.createImpl([this._getCurrentMatrix()]);

    m.skewXSelf(sX);

    return m;
  }

  skewY(sY = 0) {
    const m = DOMMatrix.createImpl([this._getCurrentMatrix()]);

    m.skewYSelf(sY);

    return m;
  }

  multiply(other) {
    const m = DOMMatrix.createImpl([this._getCurrentMatrix()]);

    m.multiplySelf(other);

    return m;
  }

  flipX() {
    const m = DOMMatrix.create([this._getCurrentMatrix()]);

    m.multiplySelf(DOMMatrix.create([[-1, 0, 0, 1, 0, 0]]).toJSON());

    return m;
  }

  flipY() {
    const m = DOMMatrix.createImpl([this._getCurrentMatrix()]);

    m.multiplySelf(DOMMatrix.createImpl([[1, 0, 0, -1, 0, 0]]).toJSON());

    return m;
  }

  inverse() {
    const m = DOMMatrix.createImpl([this._getCurrentMatrix()]);

    m.invertSelf();

    return m;
  }

  // transformPoint(point) {
  //   throw new Error(`Transform Point is not implemented`);
  // }

  toFloat32Array() {
    return new Float32Array(this._getCurrentMatrix());
  }

  toFloat64Array() {
    return new Float64Array(this._getCurrentMatrix());
  }

  toJSON() {
    return [
      "a", "b", "c", "d", "e", "f",
      "m11", "m12", "m13", "m14",
      "m21", "m22", "m23", "m24",
      "m31", "m32", "m33", "m34",
      "m41", "m42", "m43", "m44",
      "is2D", "isIdentity"
    ].reduce((domMatrixInit, prop) => {
      domMatrixInit[prop] = this[prop];
      return domMatrixInit;
    }, {});
  }

  toString() {
    const matrix = this._getCurrentMatrix();

    if (matrix.some(x =>
      isNaN(x) ||
      x === Infinity ||
      x === -Infinity)) {
      throw new DOMException("Matrix contains non-finite values.", "InvalidStateError");
    }

    if (this.is2D) {
      return `matrix(${matrix.join(", ")})`;
    }

    return `matrix3d(${matrix.join(", ")})`;
  }
}

module.exports.implementation = DOMMatrixReadOnlyImpl;
const DOMMatrix = require("../generated/DOMMatrix");
