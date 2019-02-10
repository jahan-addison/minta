/**
 * Enum of match types
 */
export enum Types {
  Boolean = 1,
  Tuple,
  RegExp,
  Constructor,
  Primitive
}

/**
 * Tuple type
 */

export type Tuple     = Array<any>;

/**
 * Primitive type
 */

export type Primitive = string | number | null | undefined;

/**
 * Constructor type
 */

export interface Constructor {
  constructor: any;
}

/**
 * A Pattern
 */

export type Pattern  = Tuple | boolean | Function |  Primitive | Constructor | RegExp;
/**
 * A Callback
 */

export type Callback = (item?: Pattern) => Pattern

/**
 * An object reference to be used as 'null' without collision with `pattern'
 */
export const NULLPTR = Object.create(null);

/**
 * Is this a tuple? (n-array). We use hasOwnPropery length to also
 * check for strings and array-like objects.
 *
 * @param x a Pattern to test
 * @returns is array
 */
function isTuple(x: any): boolean {
  return x && x.hasOwnProperty('length');
}

/**
 * Get type of a pattern
 *
 * @param x pattern
 * @returns type
 */
function is(x: Pattern): Types {
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
function eq(x: Tuple, y: Tuple): boolean {
  if (x.length !== y.length) {
    return false;
  }
  return x.reduce((is: boolean, item: any, index: number) => {
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
function apply(initial: any, test: any, application: Callback): any {
  switch(is(test)) {
    case Types.RegExp:
      return test.test(initial) ? application(initial) : NULLPTR;
    case Types.Constructor:
      return initial && test.name === (initial.name || initial.constructor.name) ? application(initial) : NULLPTR;
    case Types.Tuple:
      const t1 = Array.prototype.concat.apply([], [initial]);
      const t2 = Array.prototype.concat.apply([], [test]);
      return eq(t1, t2) ? application(initial) : NULLPTR;
    default:
      return initial === test ? application(initial) : NULLPTR;
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
export function match(pattern: Pattern, passthrough: boolean = false): (...cases: Array<Pattern | Callback>) => any {
  return (...cases: Array<Pattern | Callback>): any => {
    let ret = NULLPTR;
    if (!(cases.length % 2)) {
      throw new SyntaxError('length of patterns and cases must be odd');
    }
    for(let i = 0; i < cases.length - 1; i+=2) {
      if (passthrough) {
        let value = apply(i > 0 ? ret : pattern,
          cases[i+0],
          <Callback>cases[i+1]);
        if (value !== NULLPTR) {
          ret = value;
        }
      } else {
        ret = apply(pattern, cases[i+0], <Callback>cases[i+1]);
      }
      if (ret !== NULLPTR && passthrough === false)
        break;
    }
    // apply the default callback
    if (ret === NULLPTR) {
      if (typeof cases[cases.length-1] !== 'function') {
        throw new SyntaxError('no default case callback was provided');
      }
      const defaultApply = <Callback>cases[cases.length-1];
      if (typeof defaultApply === 'function') {
        return defaultApply(pattern);
      }
    }
    return ret;
  }
}

// method testing:
export const Test = {
  isTuple,
  is,
  apply,
  eq
}