import { CliOption, onAction } from "./command";
import { createConfig, build, watch } from "./rollup";

onAction(run);

async function run(filename: string, opt: CliOption) {
  const config = await createConfig(filename, opt);
  if (opt.watch) {
    return watch(config);
  }
  return build(config);
}
