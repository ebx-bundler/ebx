import type { Plugin, PluginBuild } from "esbuild";
import { type ResultPromise as Process, execaNode, ExecaError } from "execa";
import { bold, dim } from "../colors";
import { EOL } from "node:os";

export function node(filename: string, nodeOptions: string[]) {
  let isStopping = false;
  let proc: Process;
  const promise = new Promise<void>(async (resolve) => {
    proc = execaNode(filename, { nodeOptions, stdio: "inherit" });
    await proc.catch((err) => {
      if (!(err instanceof ExecaError)) {
        throw err;
      }
    });
    resolve();
  });

  function stop() {
    if (isStopping) {
      return promise;
    }
    isStopping = true;
    proc.kill("SIGTERM");
    return promise;
  }
  return stop;
}

interface RunOption {
  filename: string;
  nodeOptions: string[];
}
export function run(opt: RunOption): Plugin {
  return {
    name: "plugin-run",
    setup: (arg) => setup(arg, opt),
  };
}

async function setup(build: PluginBuild, { filename, nodeOptions }: RunOption) {
  if (build.initialOptions.sourcemap) {
    nodeOptions.push("--enable-source-maps");
  }
  const execute = createRunner(filename, nodeOptions);
  build.onEnd(({ errors }) => {
    console.log(dim(`↺ ${bold("rs")} ⏎ to restart${EOL}`));
    if (!errors.length) {
      execute();
    }
  });
  onRestart(execute);
}

function onRestart(execute: ReturnType<typeof createRunner>) {
  process.stdout.on("data", (buf) => {
    const txt = buf.toString().trim();
    if (txt === "rs") {
      execute();
    }
  });
}

export function createRunner(filename: string, nodeOptions: string[]) {
  let stopProcess: ReturnType<typeof node> | null = null;
  let pendingTask: (() => void) | null = null;
  return async function execute() {
    pendingTask = () => {
      stopProcess = node(filename, nodeOptions);
      pendingTask = null;
    };
    await stopProcess?.();
    pendingTask?.();
  };
}
