module.exports = {
  clearMocks: true,
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ["node_modules"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testEnvironment: 'node',
  preset: 'ts-jest',
  // globalSetup: './tests/config.ts'
};
