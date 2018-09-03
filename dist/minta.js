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
function eq(x, y) {
    if (x.length !== y.length) {
        return false;
    }
    return x.reduce((is, item, index) => {
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
            return initial && test.name === (initial.name || initial.constructor.name) ? application(initial) : false;
        case Types.Tuple:
            const t1 = Array.prototype.concat.apply([], [initial]);
            const t2 = Array.prototype.concat.apply([], [test]);
            return eq(t1, t2) ? application(initial) : false;
        default:
            return initial === test ? application(initial) : false;
    }
}
function match(pattern, passthrough = false) {
    return (...cases) => {
        let ret;
        if (!(cases.length % 2)) {
            throw new SyntaxError('length of patterns and cases must be odd');
        }
        for (let i = 0; i < cases.length - 1; i += 2) {
            if (passthrough) {
                let value = apply(i > 0 ? ret : pattern, cases[i + 0], cases[i + 1]);
                if (value) {
                    ret = value;
                }
            }
            else {
                ret = apply(pattern, cases[i + 0], cases[i + 1]);
            }
            if (ret !== false && passthrough === false)
                break;
        }
        if (!ret) {
            if (typeof cases[cases.length - 1] !== 'function') {
                throw new SyntaxError('no default case callback was provided');
            }
            const defaultApply = cases[cases.length - 1];
            if (typeof defaultApply === 'function') {
                return defaultApply(pattern);
            }
        }
        return ret;
    };
}
exports.match = match;
exports.Test = {
    isTuple,
    is,
    apply,
    eq
};
