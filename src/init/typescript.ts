import { extname } from "node:path";
import { isExists, loadJSON, write } from "../utils/fs";
import { loadConfig } from "../config";

export function isTypescript(fname: string) {
  return extname(fname) === ".ts";
}

export async function dumpTSConfig(name: string) {
  if (isExists(name)) return;
  const tsConfig = await loadJSON<any>("./stubs/tsconfig.stub");
  const config = await loadConfig();
  if (config.type === "module") {
    tsConfig.compilerOptions.module = "ESNext";
  }
  write(name, JSON.stringify(tsConfig, null, 2));
}
