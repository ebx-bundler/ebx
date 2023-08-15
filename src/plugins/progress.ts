import { type Plugin } from "esbuild";
import ora from "ora";
import { bold, cyan, green } from "../colors";
import ms from "pretty-ms";
import { relativeId } from "../path";
import { getResetScreen } from "../screen";
import { stderr } from "../logging";
import { getEntry } from "../utils";

interface ProgressOption {
  message?: string;
  dist: string;
  clear?: boolean;
}
export function progress({ clear = true, ...options }: ProgressOption): Plugin {
  const message = options.message || "Building";
  const spinner = ora();
  const dist = relativeId(options.dist);
  return {
    name: "progress",
    setup(build) {
      let started = 0;
      const reset = getResetScreen();
      const input = relativeId(getEntry(build.initialOptions));
      build.onStart(() => {
        clear && reset();
        stderr(cyan(`\nbundles ${bold(input!)} → ${bold(dist)}...`));
        spinner.text = message + "\n";
        spinner.start();
        started = Date.now();
      });
      build.onEnd((result) => {
        result.errors.length
          ? spinner.fail(
              `Build failed. ${result.errors.length} error${
                result.errors.length > 1 ? "s" : ""
              }`
            )
          : spinner.succeed(
              green(`created ${bold(dist)} in ${ms(Date.now() - started)}`)
            );
        console.log("waiting for changes...\n");
      });
    },
  };
}
