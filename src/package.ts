import { readFileSync as readFile } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { ensureCase } from "./utils";

export interface PackageInfo {
  name?: string;
  type: "module" | "commonjs";
  main?: string;
}

export function getInfo(): PackageInfo {
  try {
    const cwd = process.cwd();
    const packagePath = join(cwd, "package.json");
    const info: PackageInfo = JSON.parse(readFile(packagePath, "utf-8"));
    if (!info.type) {
      info.type = "commonjs";
    }
    return ensureCase(info, "type");
  } catch (err) {
    return {
      type: "commonjs",
    };
  }
}

export function getDestination(info: PackageInfo) {
  if (!info.main) {
    return "dist";
  }
  return dirname(resolve(info.main));
}

export function getFormat(info: PackageInfo) {
  switch (info.type) {
    case "module":
      return "es";
    case "commonjs":
      return "cjs";
  }
}
