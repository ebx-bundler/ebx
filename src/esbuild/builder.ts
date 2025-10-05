import type { BuildOptions } from "esbuild";
import { type ConfigR } from "../config";
import { clean } from "../utils/fs";
import { isCurrentPath } from "../path";
import { buildPlugins } from "./plugins";

export async function buildEsbuildConfig(
  filename: string,
  config: ConfigR
): Promise<BuildOptions> {
  const { outdir, outExtension, format, inject, loader } = config;
  if (isCurrentPath(outdir)) config.clean = false;
  if (config.clean) clean(outdir);
  const plugins = await buildPlugins(config, filename);
  const entryPoints = [filename, ...config.import];
  const target = config.target;
  const buildConfig: BuildOptions = {
    entryPoints,
    bundle: true,
    inject,
    target,
    platform: "node",
    outExtension: { ".js": outExtension },
    format,
    outdir,
    minify: config.minify,
    sourcemap: config.sourcemap,
    tsconfig: config.tsconfig,
    metafile: true,
    plugins,
    loader,
  };
  if (format === "esm") buildConfig.splitting = true;
  return buildConfig;
}
