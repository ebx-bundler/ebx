import type { Loader } from "esbuild";

interface External {
  include?: string[];
}

/**
 * EBX Configuration
 */
export interface EbxConfig {
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
  polyfills?: string[];

  /**
   * Node.js version target
   * @example { node: ">=18.0.0" }
   */
  engines?: {
    node?: string;
  };

  /**
   * Files to inject into the bundle
   */
  inject?: string[];

  /**
   * External module configuration
   * By default, all modules are external.
   * Use "include" to bundle specific modules.
   */
  external?: External;

  /**
   * Custom loaders for file extensions
   * @example { ".graphql": "text", ".txt": "text" }
   */
  loader?: Record<string, Loader>;
}

declare const config: EbxConfig;
export default config;
