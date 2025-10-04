import { parsePackageInfo } from "./info";
import { dirname, resolve, extname } from "node:path";
import semver from "semver";

export const packageInfo = await parsePackageInfo();
const info = packageInfo;

export function getTarget(prefix = "node") {
  if (!info.engines?.node) {
    return;
  }
  const version = semver.coerce(info.engines.node);
  if (!version) {
    throw new Error(`Invalid node version selected (${info.engines.node})`);
  }
  return `${prefix}${version.version}`;
}

export function getDestination(): [string, string] {
  if (!info.main) {
    return [resolve("dist"), ".js"];
  }
  const resolved = resolve(info.main);
  return [dirname(resolved), extname(resolved)];
}

export function getFormat() {
  switch (info.type) {
    case "module":
      return "esm";
    case "commonjs":
      return "cjs";
  }
}
