export type Polyfill = "cjs" | "decorators";
import type { Format, Loader } from "esbuild";

export type HookFunction = (context: HookContext) => void | Promise<void>;

export interface HookContext {
  config: Config;
  result?: any;
  error?: Error;
}

export interface BuildEntry {
  input: string | string[];
  output?: string;
  format?: Format;
  target?: string;
  plugins?: any[];
}

export type LogLevel = "error" | "warn" | "info" | "debug";

export interface BaseConfig {
  run: boolean | string;
  watch: boolean;
  clean: boolean;
  sourcemap: boolean;
  tsconfig: string;
  minify: boolean;
  ignoreTypes: boolean;
  reset: boolean;
  nodeOptions: string[];
  killSignal: NodeJS.Signals;
  import: string[];
  outdir: string;
  format: Format;
  ext: string;
  polyfills: Polyfill[];
  inject: string[];
  loader: Record<string, Loader>;
  target?: string;
  envFile?: string;

  // New features
  logLevel?: LogLevel;
  repl?: boolean;
  test?: boolean | string;
  testPattern?: string;
  inspect?: boolean | number;
  inspectBrk?: boolean | number;
  parallel?: boolean;
  entries?: BuildEntry[];
  hooks?: {
    preBuild?: HookFunction | HookFunction[];
    postBuild?: HookFunction | HookFunction[];
    onError?: HookFunction | HookFunction[];
    onWatch?: HookFunction | HookFunction[];
  };
}

export interface CliOption extends Partial<BaseConfig> {
  grace?: boolean;
}

export interface Config extends BaseConfig {
  external?: { include?: string[] };
}
