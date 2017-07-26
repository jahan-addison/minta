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
    instanceOf(e) {
        return this.read()[0].constructor.name === e.name;
    }
    map(g) {
        return new Value(this.x.map(g));
    }
    apply(g) {
        return Value.toValue(g(this.x.length > 1 ? this.x : this.x[0]));
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
        else if (typeof x === 'function') {
            if (this.value.instanceOf(x)) {
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
    default(g = identity) {
        return this._(g);
    }
    _(g = identity) {
        if (!this.matched) {
            this.value = g ? this.value.apply(g) : this.value.apply(identity);
        }
        return this.value.read().length > 1 ? this.value.read() : this.value.read()[0];
    }
    isFallable(fallthrough) {
        return !this.matched || (fallthrough || this.fallthrough);
    }
    get val() {
        return this.x;
    }
}
exports.Match = Match;
function match(pattern, fallthrough = false) {
    const tuple = Array.prototype.concat.call([], pattern);
    return new Match(tuple, fallthrough);
}
exports.match = match;
