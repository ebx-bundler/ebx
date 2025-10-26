import { type BuildOptions } from "esbuild";
import { basename, extname, join } from "node:path";
import { config as dotenvConfig } from "dotenv";
import dotenvExpand from "dotenv-expand";
import { resolve, isAbsolute } from "node:path";

export function ensureCase<T extends Record<string, any>>(
  data: T,
  ...args: (keyof T)[]
): T {
  for (const name of args) {
    const value = data[name];
    if (!value) {
      continue;
    }
    if (typeof value === "string") {
      data[name] = value.toLowerCase() as T[keyof T];
    }
  }
  return data;
}

export function getEntry(opt: BuildOptions) {
  if (!Array.isArray(opt.entryPoints) || opt.entryPoints.length === 0) {
    throw new Error("invalid entry");
  }
  return opt.entryPoints[0] as string;
}

export function getOutputFilename(src: string, outdir: string, ext: string) {
  const filename = basename(src, extname(src));
  return join(outdir, filename) + ext;
}

export function loadEnvFile(filepath: string): Record<string, string> {
  console.log({ filepath });
  const absolutePath = isAbsolute(filepath)
    ? filepath
    : resolve(process.cwd(), filepath);
  const result = dotenvConfig({ path: absolutePath, quiet: true });
  if (result.error) {
    const errorMsg = result.error.message;
    if (errorMsg.includes("ENOENT")) {
      throw new Error(`Environment file not found: ${absolutePath}`);
    }
    if (errorMsg.includes("EACCES")) {
      throw new Error(
        `Permission denied reading environment file: ${absolutePath}`
      );
    }
    throw new Error(
      `Failed to parse environment file at ${absolutePath}: ${errorMsg}`
    );
  }

  dotenvExpand.expand(result);
  return result.parsed || {};
}
