import { program } from "commander";
import { version } from "../package.json";
import { handleInit } from "./init";
import type { CliOption } from "./config/types";
import { handleAction } from "./esbuild";
export type { CliOption };
program.version(version);

program
  .command("init")
  .description(
    "Initialize project with config files (ebx.config.js/mjs and tsconfig.json)"
  )
  .action(handleInit);

program.argument("[filename]");

program.option(
  "-w --watch",
  "Watch for changes in the source files and automatically rebuild when changes are detected."
);
program.option("-i --import <import...>", "Import additional files");
program.option(
  "-r --run",
  "Run the compiled program after a successful build."
);
program.option(
  "--nc --no-clean",
  "Do not clean the build output directory before building."
);
program.option(
  "-s --sourcemap",
  "Generate sourcemaps for the compiled JavaScript code."
);
program.option(
  "--tsconfig <tsconfig>",
  "Path to a custom TypeScript configuration file (tsconfig.json)."
);
program.option("-m --minify", "Minify the output JavaScript code.");
program.option("--no-reset", "Do not reset screen after build");
program.option("--ignore-types", "Ignores type errors.", false);

program.option(
  "--no --node-options <options...>",
  "Specify Node.js options that should be used when running the program."
);
program.option(
  "--kill-signal <signal>",
  "Specify the signal that will be sent to the program before restarting it. Default: SIGTERM"
);

program.option(
  "--ng --no-grace",
  "This option forces the program to be abruptly terminated without any graceful shutdown procedure and then immediately restarted."
);

// Config override options
program.option("-o --outdir <outdir>", "Override output directory from config");
program.option("-f --format <format>", "Override module format (esm or cjs)");
program.option(
  "-p --polyfills <polyfills...>",
  "Override polyfills from config (e.g., cjs, decorators)"
);
program.option(
  "-t --target <target>",
  "Override target environment (e.g., node18)"
);

program.action(handleAction);
export function start() {
  program.parse();
}
