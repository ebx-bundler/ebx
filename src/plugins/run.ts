import type { BuildOptions, Plugin, PluginBuild } from "esbuild";
import { type ExecaChildProcess as Process, execaNode as node } from "execa";
import { bold, dim } from "../colors";
import { EOL } from "node:os";

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
  const execute = createRunner(filename, nodeOptions, build.initialOptions);
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

function createRunner(file: string, nodeOptions: string[], opt: BuildOptions) {
  let p: Process | null = null;

  if (opt.sourcemap) {
    nodeOptions.push("--enable-source-maps");
  }

  function run() {
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
