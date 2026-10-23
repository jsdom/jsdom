"use strict";

// Font files are not loaded by jsdom. Use consistent fallback metrics for relative lengths.
const metrics = exports.metrics = { ascent: 0.905, descent: 0.212, lineGap: 0.033 };

exports.getNormalLineHeight = size => (metrics.ascent + metrics.descent + metrics.lineGap) * size;

exports.defaultSize = 16;
