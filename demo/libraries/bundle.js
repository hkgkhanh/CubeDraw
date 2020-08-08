'use strict';

/**
 * A function that always returns `true`. Any passed in parameters are ignored.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Function
 * @sig * -> Boolean
 * @param {*}
 * @return {Boolean}
 * @see R.F
 * @example
 *
 *      R.T(); //=> true
 */
var T = function () {
  return true;
};

/**
 * A special placeholder value used to specify "gaps" within curried functions,
 * allowing partial application of any combination of arguments, regardless of
 * their positions.
 *
 * If `g` is a curried ternary function and `_` is `R.__`, the following are
 * equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2, _)(1, 3)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @name __
 * @constant
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @example
 *
 *      const greet = R.replace('{name}', R.__, 'Hello, {name}!');
 *      greet('Alice'); //=> 'Hello, Alice!'
 */
var __ = {
  '@@functional/placeholder': true
};

function _isPlaceholder(a) {
  return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
}

/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;

      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
          return fn(a, _b);
        });

      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}

function _arity(n, fn) {
  /* eslint-disable no-unused-vars */
  switch (n) {
    case 0:
      return function () {
        return fn.apply(this, arguments);
      };

    case 1:
      return function (a0) {
        return fn.apply(this, arguments);
      };

    case 2:
      return function (a0, a1) {
        return fn.apply(this, arguments);
      };

    case 3:
      return function (a0, a1, a2) {
        return fn.apply(this, arguments);
      };

    case 4:
      return function (a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };

    case 5:
      return function (a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };

    case 6:
      return function (a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };

    case 7:
      return function (a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };

    case 8:
      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };

    case 9:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };

    case 10:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };

    default:
      throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
}

/**
 * Internal curryN function.
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.
 * @param {Array} received An array of arguments received thus far.
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

function _curryN(length, received, fn) {
  return function () {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;

    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;

      if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }

      combined[combinedIdx] = result;

      if (!_isPlaceholder(result)) {
        left -= 1;
      }

      combinedIdx += 1;
    }

    return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
  };
}

/**
 * Returns a curried equivalent of the provided function, with the specified
 * arity. The curried function has two unusual capabilities. First, its
 * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.5.0
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      const sumArgs = (...args) => R.sum(args);
 *
 *      const curriedAddFourNumbers = R.curryN(4, sumArgs);
 *      const f = curriedAddFourNumbers(1, 2);
 *      const g = f(3);
 *      g(4); //=> 10
 */

var curryN =
/*#__PURE__*/
_curry2(function curryN(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }

  return _arity(length, _curryN(length, [], fn));
});

/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;

      case 1:
        return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        });

      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1(function (_c) {
          return fn(a, b, _c);
        });

      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
          return fn(_a, _b, c);
        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b, c);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b, c);
        }) : _isPlaceholder(c) ? _curry1(function (_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
    }
  };
}

/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
var _isArray = Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
};

function _isTransformer(obj) {
  return obj != null && typeof obj['@@transducer/step'] === 'function';
}

/**
 * Returns a function that dispatches with different strategies based on the
 * object in list position (last argument). If it is an array, executes [fn].
 * Otherwise, if it has a function with one of the given method names, it will
 * execute that function (functor case). Otherwise, if it is a transformer,
 * uses transducer [xf] to return a new transformer (transducer case).
 * Otherwise, it will default to executing [fn].
 *
 * @private
 * @param {Array} methodNames properties to check for a custom implementation
 * @param {Function} xf transducer to initialize if object is transformer
 * @param {Function} fn default ramda implementation
 * @return {Function} A function that dispatches on object in list position
 */

function _dispatchable(methodNames, xf, fn) {
  return function () {
    if (arguments.length === 0) {
      return fn();
    }

    var args = Array.prototype.slice.call(arguments, 0);
    var obj = args.pop();

    if (!_isArray(obj)) {
      var idx = 0;

      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === 'function') {
          return obj[methodNames[idx]].apply(obj, args);
        }

        idx += 1;
      }

      if (_isTransformer(obj)) {
        var transducer = xf.apply(null, args);
        return transducer(obj);
      }
    }

    return fn.apply(this, arguments);
  };
}

var _xfBase = {
  init: function () {
    return this.xf['@@transducer/init']();
  },
  result: function (result) {
    return this.xf['@@transducer/result'](result);
  }
};

/**
 * Returns the larger of its two arguments.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> a
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.maxBy, R.min
 * @example
 *
 *      R.max(789, 123); //=> 789
 *      R.max('a', 'b'); //=> 'b'
 */

var max =
/*#__PURE__*/
_curry2(function max(a, b) {
  return b > a ? b : a;
});

function _map(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);

  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }

  return result;
}

function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}

/**
 * Tests whether or not an object is similar to an array.
 *
 * @private
 * @category Type
 * @category List
 * @sig * -> Boolean
 * @param {*} x The object to test.
 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
 * @example
 *
 *      _isArrayLike([]); //=> true
 *      _isArrayLike(true); //=> false
 *      _isArrayLike({}); //=> false
 *      _isArrayLike({length: 10}); //=> false
 *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 */

var _isArrayLike =
/*#__PURE__*/
_curry1(function isArrayLike(x) {
  if (_isArray(x)) {
    return true;
  }

  if (!x) {
    return false;
  }

  if (typeof x !== 'object') {
    return false;
  }

  if (_isString(x)) {
    return false;
  }

  if (x.nodeType === 1) {
    return !!x.length;
  }

  if (x.length === 0) {
    return true;
  }

  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }

  return false;
});

var XWrap =
/*#__PURE__*/
function () {
  function XWrap(fn) {
    this.f = fn;
  }

  XWrap.prototype['@@transducer/init'] = function () {
    throw new Error('init not implemented on XWrap');
  };

  XWrap.prototype['@@transducer/result'] = function (acc) {
    return acc;
  };

  XWrap.prototype['@@transducer/step'] = function (acc, x) {
    return this.f(acc, x);
  };

  return XWrap;
}();

function _xwrap(fn) {
  return new XWrap(fn);
}

/**
 * Creates a function that is bound to a context.
 * Note: `R.bind` does not provide the additional argument-binding capabilities of
 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @category Object
 * @sig (* -> *) -> {*} -> (* -> *)
 * @param {Function} fn The function to bind to context
 * @param {Object} thisObj The context to bind `fn` to
 * @return {Function} A function that will execute in the context of `thisObj`.
 * @see R.partial
 * @example
 *
 *      const log = R.bind(console.log, console);
 *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
 *      // logs {a: 2}
 * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
 */

