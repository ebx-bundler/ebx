import type { BuildOptions, Plugin } from "esbuild";
import { type ExecaChildProcess as Process, execaNode as node } from "execa";
import { basename, extname, join } from "node:path";
import { getEntry } from "../utils";

function getOutputFilename(opt: BuildOptions) {
  const outdir = opt.outdir!;
  let filename = basename(getEntry(opt), ".js");
  filename = filename.replace(extname(filename), ".js");
  return join(outdir, filename);
}
interface RunOption {
  filename?: string;
}
export function run({ filename }: RunOption = {}): Plugin {
  return {
    name: "plugin-run",
    async setup(build) {
      const fname = filename ?? getOutputFilename(build.initialOptions);
      const execute = createRunner(fname, build.initialOptions);
      build.onEnd(execute);
    },
  };
}

function createRunner(file: string, opt: BuildOptions) {
  let p: Process | null = null;

  function run() {
    const nodeOptions: string[] = [];
    if (opt.sourcemap) {
      nodeOptions.push("--enable-source-maps");
    }
    return node(file, {
      stdio: "inherit",
      nodeOptions,
    });
  }

  return function execute() {
    if (!p) {
      p = run();
      return;
    }
    p.kill("SIGTERM", {
      forceKillAfterTimeout: 2000,
    });
    p = null;
    execute();
  };
}
