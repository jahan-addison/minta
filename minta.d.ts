/**
 * Minta functional pattern matcher
 */
declare module 'minta' {
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
   * Extend Function type for the Object.property.name that exists on all objects.
   */
  interface Function {
    name: string;
  }

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
  export function match(pattern: any, passthrough?: boolean): (...cases: Array<Pattern | Callback>) => any;

  /**
   * Tuple type
   */

  export type Tuple     = Array<any>;

  /**
   * Primitive type
   */

  export type Primitive = string | number | undefined | null;

  /**
   * Constructor type
   */

  export interface Constructor {
    constructor(): any;
  }

  /**
   * A Pattern
   */

  export type Pattern  = Tuple | boolean | Function | Primitive | Constructor | RegExp;

  /**
   * A Callback
   */

  export type Callback = (item?: Pattern) => Pattern

}
