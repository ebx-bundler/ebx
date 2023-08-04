import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import { externals } from "rollup-plugin-node-externals";
import { MergedRollupOptions as RollupOptions } from "rollup";
import { getDestination, getFormat } from "./package.js";
import { CliOption } from "./command.js";
import { clean } from "./fs.js";

export { RollupOptions };

export async function createConfig(filename: string, option: CliOption) {
  const [dir] = getDestination();
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
    output: [
      {
        dir,
        sourcemap: option.sourcemap,
        format: getFormat(),
        esModule: true,
        chunkFileNames,
      },
    ],
    plugins,
  };

  return config;
}

function chunkFileNames() {
  return `[name].[format].js`;
}
