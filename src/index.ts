import { build } from "./build";
import { red } from "./colors";
import { type CliOption, onAction } from "./command";
import { createConfig } from "./config";
import { stderr } from "./logging";
import { dumpConfig, isTypescript } from "./typescript";
import { watch } from "./watch";

async function handleAction(filename: string, opt: CliOption) {
  if (isTypescript(filename)) {
    if (!opt.tsconfig) {
      await dumpConfig("tsconfig.json");
    }
  } else {
    opt.ignoreTypes = true;
  }

  try {
    const config = await createConfig(filename, opt);
    if (opt.watch) {
      return watch(config);
    }
    return build(config, opt);
  } catch (err) {
    if (err instanceof Error) {
      stderr(red("✘ " + err.message));
    } else {
      stderr(err);
    }
  }
}

export function run() {
  onAction(handleAction);
}
