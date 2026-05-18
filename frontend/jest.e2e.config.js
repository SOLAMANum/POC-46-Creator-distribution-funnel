/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 60000,
  testMatch: ['**/__tests__/e2e/**/*.test.ts', '**/__tests__/e2e/**/*.test.js'],
};
