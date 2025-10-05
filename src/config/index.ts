import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { Config } from "./types";
import { defaults } from "./defaults";
import type { CliOption } from "../command";
import { getDestination, getFormat, getTarget } from "../project";
import { parsePackageInfo } from "../project/info";

export type { Config };

export async function loadConfig(cliOption: CliOption = {}): Promise<Config> {
  let config: Partial<Config> = {};
  const packageInfo = parsePackageInfo();
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
  const [outdir, outExt] = getDestination(packageInfo);

  config.target ??= getTarget(packageInfo);
  config.format ??= getFormat(packageInfo);
  config.outdir ??= outdir;
  config.ext ??= outExt;

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
