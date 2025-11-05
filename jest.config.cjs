module.exports = {
  testEnvironment: 'node',
  // We're using .cjs files for modules/tests to avoid ESM/CJS complications in this repo
  testMatch: ['**/__tests__/**/*.cjs']
};
