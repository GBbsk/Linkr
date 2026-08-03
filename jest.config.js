module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    setupFilesAfterEnv: ['./__tests__/setup.js'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.js', '!src/index.js'],
    testTimeout: 10000,
}