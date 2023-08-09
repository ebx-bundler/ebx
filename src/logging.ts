import process from "node:process";

export const stderr = (...parameters: readonly unknown[]) =>
  process.stderr.write(`${parameters.join("")}\n`);

export function handleError(error: unknown, recover = false): void {}
