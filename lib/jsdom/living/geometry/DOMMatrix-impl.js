"use strict";

const DOMMatrixReadOnlyImpl = require("./DOMMatrixReadOnly-impl").implementation;
const { matrixUtils, matrix3dArrayProperties } = require("../helpers/geometry/matrix");
const {
  validateDOMMatrixInit,
  arrayFromDOMMatrixInit
} = require("../helpers/geometry/dommatrix-init");

class DOMMatrixImpl extends DOMMatrixReadOnlyImpl {
  _setMatrixInvalidState() {
    matrix3dArrayProperties.forEach(prop => {
      this[prop] = NaN;
    });

    this.is2D = false;
  }

  static fromMatrix(other) {
    other = other instanceof DOMMatrixImpl ? other.toJSON() : other;

    const matrixInitialization = validateDOMMatrixInit(other);
    const initializationArray = arrayFromDOMMatrixInit(matrixInitialization);

    return new DOMMatrixImpl([initializationArray]);
  }

  _multiply(a, b) {
    const order = 4;
    const result = Array(order * order).fill(0);
    const _mA = Array.from(a);
    const _mB = Array.from(b);

    for (let i = 0; i < order; i += 1) {
      for (let j = 0; j < order; j += 1) {
        for (let k = 0; k < order; k += 1) {
          const matrixElementA = _mA[i * order + k];
          const matrixElementB = _mB[k * order + j];
          result[i * order + j] += matrixElementA * matrixElementB;
        }
      }
    }

    this._updatePropsFromMatrix(result);

    return this;
  }

  _getRotationMatrix(x, y, z, alpha) {
    alpha *= Math.PI / 180;

    const sc = Math.sin(alpha * 0.5) * Math.cos(alpha * 0.5);
    const sq = Math.pow(Math.sin(alpha * 0.5), 2);
    const xSq = Math.pow(x, 2);
    const ySq = Math.pow(y, 2);
    const zSq = Math.pow(z, 2);

    const m11 = 1 - 2 * (ySq + zSq) * sq;
    const m12 = 2 * ((x * y * sq) + (z * sc));
    const m13 = 2 * ((x * z * sq) - (y * sc));


    const m21 = 2 * ((x * y * sq) - (z * sc));
    const m22 = 1 - 2 * (xSq + zSq) * sq;
    const m23 = 2 * ((y * z * sq) + (x * sc));

    const m31 = 2 * ((x * z * sq) + (y * sc));
    const m32 = 2 * ((y * z * sq) - (x * sc));
    const m33 = 1 - 2 * (xSq + ySq) * sq;

    return new DOMMatrixImpl([
      [
        m11, m12, m13, 0,
        m21, m22, m23, 0,
        m31, m32, m33, 0,
        0, 0, 0, 1
      ]
    ]);
  }

  multiplySelf(other) {
    const otherMatrix = DOMMatrixImpl.fromMatrix(other);

    // post multiply
    return this._multiply(otherMatrix, this);
  }

  preMultiplySelf(other) {
    const otherMatrix = DOMMatrixImpl.fromMatrix(other);
    if (!otherMatrix.is2D) {
      this.is2D = false;
    }

    return this._multiply(this, otherMatrix);
  }

  translateSelf(tX = 0, tY = 0, tZ = 0) {
    const translationMatrix = new DOMMatrixImpl([
      [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tX, tY, tZ, 1
      ]
    ]);

    return this.multiplySelf(translationMatrix);
  }

  scaleSelf(scaleX = 1, scaleY, scaleZ = 1, originX = 0, originY = 0, originZ = 0) {
    const scalingMatrix = new DOMMatrixImpl([
      [
        scaleX, 0, 0, 0,
        0, scaleY, 0, 0,
        0, 0, scaleZ, 0,
        0, 0, 0, 1
      ]
    ]);
    this.translateSelf(originX, originY, originZ);
    if (typeof scaleY === "undefined") {
      scaleY = scaleX;
    }
    this.multiplySelf(scalingMatrix);
    this.translateSelf(-originX, -originY, -originZ);
    if (scaleZ !== 1 || originZ !== 0) {
      this.is2D = false;
    }

    return this;
  }

