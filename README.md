# Minta
> Simple, effective, functional pattern matcher.

## What is pattern matching?

> Pattern matching is the act of checking a given sequence of tokens for the presence of the constituents of some pattern. In contrast to pattern recognition, the match usually has to be **exact**. The patterns have the form of either sequences or tree structures. Uses of pattern matching include outputting the locations (if any) of a pattern within a token sequence, to output some component of the matched pattern, and to substitute the matching pattern with some other token sequence (i.e., search and replace).

## Details

Minta was inspired by the pattern matching systems in Rust, Haskell, and other resourceful languages.

To build the project, run `npm run build`.
To run the test suite, run `npm test`.

Minta provides a utility `match` function:
>  `match(pattern: Pattern, passthrough?: boolean): (...cases: <Pattern | Callback>) => any`

`Pattern` may be any primitive value (string, boolean, number, null, etc), an object (or constructor), an array (tuple), or a regex expression.

The applied function takes an **odd** number of ( `Pattern` case,     `callback(value)` ) pairs, and a last `callback`being the default case. The syntax fairly resembles [rust's pattern matching](https://doc.rust-lang.org/1.6.0/book/patterns.html).

When `passthrough` is `true`, cases that match will apply on the transformed values, useful for building parsers.

## How to use

Minta works without Typescript, of course, and may be installed with yarn or npm:

`yarn add minta`

or,

`npm install --save minta`.

Then you can import `match`:

```javascript
import { match } from 'minta';
const data = match(someValue()) (
  'the pattern', (e) => e + ' is this value',
  /another?/,     _  => 'that value',
  otherwise          => false
);
```

## Real world examples

```javascript
// clamp
const a = match(value) (
  value < min, _ => min,
  value < max, _ => value,
  otherwise      => max
);
```

```javascript
// fibonacci
function fib(n) {
  return match(n) (
    0, x => 1,
    1, x => 1,
    n >= 2, x => fib(x-1) + fib(x-2),
    otherwise => n
  );
}
```

```javascript
// regex matching
const type = match(fileType) (
  /\.js/,   () => 'javascript',
  /\.scss/, () => 'sass',
  /\.json/, () => 'json',
  /\.yml/,  () => 'yaml',
  otherwise    => 'json'
);
```

```javascript
// check for null-like values
const check = match(isNull()) (
  undefined, _ => 'undefined',
  false,     _ => 'false',
  null,      _ => 'null',
  otherwise    => 'default'
); // 'null'
```

```javascript
// passthrough (parsing)
const a = match([1,2,3], true) (
  ['a','b','c'], _ => ['abc']
  [1,2,3],       _ => [123],
  [123],         _ => [5]
  otherwise        => 0
); // [5]
```

```javascript
// class cases
class Example {
  do() {
    return 'example thing';
  }
}
const example = new Example();
const action = match(example) (
  RegExp,  ()  => 'a regex',
  String,  ()  => 'a string',
  Example, (e) => e.do(),
  otherwise    => false
); // 'example thing'
```

## License

> Apache 2.0
