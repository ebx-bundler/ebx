import { Plugin } from "esbuild";
import ora from "ora";
import { bold, green } from "../colors";
import ms from "pretty-ms";
import { relativeId } from "../path";

interface ProgressOption {
  message?: string;
}
export function progress(options: ProgressOption = {}): Plugin {
  const message = options.message || "Building";
  const spinner = ora();
  return {
    name: "progress",
    setup(build) {
      let start: number;
      build.onStart(() => {
        start = Date.now();
        spinner.text = message + "\n";
        spinner.start();
      });
      build.onEnd((result) => {
        const files = relativeId(result.outputFiles?.[0].path);
        result.errors.length
          ? spinner.fail(
              `Build failed. ${result.errors.length} error${
                result.errors.length > 1 ? "s" : ""
              }`
            )
          : spinner.succeed(
              green(`created ${bold(files)} in ${bold(ms(Date.now() - start))}`)
            );
      });
    },
  };
}
