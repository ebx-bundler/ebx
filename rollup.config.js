import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import { externals } from "rollup-plugin-node-externals";
import { rmSync } from "node:fs";
import json from "@rollup/plugin-json";
try {
  rmSync("dist", { recursive: true });
} catch (er) {}
export default defineConfig({
  input: "./src/index.ts",
  plugins: [externals(), typescript(), json()],
  output: {
    format: "es",
    chunkFileNames: "[name].js",
    dir: "dist",
  },
});
