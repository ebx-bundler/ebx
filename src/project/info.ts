import { join } from "node:path";
import { loadJSON } from "../utils/fs";
import { ensureCase } from "../utils/utils";

export interface PackageInfo {
  name?: string;
  type: "module" | "commonjs";
  main?: string;
  engines?: {
    node?: string;
  };
}

export function parsePackageInfo(): PackageInfo {
  try {
    const cwd = process.cwd();
    const packagePath = join(cwd, "package.json");
    const info = loadJSON<PackageInfo>(packagePath);
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
