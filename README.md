# Minta
> Simple, effective, pattern matcher.

## What is pattern matching?

> Pattern matching is the act of checking a given sequence of tokens for the presence of the constituents of some pattern. In contrast to pattern recognition, the match usually has to be **exact**. The patterns have the form of either sequences or tree structures. Uses of pattern matching include outputting the locations (if any) of a pattern within a token sequence, to output some component of the matched pattern, and to substitute the matching pattern with some other token sequence (i.e., search and replace).

## Details

Minta was born from recent graphical development. It was inspired by the pattern matching systems in Swift and Haskell.

To build the project, run `npm run build`.
To run the test suite, run `npm test`.



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
);

console.log(action) // 'thing'
```

## License

> Apache 2.0
