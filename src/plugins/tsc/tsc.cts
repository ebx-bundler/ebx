import path from "node:path";

export const tscPath = () => {
  return path.join(require.resolve("typescript/lib/tsc.js"));
};
