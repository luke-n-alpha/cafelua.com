import nextJest from 'next/jest';

const createJestConfig = nextJest({ dir: './' });

const config = {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    testPathIgnorePatterns: ['<rootDir>/tests/e2e/']
};

export default createJestConfig(config);
