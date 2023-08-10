import { BuildOptions, Plugin } from "esbuild";
import { ExecaChildProcess as Process, execaNode as node } from "execa";
import { basename, extname, join } from "node:path";

function getOutputFilename(opt: BuildOptions) {
  const outdir = opt.outdir;
  let filename = basename((opt.entryPoints as string[])?.at(0), ".js");
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
      const execute = createRunner(fname);
      build.onEnd(execute);
    },
  };
}

function createRunner(file: string) {
  let p: Process = null;

  return function execute() {
    if (!p) {
      p = node(file, { stdio: "inherit" });
      return;
    }
    p.kill("SIGTERM", {
      forceKillAfterTimeout: 2000,
    });
    p.on("close", () => {
      p = node(file, { stdio: "inherit" });
    });
  };
}
