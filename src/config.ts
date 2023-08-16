import { getDestination, getFormat, getTarget } from "./package.js";
import { type CliOption } from "./command.js";
import { clean } from "./fs.js";
import type { BuildOptions, Plugin } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import { progress } from "./plugins/progress.js";
import { run } from "./plugins/run.js";
import { tscForkPlugin } from "./plugins/tsc/index.js";

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

  plugins.push(nodeExternalsPlugin());

  if (option.watch) {
    if (!option.ignoreTypes) {
      plugins.push(tscForkPlugin());
    }
    plugins.push(progress({ dist: dir }));
  }

  if (option.run) {
    plugins.push(run());
  }

  const config: ConfigOption = {
    entryPoints: [filename],
    bundle: true,
    target: getTarget(),
    platform: "node",
    format: getFormat(),
    outdir: dir,
    minify: option.minify,
    sourcemap: option.sourcemap,
    tsconfig: option.tsconfig,
    plugins,
  };

  if (config.format === "esm") {
    config.splitting = true;
  }

  return config;
}
