module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/config$': '<rootDir>/src/__mocks__/config.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(svg|png|jpg|jpeg|gif|webp|ico)$':
      '<rootDir>/src/__mocks__/fileMock.cjs',
  },
  setupFilesAfterEnv: ['./src/test/setup.ts'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  testPathIgnorePatterns: ['/node_modules/', '\\.integration\\.'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};
