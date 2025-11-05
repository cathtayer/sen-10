const { test, expect } = require("@jest/globals");
const { add } = require("../src/utils.cjs");

test("2 + 2 equals 4", () => {
  expect(add(2, 2)).toBe(4);
});
