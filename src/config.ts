import { getDestination, getFormat } from "./package.js";
import { type CliOption } from "./command.js";
import { clean } from "./fs.js";
import type { BuildOptions, Plugin } from "esbuild";

import { nodeExternalsPlugin } from "esbuild-node-externals";
import { progress } from "./plugins/progress.js";
import { run } from "./plugins/run.js";

export type ConfigOption = BuildOptions;
export type { Plugin };

export async function createConfig(
  filename: string,
  option: CliOption
): Promise<ConfigOption> {
  const [dir] = getDestination();
  if (option.clean) {
    clean(dir);
  }

  const plugins: Plugin[] = [];

  if (option.decorators) {
    const { default: tsc } = await import("esbuild-plugin-tsc");
    plugins.push(tsc());
  }

  plugins.push(nodeExternalsPlugin());

  if (option.watch) {
    plugins.push(progress({ dist: dir }));
  }

  if (option.run) {
    plugins.push(run());
  }

  const config: ConfigOption = {
    entryPoints: [filename],
    bundle: true,
    target: "node20",
    platform: "node",
    format: getFormat(),
    outdir: dir,
    minify: option.minify,
    sourcemap: option.sourcemap,
    plugins,
  };

  return config;
}
