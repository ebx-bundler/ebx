import type { Loader } from "esbuild";

/**
 * EBX Configuration
 * Use in ebx.config.js:
 *
 * @example
 * ```js
 * /**
 *  * @type {import('ebx').Config}
 *  *\/
 * export default {
 *   outdir: "dist",
 *   type: "module",
 *   polyfills: ["cjs"]
 * };
 * ```
 */
export interface Config {
  /**
   * Output directory for compiled files
   * @default "dist"
   */
  outdir?: string;

  /**
   * Output file extension
   * @default ".js"
   */
  outExtension?: string;

  /**
   * Module format: "module" for ESM, "commonjs" for CJS
   * @default "commonjs"
   */
  type?: "module" | "commonjs";

  /**
   * Polyfills to enable
   * - "cjs": Adds __dirname, __filename, and require support in ESM
   * - "decorators": Enables TypeScript decorators
   */
  polyfills?: Array<"cjs" | "decorators">;

  /**
   * Files to inject into the bundle
   */
  inject?: string[];

  /**
   * External module configuration
   * By default, all modules are external.
   * Use "include" to bundle specific modules.
   * @example { include: ["lodash"] }
   */
  external?: {
    include?: string[];
  };

  /**
   * Custom loaders for file extensions
   * @example { ".graphql": "text", ".html": "text" }
   */
  loader?: Record<string, Loader>;
}
