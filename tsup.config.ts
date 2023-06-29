import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/utils/object.ts",
    "src/utils/collection.ts",
    "src/utils/dom.ts",
    "src/utils/path.ts",
    "src/stores.ts",
    "src/compiler/index.ts",
    "src/definition/index.ts",
  ],
  dts: true,
  sourcemap: true,
  format: ["cjs", "esm"],
});
