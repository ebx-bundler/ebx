import type { Plugin, PluginBuild } from "esbuild";
import { type ExecaChildProcess as Process, execaNode as node } from "execa";
import { bold, dim } from "../colors";
import { EOL } from "node:os";

interface RunOption {
  filename: string;
  nodeOptions: string[];
  killSignal?: string;
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

function createRunner({ filename: file, nodeOptions, killSignal }: RunOption) {
  let p: Process | null = null;

  function run() {
    return node(file, {
      stdio: "inherit",
      nodeOptions,
    });
  }

  return function execute() {
    if (!p || p.exitCode !== null) {
      p = run();
      return;
    }
    p.kill(killSignal);
    p.on("exit", () => {
      p = null;
      execute();
    });
  };
}
