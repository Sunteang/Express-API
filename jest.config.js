module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/src/(.*)$": "<rootDir>/src/$1", 
  },
  testTimeout: 30000,
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
};
