import { EOL } from "node:os";
import esbuild, { type BuildOptions } from "esbuild";
import ora from "ora";

import { bold, cyan } from "../utils/colors";
import { relativeId } from "../utils/path";
import { errorMessage, stderr, successMessage } from "../utils/logging";
import { getEntry } from "../utils/utils";
import { tsc } from "../plugins/typescript/tsc";
import type { CliOption } from "../command";

async function typeCheck(config?: string) {
  let hasError = false;
  for await (const log of tsc({ config })) {
    hasError = true;
    process.stderr.write(log);
  }
  if (hasError) {
    process.exit(1);
  }
}

export async function build(
  inputOptions: BuildOptions,
  config: CliOption
): Promise<void> {
  const start = Date.now();
  const files = relativeId(inputOptions.outdir!);
  let inputFiles = relativeId(getEntry(inputOptions));
  const spinner = ora();
  stderr(cyan(`\n${bold(inputFiles!)} → ${bold(files)}...`));
  spinner.start();
  if (!config.ignoreTypes) {
    spinner.text = "checking types..." + EOL;
    await typeCheck(inputOptions.tsconfig);
  }
  spinner.text = "bundling..." + EOL;
  try {
    const { metafile } = await esbuild.build(inputOptions);
    spinner.succeed(successMessage(files, metafile!, start));
  } catch (err: unknown) {
    const message =
      err && typeof err === "object" && "errors" in err
        ? errorMessage(err.errors as any)
        : err instanceof Error
        ? err.message
        : String(err);
    spinner.fail(message);
  }
}
