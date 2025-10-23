import { logDebug, shouldLog } from "./error-formatter";
import { green } from "./colors";

export function debugTime(label: string) {
  if (!shouldLog("debug")) return () => {};

  const start = Date.now();
  logDebug(`⏱️  Starting: ${label}`);

  return () => {
    const duration = Date.now() - start;
    logDebug(`✓ Completed: ${label} ${green(`(${duration}ms)`)}`);
  };
}
