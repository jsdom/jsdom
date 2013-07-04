var path = require('path');

/**
 * Intercepts a method by replacing the prototype's implementation
 * with a wrapper that invokes the given interceptor instead.
 *
 *     utils.intercept(core.Element, 'inserBefore',
 *       function(_super, args, newChild, refChild) {
 *         console.log('insertBefore', newChild, refChild);
 *         return _super.apply(this, args);
 *       }
 *     );
 */
exports.intercept = function(clazz, method, interceptor) {
  var proto = clazz.prototype,
      _super = proto[method],
      unwrapArgs = interceptor.length > 2;

  proto[method] = function() {
    if (unwrapArgs) {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(_super, arguments);
      return interceptor.apply(this, args);
    }
    else {
      return interceptor.call(this, _super, arguments);
    }
  };
};

exports.toFileUrl = function (fileName) {
  // Beyond just the `path.resolve`, this is mostly for the benefit of Windows,
  // where we need to convert '\' to '/' and add an extra '/' prefix before the
  // drive letter.
  var pathname = path.resolve(process.cwd(), fileName).replace(/\\/g, '/');
  if (pathname[0] !== '/') {
    pathname = '/' + pathname;
  }

  return 'file://' + pathname;
};
