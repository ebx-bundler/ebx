import { existsSync, writeFileSync, rmSync, mkdirSync, readFileSync } from "node:fs";

export function isExists(f: string) {
  return existsSync(f);
}

export function write(name: string, content: string) {
  writeFileSync(name, content);
}

export function clean(dest: string) {
  try {
    if (existsSync(dest)) {
      rmSync(dest, { recursive: true });
    }
    mkdirSync(dest, { recursive: true });
  } catch (err) {
    // Ignore errors if directory doesn't exist or can't be cleaned
  }
}

export function loadJSON<T = unknown>(fn: string): T {
  return JSON.parse(readFileSync(fn, "utf8")) as T;
}
