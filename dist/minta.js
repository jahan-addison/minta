(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * Enum of match types
     */
    var Types;
    (function (Types) {
        Types[Types["Boolean"] = 1] = "Boolean";
        Types[Types["Tuple"] = 2] = "Tuple";
        Types[Types["RegExp"] = 3] = "RegExp";
        Types[Types["Constructor"] = 4] = "Constructor";
        Types[Types["Primitive"] = 5] = "Primitive";
    })(Types = exports.Types || (exports.Types = {}));
    /**
     * An object reference to be used as 'null' without collision with `pattern'
     */
    exports.NULLPTR = Object.create(null);
    /**
     * Is this a tuple? (n-array). We use hasOwnPropery length to also
     * check for strings and array-like objects.
     *
     * @param x a Pattern to test
     * @returns is array
     */
    function isTuple(x) {
        return x && x.hasOwnProperty('length');
    }
    /**
     * Get type of a pattern
     *
     * @param x pattern
     * @returns type
     */
    function is(x) {
        if (typeof x === 'boolean')
            return Types.Boolean;
        if (x instanceof RegExp)
            return Types.RegExp;
        if (typeof x === 'function' && x.constructor.name)
            return Types.Constructor;
        if (isTuple(x))
            return Types.Tuple;
        return Types.Primitive;
    }
    /**
     * Are 2 tuples equal?
     * @param x first tuple
     * @param y second tuple
     * @returns if tuples match
     */
    function eq(x, y) {
        if (x.length !== y.length) {
            return false;
        }
        return x.reduce(function (is, item, index) {
            return is && item === y[index];
        }, true);
    }
    /**
     * Apply a function on a pattern type match
     *
     * @param initial pattern
     * @param test test type to compare
     * @param application function to apply
     * @returns the applicative value
     */
    function apply(initial, test, application) {
        switch (is(test)) {
            case Types.Boolean:
                return test ? application(initial) : exports.NULLPTR;
            case Types.RegExp:
                return test.test(initial) ? application(initial) : exports.NULLPTR;
            case Types.Constructor:
                return initial && test.name === (initial.name || initial.constructor.name) ? application(initial) : exports.NULLPTR;
            case Types.Tuple:
                var t1 = Array.prototype.concat.apply([], [initial]);
                var t2 = Array.prototype.concat.apply([], [test]);
                return eq(t1, t2) ? application(initial) : exports.NULLPTR;
            default:
                return initial === test ? application(initial) : exports.NULLPTR;
        }
    }
    /**
     * Pattern matcher
     *
     * @param pattern The base value to match against.
     * @param passthrough The option to continue after a match, useful for parsing
     * @return Returns a function that invokes pairs of (case, callback) and a default case callback
     * whereby each 'case' is checked against the base pattern, and 'callback' is returned on a match.
     * Note that when 'passthrough' is true, the base pattern is changed for every matched case in-order.
     *
     */
    function match(pattern, passthrough) {
        if (passthrough === void 0) { passthrough = false; }
        return function () {
            var cases = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                cases[_i] = arguments[_i];
            }
            var ret = exports.NULLPTR;
            if (!(cases.length % 2)) {
                throw new SyntaxError('length of patterns and cases must be odd');
            }
            for (var i = 0; i < cases.length - 1; i += 2) {
                if (passthrough) {
                    var value = apply(i > 0 ? ret : pattern, cases[i + 0], cases[i + 1]);
                    if (value !== exports.NULLPTR) {
                        ret = value;
                    }
                }
                else {
                    ret = apply(pattern, cases[i + 0], cases[i + 1]);
                }
                if (ret !== exports.NULLPTR && passthrough === false)
                    break;
            }
            // apply the default callback
            if (ret === exports.NULLPTR) {
                if (typeof cases[cases.length - 1] !== 'function') {
                    throw new SyntaxError('no default case callback was provided');
                }
                var defaultApply = cases[cases.length - 1];
                if (typeof defaultApply === 'function') {
                    return defaultApply(pattern);
                }
            }
            return ret;
        };
    }
    exports.match = match;
    // method testing:
    exports.Test = {
        isTuple: isTuple,
        is: is,
        apply: apply,
        eq: eq
    };
});
