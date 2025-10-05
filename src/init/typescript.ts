import { extname } from "node:path";
import { isExists, write } from "../utils/fs";
import { tsConfig } from "./stubs/tsconfig";

export function isTypescript(fname: string) {
  return extname(fname) === ".ts";
}

export async function dumpTSConfig(name: string) {
  if (isExists(name)) return;
  write(name, JSON.stringify(tsConfig, null, 2));
}
