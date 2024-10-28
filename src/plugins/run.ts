import type { Plugin, PluginBuild } from "esbuild";
import { EOL } from "node:os";
import { runNode } from "./helpers/node-runner";
import { bold, dim } from "../colors";

interface RunOption {
  filename: string;
  nodeOptions: string[];
  killSignal?: NodeJS.Signals;
}

export function run(opt: RunOption): Plugin {
  return {
    name: "plugin-run",
    setup: (arg) => setup(arg, opt),
  };
}

async function setup(build: PluginBuild, opts: RunOption) {
  if (build.initialOptions.sourcemap) {
    opts.nodeOptions.push("--enable-source-maps");
  }
  const execute = createRunner(opts);
  build.onEnd(({ errors }) => {
    console.log(dim(`↺ ${bold("rs")} ⏎ to restart${EOL}`));
    if (!errors.length) {
      execute();
    }
  });
  onRestart(execute);
}

function onRestart(execute: ReturnType<typeof createRunner>) {
  process.stdin.on("data", (buf) => {
    const txt = buf.toString().trim();
    if (txt === "rs") {
      execute();
    }
  });
}

export function createRunner(option: RunOption) {
  let stopProcess: ReturnType<typeof runNode> | null = null;
  let pendingTask: (() => void) | null = null;
  return async function execute() {
    pendingTask = () => {
      stopProcess = runNode(option.filename, option.nodeOptions);
      pendingTask = null;
    };
    await stopProcess?.(option.killSignal);
    pendingTask?.();
  };
}
