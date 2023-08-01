import { CliOption, onAction } from "./command";
import { getInfo } from "./package";
import { createConfig, build, watch } from "./rollup";
import { dumpConfig, isTypescript } from "./typescript";

onAction(handleAction);

async function handleAction(filename: string, opt: CliOption) {
  const pkg = getInfo();
  if (isTypescript(filename)) {
    await dumpConfig(pkg);
  }
  const config = await createConfig(filename, pkg, opt);
  if (opt.watch) {
    return watch(config);
  }
  return build(config);
}
