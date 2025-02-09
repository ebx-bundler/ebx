import {
  getDestination,
  getExternal,
  getFormat,
  getLoader,
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
import { getOutputFilename } from "./utils";
import { loadOptions, loadOptionsStrict } from "./load-options";
import type { ConfigOption } from "./types";

export type { Plugin };

export async function loadConfigs({
  config: configFile,
  ...options
}: CliOption): Promise<[BuildOptions, ConfigOption]> {
  const configs = configFile
    ? await loadOptionsStrict(configFile)
    : await loadOptions("ebx.config", ["js", "mjs"]);

  const {
    run,
    watch,
    clean,
    sourcemap,
    tsconfig,
    minify,
    ignoreTypes,
    reset,
    nodeOptions,
    killSignal,
    grace,
    import: imports,
    loader = getLoader(),
    plugins = [],
    polyfills = [],
    nodeExternal,
    ...base
  } = configs;

  return [
    base,
    {
      run,
      watch,
      clean,
      tsconfig,
      minify,
      ignoreTypes,
      nodeOptions,
      killSignal,
      grace,
      import: imports,
      nodeExternal,
      polyfills,
      ...options,
    },
  ];
}

export async function createConfig(filename: string, option: ConfigOption) {
  const [dir, ext] = getDestination();
  if (!option.grace) {
    option.killSignal = "SIGKILL";
  }
  if (isCurrentPath(dir)) {
    option.clean = false;
  }

  if (option.clean) {
    clean(dir);
  }
  const format = getFormat();
  const polyfills = await getPolyfills(option.polyfills, option);
  const external = { ...getExternal(), ...option.nodeExternal };

  const plugins: Plugin[] = [...polyfills];

  if (external.include !== "*") {
    plugins.push(
      nodeExternalsPlugin({
        allowList: external.include,
      })
    );
  }

  if (option.watch) {
    if (!option.ignoreTypes) {
      plugins.push(tsCheckPlugin());
    }
    plugins.push(progress({ dist: dir, clear: false }));
  }

  if (option.run) {
    if (option.run === true) {
      option.run = getOutputFilename(filename, dir, ext);
    }

    const nodeOptions = option.nodeOptions?.split(" ") ?? [];

    option.import?.forEach((x) => {
      nodeOptions.push("--import", getOutputFilename(x, dir, ext));
    });

    plugins.push(
      run({
        nodeOptions,
        filename: option.run,
        killSignal: option.killSignal,
      })
    );
  }

  const entryPoints = [filename];
  if (option.import) {
    entryPoints.push(...option.import);
  }

  const config: BuildOptions = {
    entryPoints,
    bundle: true,
    target: getTarget(),
    platform: "node",
    outExtension: { ".js": ext },
    format,
    outdir: dir,
    minify: option.minify,
    tsconfig: option.tsconfig,
    metafile: true,
    plugins,
  };

  if (config.format === "esm") {
    config.splitting = true;
  }

  return config;
}
