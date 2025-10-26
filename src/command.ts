import { program } from "commander";
import { version } from "../package.json";
import { handleInit } from "./init";
import type { CliOption } from "./config/types";
import { handleAction } from "./esbuild";
export type { CliOption };
program.version(version);

program
  .command("init")
  .description("Initialize project with config files")
  .action(handleInit);

program.argument("[filename]");

program.option("-w --watch", "Watch for changes and rebuild automatically");
program.option(
  "-i --import <import...>",
  "Import additional files before entry"
);
program.option("-r --run", "Run the program after build");
program.option("--env-file <path>", "Path to .env file (only used with --run)");
program.option("--no-clean", "Skip cleaning output directory");
program.option("-s --sourcemap", "Generate sourcemaps");
program.option("--tsconfig <tsconfig>", "Path to custom tsconfig.json");
program.option("-m --minify", "Minify output code");
program.option("--no-reset", "Skip screen reset after build");
program.option("--ignore-types", "Ignore type errors");

program.option(
  "--no --node-options <options...>",
  "Pass options to Node.js runtime"
);
program.option(
  "--kill-signal <signal>",
  "Signal to send before restart (default: SIGTERM)"
);

program.option("--no-grace", "Force restart without graceful shutdown");

// Config override options
program.option("-o --outdir <outdir>", "Override output directory from config");
program.option("-f --format <format>", "Override module format (esm or cjs)");
program.option("--ext <ext>", "Output extension");
program.option(
  "-p --polyfills <polyfills...>",
  "Override polyfills (cjs, decorators)"
);
program.option(
  "-t --target <target>",
  "Override target environment (node18, etc)"
);

program.action(handleAction);
export function run() {
  program.parse();
}
