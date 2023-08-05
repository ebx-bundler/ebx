import process from "node:process";
import { bold, cyan, dim, red } from "./colors";
import { relativeId } from "./path";

export const stderr = (...parameters: readonly unknown[]) =>
  process.stderr.write(`${parameters.join("")}\n`);

export function handleError(error: unknown, recover = false): void {}
