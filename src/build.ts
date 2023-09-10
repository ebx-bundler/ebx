import { EOL } from "node:os";
import esbuild from "esbuild";
import ora from "ora";

import { bold, cyan } from "./colors";
import { relativeId } from "./path";
import { errorMessage, stderr, successMessage } from "./logging";
import { type ConfigOption } from "./config";
import { getEntry } from "./utils";
import { tsc } from "./plugins/typescript/tsc";
import type { CliOption } from "./command";

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
  inputOptions: ConfigOption,
  option: CliOption
): Promise<any> {
  const start = Date.now();
  const files = relativeId(inputOptions.outdir!);
  let inputFiles = relativeId(getEntry(inputOptions));
  const spinner = ora();
  stderr(cyan(`\n${bold(inputFiles!)} → ${bold(files)}...`));
  spinner.start();
  if (!option.ignoreTypes) {
    spinner.text = "checking types..." + EOL;
    await typeCheck(inputOptions.tsconfig);
  }
  spinner.text = "bundling..." + EOL;
  try {
    const { metafile } = await esbuild.build(inputOptions);
    spinner.succeed(successMessage(files, metafile!, start));
  } catch (err: any) {
    spinner.fail(err.errors ? errorMessage(err.errors) : err.message);
  }
}
