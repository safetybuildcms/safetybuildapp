// this seems to work on both mac and windows
let transformIgnorePatterns = process.platform === 'win32' ? [`\.\.node_modules/\\.pnpm/\\@react-native`] : []

module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.js'],

  projects: [
    {
      preset: 'jest-expo',
      setupFilesAfterEnv: ['./jest.setup.js'],
      transformIgnorePatterns,
      displayName: 'unit',
      testMatch: [
        '**/src/screens/*.test.tsx',
        '**/src/components/*.test.tsx',
        '**/src/navigation/*.test.tsx',
        '**/src/libs/*.test.tsx'
      ],
      testPathIgnorePatterns: ['/node_modules/', 'src/tests/integration/']
    },
    {
      preset: 'jest-expo',
      setupFilesAfterEnv: ['./jest.setup.js'],
      // transformIgnorePatterns: [`node_modules/.pnpm/@react-native`],
      transformIgnorePatterns,
      displayName: 'integration',
      testMatch: ['**/tests/integration/**/*.test.ts']
    }
  ]
}
