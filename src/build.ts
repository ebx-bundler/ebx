import ms from "pretty-ms";
import { bold, cyan, green } from "./colors";
import { relativeId } from "./path";
import { stderr } from "./logging";
import { type ConfigOption } from "./config";
import esbuild from "esbuild";
import { getEntry } from "./utils";
import { tsc } from "./tsc";
import ora from "ora";
import { EOL } from "os";

async function typecheck(config?: string) {
  let hasError = false;
  for await (const log of tsc({ config })) {
    hasError = true;
    process.stdout.write(log);
  }
  if (hasError) {
    process.exit(1);
  }
}

export default async function build(inputOptions: ConfigOption): Promise<any> {
  const start = Date.now();
  const files = inputOptions.outdir!;
  let inputFiles = relativeId(getEntry(inputOptions));
  const spinner = ora();
  stderr(cyan(`\n${bold(inputFiles!)} → ${bold(files)}...`));
  spinner.start();
  spinner.text = "checking types..." + EOL;
  await typecheck(inputOptions.tsconfig);
  spinner.text = "bundling..." + EOL;
  await esbuild.build(inputOptions);
  spinner.succeed(
    green(`created ${bold(files)} in ${bold(ms(Date.now() - start))}`)
  );
}
