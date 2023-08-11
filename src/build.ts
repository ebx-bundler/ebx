import ms from "pretty-ms";
import { bold, cyan, green } from "./colors";
import { relativeId } from "./path";
import { stderr } from "./logging";
import { type ConfigOption } from "./config";
import esbuild from "esbuild";
import { getEntry } from "./utils";

export default async function build(inputOptions: ConfigOption): Promise<any> {
  const start = Date.now();
  const files = inputOptions.outdir!;
  let inputFiles = relativeId(getEntry(inputOptions));
  stderr(cyan(`\n${bold(inputFiles!)} → ${bold(files)}...`));
  await esbuild.build(inputOptions);
  stderr(green(`created ${bold(files)} in ${bold(ms(Date.now() - start))}`));
}
