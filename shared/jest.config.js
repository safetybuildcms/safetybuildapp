/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}]
  }
}

// pnpm add -D ts-jest @types/jest @jest/globals  --filter=shared
