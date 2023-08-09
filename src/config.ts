import { getDestination, getFormat } from "./package.js";
import { CliOption } from "./command.js";
import { clean } from "./fs.js";
import type { BuildOptions, Plugin } from "esbuild";
import tsc from "esbuild-plugin-tsc";

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
  const plugins: Plugin[] = [tsc(), nodeExternalsPlugin(), progress()];

  if (option.run) {
    plugins.push(run({ filename: "./dist/index.js" }));
  }

  const config: ConfigOption = {
    entryPoints: [filename],
    bundle: true,
    target: "node20",
    platform: "node",
    format: getFormat(),
    outdir: dir,
    minify: option.minify,
    plugins,
  };

  return config;
}
