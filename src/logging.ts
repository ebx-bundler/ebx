import process from "node:process";
import type { RollupError, RollupLog } from "rollup";
import { bold, cyan, dim, red } from "./colors";
import { relativeId } from "./path";

export const stderr = (...parameters: readonly unknown[]) =>
  process.stderr.write(`${parameters.join("")}\n`);

export function handleError(error: RollupError, recover = false): void {
  const name = error.name || (error.cause as Error)?.name;
  const nameSection = name ? `${name}: ` : "";
  const pluginSection = error.plugin ? `(plugin ${error.plugin}) ` : "";
  const message = `${pluginSection}${nameSection}${error.message}`;

  const outputLines = [bold(red(`[!] ${bold(message.toString())}`))];

  if (error.url) {
    outputLines.push(cyan(error.url));
  }

  if (error.loc) {
    outputLines.push(
      `${relativeId((error.loc.file || error.id)!)} (${error.loc.line}:${
        error.loc.column
      })`
    );
  } else if (error.id) {
    outputLines.push(relativeId(error.id));
  }

  if (error.frame) {
    outputLines.push(dim(error.frame));
  }

  if (error.stack) {
    outputLines.push(
      dim(error.stack?.replace(`${nameSection}${error.message}\n`, ""))
    );
  }

  outputLines.push("", "");
  stderr(outputLines.join("\n"));

  if (!recover) process.exit(1);
}

export function logOnlyInlineSourcemapsForStdout(): RollupLog {
  return {
    code: "ONLY_INLINE_SOURCEMAPS",
    message: "Only inline sourcemaps are supported when bundling to stdout.",
  };
}
