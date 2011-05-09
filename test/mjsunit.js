// Copyright 2008 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// This has been modified to follow a message first argument sequence -- Elijah Insua

function MjsUnitAssertionError(message) {
  this.message = message;
}

MjsUnitAssertionError.prototype.toString = function() {
  return this.message;
};

exports.MjsUnitAssertionError = MjsUnitAssertionError;

/*
 * This file is included in all mini jsunit test cases.  The test
 * framework expects lines that signal failed tests to start with
 * the f-word and ignore all other lines.
 */

var fail = exports.fail = function(expected, found, name_opt, msg) {
  var start;
  start = "Failure (" + msg + "): ";
  throw new MjsUnitAssertionError(msg + " " + start + " expected <" + expected + "> found <" + found + ">");
};


var deepObjectEquals = exports.deepObjectEquals = function(a, b) {
  var aProps = [];
  for (var key in a)
    aProps.push(key);
  var bProps = [];
  for (var key in b)
    bProps.push(key);
  aProps.sort();
  bProps.sort();
  if (!deepEquals(aProps, bProps))
    return false;
  for (var i = 0; i < aProps.length; i++) {
    if (!deepEquals(a[aProps[i]], b[aProps[i]]))
      return false;
  }
  return true;
};


var deepEquals = exports.deepEquals = function(a, b) {
  if (a == b) return true;
  if (typeof a == "number" && typeof b == "number" && isNaN(a) && isNaN(b)) {
    return true;
  }
  if (a && a.constructor && (a.constructor === RegExp || b.constructor === RegExp)) {
    return (a.constructor === b.constructor) && (a.toString === b.toString);
  }
  if ((typeof a) !== 'object' || (typeof b) !== 'object' ||
      (a === null) || (b === null))
    return false;
  if (a.constructor === Array) {
    if (b.constructor !== Array)
      return false;
    if (a.length != b.length)
      return false;
    for (var i = 0; i < a.length; i++) {
      if (i in a) {
        if (!(i in b) || !(deepEquals(a[i], b[i])))
          return false;
      } else if (i in b) {
        return false;
      }
    }
    return true;
  } else {
    return deepObjectEquals(a, b);
  }
};


var assertEquals = exports.assertEquals = function(msg, expected, found, name_opt) {
  if (!deepEquals(found, expected)) {
    fail(expected, found, name_opt, msg);
  }
};

var assertSame = exports.assertSame = exports.assertEquals;

var assertArrayEquals = exports.assertArrayEquals = function(msg, expected, found, name_opt) {
  var start = "";
  if (name_opt) {
    start = name_opt + " - ";
  }
  assertEquals(msg, expected.length, found.length, start + "array length");
  if (expected.length == found.length) {
    for (var i = 0; i < expected.length; ++i) {
      assertEquals(msg, expected[i], found[i], start + "array element at index " + i);
    }
  }
};


var assertTrue = exports.assertTrue = function(msg, value, name_opt) {
  assertEquals(msg, true, value, name_opt);
};


var assertFalse = exports.assertFalse = function(msg, value, name_opt) {
  assertEquals(msg,false, value, name_opt);
};


var assertNaN = exports.assertNaN = function(msg, value, name_opt) {
  if (!isNaN(value)) {
    fail("NaN", value, name_opt, msg);
  }
};


var assertNull = exports.assertNull = function(msg, value, name_opt) {
  if (value !== null) {
    fail("null", value, name_opt, msg);
  }
};


var assertNotNull = exports.assertNotNull = function(msg, value, name_opt) {
  if (value === null) {
    fail("not null", value, name_opt, msg);
  }
};


var assertThrows = exports.assertThrows = function(msg, code, type_opt, cause_opt) {
  var threwException = true;
  try {
    if (typeof code == 'function') {
      code();
    } else {
      eval(code);
    }
    threwException = false;
  } catch (e) {
    if (typeof type_opt == 'function')
      assertInstanceof(msg, e, type_opt);
    if (arguments.length >= 3)
      assertEquals(msg, e.type, cause_opt);
    // Do nothing.
  }
  if (!threwException) assertTrue(msg, false, "did not throw exception");
};


var assertInstanceof = exports.assertInstanceof = function(msg, obj, type) {
  if (!(obj instanceof type)) {
    assertTrue(msg, false, "Object <" + obj + "> is not an instance of <" + type + ">");
  }
};


var assertDoesNotThrow = exports.assertDoesNotThrow = function(msg, code) {
  try {
    if (typeof code == 'function') {
      code();
    } else {
      eval(code);
    }
  } catch (e) {
    assertTrue(msg, false, "threw an exception: " + (e.message || e));
  }
};


var assertUnreachable = exports.assertUnreachable = function(msg, name_opt) {
  // Fix this when we ditch the old test runner.
  var message = "Fail" + "ure: unreachable"
  if (name_opt) {
    message += " - " + name_opt;
  }
  throw new MjsUnitAssertionError(message);
};

var assertSize = exports.assertSize = function(msg, obj, expected) {
  ocount = (obj && obj.length) ? obj.length : parseInt(obj);
  ecount = (expected) ? expected.length : parseInt(expected);

  if (ocount !== ecount)
  {
      throw new MjsUnitAssertionError("Failure: " + ocount + " does not equal " + ecount);
  }    
};

var assertInstanceOf = exports.assertInstanceOf = function(msg, obj, expected) {
    if (!(obj instanceof expected))
    {
        throw new MjsUnitAssertionError("Failure: " + " is not an instance of " + expected);
    }  
};

var assertEqualsList = exports.assertEqualsList = function(msg, obj, expected) {

  for (var i=0; i<expected.length; i++)
  {
    if (!obj[i] || obj[i] !== expected[i])
    {
        throw new MjsUnitAssertionError("Failure: list does not contain the same items as expected");
    }  
    
  }
 
}
