import { BuildOptions, Plugin } from "esbuild";
import { ExecaChildProcess, execaNode } from "execa";
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
      let subprocess: ExecaChildProcess = null;
      const fname = filename ?? getOutputFilename(build.initialOptions);
      build.onEnd(() => {
        if (subprocess) {
          subprocess.kill("SIGTERM", {
            forceKillAfterTimeout: 2000,
          });
        }
        subprocess = execaNode(fname);
        subprocess.pipeStdout(process.stdout).pipeStderr(process.stderr);
      });
    },
  };
}
