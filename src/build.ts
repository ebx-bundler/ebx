import { EOL } from "node:os";
import esbuild from "esbuild";
import ora from "ora";

import { bold, cyan, green } from "./colors";
import { relativeId } from "./path";
import { stderr } from "./logging";
import { type ConfigOption } from "./config";
import { getEntry } from "./utils";
import { tsc } from "./plugins/typescript/tsc";
import type { CliOption } from "./command";
import { printTimings } from "./timings";

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
  await esbuild.build(inputOptions);
  spinner.succeed(green(`created ${bold(files)} in ${printTimings(start)}`));
}
