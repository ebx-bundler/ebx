import { existsSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";

export function isExists(f: string) {
  return existsSync(f);
}

export function write(name: string, content: string) {
  writeFileSync(name, content);
}

export function clean(dest: string) {
  try {
    rmSync(dest, { recursive: true });
    mkdirSync(dest);
  } catch (er) {}
}

export async function loadJSON<T = unknown>(fn: string) {
  return JSON.parse(await readFile(fn, "utf8")) as T;
}
