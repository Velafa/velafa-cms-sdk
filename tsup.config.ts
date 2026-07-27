import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    next: "src/next/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "node18",
  external: ["next", "next/navigation"],
});
