import { createRequire } from "module"
import { pathsToModuleNameMapper } from "ts-jest"

const require = createRequire(import.meta.url)
const tsconfig = require("./tsconfig.json")

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */

const config = {
  setupFiles: ["jest-webextension-mock"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testRegex: ["^.+\\.test.tsx?$"],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>/"
  }),
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": ["ts-jest", {
      useESM: true,
    }],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(.*\\.mjs$))"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node", "mjs"],
  // Add this to tell Jest to mock this module
  moduleDirectories: ["node_modules", "<rootDir>"]
}

export default config