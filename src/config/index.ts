import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { Config, ConfigR } from "./types";
import { defaults } from "./defaults";
import type { CliOption } from "../command";
import { getDestination, getFormat, getTarget } from "../project";

export type { Config, ConfigR };

export async function loadConfig(overrides: CliOption = {}): Promise<ConfigR> {
  let config: Config = {};

  // Try loading ebx.config.js or ebx.config.mjs
  for (const ext of ["js", "mjs"]) {
    try {
      const configPath = join(process.cwd(), `ebx.config.${ext}`);
      const configUrl = pathToFileURL(configPath).href;
      const module = await import(configUrl);
      config = module.default || module;
      break;
    } catch {}
  }
  const [outdir, outExt] = getDestination();
  config.target ??= getTarget();
  config.outExtension ??= outExt;
  config.outdir ??= outdir;
  config.format ??= getFormat();

  const { grace, ...other } = overrides;
  if (!grace) {
    config.killSignal = "SIGKILL";
  }
  return {
    ...defaults,
    ...config,
    ...other,
  };
}
