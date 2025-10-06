import { join } from "path";
import { loadJSON } from "../utils/fs";
import { ensureCase } from "../utils";
import semver from "semver";

export interface PkgInfo {
  name?: string;
  type?: "module" | "commonjs";
  main?: string;
  engines?: {
    node?: string;
  };
}

export function loadPkg(): PkgInfo {
  try {
    const cwd = process.cwd();
    const packagePath = join(cwd, "package.json");
    const info = loadJSON<PkgInfo>(packagePath);
    if (!info.type) {
      info.type = "commonjs";
    }
    return ensureCase(info, "type");
  } catch (err) {
    return {};
  }
}

export function getTarget(node: string, prefix = "node") {
  const version = semver.coerce(node);
  if (!version) {
    throw new Error(`Invalid node version selected (${node})`);
  }
  return `${prefix}${version.version}`;
}
