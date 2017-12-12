type Tuple = Array<any>;

export enum Types {
  Boolean = 1,
  Tuple,
  RegExp,
  Constructor,
  Primitive
};

function isTuple(x: any): boolean {
  return x.hasOwnProperty('length');
}

function is(x: any): Types {
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

function eq(x: Tuple, y: Tuple): boolean {
  if (x.length !== y.length) {
    return false;
  }
  return x.reduce((is: boolean, item: any, index: number) => {
    return is && item === y[index];
  }, true);
}

function apply(initial: any, test: any, application: Function): any {
  switch(is(test)) {
    case Types.Boolean:
      return test ? application(initial) : false;
    case Types.RegExp:
      return test.test(initial) ? application(initial) : false;
    case Types.Constructor:
      console.log(test.name, initial.constructor.name);
      return test.name === (initial.name || initial.constructor.name) ? application(initial) : false;
    case Types.Tuple:
      const t1 = Array.prototype.concat.apply([], [initial]);
      const t2 = Array.prototype.concat.apply([], [test]);
      return eq(t1, t2) ? application(initial) : false;
    default:
      return initial === test ? application(initial) : false;
    }

}

export function match(pattern: any, passthrough: boolean = false): any {
  return (...cases: any[]) => {
    let ret;
    if (!(cases.length % 2)) {
      throw new SyntaxError('length of patterns and cases must be odd');
    }
    for(let i = 0; i < cases.length - 1; i+=2) {
      if (passthrough) {
        let value = apply(i > 0 ? ret : pattern,
          cases[i+0],
          <Function>cases[i+1]);
        if (value) {
          ret = value;
        }
      } else {
        ret = apply(pattern, cases[i+0], <Function>cases[i+1]);
      }
      if (ret !== false && passthrough === false)
        break;
    }
    // apply the default callback
    if (!ret) {
      if (typeof cases[cases.length-1] !== 'function') {
        throw new SyntaxError('no default case callback was provided');
      }
      const defaultApply = <Function>cases[cases.length-1];
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

