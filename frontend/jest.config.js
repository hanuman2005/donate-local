module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  coverageDirectory: "./coverage",
  collectCoverageFrom: ["src/**/*.js", "src/**/*.jsx"],
};
