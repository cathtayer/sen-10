const { add } = require('../src/utils.cjs');

test('intentional failing test: 2 + 2 equals 5 (failing test)', () => {
  // This test is intentionally wrong to demonstrate a failing test
  expect(add(2, 2)).toBe(4);
});
