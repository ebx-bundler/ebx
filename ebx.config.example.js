/**
 * Example ebx.config.js configuration file
 *
 * This file demonstrates all available configuration options.
 * You can copy this to your project root as "ebx.config.js" to customize ebx behavior.
 *
 * All options can be overridden via CLI flags:
 * - --outdir, -o: Override output directory
 * - --format, -f: Override module format (esm or cjs)
 * - --polyfills, -p: Override polyfills
 * - --target, -t: Override target environment (e.g., node18)
 */

export default {
  /**
   * Output directory for compiled files
   * @type {string}
   * @default "dist"
   */
  outdir: "dist",

  /**
   * Output file extension
   * @type {string}
   * @default ".js"
   */
  outExtension: ".js",

  /**
   * Module format: "module" for ESM, "commonjs" for CJS
   * @type {"module" | "commonjs"}
   * @default "commonjs"
   */
  type: "module",

  /**
   * Polyfills to enable
   * Available options:
   * - "cjs": Adds __dirname, __filename, and require support in ESM
   * - "decorators": Enables TypeScript decorators
   * @type {string[]}
   */
  polyfills: ["cjs"],

  /**
   * Node.js version target
   * @type {object}
   */
  engines: {
    node: ">=18.0.0",
  },

  /**
   * Files to inject into the bundle
   * @type {string[]}
   */
  inject: [],

  /**
   * External module configuration
   * By default, all modules are external. Use "include" to bundle specific modules.
   * @type {object}
   */
  external: {
    include: ["lodash"], // This will bundle lodash instead of keeping it external
  },

  /**
   * Custom loaders for file extensions
   * @type {object}
   */
  loader: {
    ".graphql": "text",
    ".txt": "text",
    ".html": "text",
  },
};
