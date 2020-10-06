module.exports = {
    verbose: true,
    collectCoverage: true,
    coverageDirectory: './tests/coverage/',
    globalSetup: './tests/setup.js',
    globalTeardown: './tests/teardown.js',
    testEnvironment: './tests/mongo-test-environment.js',
    collectCoverageFrom: [
        '**/*.{js,jsx}',
        '!**/config/**',
        '!**/jest.config.*',
        '!**/node_modules/**',
        '!**/models/**',
        '!**/schemas/**',
        '!**/scripts/**',
        '!**/tests/**',
    ],
};
