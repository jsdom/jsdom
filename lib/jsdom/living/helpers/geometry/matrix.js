"use strict";

exports.matrix3dArrayProperties = [
  "m11", "m12", "m13", "m14",
  "m21", "m22", "m23", "m24",
  "m31", "m32", "m33", "m34",
  "m41", "m42", "m43", "m44"
];

exports.matrix2dArrayProperties =
  ["m11", "m12", "m21", "m22", "m41", "m42"];

exports.matrixUtils = {
  to2DMatrix(m, order) {
    const m2d = [];
    for (let row = 0; row < order; row += 1) {
      m2d[row] = [];
      for (let col = 0; col < order; col += 1) {
        const idx = col + order * row;
        m2d[row][col] = m[idx];
      }
    }

    return m2d;
  },
  to1DMatrix(m2d) {
    return m2d.reduce((m2, row) => m2.concat(row), []);
  },
  getPivotRow(matrix, column) {
    let max = 0;
    let pivot = column;

    for (let row = column; row < matrix.length; row += 1) {
      const element = Math.abs(matrix[row][column]);
      if (max < element) {
        max = element;
        pivot = row;
      }
    }

    return pivot;
  },
  swapRows(matrix, a, b) {
    const t = matrix[a];
    matrix[a] = matrix[b];
    matrix[b] = t;
  },
  getVector3Magnitude(x, y, z) {
    return Math.sqrt(Math.pow(x, 2) +
      Math.pow(y, 2) +
      Math.pow(z, 2));
  },
  normalizeVector(x, y, z) {
    const magnitude = this.getVector3Magnitude(x, y, z);
    return {
      x: x / magnitude,
      y: y / magnitude,
      z: z / magnitude
    };
  },
  toRadians(degrees) {
    return degrees * Math.PI / 180;
  }
};
