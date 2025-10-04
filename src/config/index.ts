import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { Config, ConfigR } from "./types";
import { defaults } from "./defaults";
import type { CliOption } from "../command";

export type { Config, ConfigR };

export async function loadConfig(overrides: CliOption = {}): Promise<ConfigR> {
  let config: Config = {};
  try {
    const configUrl = pathToFileURL(join(process.cwd(), "ebx.config.js")).href;
    const module = await import(configUrl);
    config = module.default || module;
  } catch {}
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
