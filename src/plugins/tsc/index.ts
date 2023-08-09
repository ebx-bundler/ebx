import { spawn } from "child_process";
import { Plugin } from "esbuild";

export function tscFork(): Plugin {
  return {
    name: 'ts-type-check',
    setup(build) {
    
    },
  };
}

