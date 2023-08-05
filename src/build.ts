import process from "node:process";
import ms from "pretty-ms";
import { bold, cyan, green } from "./colors";
import { relativeId } from "./path";
import { stderr } from "./logging";
import { printTimings } from "./timings";
import { ConfigOption } from "./config";
import esbuild from "esbuild";

export default async function build(inputOptions: ConfigOption): Promise<any> {
  const start = Date.now();
  const files = inputOptions.outdir;
  let inputFiles = inputOptions.entryPoints[0];
  stderr(cyan(`\n${bold(inputFiles!)} → ${bold(files)}...`));
  await esbuild.build(inputOptions);
  stderr(green(`created ${bold(files)} in ${bold(ms(Date.now() - start))}`));
  // if (bundle && bundle.getTimings) {
  //   printTimings(bundle.getTimings());
  // }
}
