import { Plugin } from "esbuild";

interface ProgressOption {
  message?: string;
}
export function tscFork(options: ProgressOption = {}): Plugin {
  return {
    name: "progress",
    setup(build) {},
  };
}
