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
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: "<rootDir>/"
    }),
    // Mock the problematic modules
    "@plasmohq/storage/hook": "<rootDir>/tests/__mocks__/storageMock.ts"
  },
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": ["ts-jest", {
      useESM: true,
    }],
  },
  transformIgnorePatterns: [
    // Be more specific about what to transform
    "node_modules/(?!(@plasmohq|pify|.*\\.mjs$))"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node", "mjs"]
}

export default config