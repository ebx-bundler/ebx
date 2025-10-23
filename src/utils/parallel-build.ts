import esbuild, { type BuildOptions, type BuildResult } from "esbuild";
import { debugTime } from "./debug";
import { logDebug, logSuccess, logError } from "./error-formatter";
import type { BuildEntry, Config } from "../config/types";
import { cyan } from "./colors";

export interface ParallelBuildResult {
  results: BuildResult[];
  errors: Error[];
  duration: number;
}

export async function buildParallel(
  entries: BuildEntry[],
  baseConfig: Partial<BuildOptions>,
  config: Config
): Promise<ParallelBuildResult> {
  const endTimer = debugTime("Parallel build");
  const start = Date.now();

  logDebug(`Building ${entries.length} entries in parallel`);

  const buildPromises = entries.map((entry, index) =>
    buildEntry(entry, baseConfig, config, index)
  );

  const results = await Promise.allSettled(buildPromises);

  const successful: BuildResult[] = [];
  const errors: Error[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      successful.push(result.value);
      logSuccess(`Entry ${index + 1} built: ${entries[index].input}`);
    } else {
      errors.push(result.reason);
      logError(`Entry ${index + 1} failed: ${entries[index].input}`, result.reason);
    }
  });

  const duration = Date.now() - start;
  endTimer();

  if (errors.length === 0) {
    logSuccess(
      `All ${entries.length} entries built successfully in ${duration}ms`
    );
  } else {
    console.log(
      cyan(
        `${successful.length}/${entries.length} entries built successfully, ${errors.length} failed (${duration}ms)`
      )
    );
  }

  return {
    results: successful,
    errors,
    duration,
  };
}

async function buildEntry(
  entry: BuildEntry,
  baseConfig: Partial<BuildOptions>,
  _config: Config,
  index: number
): Promise<BuildResult> {
  logDebug(`Building entry ${index + 1}: ${entry.input}`);

  const entryPoints = Array.isArray(entry.input) ? entry.input : [entry.input];

  const buildConfig: BuildOptions = {
    ...baseConfig,
    entryPoints,
    outdir: entry.output || baseConfig.outdir,
    format: entry.format || baseConfig.format,
    target: entry.target || baseConfig.target,
    plugins: [...(baseConfig.plugins || []), ...(entry.plugins || [])],
  };

  return esbuild.build(buildConfig);
}

export function shouldUseParallelBuild(config: Config): boolean {
  return !!(config.parallel && config.entries && config.entries.length > 1);
}
