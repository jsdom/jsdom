var path = require('path');

function toPathname(dirname, relativePath) {
  var pathname = path.resolve(dirname, relativePath).replace(/\\/g, '/');
  if (pathname[0] !== '/') {
    pathname = '/' + pathname;
  }
  return pathname;
}

exports.toFileUrl = function (dirname) {
    return function (relativePath) {
      return 'file://' + toPathname(dirname, relativePath);
    };
};

exports.toPathname = function (dirname) {
    return function (relativePath) {
        return toPathname(dirname, relativePath);
    };
};
