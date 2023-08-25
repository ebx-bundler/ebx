import { type Plugin } from "esbuild";
import { tsc } from "./tsc";
import { strip } from "./stripper";

export function tsCheckPlugin(): Plugin {
  return {
    name: "ts-check",
    async setup() {
      const subprocess = tsc({ watch: true });
      subprocess.pipe(strip()).pipe(process.stderr);
    },
  };
}
