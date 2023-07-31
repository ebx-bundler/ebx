import { program } from "commander";

export interface CliOption {
  run: boolean;
  watch: boolean;
  clean: boolean;
}

type Callback = (filename: string, opt: CliOption) => void;

program.option("-w --watch", "watch changes");
program.option("-r --run", "run the program");
program.option("-r --clean", "clean before build");

program.argument("filename");

export function onAction(callback: Callback) {
  program.action(callback);
  program.parse();
}
