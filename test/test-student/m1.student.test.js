/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Imporant: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
*/

// const distribution = require('../../config.js');
const distribution = require('../../distribution');


test('(1 pts) student test', () => {
  // Fill out this test case...
  
  // Triple nest object case
  let object = {a: {b: {c: 1}}};
  const serialized = distribution.util.serialize(object);
  const deserialized = distribution.util.deserialize(serialized);
  expect(deserialized).toEqual(object);
});


test('(1 pts) student test', () => {
  // Fill out this test case...
  
  // Test Javascript's NaN
  let object = {a: NaN};
  const serialized = distribution.util.serialize(object);
  const deserialized = distribution.util.deserialize(serialized);
  expect(deserialized).toEqual(object);
});


test('(1 pts) student test', () => {
  // Fill out this test case...
  
  // Test Javascript's Infinity
  let object = {a: Infinity};
  const serialized = distribution.util.serialize(object);
  const deserialized = distribution.util.deserialize(serialized);
  expect(deserialized).toEqual(object);
});

test('(1 pts) student test', () => {
  // Fill out this test case...
    
  // Test array with missing indices
  let object = [1, , 3];
  const serialized = distribution.util.serialize(object);
  const deserialized = distribution.util.deserialize(serialized);
  expect(deserialized).toEqual(object);
});

test('(1 pts) student test', () => {
  // Fill out this test case...
  
  // Test object with weird values
  let object = {a: NaN, b: Infinity, c: [-Infinity]};
  const serialized = distribution.util.serialize(object);
  const deserialized = distribution.util.deserialize(serialized);
  expect(deserialized).toEqual(object);
});
