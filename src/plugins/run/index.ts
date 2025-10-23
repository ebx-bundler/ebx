import type { Plugin, PluginBuild } from "esbuild";
import { EOL } from "node:os";
import { runNode } from "./node-runner";
import { bold, dim } from "../../utils/colors";
import { log } from "../../utils/logging";
import { loadEnvFile } from "../../utils/utils";

interface RunOption {
  filename: string;
  nodeOptions: string[];
  killSignal?: NodeJS.Signals;
  envFile?: string;
}

export function run(opt: RunOption): Plugin {
  return {
    name: "plugin-run",
    setup: (arg) => setup(arg, opt),
  };
}

let restartListenerAttached = false;

async function setup(build: PluginBuild, opts: RunOption) {
  if (build.initialOptions.sourcemap) {
    opts.nodeOptions.push("--enable-source-maps");
  }
  const execute = createRunner(opts);
  build.onEnd(({ errors }) => {
    if (!errors.length) {
      log(dim(`↺ ${bold("rs")} ⏎ to restart${EOL}`));
      execute();
    }
  });
  onRestart(execute);
}

function onRestart(execute: ReturnType<typeof createRunner>) {
  // Prevent duplicate listeners in watch mode
  if (restartListenerAttached) return;
  restartListenerAttached = true;

  process.stdout.on("data", (buf) => {
    const txt = buf.toString().trim();
    if (txt === "rs") {
      execute();
    }
  });
}

export function createRunner(option: RunOption) {
  let stopProcess: ReturnType<typeof runNode> | null = null;
  let isExecuting = false;

  // Load env file once when runner is created
  const envVars = option.envFile ? loadEnvFile(option.envFile) : undefined;

  return async function execute() {
    if (isExecuting) return;
    isExecuting = true;
    try {
      await stopProcess?.(option.killSignal);
      stopProcess = runNode(option.filename, option.nodeOptions, envVars);
    } finally {
      isExecuting = false;
    }
  };
}
