import { execaNode as node } from "execa";
import { type Plugin } from "esbuild";
import { tscPath } from "./tsc.cjs";

export function tscForkPlugin(): Plugin {
  return {
    name: "ts-type-check",
    async setup() {
      const p = tscPath();
      const subprocess = node(p, ["--noEmit", "--watch"]);
      subprocess.stdout?.on("data", (data) => {
        data = data.toString();
        if (data === "\x1Bc") {
          return;
        }
        if (/(^\s+)?\d+:\d+:\d+\s/m.test(data)) {
          return;
        }
        process.stdout.write(data.toString());
      });
    },
  };
}
