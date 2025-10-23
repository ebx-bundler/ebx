/**
 * EBX Configuration File Example
 *
 * This file demonstrates all available configuration options in ebx.config.js
 */

export default {
  // Basic build options
  outdir: "dist",
  format: "esm", // or "cjs"
  minify: false,
  sourcemap: true,
  tsconfig: "tsconfig.json",

  // Target environment
  target: "node18",

  // Polyfills
  polyfills: ["cjs", "decorators"],

  // External packages (to include in bundle)
  external: {
    include: ["lodash"]
  },

  // Custom loaders
  loader: {
    ".graphql": "text",
    ".txt": "text"
  },

  // Log level: "error" | "warn" | "info" | "debug"
  logLevel: "info",

  // Multiple entry points (for parallel builds)
  parallel: true,
  entries: [
    {
      input: "src/server.ts",
      output: "dist/server",
      format: "esm"
    },
    {
      input: "src/worker.ts",
      output: "dist/worker",
      format: "esm"
    }
  ],

  // Pre/Post build hooks
  hooks: {
    preBuild: async ({ config }) => {
      console.log("Starting build...");
    },

    postBuild: async ({ config, result }) => {
      console.log("Build completed successfully!");
    },

    onError: async ({ config, error }) => {
      console.error("Build failed:", error.message);
    },

    onWatch: async ({ config, result }) => {
      console.log("File changed, rebuilt!");
    }
  },

  // Test configuration
  test: false,
  testPattern: "**/*.test.{ts,js}",

  // Debugger configuration
  inspect: false, // or port number like 9229
  inspectBrk: false, // or port number like 9229

  // Node options
  nodeOptions: ["--experimental-modules"],

  // Environment file
  envFile: ".env",

  // Watch mode options
  watch: false,
  clean: true,
  reset: true,

  // Runtime options
  run: false,
  killSignal: "SIGTERM",

  // Type checking
  ignoreTypes: false
};
