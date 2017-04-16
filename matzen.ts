type callback  = (_: value) => any;
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
    return Value.toValue(this.x.map(g));
  }
  public apply(g: callback): Value {
    return Value.toValue(g(this.x));
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
  public default(g: callback = identity, only: boolean = true): any {
    return this._(g, only);
  }

  public _(g: callback = identity, only: boolean = true): any {
    if(!this.matched) {
      this.value = g ? this.value.apply(g) : this.value.apply(identity);
    }
    return only ? this.value.read()[0] : this.value.read();
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

type matchCallback = (matched: Match, value?: any) => any;

export function match(pattern: any, g: matchCallback, fallthrough: boolean = false): any {
  const tuple = <value>Array.prototype.concat.call([], pattern);
  const ref   = new Match(tuple, fallthrough);
  return g.call(ref, ref, pattern);
}

/*
  // Simple:
  const a = match([1,2,3], pattern => {
    return pattern
      .case([1,2,3], _ => 2)
      .default()
  });
  // 2
  console.log(a);

  // Clamp:
  const min = 200;
  const max = 500;
  const b   = match(723, (pattern, z) => {
    return pattern
      .case(z < min, _ => min)
      .case(z < max, _ => z)
      ._(z => max) // default alias
  });
  // 500
  console.log(b);
*/