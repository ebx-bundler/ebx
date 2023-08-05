import { getDestination } from "./package.js";
import { CliOption } from "./command.js";
import { clean } from "./fs.js";
import type { BuildOptions, Plugin } from "esbuild";
import tsc from "esbuild-plugin-tsc";
import { NodeResolvePlugin } from "@esbuild-plugins/node-resolve";

import { EsmExternalsPlugin } from "@esbuild-plugins/esm-externals";
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
  const plugins: Plugin[] = [
    NodeResolvePlugin({
      extensions: [".ts", ".js"],
      onResolved: (resolved) => {
        if (resolved.includes("node_modules")) {
          return { external: true };
        }
        return resolved;
      },
    }),
    EsmExternalsPlugin({ externals: ["express"] }),
    tsc(),
    progress(),
    run({ filename: "./dist/index.js" }),
  ];
  if (option.run) {
    plugins.push();
  }

  const config: ConfigOption = {
    entryPoints: [filename],
    bundle: true,
    target: "node20",
    platform: "node",
    format: "esm",
    outdir: dir,
    plugins,
  };

  return config;
}
