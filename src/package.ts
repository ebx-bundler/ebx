import { readFileSync as readFile } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { ensureCase } from "./utils";
import semver from "semver";

export interface PackageInfo {
  name?: string;
  type: "module" | "commonjs";
  main?: string;
  polyfills?: string[];
  engines?: {
    node?: string;
  };
  inject?: string[];
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
    return [resolve("dist")];
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

export async function getPolyfills() {
  if (!info.polyfills) {
    return [];
  }

  const polyfills = info.polyfills.map(async (name) => {
    switch (name) {
      case "cjs":
        const { cjs } = await import("./plugins/cjs-polyfill");
        return cjs();
      case "decorators":
        const { default: decorators } = await import("esbuild-plugin-tsc");
        return decorators();
      default:
        throw new Error(`Unknown polyfill ${name}`);
    }
  });
  return Promise.all(polyfills);
}

export function getInject() {
  return info.inject ?? [];
}
