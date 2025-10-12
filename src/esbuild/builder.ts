import type { BuildOptions } from "esbuild";
import { type Config } from "../config";
import { clean } from "../utils/fs";
import { isCurrentPath } from "../utils/path";
import { buildPlugins } from "./plugins";

export async function buildEsbuildConfig(
  filename: string,
  config: Config
): Promise<BuildOptions> {
  const { outdir, ext: outExtension, format, inject, loader } = config;
  if (isCurrentPath(outdir)) config.clean = false;
  if (config.clean) clean(outdir);
  const plugins = await buildPlugins(config, filename);
  const entryPoints = [filename, ...config.import];
  const buildConfig: BuildOptions = {
    entryPoints,
    bundle: true,
    inject,
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
  if (config.target) {
    buildConfig.target = config.target;
  }
  if (format === "esm") buildConfig.splitting = true;
  return buildConfig;
}
