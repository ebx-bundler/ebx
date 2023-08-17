import { stderr as std } from "node:process";

export const stderr = (...parameters: readonly unknown[]) =>
  std.write(`${parameters.join("")}\n`);

export function handleError(error: unknown, recover = false): void {}
