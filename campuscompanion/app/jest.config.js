/**
 * Jest configuration for the frontend
 * This configuration sets up the testing environment for the project
 * @author Arul Sharma
 */
module.exports = {
  // Use ts-jest preset to compile TypeScript files in tests.
  preset: "ts-jest",

  // Set the test environment to jsdom to simulate the browser environment.
  testEnvironment: "jsdom",

  // Automatically configure or reset the testing framework before each test.
  // Here, it imports custom matchers from jest-dom to extend jest's assertions.
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Configure Jest to handle module aliases, allowing for cleaner import statements.
  // This maps any import starting with "@components/" to the app/components directory.
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/app/components/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "\\.(css|less)$": "<rootDir>/jest/cssTransform.js",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  collectCoverageFrom: [
    "**/auth/page.{ts,tsx}", // Include all TypeScript and TSX files
    "**/chat/page.{ts,tsx}",
    "**/shib/page.{ts,tsx}",
    "**/mainSettings/layout.{ts,tsx}",
    "**/mainSettings/contactSupport/page.{ts,tsx}",
    "**/mainSettings/syllabi/page.{ts,tsx}",
    "**/mainSettings/transcript/page.{ts,tsx}",
    "!**/*.test.{ts,tsx}", // Exclude test files
    "!**/node_modules/**", // Exclude node_modules
    "!**/.next/**", // Exclude .next folder if using Next.js
    "!**/jest/**", // Exclude jest setup/config files
    "!**/vendor/**", // Exclude vendor directory if any
    "!**/*.d.ts", // Exclude TypeScript declaration files
  ],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
};
