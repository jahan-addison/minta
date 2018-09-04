# Minta
> Simple, effective, pattern matcher.

## What is pattern matching?

> Pattern matching is the act of checking a given sequence of tokens for the presence of the constituents of some pattern. In contrast to pattern recognition, the match usually has to be **exact**. The patterns have the form of either sequences or tree structures. Uses of pattern matching include outputting the locations (if any) of a pattern within a token sequence, to output some component of the matched pattern, and to substitute the matching pattern with some other token sequence (i.e., search and replace).

## Details

Minta was inspired by the pattern matching systems in Rust, Haskell, and other modern languages.

To build the project, run `npm run build`.
To run the test suite, run `npm test`.

Minta provides a utility `match` function:
>  `match(pattern: Pattern, passthrough?: boolean): (...cases: Array<Pattern | Callback>) => any`

The applied function takes an **odd** number of ( `Pattern` case,     `callback(value)` ) pairs, with the last `callback`being the default case. The syntax fairly resembles [rust's pattern matching](https://doc.rust-lang.org/1.6.0/book/patterns.html).

When `passthrough` is `true`, cases that match will apply on the transformed values, useful for building parsers.

### Real world examples

```javascript
// clamp
const a = match(value) (
  value < min, _ => min,
  value < max, _ => value,
  _ => max
);
```

```javascript
// fib
function fib(n) {
  return match(n) (
    0, x => 1,
    1, x => 1,
    n >= 2, x => fib(x-1) + fib(x-2),
    _ => n
  );
}
```

```javascript
// passthrough (parsing)
const a = match([1,2,3], true) (
  ['a','b','c'], _ => ['abc']
  [1,2,3],       _ => [123],
  [123],         _ => [5]
  _ => 0
); // [5]
```

```javascript
// class cases
class Example {
  do() {
    return 'thing';
  }
}
const example = new Example();
const action = match(example) (
  RegExp,  () => 'a regex',
  String,  () => 'a string',
  Example, (e) => e.do(),
  () => false
); // 'thing'
```

## License

> Apache 2.0
