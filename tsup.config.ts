import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/ast/index.ts",
    "src/style/index.ts",
    "src/utils/object.ts",
    "src/utils/collection.ts",
    "src/utils/dom.ts",
    "src/utils/path.ts",
    "src/utils/number.ts",
  ],
  dts: true,
  sourcemap: true,
  format: ["cjs", "esm"],
});
