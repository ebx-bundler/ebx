import type { FSWatcher } from "node:fs";
import process from "node:process";
import dateTime from "date-time";
import ms from "pretty-ms";
import { onExit } from "signal-exit";
import * as rollup from "rollup";
import type { RollupWatcher } from "rollup";
import { bold, cyan, green, underline } from "./colors";
import { relativeId } from "./path";
import { handleError, stderr } from "./logging";
import { getResetScreen } from "./screen";
import { printTimings } from "./timings";
import { RollupOptions } from "./rollup";

export async function watch(options: RollupOptions): Promise<void> {
  process.env.ROLLUP_WATCH = "true";
  const isTTY = process.stderr.isTTY;
  let watcher: RollupWatcher;
  let configWatcher: FSWatcher;
  let resetScreen: (heading: string) => void;
  onExit(close as any);
  process.on("uncaughtException", closeWithError);
  if (!process.stdin.isTTY) {
    process.stdin.on("end", close);
    process.stdin.resume();
  }

  await start(options);

  async function start(configs: RollupOptions): Promise<void> {
    watcher = rollup.watch(configs);

    watcher.on("event", (event) => {
      switch (event.code) {
        case "ERROR": {
          handleError(event.error, true);
          break;
        }

        case "START": {
          if (!resetScreen) {
            resetScreen = getResetScreen([configs], isTTY);
          }
          resetScreen(underline(`rollup v${rollup.VERSION}`));

          break;
        }

        case "BUNDLE_START": {
          let input = event.input;
          if (typeof input !== "string") {
            input = Array.isArray(input)
              ? input.join(", ")
              : Object.values(input as Record<string, string>).join(", ");
          }
          stderr(
            cyan(
              `bundles ${bold(input)} → ${bold(
                event.output.map(relativeId).join(", ")
              )}...`
            )
          );

          break;
        }

        case "BUNDLE_END": {
          stderr(
            green(
              `created ${bold(
                event.output.map(relativeId).join(", ")
              )} in ${bold(ms(event.duration))}`
            )
          );
          if (event.result && event.result.getTimings) {
            printTimings(event.result.getTimings());
          }
          break;
        }

        case "END": {
          if (isTTY) {
            stderr(`\n[${dateTime()}] waiting for changes...`);
          }
        }
      }

      if ("result" in event && event.result) {
        event.result.close().catch((error) => handleError(error, true));
      }
    });
  }

  async function close(code: number | null | undefined): Promise<void> {
    process.removeListener("uncaughtException", closeWithError);
    // removing a non-existent listener is a no-op
    process.stdin.removeListener("end", close);
    if (watcher) await watcher.close();
    if (configWatcher) configWatcher.close();
    if (code) process.exit(code);
  }

  // return a promise that never resolves to keep the process running
  return new Promise(() => {});
}

function closeWithError(error: Error): void {
  error.name = `Uncaught ${error.name}`;
  handleError(error);
}