var bind =
/*#__PURE__*/
_curry2(function bind(fn, thisObj) {
  return _arity(fn.length, function () {
    return fn.apply(thisObj, arguments);
  });
});

function _arrayReduce(xf, acc, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    acc = xf['@@transducer/step'](acc, list[idx]);

    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }

    idx += 1;
  }

  return xf['@@transducer/result'](acc);
}

function _iterableReduce(xf, acc, iter) {
  var step = iter.next();

  while (!step.done) {
    acc = xf['@@transducer/step'](acc, step.value);

    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }

    step = iter.next();
  }

  return xf['@@transducer/result'](acc);
}

function _methodReduce(xf, acc, obj, methodName) {
  return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
}

var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';
function _reduce(fn, acc, list) {
  if (typeof fn === 'function') {
    fn = _xwrap(fn);
  }

  if (_isArrayLike(list)) {
    return _arrayReduce(fn, acc, list);
  }

  if (typeof list['fantasy-land/reduce'] === 'function') {
    return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
  }

  if (list[symIterator] != null) {
    return _iterableReduce(fn, acc, list[symIterator]());
  }

  if (typeof list.next === 'function') {
    return _iterableReduce(fn, acc, list);
  }

  if (typeof list.reduce === 'function') {
    return _methodReduce(fn, acc, list, 'reduce');
  }

  throw new TypeError('reduce: list must be array or iterable');
}

var XMap =
/*#__PURE__*/
function () {
  function XMap(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XMap.prototype['@@transducer/init'] = _xfBase.init;
  XMap.prototype['@@transducer/result'] = _xfBase.result;

  XMap.prototype['@@transducer/step'] = function (result, input) {
    return this.xf['@@transducer/step'](result, this.f(input));
  };

  return XMap;
}();

var _xmap =
/*#__PURE__*/
_curry2(function _xmap(f, xf) {
  return new XMap(f, xf);
});

function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var toString = Object.prototype.toString;

var _isArguments =
/*#__PURE__*/
function () {
  return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
    return toString.call(x) === '[object Arguments]';
  } : function _isArguments(x) {
    return _has('callee', x);
  };
}();

var hasEnumBug = !
/*#__PURE__*/
{
  toString: null
}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString']; // Safari bug

var hasArgsEnumBug =
/*#__PURE__*/
function () {

  return arguments.propertyIsEnumerable('length');
}();

var contains = function contains(list, item) {
  var idx = 0;

  while (idx < list.length) {
    if (list[idx] === item) {
      return true;
    }

    idx += 1;
  }

  return false;
};
/**
 * Returns a list containing the names of all the enumerable own properties of
 * the supplied object.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own properties.
 * @see R.keysIn, R.values
 * @example
 *
 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
 */


var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ?
/*#__PURE__*/
_curry1(function keys(obj) {
  return Object(obj) !== obj ? [] : Object.keys(obj);
}) :
/*#__PURE__*/
_curry1(function keys(obj) {
  if (Object(obj) !== obj) {
    return [];
  }

  var prop, nIdx;
  var ks = [];

  var checkArgsLength = hasArgsEnumBug && _isArguments(obj);

  for (prop in obj) {
    if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
      ks[ks.length] = prop;
    }
  }

  if (hasEnumBug) {
    nIdx = nonEnumerableProps.length - 1;

    while (nIdx >= 0) {
      prop = nonEnumerableProps[nIdx];

      if (_has(prop, obj) && !contains(ks, prop)) {
        ks[ks.length] = prop;
      }

      nIdx -= 1;
    }
  }

  return ks;
});

/**
 * Takes a function and
 * a [functor](https://github.com/fantasyland/fantasy-land#functor),
 * applies the function to each of the functor's values, and returns
 * a functor of the same shape.
 *
 * Ramda provides suitable `map` implementations for `Array` and `Object`,
 * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
 *
 * Dispatches to the `map` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * Also treats functions as functors and will compose them together.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Functor f => (a -> b) -> f a -> f b
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {Array} list The list to be iterated over.
 * @return {Array} The new list.
 * @see R.transduce, R.addIndex
 * @example
 *
 *      const double = x => x * 2;
 *
 *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
 *
 *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
 * @symb R.map(f, [a, b]) = [f(a), f(b)]
 * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
 * @symb R.map(f, functor_o) = functor_o.map(f)
 */

var map =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['fantasy-land/map', 'map'], _xmap, function map(fn, functor) {
  switch (Object.prototype.toString.call(functor)) {
    case '[object Function]':
      return curryN(functor.length, function () {
        return fn.call(this, functor.apply(this, arguments));
      });

    case '[object Object]':
      return _reduce(function (acc, key) {
        acc[key] = fn(functor[key]);
        return acc;
      }, {}, keys(functor));

    default:
      return _map(fn, functor);
  }
}));

/**
 * Determine if the passed argument is an integer.
 *
 * @private
 * @param {*} n
 * @category Type
 * @return {Boolean}
 */
var _isInteger = Number.isInteger || function _isInteger(n) {
  return n << 0 === n;
};

/**
 * Returns the nth element of the given list or string. If n is negative the
 * element at index length + n is returned.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> [a] -> a | Undefined
 * @sig Number -> String -> String
 * @param {Number} offset
 * @param {*} list
 * @return {*}
 * @example
 *
 *      const list = ['foo', 'bar', 'baz', 'quux'];
 *      R.nth(1, list); //=> 'bar'
 *      R.nth(-1, list); //=> 'quux'
 *      R.nth(-99, list); //=> undefined
 *
 *      R.nth(2, 'abc'); //=> 'c'
 *      R.nth(3, 'abc'); //=> ''
 * @symb R.nth(-1, [a, b, c]) = c
 * @symb R.nth(0, [a, b, c]) = a
 * @symb R.nth(1, [a, b, c]) = b
 */

var nth =
/*#__PURE__*/
_curry2(function nth(offset, list) {
  var idx = offset < 0 ? list.length + offset : offset;
  return _isString(list) ? list.charAt(idx) : list[idx];
});

