import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/utils/index.ts",
    "src/dom/index.ts",
    "src/guard.ts",
    "src/path.ts",
    "src/stores.ts",
    "src/compiler/index.ts",
    "src/definition/index.ts",
  ],
  dts: true,
  sourcemap: true,
  format: ["cjs", "esm"],
});
