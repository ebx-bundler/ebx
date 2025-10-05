import type { Plugin } from "esbuild";
import type { Config } from "../config";
import { getOutputFilename } from "../utils/utils";
import { progress } from "../plugins/progress";
import { run } from "../plugins/run";
import { tsCheckPlugin } from "../plugins/typescript";
import { nodeExternalsPlugin } from "esbuild-node-externals";

export async function buildPlugins(
  config: Config,
  filename: string
): Promise<Plugin[]> {
  const { outdir, ext: outExtension } = config;

  const plugins: Plugin[] = [];

  // Add polyfill plugins
  for (const name of config.polyfills) {
    if (name === "cjs") {
      const { cjs } = await import("../plugins/cjs-polyfill");
      plugins.push(cjs());
    } else if (name === "decorators") {
      const { decorators } = await import("../plugins/decorator-polyfill");
      plugins.push(decorators({ tsconfigPath: config.tsconfig }));
    }
  }

  plugins.push(nodeExternalsPlugin({ allowList: config.external?.include }));

  if (config.watch) {
    if (!config.ignoreTypes) plugins.push(tsCheckPlugin());
    plugins.push(progress({ dist: outdir, clear: config.reset }));
  }

  if (config.run) {
    if (config.run === true) {
      config.run = getOutputFilename(filename, outdir, outExtension);
    }
    const nodeOptions = config.nodeOptions;
    config.import.forEach((x) => {
      nodeOptions.push("--import", getOutputFilename(x, outdir, outExtension));
    });
    plugins.push(
      run({ nodeOptions, filename: config.run, killSignal: config.killSignal })
    );
  }

  return plugins;
}
