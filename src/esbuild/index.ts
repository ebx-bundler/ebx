import { red } from "../colors";
import type { CliOption } from "../command";
import { loadConfig } from "../config";
import { isTypescript } from "../init/typescript";
import { stderr } from "../logging";
import { build } from "./build";
import { buildEsbuildConfig } from "./builder";
import { watch } from "./watch";

export async function handleAction(filename: string, opt: CliOption) {
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
    if (err instanceof Error) {
      stderr(red("✘ " + err.message));
    } else {
      stderr(err);
    }
  }
}
