import { type ConfigOption } from "./config";
import * as esbuild from "esbuild";

export async function watch(options: ConfigOption): Promise<void> {
  await start(options);
  async function start(configs: ConfigOption): Promise<void> {
    const context = await esbuild.context({ ...configs });
    await context.watch();
  }
}
