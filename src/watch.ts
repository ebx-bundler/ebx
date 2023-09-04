import { type ConfigOption } from "./config";
import esbuild from "esbuild";

export async function watch(options: ConfigOption): Promise<void> {
  const context = await esbuild.context({ ...options });
  await context.watch();
}
