import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import { externals } from "rollup-plugin-node-externals";
import { RollupOptions, rollup, watch as rollupWatch } from "rollup";
import { PackageInfo, getDestination, getFormat } from "./package.js";
import { CliOption } from "./command.js";
import { clean } from "./fs.js";

export async function createConfig(
  filename: string,
  pkg: PackageInfo,
  option: CliOption
) {
  const dir = getDestination(pkg);
  if (option.clean) {
    clean(dir);
  }
  const plugins = [
    json(),
    externals(),
    typescript({
      tsconfig: option.tsconfig,
      outputToFilesystem: true,
    }),
  ];
  if (option.run) {
    const { default: run } = await import("@rollup/plugin-run");
    plugins.push(
      run({
        allowRestarts: true,
      })
    );
  }
  const config: RollupOptions = {
    input: filename,
    output: {
      dir,
      sourcemap: option.sourcemap,
      format: getFormat(pkg),
      esModule: true,
      chunkFileNames,
    },
    plugins,
  };

  return config;
}

export function watch(config: RollupOptions) {
  console.clear();
  rollupWatch(config)
    .on("restart", () => {
      console.clear();
    })
    .on("change", (id) => {
      console.log("reload", id);
    });
}

export async function build(config: RollupOptions) {
  const output = Array.isArray(config.output) ? config.output : [config.output];
  const bundle = await rollup(config);
  await Promise.all(output.map(bundle.write));
  console.log("build successfully");
}

function chunkFileNames() {
  return `[name].[format].js`;
}
