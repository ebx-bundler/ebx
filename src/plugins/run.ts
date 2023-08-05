import { Plugin } from "esbuild";
import { ExecaChildProcess, execaNode } from "execa";

interface RunOption {
  filename: string;
}
export function run({ filename }: RunOption): Plugin {
  return {
    name: "plugin-run",
    async setup(build) {
      let subprocess: ExecaChildProcess = null;
      build.onEnd(() => {
        if (subprocess) {
          subprocess.kill("SIGTERM", {
            forceKillAfterTimeout: 2000,
          });
        }
        subprocess = execaNode(`${filename}`);
        subprocess.pipeStdout(process.stdout);
      });
    },
  };
}
