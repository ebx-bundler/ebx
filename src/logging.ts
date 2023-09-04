import { stderr as std } from "node:process";

export const stderr = (...parameters: readonly unknown[]) => {
  return std.write(`${parameters.join("")}\n`);
};
