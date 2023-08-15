import { existsSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

export function isExists(f: string) {
  return existsSync(f);
}

export function write(name: string, content: string) {
  writeFileSync(name, content);
}

export function clean(dest: string) {
  if (process.cwd() === resolve(dest)) {
    return;
  }
  try {
    rmSync(dest, { recursive: true });
    mkdirSync(dest);
  } catch (er) {}
}