/**
 * Retrieves the values at given paths of an object.
 *
 * @func
 * @memberOf R
 * @since v0.27.0
 * @category Object
 * @typedefn Idx = [String | Int]
 * @sig [Idx] -> {a} -> [a | Undefined]
 * @param {Array} pathsArray The array of paths to be fetched.
 * @param {Object} obj The object to retrieve the nested properties from.
 * @return {Array} A list consisting of values at paths specified by "pathsArray".
 * @see R.path
 * @example
 *
 *      R.paths([['a', 'b'], ['p', 0, 'q']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, 3]
 *      R.paths([['a', 'b'], ['p', 'r']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, undefined]
 */

var paths =
/*#__PURE__*/
_curry2(function paths(pathsArray, obj) {
  return pathsArray.map(function (paths) {
    var val = obj;
    var idx = 0;
    var p;

    while (idx < paths.length) {
      if (val == null) {
        return;
      }

      p = paths[idx];
      val = _isInteger(p) ? nth(p, val) : val[p];
      idx += 1;
    }

    return val;
  });
});

/**
 * Retrieve the value at a given path.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @typedefn Idx = String | Int
 * @sig [Idx] -> {a} -> a | Undefined
 * @param {Array} path The path to use.
 * @param {Object} obj The object to retrieve the nested property from.
 * @return {*} The data at `path`.
 * @see R.prop, R.nth
 * @example
 *
 *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
 *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
 *      R.path(['a', 'b', 0], {a: {b: [1, 2, 3]}}); //=> 1
 *      R.path(['a', 'b', -2], {a: {b: [1, 2, 3]}}); //=> 2
 */

var path =
/*#__PURE__*/
_curry2(function path(pathAr, obj) {
  return paths([pathAr], obj)[0];
});

/**
 * Returns a function that when supplied an object returns the indicated
 * property of that object, if it exists.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @typedefn Idx = String | Int
 * @sig Idx -> {s: a} -> a | Undefined
 * @param {String|Number} p The property name or array index
 * @param {Object} obj The object to query
 * @return {*} The value at `obj.p`.
 * @see R.path, R.nth
 * @example
 *
 *      R.prop('x', {x: 100}); //=> 100
 *      R.prop('x', {}); //=> undefined
 *      R.prop(0, [100]); //=> 100
 *      R.compose(R.inc, R.prop('x'))({ x: 3 }) //=> 4
 */

var prop =
/*#__PURE__*/
_curry2(function prop(p, obj) {
  return path([p], obj);
});

