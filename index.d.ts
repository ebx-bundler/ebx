import type { Format, Loader } from "esbuild";

export type Polyfill = "cjs" | "decorators";

/**
 * EBX Configuration
 * Use in ebx.config.js or ebx.config.mjs:
 *
 * @example
 * ```js
 * /**
 *  * @type {import('ebx').Config}
 *  *\/
 * export default {
 *   outdir: "dist",
 *   format: "esm",
 *   polyfills: ["cjs"],
 *   minify: false,
 *   sourcemap: true
 * };
 * ```
 */
export interface Config {
  /**
   * Automatically run the compiled output
   * @default false
   */
  run?: boolean | string;

  /**
   * Enable watch mode for automatic recompilation
   * @default false
   */
  watch?: boolean;

  /**
   * Clean output directory before build
   * @default false
   */
  clean?: boolean;

  /**
   * Generate source maps
   * @default false
   */
  sourcemap?: boolean;

  /**
   * Path to tsconfig.json file
   * @default "tsconfig.json"
   */
  tsconfig?: string;

  /**
   * Minify the output
   * @default false
   */
  minify?: boolean;

  /**
   * Ignore TypeScript type checking
   * @default false
   */
  ignoreTypes?: boolean;

  /**
   * Reset/restart the process on file changes (in watch mode)
   * @default false
   */
  reset?: boolean;

  /**
   * Node.js options to pass when running
   * @default []
   */
  nodeOptions?: string[];

  /**
   * Signal to use when killing the process
   * @default "SIGTERM"
   */
  killSignal?: NodeJS.Signals;

  /**
   * Modules to import before running
   * @default []
   */
  import?: string[];

  /**
   * Output directory for compiled files
   * @default "dist"
   */
  outdir?: string;

  /**
   * Output format: "esm" or "cjs"
   * @default "cjs"
   */
  format?: Format;

  /**
   * Output file extension
   * @default ".js"
   */
  ext?: string;

  /**
   * Polyfills to enable
   * - "cjs": Adds __dirname, __filename, and require support in ESM
   * - "decorators": Enables TypeScript decorators
   * @default []
   */
  polyfills?: Polyfill[];

  /**
   * Files to inject into the bundle
   * @default []
   */
  inject?: string[];

  /**
   * Custom loaders for file extensions
   * @example { ".graphql": "text", ".html": "text" }
   * @default {}
   */
  loader?: Record<string, Loader>;

  /**
   * Target environment (e.g., "node18", "node20")
   */
  target?: string;

  /**
   * External module configuration
   * By default, all modules are external.
   * Use "include" to bundle specific modules.
   * @example { include: ["lodash"] }
   */
  external?: {
    include?: string[];
  };
}
