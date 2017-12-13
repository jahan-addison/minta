"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Types;
(function (Types) {
    Types[Types["Boolean"] = 1] = "Boolean";
    Types[Types["Tuple"] = 2] = "Tuple";
    Types[Types["RegExp"] = 3] = "RegExp";
    Types[Types["Constructor"] = 4] = "Constructor";
    Types[Types["Primitive"] = 5] = "Primitive";
})(Types = exports.Types || (exports.Types = {}));
;
function isTuple(x) {
    return x.hasOwnProperty('length');
}
function is(x) {
    if (typeof x === 'boolean') return Types.Boolean;
    if (x instanceof RegExp) return Types.RegExp;
    if (typeof x === 'function' && x.constructor.name) return Types.Constructor;
    if (isTuple(x)) return Types.Tuple;
    return Types.Primitive;
}
function eq(x, y) {
    if (x.length !== y.length) {
        return false;
    }
    return x.reduce(function (is, item, index) {
        return is && item === y[index];
    }, true);
}
function apply(initial, test, application) {
    switch (is(test)) {
        case Types.Boolean:
            return test ? application(initial) : false;
        case Types.RegExp:
            return test.test(initial) ? application(initial) : false;
        case Types.Constructor:
            return test.name === (initial.name || initial.constructor.name) ? application(initial) : false;
        case Types.Tuple:
            var t1 = Array.prototype.concat.apply([], [initial]);
            var t2 = Array.prototype.concat.apply([], [test]);
            return eq(t1, t2) ? application(initial) : false;
        default:
            return initial === test ? application(initial) : false;
    }
}
function match(pattern) {
    var passthrough = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    return function () {
        var ret = void 0;
        if (!(arguments.length % 2)) {
            throw new SyntaxError('length of patterns and cases must be odd');
        }
        for (var i = 0; i < arguments.length - 1; i += 2) {
            if (passthrough) {
                var value = apply(i > 0 ? ret : pattern, arguments.length <= i + 0 ? undefined : arguments[i + 0], arguments.length <= i + 1 ? undefined : arguments[i + 1]);
                if (value) {
                    ret = value;
                }
            } else {
                ret = apply(pattern, arguments.length <= i + 0 ? undefined : arguments[i + 0], arguments.length <= i + 1 ? undefined : arguments[i + 1]);
            }
            if (ret !== false && passthrough === false) break;
        }
        if (!ret) {
            var _ref, _ref2;

            if (typeof (_ref = arguments.length - 1, arguments.length <= _ref ? undefined : arguments[_ref]) !== 'function') {
                throw new SyntaxError('no default case callback was provided');
            }
            var defaultApply = (_ref2 = arguments.length - 1, arguments.length <= _ref2 ? undefined : arguments[_ref2]);
            if (typeof defaultApply === 'function') {
                return defaultApply(pattern);
            }
        }
        return ret;
    };
}
exports.match = match;
exports.Test = {
    isTuple: isTuple,
    is: is,
    apply: apply,
    eq: eq
};
