import type { Command } from "commander";
import type { CliOption } from "../command";
import { loadConfig } from "../config";
import { isTypescript } from "../init/typescript";
import { handleError } from "../utils";
import { build } from "./build";
import { buildEsbuildConfig } from "./builder";
import { watch } from "./watch";
import { setLogLevel } from "../utils/error-formatter";
import { startRepl } from "../repl";
import { runTests } from "../test/runner";
import { shouldUseParallelBuild, buildParallel } from "../utils/parallel-build";
import { executePreBuildHooks, executePostBuildHooks, executeErrorHooks } from "../utils/hooks";

function removeDefaults(opt: CliOption, cmd: Command): CliOption {
  return Object.fromEntries(
    Object.entries(opt).filter(
      ([key]) => cmd.getOptionValueSource(key) !== "default"
    )
  );
}

export async function handleAction(
  filename: string,
  opt: CliOption,
  cmd: Command
): Promise<void> {
  opt = removeDefaults(opt, cmd);

  // Handle inspect port conversion
  if (opt.inspect === true) {
    opt.inspect = 9229;
  } else if (typeof opt.inspect === "string") {
    opt.inspect = parseInt(opt.inspect, 10);
  }

  if (opt.inspectBrk === true) {
    opt.inspectBrk = 9229;
  } else if (typeof opt.inspectBrk === "string") {
    opt.inspectBrk = parseInt(opt.inspectBrk, 10);
  }

  if (!isTypescript(filename)) {
    opt.ignoreTypes = true;
  }

  const config = await loadConfig(opt);

  // Set log level
  if (config.logLevel) {
    setLogLevel(config.logLevel);
  }

  try {
    // Handle REPL mode
    if (config.repl) {
      return startRepl(config);
    }

    // Handle test mode
    if (config.test) {
      return runTests(config);
    }

    // Execute pre-build hooks
    await executePreBuildHooks(config);

    // Handle parallel builds
    if (shouldUseParallelBuild(config)) {
      const option = await buildEsbuildConfig(filename, config);
      const result = await buildParallel(config.entries!, option, config);
      await executePostBuildHooks(config, result);
      return;
    }

    // Normal build flow
    const option = await buildEsbuildConfig(filename, config);
    if (config.watch) {
      await watch(option);
      return;
    }

    const result = await build(option, config);
    await executePostBuildHooks(config, result);
  } catch (err) {
    await executeErrorHooks(config, err as Error);
    handleError(err);
  }
}
