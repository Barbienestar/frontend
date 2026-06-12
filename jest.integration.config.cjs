module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/config$': '<rootDir>/src/__mocks__/config.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(svg|png|jpg|jpeg|gif|webp|ico)$':
      '<rootDir>/src/__mocks__/fileMock.cjs',
  },
  setupFilesAfterEnv: ['./src/test/setup.integration.ts'],
  testMatch: ['**/*.integration.test.{ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};
