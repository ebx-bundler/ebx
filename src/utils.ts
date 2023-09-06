import { type BuildOptions } from "esbuild";
import { basename, extname, join } from "node:path";

interface Data {
  [key: string]: any;
}
export function ensureCase<T extends Data>(data: T, ...args: (keyof T)[]): T {
  for (const name of args) {
    if (!data[name]) {
      continue;
    }
    data[name] = data[name].toLowerCase();
  }
  return data;
}

export function getOutputFilename(src: string, outdir: string, ext: string) {
  const filename = basename(src, extname(src));
  return join(outdir, filename) + ext;
}
