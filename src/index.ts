import build from "./build";
import { CliOption, onAction } from "./command";
import { createConfig } from "./config";
import { dumpConfig, isTypescript } from "./typescript";
import { watch } from "./watch";

onAction(handleAction);

async function handleAction(filename: string, opt: CliOption) {
  if (isTypescript(filename) && !opt.tsconfig) {
    await dumpConfig();
  }
  const config = await createConfig(filename, opt);
  if (opt.watch) {
    return watch(config);
  }
  return build(config);
}