/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*. It may use
 * [`R.reduced`](#reduced) to shortcut the iteration.
 *
 * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
 * is *(value, acc)*.
 *
 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduce` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
 *
 * Dispatches to the `reduce` method of the third argument, if present. When
 * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
 * shortcuting, as this is not implemented by `reduce`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduced, R.addIndex, R.reduceRight
 * @example
 *
 *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
 *      //          -               -10
 *      //         / \              / \
 *      //        -   4           -6   4
 *      //       / \              / \
 *      //      -   3   ==>     -3   3
 *      //     / \              / \
 *      //    -   2           -1   2
 *      //   / \              / \
 *      //  0   1            0   1
 *
 * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
 */

var reduce =
/*#__PURE__*/
_curry3(_reduce);

/**
 * Returns a function that always returns the given value. Note that for
 * non-primitives the value returned is a reference to the original value.
 *
 * This function is known as `const`, `constant`, or `K` (for K combinator) in
 * other languages and libraries.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> (* -> a)
 * @param {*} val The value to wrap in a function
 * @return {Function} A Function :: * -> val.
 * @example
 *
 *      const t = R.always('Tee');
 *      t(); //=> 'Tee'
 */

var always =
/*#__PURE__*/
_curry1(function always(val) {
  return function () {
    return val;
  };
});

/**
 * Gives a single-word string description of the (native) type of a value,
 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
 * attempt to distinguish user Object types any further, reporting them all as
 * 'Object'.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Type
 * @sig (* -> {*}) -> String
 * @param {*} val The value to test
 * @return {String}
 * @example
 *
 *      R.type({}); //=> "Object"
 *      R.type(1); //=> "Number"
 *      R.type(false); //=> "Boolean"
 *      R.type('s'); //=> "String"
 *      R.type(null); //=> "Null"
 *      R.type([]); //=> "Array"
 *      R.type(/[A-z]/); //=> "RegExp"
 *      R.type(() => {}); //=> "Function"
 *      R.type(undefined); //=> "Undefined"
 */

var type =
/*#__PURE__*/
_curry1(function type(val) {
  return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
});

function _arrayFromIterator(iter) {
  var list = [];
  var next;

  while (!(next = iter.next()).done) {
    list.push(next.value);
  }

  return list;
}

function _includesWith(pred, x, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    if (pred(x, list[idx])) {
      return true;
    }

    idx += 1;
  }

  return false;
}

function _functionName(f) {
  // String(x => x) evaluates to "x => x", so the pattern may not match.
  var match = String(f).match(/^function (\w*)/);
  return match == null ? '' : match[1];
}

// Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
function _objectIs(a, b) {
  // SameValue algorithm
  if (a === b) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return a !== 0 || 1 / a === 1 / b;
  } else {
    // Step 6.a: NaN == NaN
    return a !== a && b !== b;
  }
}

var _objectIs$1 = typeof Object.is === 'function' ? Object.is : _objectIs;

/**
 * private _uniqContentEquals function.
 * That function is checking equality of 2 iterator contents with 2 assumptions
 * - iterators lengths are the same
 * - iterators values are unique
 *
 * false-positive result will be returned for comparision of, e.g.
 * - [1,2,3] and [1,2,3,4]
 * - [1,1,1] and [1,2,3]
 * */

function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
  var a = _arrayFromIterator(aIterator);

  var b = _arrayFromIterator(bIterator);

  function eq(_a, _b) {
    return _equals(_a, _b, stackA.slice(), stackB.slice());
  } // if *a* array contains any element that is not included in *b*


  return !_includesWith(function (b, aItem) {
    return !_includesWith(eq, aItem, b);
  }, b, a);
}

function _equals(a, b, stackA, stackB) {
  if (_objectIs$1(a, b)) {
    return true;
  }

  var typeA = type(a);

  if (typeA !== type(b)) {
    return false;
  }

  if (a == null || b == null) {
    return false;
  }

  if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
    return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
  }

  if (typeof a.equals === 'function' || typeof b.equals === 'function') {
    return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
  }

  switch (typeA) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
        return a === b;
      }

      break;

    case 'Boolean':
    case 'Number':
    case 'String':
      if (!(typeof a === typeof b && _objectIs$1(a.valueOf(), b.valueOf()))) {
        return false;
      }

      break;

    case 'Date':
      if (!_objectIs$1(a.valueOf(), b.valueOf())) {
        return false;
      }

      break;

    case 'Error':
      return a.name === b.name && a.message === b.message;

    case 'RegExp':
      if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
        return false;
      }

      break;
  }

  var idx = stackA.length - 1;

  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }

    idx -= 1;
  }

  switch (typeA) {
    case 'Map':
      if (a.size !== b.size) {
        return false;
      }

      return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));

    case 'Set':
      if (a.size !== b.size) {
        return false;
      }

      return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));

    case 'Arguments':
    case 'Array':
    case 'Object':
    case 'Boolean':
    case 'Number':
    case 'String':
    case 'Date':
    case 'Error':
    case 'RegExp':
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'ArrayBuffer':
      break;

    default:
      // Values of other types are only equal if identical.
      return false;
  }

  var keysA = keys(a);

  if (keysA.length !== keys(b).length) {
    return false;
  }

  var extendedStackA = stackA.concat([a]);
  var extendedStackB = stackB.concat([b]);
  idx = keysA.length - 1;

  while (idx >= 0) {
    var key = keysA[idx];

    if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
      return false;
    }

    idx -= 1;
  }

  return true;
}

/**
 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
 * cyclical data structures.
 *
 * Dispatches symmetrically to the `equals` methods of both arguments, if
 * present.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> b -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      R.equals(1, 1); //=> true
 *      R.equals(1, '1'); //=> false
 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
 *
 *      const a = {}; a.v = a;
 *      const b = {}; b.v = b;
 *      R.equals(a, b); //=> true
 */

var equals =
/*#__PURE__*/
_curry2(function equals(a, b) {
  return _equals(a, b, [], []);
});

function _indexOf(list, a, idx) {
  var inf, item; // Array.prototype.indexOf doesn't exist below IE9

  if (typeof list.indexOf === 'function') {
    switch (typeof a) {
      case 'number':
        if (a === 0) {
          // manually crawl the list to distinguish between +0 and -0
          inf = 1 / a;

          while (idx < list.length) {
            item = list[idx];

            if (item === 0 && 1 / item === inf) {
              return idx;
            }

            idx += 1;
          }

          return -1;
        } else if (a !== a) {
          // NaN
          while (idx < list.length) {
            item = list[idx];

            if (typeof item === 'number' && item !== item) {
              return idx;
            }

            idx += 1;
          }

          return -1;
        } // non-zero numbers can utilise Set


        return list.indexOf(a, idx);
      // all these types can utilise Set

      case 'string':
      case 'boolean':
      case 'function':
      case 'undefined':
        return list.indexOf(a, idx);

      case 'object':
        if (a === null) {
          // null can utilise Set
          return list.indexOf(a, idx);
        }

    }
  } // anything else not covered above, defer to R.equals


  while (idx < list.length) {
    if (equals(list[idx], a)) {
      return idx;
    }

    idx += 1;
  }

  return -1;
}

function _includes(a, list) {
  return _indexOf(list, a, 0) >= 0;
}

/**
 * Returns a function, `fn`, which encapsulates `if/else, if/else, ...` logic.
 * `R.cond` takes a list of [predicate, transformer] pairs. All of the arguments
 * to `fn` are applied to each of the predicates in turn until one returns a
 * "truthy" value, at which point `fn` returns the result of applying its
 * arguments to the corresponding transformer. If none of the predicates
 * matches, `fn` returns undefined.
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Logic
 * @sig [[(*... -> Boolean),(*... -> *)]] -> (*... -> *)
 * @param {Array} pairs A list of [predicate, transformer]
 * @return {Function}
 * @see R.ifElse, R.unless, R.when
 * @example
 *
 *      const fn = R.cond([
 *        [R.equals(0),   R.always('water freezes at 0°C')],
 *        [R.equals(100), R.always('water boils at 100°C')],
 *        [R.T,           temp => 'nothing special happens at ' + temp + '°C']
 *      ]);
 *      fn(0); //=> 'water freezes at 0°C'
 *      fn(50); //=> 'nothing special happens at 50°C'
 *      fn(100); //=> 'water boils at 100°C'
 */

var cond =
/*#__PURE__*/
_curry1(function cond(pairs) {
  var arity = reduce(max, 0, map(function (pair) {
    return pair[0].length;
  }, pairs));
  return _arity(arity, function () {
    var idx = 0;

    while (idx < pairs.length) {
      if (pairs[idx][0].apply(this, arguments)) {
        return pairs[idx][1].apply(this, arguments);
      }

      idx += 1;
    }
  });
});

/**
 * Returns the second argument if it is not `null`, `undefined` or `NaN`;
 * otherwise the first argument is returned.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Logic
 * @sig a -> b -> a | b
 * @param {a} default The default value.
 * @param {b} val `val` will be returned instead of `default` unless `val` is `null`, `undefined` or `NaN`.
 * @return {*} The second value if it is not `null`, `undefined` or `NaN`, otherwise the default value
 * @example
 *
 *      const defaultTo42 = R.defaultTo(42);
 *
 *      defaultTo42(null);  //=> 42
 *      defaultTo42(undefined);  //=> 42
 *      defaultTo42(false);  //=> false
 *      defaultTo42('Ramda');  //=> 'Ramda'
 *      // parseInt('string') results in NaN
 *      defaultTo42(parseInt('string')); //=> 42
 */

var defaultTo =
/*#__PURE__*/
_curry2(function defaultTo(d, v) {
  return v == null || v !== v ? d : v;
});

/**
 * Returns a new function much like the supplied one, except that the first two
 * arguments' order is reversed.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig ((a, b, c, ...) -> z) -> (b -> a -> c -> ... -> z)
 * @param {Function} fn The function to invoke with its first two parameters reversed.
 * @return {*} The result of invoking `fn` with its first two parameters' order reversed.
 * @example
 *
 *      const mergeThree = (a, b, c) => [].concat(a, b, c);
 *
 *      mergeThree(1, 2, 3); //=> [1, 2, 3]
 *
 *      R.flip(mergeThree)(1, 2, 3); //=> [2, 1, 3]
 * @symb R.flip(f)(a, b, c) = f(b, a, c)
 */

var flip =
/*#__PURE__*/
_curry1(function flip(fn) {
  return curryN(fn.length, function (a, b) {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = b;
    args[1] = a;
    return fn.apply(this, args);
  });
});

/**
 * Creates a function that will process either the `onTrue` or the `onFalse`
 * function depending upon the result of the `condition` predicate.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Logic
 * @sig (*... -> Boolean) -> (*... -> *) -> (*... -> *) -> (*... -> *)
 * @param {Function} condition A predicate function
 * @param {Function} onTrue A function to invoke when the `condition` evaluates to a truthy value.
 * @param {Function} onFalse A function to invoke when the `condition` evaluates to a falsy value.
 * @return {Function} A new function that will process either the `onTrue` or the `onFalse`
 *                    function depending upon the result of the `condition` predicate.
 * @see R.unless, R.when, R.cond
 * @example
 *
 *      const incCount = R.ifElse(
 *        R.has('count'),
 *        R.over(R.lensProp('count'), R.inc),
 *        R.assoc('count', 1)
 *      );
 *      incCount({});           //=> { count: 1 }
 *      incCount({ count: 1 }); //=> { count: 2 }
 */

var ifElse =
/*#__PURE__*/
_curry3(function ifElse(condition, onTrue, onFalse) {
  return curryN(Math.max(condition.length, onTrue.length, onFalse.length), function _ifElse() {
    return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
  });
});

/**
 * Returns `true` if the specified value is equal, in [`R.equals`](#equals)
 * terms, to at least one element of the given list; `false` otherwise.
 * Works also with strings.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category List
 * @sig a -> [a] -> Boolean
 * @param {Object} a The item to compare against.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if an equivalent item is in the list, `false` otherwise.
 * @see R.any
 * @example
 *
 *      R.includes(3, [1, 2, 3]); //=> true
 *      R.includes(4, [1, 2, 3]); //=> false
 *      R.includes({ name: 'Fred' }, [{ name: 'Fred' }]); //=> true
 *      R.includes([42], [[42]]); //=> true
 *      R.includes('ba', 'banana'); //=>true
 */

var includes =
/*#__PURE__*/
_curry2(_includes);

function _objectAssign(target) {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var output = Object(target);
  var idx = 1;
  var length = arguments.length;

  while (idx < length) {
    var source = arguments[idx];

    if (source != null) {
      for (var nextKey in source) {
        if (_has(nextKey, source)) {
          output[nextKey] = source[nextKey];
        }
      }
    }

    idx += 1;
  }

  return output;
}

var _objectAssign$1 = typeof Object.assign === 'function' ? Object.assign : _objectAssign;

function _isNumber(x) {
  return Object.prototype.toString.call(x) === '[object Number]';
}

/**
 * Merges a list of objects together into one object.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig [{k: v}] -> {k: v}
 * @param {Array} list An array of objects
 * @return {Object} A merged object.
 * @see R.reduce
 * @example
 *
 *      R.mergeAll([{foo:1},{bar:2},{baz:3}]); //=> {foo:1,bar:2,baz:3}
 *      R.mergeAll([{foo:1},{foo:2},{bar:2}]); //=> {foo:2,bar:2}
 * @symb R.mergeAll([{ x: 1 }, { y: 2 }, { z: 3 }]) = { x: 1, y: 2, z: 3 }
 */

var mergeAll =
/*#__PURE__*/
_curry1(function mergeAll(list) {
  return _objectAssign$1.apply(null, [{}].concat(list));
});

/**
 * If the given, non-null object has a value at the given path, returns the
 * value at that path. Otherwise returns the provided default value.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Object
 * @typedefn Idx = String | Int
 * @sig a -> [Idx] -> {a} -> a
 * @param {*} d The default value.
 * @param {Array} p The path to use.
 * @param {Object} obj The object to retrieve the nested property from.
 * @return {*} The data at `path` of the supplied object or the default value.
 * @example
 *
 *      R.pathOr('N/A', ['a', 'b'], {a: {b: 2}}); //=> 2
 *      R.pathOr('N/A', ['a', 'b'], {c: {b: 2}}); //=> "N/A"
 */

var pathOr =
/*#__PURE__*/
_curry3(function pathOr(d, p, obj) {
  return defaultTo(d, path(p, obj));
});

/**
 * Returns a list of numbers from `from` (inclusive) to `to` (exclusive).
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> Number -> [Number]
 * @param {Number} from The first number in the list.
 * @param {Number} to One more than the last number in the list.
 * @return {Array} The list of numbers in the set `[a, b)`.
 * @example
 *
 *      R.range(1, 5);    //=> [1, 2, 3, 4]
 *      R.range(50, 53);  //=> [50, 51, 52]
 */

var range =
/*#__PURE__*/
_curry2(function range(from, to) {
  if (!(_isNumber(from) && _isNumber(to))) {
    throw new TypeError('Both arguments to range must be numbers');
  }

  var result = [];
  var n = from;

  while (n < to) {
    result.push(n);
    n += 1;
  }

  return result;
});

/**
 * Replace a substring or regex match in a string with a replacement.
 *
 * The first two parameters correspond to the parameters of the
 * `String.prototype.replace()` function, so the second parameter can also be a
 * function.
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category String
 * @sig RegExp|String -> String -> String -> String
 * @param {RegExp|String} pattern A regular expression or a substring to match.
 * @param {String} replacement The string to replace the matches with.
 * @param {String} str The String to do the search and replacement in.
 * @return {String} The result.
 * @example
 *
 *      R.replace('foo', 'bar', 'foo foo foo'); //=> 'bar foo foo'
 *      R.replace(/foo/, 'bar', 'foo foo foo'); //=> 'bar foo foo'
 *
 *      // Use the "g" (global) flag to replace all occurrences:
 *      R.replace(/foo/g, 'bar', 'foo foo foo'); //=> 'bar bar bar'
 */

var replace =
/*#__PURE__*/
_curry3(function replace(regex, replacement, str) {
  return str.replace(regex, replacement);
});

var templates = {
  2: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 178 136" style="stroke-linejoin:round;"><g><rect x="44" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="64" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="44" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="64" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="86" y="44" width="20" height="20" fill="{}" stroke="black"></rect><rect x="106" y="44" width="20" height="20" fill="{}" stroke="black"></rect><rect x="86" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="106" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="44" y="44" width="20" height="20" fill="{}" stroke="black"></rect><rect x="64" y="44" width="20" height="20" fill="{}" stroke="black"></rect><rect x="44" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="64" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="44" y="86" width="20" height="20" fill="{}" stroke="black"></rect><rect x="64" y="86" width="20" height="20" fill="{}" stroke="black"></rect><rect x="44" y="106" width="20" height="20" fill="{}" stroke="black"></rect><rect x="64" y="106" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="44" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="44" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="128" y="44" width="20" height="20" fill="{}" stroke="black"></rect><rect x="148" y="44" width="20" height="20" fill="{}" stroke="black"></rect><rect x="128" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="148" y="64" width="20" height="20" fill="{}" stroke="black"></rect></g></svg>',
  3: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 258 196" style="stroke-linejoin:round;"><g><rect x="64" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="64" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="64" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="126" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="146" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="166" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="126" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="146" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="166" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="126" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="146" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="166" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="64" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="64" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="64" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="64" y="126" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="126" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="126" width="20" height="20" fill="{}" stroke="black"></rect><rect x="64" y="146" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="146" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="146" width="20" height="20" fill="{}" stroke="black"></rect><rect x="64" y="166" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="166" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="166" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="188" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="208" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="228" y="64" width="20" height="20" fill="{}" stroke="black"></rect><rect x="188" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="208" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="228" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="188" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="208" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="228" y="104" width="20" height="20" fill="{}" stroke="black"></rect></g></svg>',
  4: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 338 256" style="stroke-linejoin:round;"><g><rect x="84" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="166" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="186" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="206" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="226" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="166" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="186" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="206" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="226" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="166" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="186" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="206" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="226" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="166" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="186" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="206" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="226" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="166" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="166" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="166" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="166" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="186" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="186" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="186" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="186" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="206" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="206" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="206" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="206" width="20" height="20" fill="{}" stroke="black"></rect><rect x="84" y="226" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="226" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="226" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="226" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="248" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="268" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="288" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="308" y="84" width="20" height="20" fill="{}" stroke="black"></rect><rect x="248" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="268" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="288" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="308" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="248" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="268" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="288" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="308" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="248" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="268" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="288" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="308" y="144" width="20" height="20" fill="{}" stroke="black"></rect></g></svg>',
  5: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 418 316" style="stroke-linejoin:round;"><g><rect x="104" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="206" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="226" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="246" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="266" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="206" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="226" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="246" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="266" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="206" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="226" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="246" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="266" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="206" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="226" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="246" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="266" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="206" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="226" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="246" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="266" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="206" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="206" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="206" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="206" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="206" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="226" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="226" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="226" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="226" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="226" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="246" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="246" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="246" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="246" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="246" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="266" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="266" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="266" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="266" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="266" width="20" height="20" fill="{}" stroke="black"></rect><rect x="104" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="308" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="328" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="348" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="368" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="388" y="104" width="20" height="20" fill="{}" stroke="black"></rect><rect x="308" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="328" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="348" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="368" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="388" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="308" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="328" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="348" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="368" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="388" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="308" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="328" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="348" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="368" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="388" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="308" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="328" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="348" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="368" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="388" y="184" width="20" height="20" fill="{}" stroke="black"></rect></g></svg>',
  6: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 498 376" style="stroke-linejoin:round;"><g><rect x="124" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="102" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="102" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="102" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="102" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="102" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="102" width="20" height="20" fill="{}" stroke="black"></rect><rect x="246" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="266" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="306" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="326" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="346" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="246" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="266" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="306" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="326" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="346" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="246" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="266" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="306" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="326" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="346" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="246" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="266" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="306" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="326" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="346" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="246" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="266" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="306" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="326" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="346" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="246" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="266" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="306" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="326" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="346" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="246" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="246" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="246" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="246" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="246" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="246" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="266" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="266" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="266" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="266" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="266" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="266" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="306" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="306" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="306" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="306" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="306" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="306" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="326" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="326" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="326" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="326" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="326" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="326" width="20" height="20" fill="{}" stroke="black"></rect><rect x="124" y="346" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="346" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="346" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="346" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="346" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="346" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="102" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="102" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="102" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="102" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="102" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="102" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="368" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="388" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="408" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="428" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="448" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="468" y="124" width="20" height="20" fill="{}" stroke="black"></rect><rect x="368" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="388" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="408" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="428" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="448" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="468" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="368" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="388" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="408" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="428" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="448" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="468" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="368" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="388" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="408" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="428" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="448" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="468" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="368" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="388" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="408" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="428" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="448" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="468" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="368" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="388" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="408" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="428" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="448" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="468" y="224" width="20" height="20" fill="{}" stroke="black"></rect></g></svg>',
  7: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 578 436" style="stroke-linejoin:round;"><g><rect x="144" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="2" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="22" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="42" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="62" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="82" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="102" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="102" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="102" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="102" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="102" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="102" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="102" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="122" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="122" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="122" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="122" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="122" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="122" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="122" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="306" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="326" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="346" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="366" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="386" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="406" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="306" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="326" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="346" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="366" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="386" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="406" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="306" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="326" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="346" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="366" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="386" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="406" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="306" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="326" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="346" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="366" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="386" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="406" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="306" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="326" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="346" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="366" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="386" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="406" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="306" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="326" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="346" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="366" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="386" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="406" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="286" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="306" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="326" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="346" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="366" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="386" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="406" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="286" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="306" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="306" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="306" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="306" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="306" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="306" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="306" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="326" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="326" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="326" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="326" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="326" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="326" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="326" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="346" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="346" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="346" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="346" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="346" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="346" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="346" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="366" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="366" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="366" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="366" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="366" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="366" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="366" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="386" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="386" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="386" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="386" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="386" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="386" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="386" width="20" height="20" fill="{}" stroke="black"></rect><rect x="144" y="406" width="20" height="20" fill="{}" stroke="black"></rect><rect x="164" y="406" width="20" height="20" fill="{}" stroke="black"></rect><rect x="184" y="406" width="20" height="20" fill="{}" stroke="black"></rect><rect x="204" y="406" width="20" height="20" fill="{}" stroke="black"></rect><rect x="224" y="406" width="20" height="20" fill="{}" stroke="black"></rect><rect x="244" y="406" width="20" height="20" fill="{}" stroke="black"></rect><rect x="264" y="406" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="102" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="122" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="102" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="122" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="102" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="122" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="102" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="122" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="102" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="122" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="102" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="122" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="2" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="22" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="42" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="62" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="82" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="102" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="122" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="428" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="448" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="468" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="488" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="508" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="528" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="548" y="144" width="20" height="20" fill="{}" stroke="black"></rect><rect x="428" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="448" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="468" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="488" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="508" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="528" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="548" y="164" width="20" height="20" fill="{}" stroke="black"></rect><rect x="428" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="448" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="468" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="488" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="508" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="528" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="548" y="184" width="20" height="20" fill="{}" stroke="black"></rect><rect x="428" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="448" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="468" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="488" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="508" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="528" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="548" y="204" width="20" height="20" fill="{}" stroke="black"></rect><rect x="428" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="448" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="468" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="488" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="508" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="528" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="548" y="224" width="20" height="20" fill="{}" stroke="black"></rect><rect x="428" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="448" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="468" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="488" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="508" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="528" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="548" y="244" width="20" height="20" fill="{}" stroke="black"></rect><rect x="428" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="448" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="468" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="488" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="508" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="528" y="264" width="20" height="20" fill="{}" stroke="black"></rect><rect x="548" y="264" width="20" height="20" fill="{}" stroke="black"></rect></g></svg>',
  pyram:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 138 119" style="stroke-linejoin:round;"><g><polygon points="0 2, 10 19.32050807568877, 20 2" fill="{}" stroke="black"></polygon><polygon points="10 19.32050807568877, 20 2, 30 19.32050807568877" fill="{}" stroke="black"></polygon><polygon points="20 2, 30 19.32050807568877, 40 2" fill="{}" stroke="black"></polygon><polygon points="30 19.32050807568877, 40 2, 50 19.32050807568877" fill="{}" stroke="black"></polygon><polygon points="40 2, 50 19.32050807568877, 60 2" fill="{}" stroke="black"></polygon><polygon points="52 19.32050807568877, 62 2, 72 19.32050807568877" fill="{}" stroke="black"></polygon><polygon points="64 2, 74 19.32050807568877, 84 2" fill="{}" stroke="black"></polygon><polygon points="74 19.32050807568877, 84 2, 94 19.32050807568877" fill="{}" stroke="black"></polygon><polygon points="84 2, 94 19.32050807568877, 104 2" fill="{}" stroke="black"></polygon><polygon points="94 19.32050807568877, 104 2, 114 19.32050807568877" fill="{}" stroke="black"></polygon><polygon points="104 2, 114 19.32050807568877, 124 2" fill="{}" stroke="black"></polygon><polygon points="10 19.32050807568877, 20 36.64101615137754, 30 19.32050807568877" fill="{}" stroke="black"></polygon><polygon points="20 36.64101615137754, 30 19.32050807568877, 40 36.64101615137754" fill="{}" stroke="black"></polygon><polygon points="30 19.32050807568877, 40 36.64101615137754, 50 19.32050807568877" fill="{}" stroke="black"></polygon><polygon points="42 36.64101615137754, 52 19.32050807568877, 62 36.64101615137754" fill="{}" stroke="black"></polygon><polygon points="52 19.32050807568877, 62 36.64101615137754, 72 19.32050807568877" fill="{}" stroke="black"></polygon><polygon points="62 36.64101615137754, 72 19.32050807568877, 82 36.64101615137754" fill="{}" stroke="black"></polygon><polygon points="74 19.32050807568877, 84 36.64101615137754, 94 19.32050807568877" fill="{}" stroke="black"></polygon><polygon points="84 36.64101615137754, 94 19.32050807568877, 104 36.64101615137754" fill="{}" stroke="black"></polygon><polygon points="94 19.32050807568877, 104 36.64101615137754, 114 19.32050807568877" fill="{}" stroke="black"></polygon><polygon points="20 36.64101615137754, 30 53.96152422706631, 40 36.64101615137754" fill="{}" stroke="black"></polygon><polygon points="32 53.96152422706631, 42 36.64101615137754, 52 53.96152422706631" fill="{}" stroke="black"></polygon><polygon points="42 36.64101615137754, 52 53.96152422706631, 62 36.64101615137754" fill="{}" stroke="black"></polygon><polygon points="52 53.96152422706631, 62 36.64101615137754, 72 53.96152422706631" fill="{}" stroke="black"></polygon><polygon points="62 36.64101615137754, 72 53.96152422706631, 82 36.64101615137754" fill="{}" stroke="black"></polygon><polygon points="72 53.96152422706631, 82 36.64101615137754, 92 53.96152422706631" fill="{}" stroke="black"></polygon><polygon points="84 36.64101615137754, 94 53.96152422706631, 104 36.64101615137754" fill="{}" stroke="black"></polygon><polygon points="32 55.96152422706631, 42 73.28203230275508, 52 55.96152422706631" fill="{}" stroke="black"></polygon><polygon points="42 73.28203230275508, 52 55.96152422706631, 62 73.28203230275508" fill="{}" stroke="black"></polygon><polygon points="52 55.96152422706631, 62 73.28203230275508, 72 55.96152422706631" fill="{}" stroke="black"></polygon><polygon points="62 73.28203230275508, 72 55.96152422706631, 82 73.28203230275508" fill="{}" stroke="black"></polygon><polygon points="72 55.96152422706631, 82 73.28203230275508, 92 55.96152422706631" fill="{}" stroke="black"></polygon><polygon points="42 73.28203230275508, 52 90.60254037844385, 62 73.28203230275508" fill="{}" stroke="black"></polygon><polygon points="52 90.60254037844385, 62 73.28203230275508, 72 90.60254037844385" fill="{}" stroke="black"></polygon><polygon points="62 73.28203230275508, 72 90.60254037844385, 82 73.28203230275508" fill="{}" stroke="black"></polygon><polygon points="52 90.60254037844385, 62 107.92304845413263, 72 90.60254037844385" fill="{}" stroke="black"></polygon></g></svg>',
  'minx-ll': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 210 210" style="stroke-linejoin:round;"><g><polygon points="80.2229123600034,132.367048291092 68,94.7487921443737 100,71.4994312482022 132,94.7487921443737 119.777087639997,132.367048291092" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="119.777087639997,132.367048291092 106.513112147391,173.19828709199 93.4868878526086,173.19828709199 80.2229123600034,132.367048291092" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="119.777087639997,132.367048291092 162.708697210182,132.36980465773 149.442719099992,173.19828709199 106.513112147391,173.19828709199" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="132,94.7487921443737 166.73402188981,119.981129159454 162.708697210182,132.36980465773 119.777087639997,132.367048291092" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="132,94.7487921443737 145.26921841351,53.9192568717434 180,79.1526467251942 166.73402188981,119.981129159454" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="100,71.4994312482022 134.73078158649,46.2626343382162 145.26921841351,53.9192568717434 132,94.7487921443737" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="100,71.4994312482022 65.2692184135095,46.2626343382162 100,21.0292444847653 134.73078158649,46.2626343382162" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="68,94.7487921443737 54.7307815864905,53.9192568717434 65.2692184135095,46.2626343382162 100,71.4994312482022" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="68,94.7487921443737 33.2659781101904,119.981129159454 20,79.1526467251942 54.7307815864905,53.9192568717434" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="80.2229123600034,132.367048291092 37.2913027898181,132.36980465773 33.2659781101904,119.981129159454 68,94.7487921443737" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="80.2229123600034,132.367048291092 93.4868878526086,173.19828709199 50.5572809000084,173.19828709199 37.2913027898181,132.36980465773" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="50.5572809000084,173.19828709199 38.1966011250105,190.211303259031 85.1671842700026,190.211303259031 93.4868878526086,173.19828709199" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="106.513112147391,173.19828709199 93.4868878526086,173.19828709199 85.1671842700025,190.211303259031 114.832815729997,190.211303259031" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="149.442719099992,173.19828709199 161.80339887499,190.211303259031 114.832815729997,190.211303259031 106.513112147391,173.19828709199" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="149.442719099992,173.19828709199 161.80339887499,190.211303259031 176.318107302494,145.539624084803 162.708697210182,132.36980465773" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="166.73402188981,119.981129159454 162.708697210182,132.36980465773 176.318107302494,145.539624084803 185.485291572496,117.325931974764" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="180,79.1526467251942 200,72.6542528005361 185.485291572496,117.325931974764 166.73402188981,119.981129159454" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="180,79.1526467251942 200,72.6542528005361 162,45.0456367363323 145.26921841351,53.9192568717434" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="134.73078158649,46.2626343382162 145.26921841351,53.9192568717434 162,45.0456367363323 138,27.6086160642037" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="100,21.0292444847653 100,0 138,27.6086160642037 134.73078158649,46.2626343382162" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="100,21.0292444847653 100,0 62,27.6086160642037 65.2692184135095,46.2626343382162" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="54.7307815864905,53.9192568717434 65.2692184135095,46.2626343382162 62,27.6086160642037 38,45.0456367363324" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="20,79.1526467251942 0,72.6542528005361 38,45.0456367363324 54.7307815864905,53.9192568717434" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="20,79.1526467251942 0,72.6542528005361 14.514708427504,117.325931974764 33.2659781101904,119.981129159454" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="37.2913027898181,132.36980465773 33.2659781101904,119.981129159454 14.514708427504,117.325931974764 23.6818926975065,145.539624084803" stroke="#1E1E1E" stroke-width="4" fill="{}"/><polygon points="50.5572809000084,173.19828709199 38.1966011250105,190.211303259031 23.6818926975065,145.539624084803 37.2913027898181,132.36980465773" stroke="#1E1E1E" stroke-width="4" fill="{}"/></g></svg>`,
};

