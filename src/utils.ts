import { type BuildOptions } from "esbuild";

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

export function getEntry(opt: BuildOptions) {
  if (!Array.isArray(opt.entryPoints) || opt.entryPoints.length === 0) {
    throw new Error("invalid entry");
  }
  return opt.entryPoints[0] as string;
}
