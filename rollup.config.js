import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import { externals } from "rollup-plugin-node-externals";

export default defineConfig({
  input: "./src/index.ts",
  plugins: [externals(), typescript()],
  output: {
    format: "es",
    dir: "dist",
  },
});