const drawCube = ({ colorScheme, state, size }) => {
  const color = getColor(colorScheme);
  const coloredState = map(color, state);

  return formatStringForSize(coloredState)(size);
};

const getColor = ({ U, R: Right, F, D, L, B }) =>
  cond([
    [includes(__, ['U', 0]), always(U)],
    [includes(__, ['R', 1]), always(Right)],
    [includes(__, ['F', 2]), always(F)],
    [includes(__, ['D', 3]), always(D)],
    [includes(__, ['L', 4]), always(L)],
    [T, always(B)],
  ]);

const formatStringForSize = (list) =>
  ifElse(
    includes(__, range(2, 8)),
    (x) => formatString(list)(prop(x, templates)),
    () => console.error('Size not supported')
  );

const formatString = flip(reduce(flip(replace('{}'))));

const drawPyram = ({ colorScheme, state }) => {
  const color = getColor$1(colorScheme);

  const coloredState = map(color, state);

  return formatString$1(coloredState);
};

const getColor$1 = ({ L, F, R: Right, D }) =>
  cond([
    [includes(__, ['L', 0]), always(L)],
    [includes(__, ['F', 1]), always(F)],
    [includes(__, ['R', 2]), always(Right)],
    [T, always(D)],
  ]);

const formatString$1 = reduce(flip(replace('{}')), prop('pyram', templates));

