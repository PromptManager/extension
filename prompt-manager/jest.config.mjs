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
    "^.+.tsx?$": ["ts-jest", {}],
    "^.+.jsx?$": ["ts-jest", {}]
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@plasmohq|pify)).+\\.js$"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
}

export default config