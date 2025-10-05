import type { Format } from "esbuild";
export { parsePackageInfo } from "./info";
import { type PackageInfo } from "./info";
import { dirname, resolve, extname } from "node:path";
import semver from "semver";

export function getTarget(info: PackageInfo, prefix = "node") {
  if (!info.engines?.node) {
    return;
  }
  const version = semver.coerce(info.engines.node);
  if (!version) {
    throw new Error(`Invalid node version selected (${info.engines.node})`);
  }
  return `${prefix}${version.version}`;
}

export function getDestination(info: PackageInfo): [string, string] {
  if (!info.main) {
    return [resolve("dist"), ".js"];
  }
  const resolved = resolve(info.main);
  return [dirname(resolved), extname(resolved)];
}

export function getFormat(info: PackageInfo): Format {
  switch (info.type) {
    case "module":
      return "esm";
    case "commonjs":
      return "cjs";
  }
}
