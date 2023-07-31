import json from "@rollup/plugin-json";
import run from "@rollup/plugin-run";
import typescript from "@rollup/plugin-typescript";
import { externals } from "rollup-plugin-node-externals";
import {
  PreRenderedChunk,
  RollupOptions,
  rollup,
  watch as rollupWatch,
} from "rollup";
import { getDestination, getFormat, getInfo } from "./package.js";
import { CliOption } from "./command.js";

export async function createConfig(filename: string, option: CliOption) {
  const pkg = getInfo();
  const plugins = [
    json(),
    externals(),
    typescript({
      outputToFilesystem: true,
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
    }),
  ];
  if (option.run) {
    plugins.push(
      run({
        allowRestarts: true,
      })
    );
  }
  const config: RollupOptions = {
    input: filename,
    output: {
      dir: getDestination(pkg),
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
  rollupWatch(config).on("restart", () => {
    console.clear();
  });
}

export async function build(config: RollupOptions) {
  const output = Array.isArray(config.output) ? config.output : [config.output];
  const bundle = await rollup(config);
  return Promise.all(output.map(bundle.write));
}

function getPathAsName(id: string) {
  return id
    .replace(process.cwd() + "/", "")
    .replace("/index.ts", "")
    .replaceAll("/", "~");
}

function chunkFileNames(info: PreRenderedChunk) {
  let { name, facadeModuleId: id, moduleIds } = info;
  name = getPathAsName(id || moduleIds[0]);
  return `${name}.[format].js`;
}
