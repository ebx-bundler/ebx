import {
  getDestination,
  getExternal,
  getFormat,
  getInject,
  getPolyfills,
  getTarget,
} from "./project";
import { type CliOption } from "./command";
import { clean } from "./fs";
import type { BuildOptions, Plugin } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import { progress } from "./plugins/progress";
import { run } from "./plugins/run";
import { tsCheckPlugin } from "./plugins/typescript";
import { isCurrentPath } from "./path";

export type ConfigOption = BuildOptions;
export type { Plugin };

export async function createConfig(filename: string, option: CliOption) {
  const [dir] = getDestination();

  if (isCurrentPath(dir)) {
    option.clean = false;
  }

  if (option.clean) {
    clean(dir);
  }
  const format = getFormat();

  const polyfills = await getPolyfills(option);
  const external = getExternal();

  const plugins: Plugin[] = [...polyfills];

  plugins.push(
    nodeExternalsPlugin({
      allowList: external.include,
    })
  );

  if (option.watch) {
    if (!option.ignoreTypes) {
      plugins.push(tsCheckPlugin());
    }
    plugins.push(progress({ dist: dir, clear: option.reset }));
  }

  if (option.run) {
    plugins.push(
      run({
        nodeOptions: option.nodeOption,
        filename: option.run === true ? undefined : option.run,
      })
    );
  }

  const config: ConfigOption = {
    entryPoints: [filename],
    bundle: true,
    inject: getInject(),
    target: getTarget(),
    platform: "node",
    format,
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
