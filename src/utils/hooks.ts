import type { HookFunction, HookContext, Config } from "../config/types";
import { logDebug, formatError } from "./error-formatter";

export async function executeHooks(
  hooks: HookFunction | HookFunction[] | undefined,
  context: HookContext
): Promise<void> {
  if (!hooks) return;

  const hookArray = Array.isArray(hooks) ? hooks : [hooks];

  for (const hook of hookArray) {
    try {
      logDebug(`Executing hook: ${hook.name || "anonymous"}`);
      await hook(context);
    } catch (error) {
      console.error(formatError(error as Error));
      throw error;
    }
  }
}

export async function executePreBuildHooks(config: Config): Promise<void> {
  if (!config.hooks?.preBuild) return;

  logDebug("Running pre-build hooks");
  await executeHooks(config.hooks.preBuild, { config });
}

export async function executePostBuildHooks(
  config: Config,
  result: any
): Promise<void> {
  if (!config.hooks?.postBuild) return;

  logDebug("Running post-build hooks");
  await executeHooks(config.hooks.postBuild, { config, result });
}

export async function executeErrorHooks(
  config: Config,
  error: Error
): Promise<void> {
  if (!config.hooks?.onError) return;

  logDebug("Running error hooks");
  await executeHooks(config.hooks.onError, { config, error });
}

export async function executeWatchHooks(
  config: Config,
  result?: any
): Promise<void> {
  if (!config.hooks?.onWatch) return;

  logDebug("Running watch hooks");
  await executeHooks(config.hooks.onWatch, { config, result });
}
