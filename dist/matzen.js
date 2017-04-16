"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function identity(_) {
    return _;
}
class Value {
    static toValue(x) {
        return new Value(Array.prototype.concat.call([], x));
    }
    constructor(x) {
        this.x = x;
    }
    eq(e) {
        return this.x.reduce((a, b, i, g) => a !== false && g[i] === e.read()[i], true);
    }
    map(g) {
        return Value.toValue(this.x.map(g));
    }
    apply(g) {
        return Value.toValue(g(this.x));
    }
    read() {
        return this.x;
    }
}
exports.Value = Value;
class Match {
    constructor(x, fallthrough = false) {
        this.x = x;
        this.matched = false;
        this.fallthrough = fallthrough;
        this.value = Value.toValue(x);
    }
    case(x, g, fallthrough = false) {
        if (typeof x === 'boolean') {
            if (x) {
                if (this.isFallable(fallthrough)) {
                    this.matched = true;
                    this.value = this.value.apply(g);
                }
            }
        }
        else {
            if (this.value.eq(Value.toValue(x))) {
                if (this.isFallable(fallthrough)) {
                    this.matched = true;
                    this.value = this.value.apply(g);
                }
            }
        }
        return this;
    }
    default(g = identity, only = true) {
        return this._(g, only);
    }
    _(g = identity, only = true) {
        if (!this.matched) {
            this.value = g ? this.value.apply(g) : this.value.apply(identity);
        }
        return only ? this.value.read()[0] : this.value.read();
    }
    isFallable(fallthrough) {
        return !this.matched || (fallthrough || this.fallthrough);
    }
    get val() {
        return this.x;
    }
}
exports.Match = Match;
function match(pattern, g, fallthrough = false) {
    const tuple = Array.prototype.concat.call([], pattern);
    const ref = new Match(tuple, fallthrough);
    return g.call(ref, ref, pattern);
}
exports.match = match;
