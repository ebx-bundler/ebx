import { build } from "./build";
import { type CliOption, onAction } from "./command";
import { createConfig } from "./config";
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
  const config = await createConfig(filename, opt);
  if (opt.watch) {
    return watch(config);
  }
  return build(config, opt);
}

export function run() {
  onAction(handleAction);
}
