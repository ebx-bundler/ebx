export type Polyfil = "cjs" | "decorators";
import type { Format, Loader } from "esbuild";

export interface BaseConfig {
  run?: boolean | string;
  watch?: boolean;
  clean?: boolean;
  sourcemap?: boolean;
  tsconfig?: string;
  minify?: boolean;
  ignoreTypes?: boolean;
  reset?: boolean;
  nodeOptions?: string[];
  killSignal?: NodeJS.Signals;
  import?: string[];
  outdir?: string;
  format?: Format;
  outExtension?: string;
  polyfills?: Polyfil[];
  inject?: string[];
  external?: { include?: string[] };
  loader?: Record<string, Loader>;
  target?: string;
}

export interface CliOption extends BaseConfig {
  grace?: boolean;
}

export interface Config extends BaseConfig {}
export type ConfigR = Required<Config>;
