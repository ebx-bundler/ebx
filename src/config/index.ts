import { dirname, extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Config } from "./types";
import { defaults } from "./defaults";
import type { CliOption } from "../command";
import { getTarget, loadPkg } from "./pkg";

export type { Config };

export async function loadConfig(cliOption: CliOption = {}): Promise<Config> {
  let config: Partial<Config> = {};
  const packageInfo = loadPkg();
  for (const ext of ["js", "mjs"]) {
    try {
      const configPath = join(process.cwd(), `ebx.config.${ext}`);
      const configUrl = pathToFileURL(configPath).href;
      const module = await import(configUrl);
      config = module.default || module;
      break;
    } catch {}
  }
  const { main, engines, type } = packageInfo;
  if (main) {
    config.ext ??= extname(main);
    config.outdir ??= dirname(resolve(main));
  }

  if (engines?.node) {
    config.target ??= getTarget(engines.node);
  }

  if (type === "module") {
    config.format ??= "esm";
  }

  const { grace, ...cliOverrides } = cliOption;

  // Handle grace special case
  if (grace === false) {
    config.killSignal = "SIGKILL";
  }

  return {
    ...defaults,
    ...config,
    ...cliOverrides,
  };
}
