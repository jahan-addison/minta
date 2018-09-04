declare module 'minta' {

  /**
   * Pattern matcher
   *
   * @param pattern The base pattern to match against. Can be one of 'Boolean', 'Tuple' (or array), 'RegExp', 'Constructor', or 'Primitive' (string, number, etc.)
   * @param passthrough The option to continue after a match, useful for parsing
   * @return Returns a function that invokes pairs of (case, callback) and a default case callback
   * whereby each 'case' is checked against the base pattern, and 'callback' is returned on a match.
   * Note that when 'passthrough' is true, the base pattern is changed for every matched case in-order.
   *
   */

  export function match(pattern: Pattern, passthrough?: boolean): (...cases: Array<Pattern | Callback>) => any;

  /**
   * Tuple type
   */

  type Tuple     = Array<any>;

  /**
   * Primitive type
   */

  type Primitive = string | number | undefined | null;

  /**
   * Constructor type
   */

  interface Constructor {
    new (): any;
  }

  /**
   * A Pattern
   */

  type Pattern  = Tuple | boolean | Primitive | Constructor | RegExp;

  /**
   * A Callback
   */

  type Callback = (item?: Pattern) => Pattern

}
