import { stderr as std } from "node:process";
import { bold, green, red } from "./colors";
import type { Metafile } from "esbuild";
import ms from "pretty-ms";
import prettyBytes from "pretty-bytes";

function printTimings(start: number) {
  return bold(ms(Date.now() - start));
}

function getBytes(metafile: Metafile) {
  const size = Object.entries(metafile.outputs).reduce(
    (size, file) => size + file[1].bytes,
    0
  );
  return prettyBytes(size);
}

export const stderr = (...parameters: readonly unknown[]) => {
  return std.write(`${parameters.join("")}\n`);
};

export const log = console.log;
export const clear = console.clear;

export function successMessage(
  outdir: string,
  metafile: Metafile,
  startedAt: number
) {
  const timings = printTimings(startedAt);
  const bytes = getBytes(metafile);
  return green(`created ${bold(outdir)} (${bytes}) in ${timings}`);
}

export function errorMessage(errors: unknown[]) {
  return red(
    `Build failed. ${errors.length} error${errors.length > 1 ? "s" : ""}`
  );
}
