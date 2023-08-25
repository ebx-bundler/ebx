import { createRequire } from "node:module";
import { execaNode as node } from "execa";
const require = createRequire(import.meta.url);
export const tscPath = () => {
  return require.resolve("typescript/lib/tsc.js");
};

interface TSCOptions {
  watch?: boolean;
  config?: string;
}
export function tsc(opt: TSCOptions) {
  const p = tscPath();
  let args = ["--noEmit", "--pretty"];
  if (opt.config) {
    args = [...args, "-p", opt.config];
  }
  if (opt.watch) {
    args.push("--watch");
  }

  const subprocess = node(p, args, {
    shell: true,
    stderr: process.stderr,
    stdin: process.stdin,
    env: process.env,
  });
  return subprocess.stdout!;
}
