module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  coverageDirectory: "./coverage",
  collectCoverageFrom: ["src/**/*.js", "models/**/*.js", "controllers/**/*.js"],
};
