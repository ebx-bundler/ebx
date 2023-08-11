import { spawn } from "child_process";
import { type Plugin } from "esbuild";

export function tscFork(): Plugin {
  return {
    name: "ts-type-check",
    setup(build) {},
  };
}