const drawMegaminxLL = ({ colorScheme, state }) => {
  const color = getColor$2(colorScheme);

  const coloredState = map(color, state);

  return formatString$2(coloredState);
};

const getColor$2 = ({ U, R: Right, F, L, Bl, Br }) =>
  cond([
    [equals(0), always(U)],
    [equals(1), always(F)],
    [equals(2), always(Right)],
    [equals(3), always(Br)],
    [equals(4), always(Bl)],
    [T, always(L)],
  ]);

const formatString$2 = reduce(flip(replace('{}')), prop('minx-ll', templates));

class CubePreview {
  constructor() {
    this.colorScheme = {
      cube: {
        U: 'white',
        R: 'red',
        F: 'green',
        D: 'yellow',
        L: 'orange',
        B: 'blue',
      },
      pyram: {
        L: 'red',
        F: 'green',
        R: 'blue',
        D: 'yellow',
      },
      minx: {
        U: 'Black',
        R: 'Grey',
        F: 'Yellow',
        L: 'Orange',
        Bl: 'LightBlue',
        Br: 'Green',
      },
    };
    this.draw = {
      cube: drawCube,
      pyram: drawPyram,
      minx: drawMegaminxLL,
    };
    this.type = 'cube';
    this.size = 3;
  }

  setType(type) {
    this.type = type;
    this.size = type / 111;

    return this;
  }

  setColorScheme(colorScheme) {
    this.colorScheme[this.type] = mergeAll([
      this.colorScheme[this.type],
      colorScheme,
    ]);
    return this;
  }

  svgString(state) {
    return pathOr(
      this.draw.cube,
      [this.type],
      this.draw
    )({
      colorScheme: pathOr(this.colorScheme.cube, [this.type], this.colorScheme),
      size: this.size,
      state,
    });
  }
}

module.exports = CubePreview;
