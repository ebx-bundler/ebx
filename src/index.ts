import { CliOption, onAction } from "./command";
import { createConfig, build, watch } from "./rollup";
import { dumpConfig, isTypescript } from "./typescript";

onAction(handleAction);

async function handleAction(filename: string, opt: CliOption) {
  if (isTypescript(filename)) {
    await dumpConfig();
  }
  const config = await createConfig(filename, opt);
  if (opt.watch) {
    return watch(config);
  }
  return build(config);
}
