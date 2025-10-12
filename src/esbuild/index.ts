import type { Command } from "commander";
import type { CliOption } from "../command";
import { loadConfig } from "../config";
import { isTypescript } from "../init/typescript";
import { handleError } from "../utils";
import { build } from "./build";
import { buildEsbuildConfig } from "./builder";
import { watch } from "./watch";

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
) {
  opt = removeDefaults(opt, cmd);
  if (!isTypescript(filename)) {
    opt.ignoreTypes = true;
  }
  const config = await loadConfig(opt);
  try {
    const option = await buildEsbuildConfig(filename, config);
    if (config.watch) {
      return watch(option);
    }
    return build(option, config);
  } catch (err) {
    handleError(err);
  }
}
