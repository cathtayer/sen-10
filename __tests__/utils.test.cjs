const { add, isEven } = require("../src/utils.cjs");

test("add: 1 + 2 equals 3 (passing test)", () => {
  expect(add(1, 2)).toBe(3);
});

test("isEven: 4 is even (passing test)", () => {
  expect(isEven(4)).toBe(true);
});
