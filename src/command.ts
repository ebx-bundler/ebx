import { program } from "commander";

export interface CliOption {
  run: boolean;
  watch: boolean;
  clean: boolean;
  sourcemap: boolean;
  tsconfig?: string;
  minify?: boolean;
  decorators: boolean;
}

type Callback = (filename: string, opt: CliOption) => void;

program.option("-w --watch", "watch changes");
program.option("-r --run", "run the program");
program.option("-nc --no-clean", "clean before build");
program.option("-s --sourcemap", "generate sourcemap");
program.option("--tsconfig <tsconfig>", "custom ts config path");
program.option("-m --minify", "minify the output");
program.option("-d --decorators", "enable decorators feature");

program.argument("filename");

export function onAction(callback: Callback) {
  program.action(callback);
  program.parse();
}
