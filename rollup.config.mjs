import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import { rmSync } from "node:fs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import cleanup from "rollup-plugin-cleanup";
const isProduction = !process.env.ROLLUP_WATCH;
try {
  rmSync("dist", { recursive: true });
} catch (er) {}
export default defineConfig({
  input: "./src/index.ts",
  plugins: [
    nodeResolve({ exportConditions: ["node"], preferBuiltins: true }),
    commonjs(),
    typescript(),
    json(),
    isProduction && cleanup(),
  ],
  external: ["typescript", "esbuild"],
  output: {
    format: "esm",
    chunkFileNames: "[name].js",
    dir: "dist",
  },
});
