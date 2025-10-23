import type { Config } from "../config/types";
import { logInfo, logDebug } from "./error-formatter";

export function getDebuggerOptions(config: Config): string[] {
  const options: string[] = [];

  if (config.inspect) {
    const port = typeof config.inspect === "number" ? config.inspect : 9229;
    options.push(`--inspect=${port}`);
    logInfo(`Debugger listening on port ${port}`);
    logInfo(`Open chrome://inspect in Chrome to debug`);
  }

  if (config.inspectBrk) {
    const port = typeof config.inspectBrk === "number" ? config.inspectBrk : 9229;
    options.push(`--inspect-brk=${port}`);
    logInfo(`Debugger listening on port ${port} (waiting for debugger to attach)`);
    logInfo(`Open chrome://inspect in Chrome to debug`);
  }

  logDebug("Debugger options:", options);

  return options;
}

export function shouldAttachDebugger(config: Config): boolean {
  return !!(config.inspect || config.inspectBrk);
}
