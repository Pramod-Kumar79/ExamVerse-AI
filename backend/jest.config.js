const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",

  transform: {
    ...tsJestTransformCfg,
  },

  roots: ["<rootDir>/src"],

  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFiles: ["<rootDir>/src/__tests__/setup.ts"],

  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setupAfterEnv.ts"],

  moduleFileExtensions: ["ts", "js", "json"],

  clearMocks: true,

  setupFiles: ["<rootDir>/src/__tests__/setup.ts"],

  collectCoverage: false,

  collectCoverageFrom: ["src/**/*.ts", "!src/server.ts", "!src/**/*.d.ts"],

  coverageDirectory: "coverage",
};
