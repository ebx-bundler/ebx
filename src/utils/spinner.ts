import ora, { type Ora } from "ora";
import type { Metafile } from "esbuild";
import { bold, cyan } from "./colors";
import { errorMessage, stderr, successMessage } from "./logging";
import { relativeId } from "./path";

export interface SpinnerManager {
  start(message: string): void;
  succeed(metafile: Metafile): void;
  fail(errors: unknown[] | string): void;
}

export function createBuildSpinner(
  inputFile: string,
  outputDir: string
): SpinnerManager {
  const spinner: Ora = ora();
  const input = relativeId(inputFile);
  const output = relativeId(outputDir);
  let startTime = 0;

  return {
    start(message: string): void {
      stderr(cyan(`\n${bold(input)} → ${bold(output)}...`));
      spinner.text = message + "\n";
      spinner.start();
      startTime = Date.now();
    },

    succeed(metafile: Metafile): void {
      spinner.succeed(successMessage(output, metafile, startTime));
    },

    fail(errors: unknown[] | string): void {
      const message = typeof errors === "string" ? errors : errorMessage(errors);
      spinner.fail(message);
    },
  };
}
