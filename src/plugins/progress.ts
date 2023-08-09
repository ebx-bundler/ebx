import { bold, green } from "../colors";
import { Plugin } from "esbuild";
import ora from "ora";
import ms from 'pretty-ms';

interface ProgressOption {
  message?: string;
  dist: string;
}
export function progress(options: ProgressOption): Plugin {
  const message = options.message || "Building";
  const spinner = ora();
  return {
    name: "progress",
    setup(build) {
      let started = 0;
      build.onStart(() => {
        spinner.text = message + "\n";
        spinner.start();
        started = Date.now()
      });
      build.onEnd((result) => {
        result.errors.length
          ? spinner.fail(
              `Build failed. ${result.errors.length} error${
                result.errors.length > 1 ? "s" : ""
              }`
            )
          : spinner.succeed(green(`created ${bold(options.dist)} in ${ms(Date.now() - started)}`));
      });
    },
  };
}