  scale3dSelf(scale = 1, originX = 0, originY = 0, originZ = 0) {
    const scalingMatrix = new DOMMatrixImpl([
      [
        scale, 0, 0, 0,
        0, scale, 0, 0,
        0, 0, scale, 0,
        0, 0, 0, 1
      ]
    ]);
    this.translateSelf(originX, originY, originZ);
    this.multiplySelf(scalingMatrix);
    this.translateSelf(-originX, -originY, -originZ);
    if (scale !== 1) {
      this.is2D = false;
    }

    return this;
  }

  rotateSelf(rotX = 0, rotY, rotZ) {
    if (typeof rotY === "undefined" &&
        typeof rotZ === "undefined") {
      rotZ = rotX;
      rotX = 0;
      rotY = 0;
    }

    if (typeof rotY === "undefined") {
      rotY = 0;
    }

    if (typeof rotZ === "undefined") {
      rotZ = 0;
    }

    if (rotX !== 0 || rotY !== 0) {
      this.is2D = false;
    }

    this.multiplySelf(this._getRotationMatrix(0, 0, 1, rotZ));
    this.multiplySelf(this._getRotationMatrix(0, 1, 0, rotY));

    return this.multiplySelf(this._getRotationMatrix(1, 0, 0, rotX));
  }

  rotateFromVectorSelf(x = 0, y = 0) {
    // dot product for vectors (1, 0), (x, y) will always be x
    const dp = x;
    const vec1Mag = Math.sqrt(Math.pow(1, 2) + Math.pow(0, 2));
    const vec2Mag = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const angle = x === 0 && y === 0 ?
      0 :
      Math.acos(dp / (vec1Mag * vec2Mag)) * (180 / Math.PI);

    return this.multiplySelf(this._getRotationMatrix(0, 0, 1, angle));
  }

  rotateAxisAngleSelf(x = 0, y = 0, z = 0, angle = 0) {
    // Interestingly, this vector must be normalized. AFAIK, this isn't
    // explicitly documented anywhere but it makes sense in the context of the rotation
    //  matrix algorithm.
    const { x: xNorm, y: yNorm, z: zNorm } = matrixUtils.normalizeVector(x, y, z);

    if (x !== 0 || y !== 0) {
      this.is2D = false;
    }

    return this.multiplySelf(this._getRotationMatrix(xNorm, yNorm, zNorm, angle));
  }

  skewXSelf(sX = 0) {
    sX = Math.tan(matrixUtils.toRadians(sX));
    return this.multiplySelf(new DOMMatrixImpl([
      [
        1, 0, 0, 0,
        sX, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]
    ]));
  }

  skewYSelf(sY = 0) {
    sY = Math.tan(matrixUtils.toRadians(sY));
    return this.multiplySelf(new DOMMatrixImpl([
      [
        1, sY, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]
    ]));
  }

  invertSelf() {
    const order = 4;
    // instead of mucking around with 1D matrices here,
    // it's much more intuitive to preform the elimination on 2D matrices and convert the result back
    // down to a 1D matrix.
    const left = matrixUtils.to2DMatrix(Array.from(this), order);
    const right = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];

    for (let row = 0; row < order; row += 1) {
      const pivotRow = matrixUtils.getPivotRow(left, row);
      matrixUtils.swapRows(left, pivotRow, row);
      matrixUtils.swapRows(right, pivotRow, row);
      const diagonal = left[row][row];
      if (diagonal === 0) {
        this._setMatrixInvalidState();
        return this;
      }

      for (let col = 0; col < order; col += 1) {
        left[row][col] /= diagonal;
        right[row][col] /= diagonal;
      }

      for (let k = 0; k < order; k += 1) {
        if (k === row) {
          continue;
        }

        const factor = left[k][row];
        for (let col = 0; col < order; col += 1) {
          left[k][col] -= factor * left[row][col];
          right[k][col] -= factor * right[row][col];
        }
      }
    }

    this._updatePropsFromMatrix(matrixUtils.to1DMatrix(right));

    return this;
  }

  setMatrixValue(trasformList) {
    throw new Error(`Function not implemented`);
  }
}

module.exports.implementation = DOMMatrixImpl;
