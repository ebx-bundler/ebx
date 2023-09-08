import { program } from "commander";
import { version } from "../package.json";

export interface CliOption {
  run: boolean | string;
  watch: boolean;
  clean: boolean;
  sourcemap: boolean;
  tsconfig?: string;
  minify?: boolean;
  ignoreTypes: boolean;
  reset: boolean;
  nodeOptions?: string;
}
program.version(version);

type Callback = (filename: string, opt: CliOption) => void;

program.option(
  "-w --watch",
  "Watch for changes in the source files and automatically rebuild when changes are detected."
);
program.option(
  "-r --run [filename]",
  "Run the compiled program after a successful build."
);
program.option(
  "-nc --no-clean",
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

program.option("--node-options <options>", "node options");

program.argument("filename");

export function onAction(callback: Callback) {
  program.action(callback);
  program.parse();
}
