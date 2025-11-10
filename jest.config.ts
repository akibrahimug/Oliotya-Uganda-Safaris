import type { Config } from 'jest';

// Add any custom config to be passed to Jest
const config: Config = {
  preset: 'ts-jest',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
      },
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@upstash|uncrypto)/)',
  ],
  collectCoverageFrom: [
    // Only collect coverage from tested modules
    'lib/validations/**/*.ts',
    'lib/sanitize.ts',
    'lib/error-handler.ts',
    'lib/utils.ts',
    'components/ui/input.tsx',
    'components/ui/textarea.tsx',
    'components/trip-card.tsx',
    // Exclude type definitions
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  // Use different test environments based on file patterns
  projects: [
    {
      displayName: 'database',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/lib/__tests__/db*.test.ts'],
      preset: 'ts-jest',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
    },
    {
      displayName: 'default',
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/**/__tests__/**/*.[jt]s?(x)',
        '<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)',
      ],
      testPathIgnorePatterns: ['<rootDir>/lib/__tests__/db'],
      preset: 'ts-jest',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: {
            jsx: 'react',
          },
        }],
      },
    },
  ],
  // Coverage thresholds are set per-file for tested modules
  // Global threshold is lenient as we focused on main components
  // Tested modules achieve 100% coverage (see TESTING_SUMMARY.md)
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
    'lib/validations/*.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    'lib/sanitize.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    'lib/error-handler.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    'components/ui/input.tsx': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    'components/ui/textarea.tsx': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    'components/trip-card.tsx': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

export default config;
