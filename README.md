# Matzen
> Simple, functional, pattern matcher in TypeScript.


## What is pattern matching?


> Pattern matching is the act of checking a given sequence of tokens for the presence of the constituents of some pattern. In contrast to pattern recognition, the match usually has to be **exact**. The patterns have the form of either sequences or tree structures. Uses of pattern matching include outputting the locations (if any) of a pattern within a token sequence, to output some component of the matched pattern, and to substitute the matching pattern with some other token sequence (i.e., search and replace).

## Details

Matzen was born from recent graphical development. It was inspired by the pattern matching systems in Swift and Haskell.

You may use this project without typescript, and is installable via `npm install matzen`

To build the project, run `npm run build`.  
To run the test suite, run `npm test`.


## API

The package exports an easy-to-use `match` wrapper function which takes a primitive value or finite list (tuple). It allows you to individually match values, tuples, or conditions — and deal with their cases, while optionally 'passing-through' a newly parsed value to the next case.

Similar to Swift, each case chain **must** end with a `default` or (alias) `_()` call. By default, `_()` calls itself with the `identity` function, returning the last matched case value (or fall-through value). `default` may also be called with a final match case callback.

### Basic Examples

```javascript
const amount = 8;
const a = match(amount)
  .case(amount < 5, x => "You don't have enough to pay for that!")
  .case(5, x => "This is the right amount!")
  ._(x => "Too much money!");

console.log(a); // "Too much money!"
```

```javascript
const a = match([1,2,3])
  .case([1,2,3], x => [3,2,1], true) // fall-through as new value
  .case([3,2,1], x => [...x, true, false], true) // fall-through as new value
  ._();

console.log(a); // [3, 2, 1, true, false]
```

### Real world examples

```javascript
// clamp
const a = match(value)
  .case(value < min, _ => min)
  .case(value < max, _ => value)
  .default(_ => max)
});
```

```javascript
// fib
function fib(n) {
  return match(n)
    .case(0, x => 1)
    .case(1, x => 1)
    .case(n >= 2, x => fib(x-1) + fib(x-2))
    ._());
}
```

```javascript
const line = match(width)
  .case(width < 1200, n => 85.65 * height)
  .case(width > 1200 && v < 1600 && pixelRatio < 2, n => {
    return 85.65 * height;
  })
  .case(width > 1350 && pixelRatio >= 2, n => {
    return  72.75 * width
  })
  ._(n => 70.65 * width);

```

## License

> Apache 2.0
