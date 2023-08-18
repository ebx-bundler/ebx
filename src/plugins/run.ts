import type { BuildOptions, Plugin } from "esbuild";
import { type ExecaChildProcess as Process, execaNode as node } from "execa";
import { basename, extname, join } from "node:path";
import { getEntry } from "../utils";
import { bold, dim } from "../colors";
import { EOL } from "node:os";

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
      onRestart(execute);
    },
  };
}

function onRestart(execute: ReturnType<typeof createRunner>) {
  process.stdout.on("data", (buf) => {
    const txt = buf.toString().trim();
    if (txt === "rs") {
      execute();
    }
  });
}

function createOnce(cb: CallableFunction) {
  let hasRun = false;
  return function run() {
    if (hasRun) {
      return;
    }
    hasRun = true;
    cb();
  };
}

function createRunner(file: string, opt: BuildOptions) {
  let p: Process | null = null;
  const showMessage = createOnce(() => {
    console.log(dim(`↺ ${bold("rs")} ⏎ to restart${EOL}`));
  });

  function run() {
    showMessage();
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
