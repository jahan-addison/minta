import test from 'ava';
import { match, Test, Types, NULLPTR } from './minta';

test.beforeEach(t => {
  t.context.data = {
    0: [1,2,3],
    1: 1,
    2: String,
    3: /tes?ting/,
    4: 5 === 5,
    5: "hello world"
  };
});
let called = 0;
function dumb(x: any, reset?: number) {
  called++;
  return 'yes';
}

test('#isTuple should return true on arrays', t => {
  t.true(Test.isTuple(t.context.data[0]));
  t.false(Test.isTuple(5));
})

test('#isTuple should return true on array-like objects', t => {
  t.true(Test.isTuple(t.context.data[5]))
  t.false(Test.isTuple(t.context.data));
});


test('#is should return the integer type', t => {
  const stubs = t.context.data;
  t.is(Test.is(stubs[4]), Types.Boolean);
  t.is(Test.is(stubs[3]), Types.RegExp);
  t.is(Test.is(stubs[2]), Types.Constructor);
  t.is(Test.is(stubs[0]), Types.Tuple);
  t.is(Test.is(stubs[5]), Types.Tuple);
  t.is(Test.is(stubs[1]), Types.Primitive);
})

test('#eq should return true shallow equality', t => {
  t.true(Test.eq(t.context.data[0], [1,2,3]));
  t.false(Test.eq(t.context.data[0], [1,2,4]));
  t.false(Test.eq(t.context.data[0], [1,2,3,4,5]));
});

test('#apply should apply function based on type and equality', t => {
  const apply = Test.apply;
  const stubs = t.context.data;
  called = 0;
  t.is(apply(stubs[0], [1,2,3], dumb), 'yes');
  t.is(apply(stubs[1], 1, dumb), 'yes');
  t.is(apply(stubs[2], String, dumb), 'yes');
  t.is(apply("testing", stubs[3], dumb), 'yes');
  t.is(apply(stubs[4], true, dumb), 'yes');
  t.is(apply(stubs[5], "hello world", dumb), 'yes');
  t.is(apply(stubs[0], [3,2,1], dumb), NULLPTR);
  t.is(called, 6);
});

test('#match should error with no default case', t => {
  t.throws(() => {
    return match('test') (
    'test', () => 5,
  )}, SyntaxError);
});

test('#match should work on null-like primitives values as patterns', t => {
  t.is(match(null) (
    undefined, ()   => 'no',
    null,      ()   => 'yes',
    _ => 'default'
  ), 'yes');
  t.is(match(0) (
    false, ()  => 'no',
    null,  ()  => 'no',
    0,     ()  => 'yes',
    _ => 'default'
  ), 'yes');
  t.is(match(undefined) (
    false, ()  => 'no',
    null, ()   => 'no',
    _ => 'default'
  ), 'default');
})

test('#match should only apply the first matched case', t => {
  t.is(match('test') (
    'test', () => 'yes',
    Number, () => 'no',
    _ => 'default'
  ), 'yes');
});

test('#match should apply the default if there were no matches', t => {
  t.is(match('test') (
    'abc', () => 'yes',
    'def', () => 'no',
    _ => 'default'
  ), 'default');
});

test('#match should apply all matched cases on passthrough', t => {
  t.is(match('test', true) (
    'test',  () => 'yes',
    'yes',   () => 'super',
    'silly', () => 'dumb',
    _ => 'default'
  ), 'super');
});
