# Matzen
> Simple, functional, pattern matcher in TypeScript.


## Details

matzen was created during the development of the graphical intricacies in my [new website](https://jahan.engineer). It was inspired by the pattern matching systems in Swift and Haskell. 

You may use this project without typescript, and is installable via `npm install matzen`

To build the project, run `npm run build`.  
To run the test suite, run `npm test`.


## API

The package exports an easy-to-use `match` wrapper function with the following signature:

```typescript
(pattern: any, g: matchCallback, fallthrough: boolean = false): any 
```

In `matchCallback` you are provided with a `Match` instance and the `pattern` to test against. The `pattern` internally is converted and treated as a tuple, and you may match individually nth-tuple values. You may chain cases with optionally passing-through after a match.

Similar to Swift, each case chain **must** end with a `default` or `_()` call. By default, `default` calls itself with the `identity` function, returning the last matched case; `default` also by default returns the 1st value of the `pattern` converted tuple. This is useful when matching on a simple value like a `number`.

Optionally, when the second argument of `default` is false, it will return the matching result of the entire tuple (the first arg can be `null` to use the last matched case). Useful when pattern matching on lists.

### Basic Example

```javascript
const a = match([1,2,3], pattern => {
  return pattern
    .case([1,2,3], _ => [3,2,1], true)       // passthrough
    .case([3,2,1], _ => [true, false], true) // passthrough
    .default(null, false)
});
console.log(a); // [true, false]
```

### Real world examples (excerpts from website)

```javascript
// clamp
const a   = match(723, (pattern, value) => {
  return pattern
    .case(value < min, _ => min)
    .case(value < max, _ => value)
    ._(z => max) // default alias
});
console.log(a); // 500
```

```javascript
const lineLength = match(width, (_,v) => {
  return _
  .case(v < 1200, n => (85.65/100) * height)
  .case(v > 1200 && v < 1600 && pixelRatio < 2, n => {
    return (85.65/100) * height;
  })
  .case(v > 1350 && pixelRatio >= 2, n => { // retina
    return  (72.75/100) * width
  })
  ._(n => (70.65/100) * width);
});
```

## License

> Apache 2.0