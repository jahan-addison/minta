import test from 'ava';
import {Value, Match, match, value} from './matzen';

test.beforeEach(t => {
  t.context.data = {
    0: <value>[1,2,3],  1: 1,  2: new Value([1,2,3]),
    3: new Match([1,2,3]), 4: new Match([3,2,1], true)
  };
});

test('Value::toValue should return turn values into <value> tuples', t => {
  t.deepEqual(Value.toValue(t.context.data[0]), new Value([1,2,3]));
  t.deepEqual(Value.toValue(t.context.data[1]), new Value([1]));
});

test('Value#eq should give equality of Value\'s', t => {
	t.true(t.context.data[2].eq(new Value([1,2,3])));
	t.false(t.context.data[2].eq(new Value([3,2,1])));
});

test('Value#map should map function: callback to Value<value>', t => {
  t.deepEqual(t.context.data[2].map(x => ++x), new Value([2,3,4]))
});

test('Value#apply should apply function: callback to Value<value>', t => {
  t.deepEqual(t.context.data[2].apply(_ => 5), new Value([5]))
});

test('Value#read should read <value> data from Value<value', t => {
  t.deepEqual(t.context.data[2].read(), <value>[1,2,3]);
});

test('Match#case should apply function: callback on boolean pattern', t => {
  t.context.data[3].case(true, _ => [3,2,1]);
  t.deepEqual(t.context.data[3].value, new Value([3,2,1]));
});

test('Match#case should apply function: callback on boolean and not fall through by default', t => {
  t.context.data[3].case(true, _ => [3,2,1]);
  t.context.data[3].case(true, _ => [4,5,6]);
  t.deepEqual(t.context.data[3].value, new Value([3,2,1]));
});

test('Match#case should apply function: callback on boolean and can fall through', t => {
  t.context.data[3].case(true, _ => [3,2,1], true);
  t.context.data[3].case(true, _ => [4,5,6], true);
  t.deepEqual(t.context.data[3].value, new Value([4,5,6]));
});

test('Match#case should apply function: callback on equality of <value> tuple', t => {
  t.context.data[3].case(<value>[1,2,3], _ => [3,2,1]);
  t.deepEqual(t.context.data[3].value, new Value([3,2,1]));
});

test('Match#case should apply function: callback on equality of <value> tuple and not fall through by default', t => {
  t.context.data[3].case([1,2,3], _ => [3,2,1]);
  t.context.data[3].case([3,2,1], _ => [4,5,6]);
  t.deepEqual(t.context.data[3].value, new Value([3,2,1]));
});

test('Match#case should apply function: callback on equality of <value> tuple and can fall through', t => {
  t.context.data[3].case([1,2,3], _ => [3,2,1], true);
  t.context.data[3].case([3,2,1], _ => [true, false], true);
  t.deepEqual(t.context.data[3].value, new Value([true, false]));
});

test('Match#case should apply function: callback on 1st value of tuple on 1-tuple', t => {
  t.deepEqual(new Value([t.context.data[1]]).apply(_ => _ + 1), new Value([2]));
});

test('Match#case should apply function: callback and pass whole tuple when n > 1', t => {
  t.deepEqual(new Value(t.context.data[3]).apply(_ => [3,2,1]), new Value([3,2,1]));
});


test('Match#_ should apply identity by default and return 1st value on 1-tuple', t => {
  t.is(new Match([1])._(), 1);
});

test('Match#_ should apply function: callback and return 1st value of 1-tuple', t => {
  t.is(new Match([1])._(_ => 5), 5);
});

test('Match#_ should apply identity by default and can will tuple', t => {
  t.deepEqual(t.context.data[3]._(), [1,2,3]);
});

test('Match#isFallable should return whether matching instance falls through', t => {
  t.true(t.context.data[4].isFallable());
  // the case when a match has been met.
  t.true(t.context.data[3].isFallable());
  t.context.data[3].case([1,2,3], _ => [3,2,1]);
  t.false(t.context.data[3].isFallable());
  // a match was met, but fallthrough is overwritten
  t.true(t.context.data[3].isFallable(true));
});

// integration

test('match wrapper function', t => {
  t.deepEqual(match(5), new Match([5], false));
  t.deepEqual(match([1,2,3], true), new Match([1,2,3], true));
});
