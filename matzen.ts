type callback  = (_: any) => any;
type Tuple     = Array<any>;
export type value  = Tuple;

interface Matchable {
  case(x: any, g: callback, fallthrough?: false): Match;
     _(g: callback, only: true): any;
}

function identity<T>(_: T): T {
  return _;
}

export class Value {
  public static toValue(x) {
    return new Value(Array.prototype.concat.call([], x) as value);
  }

  constructor(x: value) {
    this.x = x;
  }
  public eq(e: Value): boolean {
    return this.x.reduce((a,b,i,g) => a !== false && g[i] === e.read()[i], true);
  }
  public map(g: callback): Value {
    return new Value(this.x.map(g));
  }
  public apply(g: callback): Value {
    return Value.toValue(g(this.x.length > 1 ? this.x : this.x[0]));
  }
  public read(): value {
    return this.x;
  }
  x: value;
}

export class Match implements Matchable {
  constructor(x: value, fallthrough: boolean = false) {
    this.x           = x;
    this.matched     = false;
    this.fallthrough = fallthrough;
    this.value       = Value.toValue(x);
  }
  public case(x: any, g: callback, fallthrough: boolean = false): Match {
    if (typeof x === 'boolean') {
      if (x) {
        if (this.isFallable(fallthrough)) {
          this.matched = true;
          this.value   = this.value.apply(g);
        }
      }
    } else {
      if (this.value.eq(Value.toValue(x))) {
        if (this.isFallable(fallthrough)) {
          this.matched = true;
          this.value   = this.value.apply(g);
        }
      }
    }
    return this;
  }
  public default(g: callback = identity): any {
    return this._(g);
  }

  public _(g: callback = identity): any {
    if(!this.matched) {
      this.value = g ? this.value.apply(g) : this.value.apply(identity);
    }
    return this.value.read().length > 1 ? this.value.read() : this.value.read()[0];
  }

  protected isFallable(fallthrough?: boolean): boolean {
    return !this.matched || (fallthrough || this.fallthrough);
  }
  x: value;
  fallthrough: boolean;
  matched: boolean;
  value: Value;
  get val(): value {
    return this.x;
  }
}

export function match(pattern: any, fallthrough: boolean = false): any {
  const tuple = <value>Array.prototype.concat.call([], pattern);
  return new Match(tuple, fallthrough);
}
