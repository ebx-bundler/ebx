import type { ConfigR } from "./types";

export const defaults: ConfigR = {
  outdir: "dist",
  outExtension: ".js",
  type: "commonjs",
  polyfills: [],
  inject: [],
  external: { include: [] },
  loader: {},
  clean: true,
  format: "cjs",
  ignoreTypes: false,
  import: [],
  minify: false,
  nodeOptions: [],
  reset: false,
  killSignal: "SIGTERM",
  run: false,
  tsconfig: "tsconfig.json",
  sourcemap: false,
  target: "",
  watch: false,
};
