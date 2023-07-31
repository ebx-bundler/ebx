import { readFileSync as readFile } from "node:fs";
import { dirname, join, resolve } from "node:path";

interface PackageInfo {
  name: string;
  type: string;
  version: string;
  main: string;
  author: string;
  license: string;
  packageManager: string;
  dependencies: Dependencies;
  devDependencies: Dependencies;
  scripts: Scripts;
  bin: string;
}

interface Scripts {
  [key: string]: string;
}

interface Dependencies {
  [key: string]: string;
}

export function getInfo(): PackageInfo {
  const cwd = process.cwd();
  const packagePath = join(cwd, "package.json");
  return JSON.parse(readFile(packagePath, "utf-8"));
}

export function getDestination(info: PackageInfo) {
  if (!info.main) {
    return "dist";
  }
  return dirname(resolve(info.main));
}

export function getFormat(info: PackageInfo) {
  if (!info.type) {
    return "cjs";
  }
  switch (info.type.toLowerCase()) {
    case "module":
      return "es";
    case "commonjs":
      return "cjs";
  }
}
