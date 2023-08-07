import { readFileSync as readFile } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { ensureCase } from "./utils";

export interface PackageInfo {
  name?: string;
  type: "module" | "commonjs";
  main?: string;
}

const info = parseInfo();
export { info as packageInfo };

function parseInfo(): PackageInfo {
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

export function getDestination(): [string, string?] {
  if (!info.main) {
    return ["dist"];
  }
  const resolved = resolve(info.main);
  return [dirname(resolved), basename(resolved)];
}

export function getFormat() {
  switch (info.type) {
    case "module":
      return "esm";
    case "commonjs":
      return "cjs";
  }
}
